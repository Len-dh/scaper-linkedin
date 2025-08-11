const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Le paramètre "url" est requis' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 100000 // on donne plus de temps pour démarrer Chrome
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', reqInt => {
      const blocked = ['image', 'stylesheet', 'font', 'media'];
      blocked.includes(reqInt.resourceType()) ? reqInt.abort() : reqInt.continue();
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.description__text', { timeout: 20000 });

    const jobDescription = await page.$eval('.description__text', el => el.innerText.trim());

    await browser.close();
    res.json({ jobDescription });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
