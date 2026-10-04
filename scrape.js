const scrape = require('website-scraper').default;

const options = {
  urls: ['https://vita-travel.webflow.io/'],
  directory: 'E:\\MnM_Travel_Russian\\vita_clone',
  sources: [
    {selector: 'img', attr: 'src'},
    {selector: 'link[rel="stylesheet"]', attr: 'href'},
    {selector: 'script', attr: 'src'}
  ]
};

scrape(options).then((result) => {
    console.log("Entire website succesfully downloaded");
}).catch((err) => {
    console.log("An error ocurred", err);
});
