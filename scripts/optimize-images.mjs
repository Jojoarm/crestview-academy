import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/assets/images');
const outputDir = path.join(__dirname, '../public/assets/img-optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(
    outputDir,
    file.replace(path.extname(file), '.webp')
  );

  // Skip optimization if already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);

    if (outputStats.mtimeMs > inputStats.mtimeMs) {
      console.log(`⏭️ Skipped (already optimized): ${file}`);
      return;
    }
  }

  const isLogo = /logo/i.test(file); // detects "logo" in the filename

  const transformer = sharp(inputPath).toFormat('webp', {
    quality: isLogo ? 95 : 80,
  });

  if (!isLogo) {
    transformer.resize({ width: 1200 }); // resize only non-logos
  }

  transformer
    .toFile(outputPath)
    .then(() => {
      console.log(
        `✅ Optimized: ${file} ${isLogo ? '(logo rule applied)' : ''}`
      );
    })
    .catch((err) => {
      console.error(`❌ Error optimizing ${file}:`, err);
    });
});
