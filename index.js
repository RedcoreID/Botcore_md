console.clear();
import fs from 'fs';
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import chalk from 'chalk';
import { createInterface } from 'readline';
import yargs from 'yargs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, './package.json'));

const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

console.log(chalk.greenBright('Bloodcore is starting...'));
say('BOTCORE-ID', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta'],
});
say(`Github@botcoreid`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta'],
});

let isRunning = false;
let isPairing = false;  // Flag to check pairing mode

/**
 * Start a JS file
 * @param {string} file Path to JS file to start
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });

  let p = fork();

  p.on('message', data => {
    switch (data) {
      case 'reset':
        console.log(chalk.yellow('Restarting...'));
        p.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (code) => {
    isRunning = false;
    console.error(chalk.redBright(`⚠️ Process exited with code: ${code}`));

    if (!process.env.pm_id) {
      start(file);
    } else {
      process.exit(1);
    }
  });

  // CLI interaction
  const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  if (opts['pairing']) {
    isPairing = true;  // Set pairing mode if the --pairing flag is used
    console.log(chalk.greenBright('Pairing mode activated.'));
    // You can add pairing-related code here, such as QR code generation or API communication
  }

  if (!opts['test'] && rl.listenerCount('line') === 0) {
    rl.on('line', line => {
      p.emit('message', line.trim());
    });
  }

  // Hot Reload
  watchFile(join(__dirname, file), () => {
    unwatchFile(join(__dirname, file));
    console.log(chalk.cyanBright(`Detected change in '${file}', restarting...`));
    p.kill();
    isRunning = false;
    start(file);
  });
}

// Start the bot, and if pairing mode is active, handle pairing processes
if (isPairing) {
  console.log(chalk.blueBright('Initializing pairing process...'));
  // Add any pairing-specific logic or methods here (e.g., generating pairing QR codes)
}

start('main.js');