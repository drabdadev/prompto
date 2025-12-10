import type { ComponentType } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // Get the icon component from Lucide
  // Use unknown cast to bypass strict type checking for dynamic access
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as unknown as Record<string, ComponentType<LucideProps> | undefined>;
  const IconComponent = icons[name];

  // Fallback to Tag icon if not found
  if (!IconComponent) {
    return <LucideIcons.Tag {...props} />;
  }

  return <IconComponent {...props} />;
}

// Export list of common icons for the picker
export const COMMON_ICONS = [
  'Layout', 'Server', 'Code', 'Database', 'Settings', 'Tag',
  'Folder', 'File', 'FileText', 'FileCode', 'Image', 'Video',
  'Music', 'Mic', 'Camera', 'Monitor', 'Smartphone', 'Tablet',
  'Globe', 'Cloud', 'Lock', 'Key', 'Shield', 'User', 'Users',
  'Heart', 'Star', 'Bookmark', 'Flag', 'Bell', 'Mail', 'MessageSquare',
  'Search', 'Filter', 'Sliders', 'Tool', 'Wrench', 'Zap', 'Cpu',
  'HardDrive', 'Wifi', 'Bluetooth', 'Battery', 'Power', 'Terminal',
  'GitBranch', 'GitCommit', 'GitMerge', 'Github', 'Package', 'Box',
  'Layers', 'Grid', 'List', 'Table', 'Calendar', 'Clock', 'Timer',
  'Play', 'Pause', 'Square', 'Circle', 'Triangle', 'Hexagon',
  'Home', 'Building', 'Map', 'MapPin', 'Navigation', 'Compass',
  'Sun', 'Moon', 'CloudRain', 'Snowflake', 'Flame', 'Droplet',
  'Bug', 'TestTube', 'Beaker', 'Microscope', 'Atom', 'Rocket',
  'Palette', 'Paintbrush', 'Pen', 'Pencil', 'Edit', 'Scissors',
  'Download', 'Upload', 'Share', 'Link', 'ExternalLink', 'Send',
  'Check', 'X', 'Plus', 'Minus', 'AlertTriangle', 'Info', 'HelpCircle',
];

// Get all available icon names for search
export function getAllIconNames(): string[] {
  return Object.keys(LucideIcons).filter(key => {
    // Filter out non-component exports
    return key !== 'createLucideIcon' &&
           key !== 'default' &&
           key !== 'icons' &&
           typeof (LucideIcons as Record<string, unknown>)[key] === 'function';
  });
}
