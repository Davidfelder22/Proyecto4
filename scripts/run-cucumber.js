const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
if (args.includes('--headed')) process.env.HEADED = '1';
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
// Cucumber ejecuta la suite; Playwright se utiliza desde los Page Objects.
const cli = path.join(root, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js');
const result = spawnSync(process.execPath, [cli, ...args.filter(arg => arg !== '--headed')], {
  cwd: root,
  stdio: 'inherit'
});
if (result.error) {
  console.error(result.error.message);
}
process.exitCode = result.status ?? 1;
