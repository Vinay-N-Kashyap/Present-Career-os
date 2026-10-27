const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generatePdf() {
  console.log('Launching Chromium for PDF generation...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, '../mistakes_during_urgency.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  console.log('Loading:', fileUrl);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  
  const outputPath = 'C:/Users/Admin/Desktop/mistakes_during_urgency.pdf';
  console.log('Printing PDF to:', outputPath);
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '14mm',
      bottom: '14mm',
      left: '12mm',
      right: '12mm'
    }
  });
  
  await browser.close();
  console.log('✅ PDF generated successfully at:', outputPath);
}

generatePdf().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
