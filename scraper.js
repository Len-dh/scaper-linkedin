const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://www.linkedin.com/jobs/view/4233626485';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Attendre que le bloc description apparaisse
  await page.waitForSelector('.description__text');

  // Extraire la description
  const jobDescription = await page.$eval('.description__text', el => el.innerText);

  console.log(jobDescription);

  await browser.close();
})();