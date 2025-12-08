const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { logger } = require('../config/logger');

// Get database and backups directory from environment or defaults
const getDataDir = () => {
  if (process.env.DATABASE_PATH) {
    return path.dirname(process.env.DATABASE_PATH);
  }
  return path.join(__dirname, '..', 'data');
};

const getBackupsDir = () => {
  const dataDir = getDataDir();
  const backupsDir = path.join(dataDir, 'backups');
  // Ensure backups directory exists
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }
  return backupsDir;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getBackupsDir());
  },
  filename: (req, file, cb) => {
    // Use a safe timestamp-based name
    cb(null, `upload-${Date.now()}.db`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith('.db')) {
      return cb(new Error('Only .db files are allowed'));
    }
    cb(null, true);
  }
});

// Format date for backup filename
const formatBackupDate = (date) => {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
};

// Validate filename to prevent path traversal
const isValidFilename = (filename) => {
  if (!filename) return false;
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  if (!filename.endsWith('.db')) {
    return false;
  }
  return true;
};

// Create a backup
router.post('/backup', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const backupsDir = getBackupsDir();
    const timestamp = formatBackupDate(new Date());
    const backupFilename = `backup-${timestamp}.db`;
    const backupPath = path.join(backupsDir, backupFilename);

    // WAL checkpoint to ensure all data is written
    db.pragma('wal_checkpoint(TRUNCATE)');

    // Use VACUUM INTO for a clean, consistent backup
    db.exec(`VACUUM INTO '${backupPath.replace(/'/g, "''")}'`);

    // Verify backup was created and is not empty
    const stats = fs.statSync(backupPath);
    if (stats.size === 0) {
      fs.unlinkSync(backupPath);
      return res.status(500).json({ error: 'Backup file is empty' });
    }

    logger.info(`Backup created: ${backupFilename} (${stats.size} bytes)`);

    res.json({
      success: true,
      filename: backupFilename,
      size: stats.size,
      message: 'Backup created successfully'
    });
  } catch (err) {
    logger.error('Backup failed:', err);
    res.status(500).json({ error: 'Failed to create backup: ' + err.message });
  }
});

// List all backups
router.get('/backups', (req, res) => {
  try {
    const backupsDir = getBackupsDir();
    const files = fs.readdirSync(backupsDir)
      .filter(file => file.endsWith('.db') && !file.startsWith('upload-'));

    const backups = files.map(file => {
      const filePath = path.join(backupsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        createdAt: stats.birthtime
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ backups });
  } catch (err) {
    logger.error('Failed to list backups:', err);
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

// Download a backup
router.get('/backups/:filename', (req, res) => {
  try {
    const { filename } = req.params;

    if (!isValidFilename(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const backupsDir = getBackupsDir();
    const filePath = path.join(backupsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    res.download(filePath, filename);
  } catch (err) {
    logger.error('Failed to download backup:', err);
    res.status(500).json({ error: 'Failed to download backup' });
  }
});

// Delete a backup
router.delete('/backups/:filename', (req, res) => {
  try {
    const { filename } = req.params;

    if (!isValidFilename(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const backupsDir = getBackupsDir();
    const filePath = path.join(backupsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    fs.unlinkSync(filePath);
    logger.info(`Backup deleted: ${filename}`);

    res.json({ success: true, message: 'Backup deleted' });
  } catch (err) {
    logger.error('Failed to delete backup:', err);
    res.status(500).json({ error: 'Failed to delete backup' });
  }
});

// Restore from uploaded file
router.post('/restore', upload.single('database'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const db = req.app.locals.db;
    const uploadedPath = req.file.path;
    const backupsDir = getBackupsDir();
    const dataDir = getDataDir();

    // Get current database path
    const currentDbPath = process.env.DATABASE_PATH || path.join(dataDir, 'prompto.db');

    // Validate SQLite header
    const fd = fs.openSync(uploadedPath, 'r');
    const header = Buffer.alloc(16);
    fs.readSync(fd, header, 0, 16, 0);
    fs.closeSync(fd);

    if (header.toString('utf8', 0, 16) !== 'SQLite format 3\0') {
      fs.unlinkSync(uploadedPath);
      return res.status(400).json({ error: 'Invalid SQLite database file' });
    }

    // Create pre-restore backup
    const preRestoreFilename = `pre-restore-${Date.now()}.db`;
    const preRestorePath = path.join(backupsDir, preRestoreFilename);

    db.pragma('wal_checkpoint(TRUNCATE)');
    db.exec(`VACUUM INTO '${preRestorePath.replace(/'/g, "''")}'`);

    logger.info(`Pre-restore backup created: ${preRestoreFilename}`);

    // Copy uploaded file to database location
    fs.copyFileSync(uploadedPath, currentDbPath);

    // Remove WAL and SHM files to force fresh start
    const walPath = currentDbPath + '-wal';
    const shmPath = currentDbPath + '-shm';
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);

    // Cleanup uploaded file
    fs.unlinkSync(uploadedPath);

    logger.info('Database restored successfully');

    res.json({
      success: true,
      message: 'Database restored. Please restart the application.',
      preRestoreBackup: preRestoreFilename
    });
  } catch (err) {
    logger.error('Restore failed:', err);
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to restore database: ' + err.message });
  }
});

// Download current database directly
router.get('/download', (req, res) => {
  try {
    const db = req.app.locals.db;
    const dataDir = getDataDir();
    const currentDbPath = process.env.DATABASE_PATH || path.join(dataDir, 'prompto.db');
    const backupsDir = getBackupsDir();

    // Create a temporary backup for download
    const timestamp = formatBackupDate(new Date());
    const tempFilename = `download-${timestamp}.db`;
    const tempPath = path.join(backupsDir, tempFilename);

    // WAL checkpoint and create backup
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.exec(`VACUUM INTO '${tempPath.replace(/'/g, "''")}'`);

    // Send file and delete after
    res.download(tempPath, `prompto-backup-${timestamp}.db`, (err) => {
      // Cleanup temp file after download
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      if (err && !res.headersSent) {
        logger.error('Download failed:', err);
      }
    });
  } catch (err) {
    logger.error('Failed to download database:', err);
    res.status(500).json({ error: 'Failed to download database' });
  }
});

module.exports = router;
