const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const script = path.resolve(__dirname, '..', 'validateSections.js');

function runValidate(content) {
  const tmpFile = path.join(os.tmpdir(), `validate-${Date.now()}-${Math.random()}`);
  fs.writeFileSync(tmpFile, content);
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

test('fails for binary file input', () => {
  const binary = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  const result = runValidate(binary);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('Unsupported');
});

test('fails for JSON text input', () => {
  const json = '{"foo":"bar"}';
  const result = runValidate(json);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('Unsupported');
});

test('fails when the path is unreadable', () => {
  const missingPath = path.join(os.tmpdir(), 'missing-file.html');
  const result = spawnSync('node', [script, missingPath], { encoding: 'utf8' });
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('Unable to read file');
});
