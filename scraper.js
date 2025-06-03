const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).json({ error: 'Le paramètre url est requis' });
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.description__text'); // CSS sélecteur spécifique à LinkedIn

    const jobDescription = await page.$eval('.description__text', el => el.innerText);

    await browser.close();
    res.status(200).json({ jobDescription });
  } catch (err) {
    await browser.close();
    res.status(500).json({ error: err.message });
  }
};
