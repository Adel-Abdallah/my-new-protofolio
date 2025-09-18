const fs = require('fs');
const path = require('path');

// Read the main index.html
const indexPath = path.join(__dirname, 'index.html');
const pdfPath = path.join(__dirname, 'pdf.html');

// Read the content of index.html
fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading index.html:', err);
        return;
    }
    
    // Extract the content inside the <main class="portfolio"> tag
    const mainContentMatch = data.match(/<main class="portfolio">([\s\S]*?)<\/main>/);
    if (!mainContentMatch) {
        console.error('Could not find portfolio content in index.html');
        return;
    }
    
    const portfolioContent = mainContentMatch[0];
    
    // Read the PDF template
    fs.readFile(pdfPath, 'utf8', (err, pdfTemplate) => {
        if (err) {
            console.error('Error reading pdf.html:', err);
            return;
        }
        
        // Replace the portfolio content in the PDF template
        const updatedPdf = pdfTemplate.replace(
            /<main class="portfolio">[\s\S]*?<\/main>/,
            portfolioContent
        );
        
        // Write the updated PDF file
        fs.writeFile(pdfPath, updatedPdf, 'utf8', (err) => {
            if (err) {
                console.error('Error writing pdf.html:', err);
                return;
            }
            console.log('PDF version generated successfully!');
            console.log('Open pdf.html in your browser and click the download button.');
        });
    });
});
