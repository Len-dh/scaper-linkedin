const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).json({ error: 'Le paramètre url est requis' });
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/opt/render/.cache/puppeteer/chrome/linux-139.0.7258.66/chrome-linux64/chrome'
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.description__text'); // CSS spécifique

    const jobDescription = await page.$eval('.description__text', el => el.innerText);

    await browser.close();
    res.status(200).json({ jobDescription });
  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
