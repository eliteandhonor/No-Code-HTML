#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = process.argv[2] || path.join(process.cwd(), 'no_code_builder.html');

function extractLibraries(html) {
  const $ = cheerio.load(html);
  const libs = new Map();
  $('script[src],link[href]').each((_, el) => {
    const attr = el.tagName === 'link' ? 'href' : 'src';
    const url = $(el).attr(attr);
    if (!url) return;
    const match = url.match(/cdnjs\.cloudflare\.com\/ajax\/libs\/([^/]+)\/([^/]+)\/.*$/);
    if (match) {
      const name = match[1];
      const version = match[2];
      if (!libs.has(name)) {
        libs.set(name, { version, url });
      }
    }
  });
  return libs;
}

async function fetchLatestVersion(lib) {
  const url = `https://api.cdnjs.com/libraries/${lib}?fields=version`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.version;
  } catch (err) {
    try {
      const { execSync } = require('child_process');
      const output = execSync(`curl -s ${url}`, { encoding: 'utf8' });
      const data = JSON.parse(output);
      return data.version;
    } catch {
      throw new Error(`Failed to fetch ${lib}: ${err.message}`);
    }
  }
}

async function main() {
  let html;
  try {
    html = fs.readFileSync(htmlPath, 'utf8');
  } catch (err) {
    console.error(`Unable to read file: ${htmlPath}`);
    process.exit(1);
  }
  const libs = extractLibraries(html);
  const outdated = [];
  const errors = [];
  for (const [name, info] of libs.entries()) {
    try {
      const latest = await fetchLatestVersion(name);
      if (latest && latest !== info.version) {
        outdated.push({ name, current: info.version, latest });
      }
    } catch (err) {
      errors.push(`${name}: ${err.message}`);
    }
  }
  if (outdated.length) {
    console.error('Outdated CDN libraries:');
    for (const lib of outdated) {
      console.error(`- ${lib.name}: ${lib.current} (latest: ${lib.latest})`);
    }
  }
  if (errors.length) {
    console.error('Errors while checking libraries:');
    for (const e of errors) console.error(`- ${e}`);
  }
  if (outdated.length || errors.length) {
    process.exit(1);
  }
  console.log('All CDN libraries are up to date.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
