import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const blockedAxiosVersions = new Set(["1.14.1", "0.30.4"]);
const blockedPackages = new Set(["plain-crypto-js"]);
const manifestSections = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];
const findings = new Set();

function relative(file) {
  return path.relative(process.cwd(), file) || path.basename(file);
}

function addFinding(file, message) {
  findings.add(`${relative(file)}: ${message}`);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function scanManifest(file) {
  const manifest = readJson(file);

  for (const section of manifestSections) {
    const deps = manifest[section] ?? {};
    for (const [name, spec] of Object.entries(deps)) {
      if (blockedPackages.has(name)) {
        addFinding(file, `blocked package "${name}" declared in ${section}`);
      }

      if (
        name === "axios" &&
        typeof spec === "string" &&
        [...blockedAxiosVersions].some((version) => spec.includes(version))
      ) {
        addFinding(file, `blocked axios range "${spec}" declared in ${section}`);
      }
    }
  }
}

function walkDependencies(file, deps, trail = []) {
  if (!deps || typeof deps !== "object") {
    return;
  }

  for (const [name, meta] of Object.entries(deps)) {
    const location = [...trail, name].join(" > ");

    if (blockedPackages.has(name)) {
      addFinding(file, `blocked package "${location}" found in lockfile`);
    }

    if (name === "axios" && blockedAxiosVersions.has(String(meta?.version ?? ""))) {
      addFinding(
        file,
        `blocked axios version "${meta.version}" locked at "${location}"`,
      );
    }

    walkDependencies(file, meta?.dependencies, [...trail, name]);
  }
}

function scanLockfile(file) {
  const lock = readJson(file);

  for (const [packagePath, meta] of Object.entries(lock.packages ?? {})) {
    const packageName =
      meta?.name ??
      (packagePath.includes("node_modules/")
        ? packagePath.split("node_modules/").pop()
        : packagePath);

    if (blockedPackages.has(packageName)) {
      addFinding(file, `blocked package "${packageName}" found in packages map`);
    }

    if (
      packageName === "axios" &&
      blockedAxiosVersions.has(String(meta?.version ?? ""))
    ) {
      addFinding(
        file,
        `blocked axios version "${meta.version}" found in packages map`,
      );
    }
  }

  walkDependencies(file, lock.dependencies);
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.name === "package.json") {
      scanManifest(fullPath);
      continue;
    }

    if (entry.name === "package-lock.json" || entry.name === "npm-shrinkwrap.json") {
      scanLockfile(fullPath);
    }
  }
}

walk(process.cwd());

if (findings.size > 0) {
  console.error("Compromised dependency guard failed:");
  for (const finding of [...findings].sort()) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Dependency guard passed.");
