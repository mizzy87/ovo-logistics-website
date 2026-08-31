const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = __dirname;

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory: ' + err);
    }

    // Find all JPG or PNG images in the root folder
    const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    if (images.length === 0) {
        console.log('No JPG/PNG images found to compress.');
        return;
    }

    console.log(`Found ${images.length} images. Starting compression...`);

    images.forEach(image => {
        const ext = path.extname(image);
        const name = path.basename(image, ext);
        const inputPath = path.join(directoryPath, image);
        const outputPath = path.join(directoryPath, `${name}.webp`);

        // Compress and convert to webp
        sharp(inputPath)
            .webp({ quality: 80 }) // 80 is a great balance of quality vs file size
            .toFile(outputPath)
            .then(info => {
                const originalSize = fs.statSync(inputPath).size;
                const newSize = info.size;
                const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
                
                console.log(`✅ Compressed ${image} -> ${name}.webp`);
                console.log(`   Size reduced by ${savings}% (${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB)`);
            })
            .catch(err => {
                console.error(`❌ Error compressing ${image}:`, err);
            });
    });
});
