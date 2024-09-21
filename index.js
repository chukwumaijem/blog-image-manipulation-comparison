import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getPercentageChange(a, b) {
  return Number((Math.abs(a - b) / a) * 100).toFixed(2) + '%';
}

const OneKB = 1024;
const OneMB = OneKB * OneKB;
const OneGB = OneKB * OneKB * OneKB;
function calculateFileSize(bytes) {
  let newSize = '0 bytes';

  if (bytes >= OneGB) {
    newSize = Number(bytes / OneGB).toFixed(2) + ' GB';
  } else if (bytes >= OneMB) {
    newSize = Number(bytes / OneMB).toFixed(2) + ' MB';
  } else if (bytes >= OneKB) {
    newSize = Number(bytes / OneKB).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    newSize = Number(bytes).toFixed(2) + ' bytes';
  } else if (bytes == 1) {
    newSize = Number(bytes).toFixed(2) + ' byte';
  }

  return newSize;
}

// Function to minify image using sharp
const funcs = {
  png: (input, output) =>
    sharp(input).png({ palette: true, effort: 10, quality: 85 }).toFile(output),
  jpeg: (input, output) =>
    sharp(input).jpeg({ mozjpeg: true, quality: 85 }).toFile(output),
};
async function minifyWithSharp(inputPath, output, fileName) {
  const outputPath = path.join(output, 'sharp', fileName);

  const srcMetadata = await sharp(inputPath).metadata();
  if (!srcMetadata.format) throw new Error();

  const start = Date.now(); // Start time
  await funcs[srcMetadata.format]?.(inputPath, outputPath);
  const end = Date.now(); // End time
  const timeTaken = Number((end - start) / 1000).toFixed(2) + 's';
  console.log(`Sharp minification took ${timeTaken}`);

  const size1 = fs.statSync(inputPath).size;
  const size2 = fs.statSync(outputPath).size;

  return {
    fileName,
    inputSize: calculateFileSize(size1),
    outputSize: calculateFileSize(size2),
    sizeDiff: getPercentageChange(size1, size2),
    timeTaken,
  };
}

// Function to minify image using imagemin
async function minifyWithImagemin(inputPath, output, fileName) {
  const outputPath = path.join(output, 'imagemin', fileName);
  const start = Date.now(); // Start time
  await imagemin([inputPath], {
    destination: path.dirname(outputPath),
    plugins: [
      imageminMozjpeg({ quality: 85 }),
      imageminPngquant({
        quality: [0.7, 0.9],
      }),
    ],
  });
  const end = Date.now(); // End time
  const timeTaken = Number((end - start) / 1000).toFixed(2) + 's';
  console.log(`Imagemin minification took ${timeTaken}`);

  const size1 = fs.statSync(inputPath).size;
  const size2 = fs.statSync(outputPath).size;

  return {
    fileName,
    inputSize: calculateFileSize(size1),
    outputSize: calculateFileSize(size2),
    sizeDiff: getPercentageChange(size1, size2),
    timeTaken,
  };
}

// Example usage
(async () => {
  const fileNames = [
    'image-3mb.jpg',
    'image-5mb.jpg',
    'image-19mb.png',
    'image-24mb.png',
  ];
  const imageInputPath = './image-inputs';
  const imageOutputPath = './image-outputs';

  const promises = fileNames.map(async (fileName) => {
    const input = path.join(__dirname, imageInputPath, fileName);
    const output = path.join(__dirname, imageOutputPath);

    const sharpResult = await minifyWithSharp(input, output, fileName);
    const imageminResult = await minifyWithImagemin(input, output, fileName);

    return { sharp: sharpResult, imagemin: imageminResult };
  });
  const [a, b, c, d] = await Promise.all(promises);
  console.table(a); // 3mb image
  console.table(b); // 5mb image
  console.table(c); // 19mb image
  console.table(d); // 24mb image
})();
