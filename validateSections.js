const fs = require('fs');
const cheerio = require('cheerio');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node validateSections.js <html-file>');
  process.exit(1);
}

let html;
try {
  html = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`Unable to read file: ${filePath}`);
  console.error(err.message);
  process.exit(1);
}

const $ = cheerio.load(html);
let missing = false;
$('body').children().each((index, element) => {
  if (element.type !== 'tag') return;
  const tag = element.name.toLowerCase();
  if (['script', 'style', 'link'].includes(tag)) return;
  if (!$(element).attr('data-section')) {
    console.error(`Element <${tag}> at index ${index} is missing data-section attribute`);
    missing = true;
  }
});

if (missing) {
  process.exit(1);
}
console.log('All top-level blocks contain data-section attribute.');
