const fs = require('fs');
const path = require('path');

// Configure your website domain here
const DOMAIN = 'https://www.ovologistics.com.ng';
const SITEMAP_FILE = 'sitemap.xml';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Find all HTML files in the current directory
const generateSitemap = () => {
    const directoryPath = __dirname;
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }
        
        // Filter out only HTML files
        const htmlFiles = files.filter(file => path.extname(file) === '.html');
        
        if (htmlFiles.length === 0) {
            console.log('No HTML files found.');
            return;
        }

        // Build the XML structure
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        htmlFiles.forEach(file => {
            // For index.html, we just use the root domain
            const urlPath = file === 'index.html' ? '' : `/${file}`;
            const url = `${DOMAIN}${urlPath}`;
            
            // Priority for index is 1.0, others are 0.8
            const priority = file === 'index.html' ? '1.0' : '0.8';

            xml += `    <url>\n`;
            xml += `        <loc>${url}</loc>\n`;
            xml += `        <lastmod>${getTodayDate()}</lastmod>\n`;
            xml += `        <changefreq>weekly</changefreq>\n`;
            xml += `        <priority>${priority}</priority>\n`;
            xml += `    </url>\n`;
        });

        xml += `</urlset>`;

        // Write the XML back to sitemap.xml
        fs.writeFile(SITEMAP_FILE, xml, (err) => {
            if (err) {
                console.error('Error writing sitemap:', err);
            } else {
                console.log(`✅ Sitemap successfully generated with ${htmlFiles.length} pages!`);
            }
        });
    });
};

// Run the function
generateSitemap();
