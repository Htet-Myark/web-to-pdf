const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-pdf', async (req, res) => {
  const url = req.body.url;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="webpage.pdf"',
  });

  res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
