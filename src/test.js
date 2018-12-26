const host   = process.env.HOST || process.argv[2] || "127.0.0.1";
const port   = process.env.PORT || process.argv[3] || 80;
const file   = process.env.FILE || process.argv[4] || "./template/img/icon.jpeg";
const reqs   = process.env.REQS || process.argv[5] || 50;
const path   = require('path');
const util   = require('util');
const spawn  = require('child_process').spawn;
const script = "./test.sh";
const proc   = spawn(`./test.sh`, [
                     `--file=${file}`,
                     `--port=${port}`,
                     `--host=${host}`,
                     `--requests=${reqs}`]
);

// Pipe to stdout
proc.stdout.on('data', (data) => {

  console.log(`${data}`);
});

// Pipe to stderr
proc.stderr.on('data', (data) => {

  console.error(`${data}`);
});

// Close with same exit code as script
proc.on('close', (code) => {

  console.log(`child process exited with code ${code}`);

  process.exit(code);
});
