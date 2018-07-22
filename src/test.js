const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function test() {

  try {

    const { stdout, stderr } = await exec('./test.sh');

    console.log('stdout:\n', stdout);
    console.error('stderr:\n', stderr);

  } catch (error) {

    console.error('Test failed');
    console.error(error);

    process.exit(1);
  }
}

test();
