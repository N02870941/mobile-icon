const port = process.env.PORT || process.argv[2] || 80;
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Calls test script.
 */
async function test() {

  try {

    // Build the command
    let script  = "./test.sh";
    let file    = "./template/img/icon.jpeg";
    let host    = "localhost";
    let reqs    = 50;
    let command = `${script} --file=${file} --port=${port} --host=${host} --requests=${reqs}`;

    // Execute it
    const { stdout, stderr } = await exec(command);

    // Print stdout and stderr
    console.log('stdout:\n', stdout);
    console.error('stderr:\n', stderr);

  // Any errors means we failed
  } catch (error) {

    console.error('Test failed');
    console.error(error);

    process.exit(1);
  }
}

test();
