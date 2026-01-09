#!/usr/bin/env node

/**
 * Image Cleanup Script
 *
 * Scans src/assets/images for unused image files and optionally removes them.
 * Images are considered "used" if they're referenced in any JSON file under src/content.
 */

import {
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
} from "fs";
import { join, relative, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const ROOT_DIR = join(__dirname, "..");
const IMAGES_DIR = join(ROOT_DIR, "src", "assets", "images");
const CONTENT_DIR = join(ROOT_DIR, "src", "content");

// Image file extensions to consider
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".tiff",
];

// ANSI color codes for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
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
  log(colors.cyan, `ℹ️  ${message}`);
}

function warning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

/**
 * Recursively find all files in a directory
 */
function findFiles(dir, extensions = []) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (stats.isFile()) {
      if (
        extensions.length === 0 ||
        extensions.includes(extname(item).toLowerCase())
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Find all image files in the assets directory
 */
function findAllImageFiles() {
  if (!existsSync(IMAGES_DIR)) {
    error(`Images directory not found: ${IMAGES_DIR}`);
    return [];
  }

  return findFiles(IMAGES_DIR, IMAGE_EXTENSIONS).map((path) => ({
    fullPath: path,
    relativePath: relative(ROOT_DIR, path),
  }));
}

/**
 * Find all JSON files in content directory
 */
function findAllJsonFiles() {
  if (!existsSync(CONTENT_DIR)) {
    error(`Content directory not found: ${CONTENT_DIR}`);
    return [];
  }

  return findFiles(CONTENT_DIR, [".json"]).map((path) => path);
}

/**
 * Extract image path from a JSON file
 */
function extractImagePathsFromJson(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    const paths = [];

    function findImagePaths(obj) {
      if (typeof obj !== "object" || obj === null) {
        return;
      }

      // Check if this object has an image property
      if (obj.image && typeof obj.image === "string") {
        paths.push(obj.image);
      }

      // Recursively search nested objects and arrays
      if (Array.isArray(obj)) {
        obj.forEach((item) => findImagePaths(item));
      } else {
        Object.values(obj).forEach((value) => findImagePaths(value));
      }
    }

    findImagePaths(data);
    return paths;
  } catch (err) {
    warning(`Could not parse JSON file: ${filePath}`);
    return [];
  }
}

/**
 * Get all image paths referenced in content JSON files
 */
function findReferencedImagePaths() {
  const jsonFiles = findAllJsonFiles();
  const referencedPaths = new Set();

  for (const jsonFile of jsonFiles) {
    const paths = extractImagePathsFromJson(jsonFile);
    paths.forEach((path) => referencedPaths.add(path));
  }

  return Array.from(referencedPaths);
}

/**
 * Normalize path for comparison
 */
function normalizePath(path) {
  return path
    .replace(/\\/g, "/") // Normalize Windows paths
    .replace(/^~\//, "@/") // Normalize tilde paths to @
    .replace(/^src\//, "@/"); // Make src/ paths relative to root
}

/**
 * Check if an image file is referenced in content
 */
function isImageReferenced(imageFile, referencedPaths) {
  const normalizedImagePath = normalizePath(imageFile.relativePath);

  for (const referencedPath of referencedPaths) {
    // Check exact match
    if (normalizePath(referencedPath) === normalizedImagePath) {
      return true;
    }

    // Check if referenced path matches the image file name
    const imageFileName = imageFile.relativePath.split("/").pop();
    if (referencedPath.includes(imageFileName)) {
      return true;
    }
  }

  return false;
}

/**
 * Ask for user confirmation
 */
async function askForConfirmation(question) {
  // Check if running in CI or non-interactive environment
  if (!process.stdin.isTTY || process.env.CI) {
    return false;
  }

  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question + " (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
    });
  });
}

/**
 * Delete unused image files
 */
async function deleteUnusedImages(unusedImages) {
  if (unusedImages.length === 0) {
    success("No unused images to delete.");
    return;
  }

  info(`Found ${unusedImages.length} unused image(s):`);
  unusedImages.forEach((img) => {
    log(colors.magenta, `  - ${img.relativePath}`);
  });

  warning("This action cannot be undone!");

  const confirmed = await askForConfirmation(
    "Are you sure you want to delete these files?",
  );

  if (!confirmed) {
    info("Operation cancelled. No files were deleted.");
    return;
  }

  let deletedCount = 0;
  for (const img of unusedImages) {
    try {
      unlinkSync(img.fullPath);
      deletedCount++;
      success(`Deleted: ${img.relativePath}`);
    } catch (err) {
      error(`Failed to delete: ${img.relativePath} - ${err.message}`);
    }
  }

  success(`Successfully deleted ${deletedCount} unused image(s).`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const shouldDelete = args.includes("--delete") || args.includes("-d");

  log(colors.bold, "\n🔍 Scanning for unused images...\n");

  // Find all image files
  const allImages = findAllImageFiles();

  if (allImages.length === 0) {
    info("No image files found in assets directory.");
    process.exit(0);
  }

  info(`Found ${allImages.length} total image(s) in assets directory.`);

  // Find all referenced image paths
  const referencedPaths = findReferencedImagePaths();
  info(`Found ${referencedPaths.length} image reference(s) in content files.`);

  // Find unused images
  const unusedImages = allImages.filter(
    (img) => !isImageReferenced(img, referencedPaths),
  );

  if (unusedImages.length === 0) {
    success(
      "\n✨ No unused images found! All images are referenced in content.",
    );
    process.exit(0);
  }

  log(colors.yellow, "\n⚠️ Found unused images:\n");

  unusedImages.forEach((img) => {
    log(colors.red, `  ✗ ${img.relativePath}`);
  });

  log(colors.cyan, `\nTotal: ${unusedImages.length} unused image(s)\n`);

  if (shouldDelete) {
    log(colors.bold, "🗑️ Deleting unused images...\n");

    // If --delete flag is used without CI, ask for confirmation
    if (!process.env.CI && process.stdin.isTTY) {
      await deleteUnusedImages(unusedImages);
    } else {
      // In CI, delete without confirmation
      info("Running in CI mode, deleting without confirmation...");

      let deletedCount = 0;
      for (const img of unusedImages) {
        try {
          unlinkSync(img.fullPath);
          deletedCount++;
          success(`Deleted: ${img.relativePath}`);
        } catch (err) {
          error(`Failed to delete: ${img.relativePath} - ${err.message}`);
        }
      }

      success(`\n✨ Successfully deleted ${deletedCount} unused image(s).`);
    }
  } else {
    log(colors.cyan, "\n💡 To delete these files, run:");
    log(colors.bold, "   npm run cleanup:images -- --delete\n");
    process.exit(0);
  }
}

// Run the script
main().catch((err) => {
  error(`Uncaught error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
