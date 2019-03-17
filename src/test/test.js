const host   = process.env.HOST || process.argv[2] || "127.0.0.1";
const port   = process.env.PORT || process.argv[3] || 80;
const file   = process.env.FILE || process.argv[4] || "./img/icon.jpeg";
const reqs   = process.env.REQS || process.argv[5] || 50;
const spawn  = require('child_process').spawn;
const script = "./test.sh";
const proc   = spawn(`./test.sh`, [
                     `--file=${file}`,
                     `--port=${port}`,
                     `--host=${host}`,
                     `--requests=${reqs}`]
);

proc.stdout.on('data', stdout => console.log(`${stdout}`));
proc.stderr.on('data', stderr => console.error(`${stderr}`));
proc.on('close', code => process.exit(code));
