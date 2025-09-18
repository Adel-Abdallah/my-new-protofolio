const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const projectDir = __dirname;
    const inputFile = path.resolve(projectDir, 'index.html');
    const outputFile = path.resolve(projectDir, 'Adel-Abdallah-Resume.pdf');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--disable-web-security',
        '--allow-file-access-from-files',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    // Use screen media to match the live site exactly (avoids @media print link URL artifacts)
    await page.emulateMediaType('screen');

    // Build file URL to local index.html
    const fileUrl = 'file://' + inputFile;

    await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 120000 });

    // Optional: ensure fonts are loaded before printing
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) {}
      }
    });

    // Hard-remove UI that should never be in the PDF (defensive along with print CSS)
    await page.evaluate(() => {
      document.querySelectorAll('.no-print, .actions-bar').forEach((el) => el.remove());
    });

    // Create PDF (A4 with background graphics)
    const pdfBuffer = await page.pdf({
      path: outputFile,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '8mm',
        bottom: '10mm',
        left: '8mm',
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    const sizeKB = (fs.statSync(outputFile).size / 1024).toFixed(1);
    console.log(`PDF generated: ${outputFile} (${sizeKB} KB)`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    process.exitCode = 1;
  }
})();
