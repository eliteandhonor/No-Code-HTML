#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(process.cwd(), 'no_code_builder.html');
const readmePath = path.join(process.cwd(), 'README.md');

let html;
try {
  html = fs.readFileSync(htmlPath, 'utf8');
} catch {
  console.error(`Unable to read ${htmlPath}`);
  process.exit(1);
}

const anchorRegex = /<!--\s*\[L(\d+)\]\s*(.+?)\s*-->/g;
const anchors = [];
let match;
while ((match = anchorRegex.exec(html)) !== null) {
  anchors.push({ line: match[1], label: match[2].trim() });
}

if (!anchors.length) {
  console.error('No anchor comments found.');
  process.exit(1);
}

const tableLines = [
  '| Line | Feature |',
  '| ---- | ------- |',
  ...anchors.map((a) => `| ${a.line} | ${a.label} |`),
];

let readme;
try {
  readme = fs.readFileSync(readmePath, 'utf8');
} catch {
  console.error(`Unable to read ${readmePath}`);
  process.exit(1);
}

const tableStart = readme.indexOf('| Line | Feature |');
if (tableStart === -1) {
  console.error('Could not find Quick Navigation table in README.md');
  process.exit(1);
}
const nextHeadingIndex = readme.indexOf('\n##', tableStart);
const endIdx = nextHeadingIndex === -1 ? readme.length : nextHeadingIndex;
const before = readme.slice(0, tableStart);
const after = readme.slice(endIdx);
const newReadme = before + tableLines.join('\n') + '\n' + after;

fs.writeFileSync(readmePath, newReadme);
console.log('Updated Quick Navigation table in README.md');
