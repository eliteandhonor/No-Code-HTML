const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const script = path.resolve(__dirname, '..', 'validateSections.js');

function runValidate(html) {
  const tmpFile = path.join(os.tmpdir(), `validate-${Date.now()}-${Math.random()}.html`);
  fs.writeFileSync(tmpFile, html);
  const result = spawnSync('node', [script, tmpFile], { encoding: 'utf8' });
  fs.unlinkSync(tmpFile);
  return result;
}

test('succeeds when all top-level blocks have data-section', () => {
  const html = '<!doctype html><html><body><div data-section="one"></div><section data-section="two"></section></body></html>';
  const result = runValidate(html);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('All top-level blocks');
});

test('fails when a top-level block is missing data-section', () => {
  const html = '<!doctype html><html><body><div></div></body></html>';
  const result = runValidate(html);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('missing data-section');
});
