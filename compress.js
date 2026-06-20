/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directories = [
  path.join(__dirname, 'public/images/projects'),
  path.join(__dirname, 'public/images/about')
];

const standaloneFiles = [
  path.join(__dirname, 'public/images/hero-bg.jpg')
];

async function compressImage(filePath) {
  const tempPath = filePath + '.tmp';
  try {
    const stats = fs.statSync(filePath);
    // Only compress files larger than 1MB
    if (stats.size > 1024 * 1024) {
      await sharp(filePath)
        .resize({ width: 1920, withoutEnlargement: true }) // resize to max 1920px width
        .jpeg({ quality: 75, progressive: true })
        .toFile(tempPath);
      
      fs.renameSync(tempPath, filePath);
      
      const newStats = fs.statSync(filePath);
      const saved = ((stats.size - newStats.size) / (1024 * 1024)).toFixed(2);
      console.log(`Compressed: ${path.basename(filePath)} (Saved ${saved} MB)`);
    } else {
      console.log(`Skipped: ${path.basename(filePath)} (Already optimized)`);
    }
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error);
  }
}

async function processAll() {
  console.log("Starting image compression...");
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (/\.(jpg|jpeg|png)$/i.test(file)) {
          await compressImage(path.join(dir, file));
        }
      }
    }
  }
  
  for (const file of standaloneFiles) {
    if (fs.existsSync(file)) {
      await compressImage(file);
    }
  }
  
  console.log("Compression complete!");
}

processAll();
