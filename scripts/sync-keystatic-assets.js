#!/usr/bin/env node

/**
 * Keystatic Asset Sync Script
 *
 * Ensures directories match JSON references for case-sensitive filesystems (Linux/Netlify).
 * Runs automatically before build to prevent deployment failures.
 */

import {
  readdirSync,
  statSync,
  renameSync,
  mkdirSync,
  existsSync,
  rmdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(colors.red, `❌ Error: ${message}`);
}

function success(message) {
  log(colors.green, `✅ ${message}`);
}

function info(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

function warning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

/**
 * Case-insensitive directory exists check
 * Returns the actual directory name if found (for case comparison)
 */
function findActualDirectory(parentDir, targetName) {
  if (!existsSync(parentDir)) return null;

  const items = readdirSync(parentDir, { withFileTypes: true });
  const dirNames = items.filter((d) => d.isDirectory()).map((d) => d.name);

  // Find case-insensitive match
  const match = dirNames.find(
    (name) => name.toLowerCase() === targetName.toLowerCase(),
  );
  return match || null;
}

/**
 * Recursively create directory if it doesn't exist
 */
function ensureDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    success(`Created directory: ${dirPath}`);
    return true;
  }
  return false;
}

/**
 * Get all testimonial JSON files and their referenced directories
 */
function getTestimonialReferences() {
  const contentDir = join(ROOT_DIR, "src/content/testimonials");
  if (!existsSync(contentDir)) return [];

  const jsonFiles = readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => join(contentDir, f));

  return jsonFiles.map((filePath) => {
    const { name: jsonName } = fileURLToPath(import.meta.url);
    // For collections, directory name is the slug (filename without .json)
    const expectedDirName = filePath.split("/").pop().replace(".json", "");
    return {
      filePath,
      expectedDirName,
      expectedDirPath: join(ROOT_DIR, "src/assets/clients", expectedDirName),
    };
  });
}

/**
 * Fix case sensitivity mismatches for testimonials
 */
function fixTestimonialCaseMismatches(references) {
  const clientsDir = join(ROOT_DIR, "src/assets/clients");
  if (!existsSync(clientsDir)) {
    ensureDirectory(clientsDir);
    return [];
  }

  const fixes = [];

  for (const ref of references) {
    const actualDirName = findActualDirectory(clientsDir, ref.expectedDirName);

    // No directory exists yet - will be created by Keystatic when needed
    if (!actualDirName) continue;

    // Case mismatch detected
    if (actualDirName !== ref.expectedDirName) {
      warning(
        `Case mismatch detected: JSON references "${ref.expectedDirName}" but directory exists as "${actualDirName}"`,
      );

      const oldPath = join(clientsDir, actualDirName);
      const newPath = join(clientsDir, ref.expectedDirName);

      try {
        renameSync(oldPath, newPath);
        success(`Renamed directory: ${actualDirName} → ${ref.expectedDirName}`);
        fixes.push({ from: actualDirName, to: ref.expectedDirName });
      } catch (err) {
        error(`Failed to rename ${actualDirName}: ${err.message}`);
      }
    }
  }

  return fixes;
}

/**
 * Clean up orphaned directories (directories with no matching JSON)
 */
function cleanupOrphanedDirectories(references) {
  const clientsDir = join(ROOT_DIR, "src/assets/clients");
  if (!existsSync(clientsDir)) return;

  const expectedDirs = new Set(references.map((r) => r.expectedDirName));
  const actualDirs = readdirSync(clientsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const orphanedDirs = actualDirs.filter((dir) => !expectedDirs.has(dir));

  if (orphanedDirs.length === 0) {
    info("No orphaned directories found");
    return;
  }

  for (const dir of orphanedDirs) {
    const dirPath = join(clientsDir, dir);
    const contents = readdirSync(dirPath);

    if (contents.length === 0) {
      // Empty directory - safe to delete
      rmdirSync(dirPath);
      success(`Removed empty orphaned directory: ${dir}`);
    } else {
      // Directory with assets - warn but don't delete
      warning(
        `Orphaned directory with assets: ${dir} (${contents.join(", ")})`,
      );
      warning(`  This directory exists but has no matching JSON file`);
      warning(`  Consider: adding JSON or deleting directory manually`);
    }
  }
}

/**
 * Create missing directories that Keystatic expects
 */
function createMissingDirectories() {
  const dirsToCreate = [
    // Case studies image structure (will be created as items are added)
    "src/assets/images/case-studies",
    // Ensure clients directory exists
    "src/assets/clients",
  ];

  for (const dir of dirsToCreate) {
    const fullPath = join(ROOT_DIR, dir);
    ensureDirectory(fullPath);
  }
}

/**
 * Main execution
 */
function main() {
  log(colors.bold, "\n🔧 Syncing Keystatic assets...\n");

  // Get all testimonial references
  const references = getTestimonialReferences();
  info(`Found ${references.length} testimonial references`);

  // Step 1: Fix case sensitivity mismatches
  log(colors.bold, "\n1. Checking case sensitivity...");
  const fixes = fixTestimonialCaseMismatches(references);

  // Step 2: Clean up orphaned directories
  log(colors.bold, "\n2. Cleaning up orphaned directories...");
  cleanupOrphanedDirectories(references);

  // Step 3: Create missing directories
  log(colors.bold, "\n3. Creating missing directories...");
  createMissingDirectories();

  // Summary
  log(colors.bold, "\n📊 Summary:");
  if (fixes.length > 0) {
    success(`Fixed ${fixes.length} case mismatches`);
  }
  info(`Ready for build on case-sensitive filesystem`);

  log(colors.bold, "\n✨ Sync complete\n");
}

// Run the script
main();
