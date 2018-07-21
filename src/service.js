const util = require('util');
const exec = util.promisify(require('child_process').exec);

//------------------------------------------------------------------------------

/**
 * Deletes temporary files
 * used at runtime.
 */
async function cleanup() {

  console.log('Deleting temporary files');

  // Delete old files
  await exec('rm -rf uploads icon.zip');

  console.log('Cleanup complete');
}

//------------------------------------------------------------------------------

/**
 * Runs the scripts that modify
 * the uploaded image.
 */
async function modify(in_file, out_dir) {

  // TODO - Edit image using NPM package instead
  // https://github.com/EyalAr/lwip

  console.log("Executing imagemagick shell script");

  const {stdout, stderr} = await exec(`./index.sh ${in_file} ${out_dir}`);
  const zip              = removeNewLine(stdout);

  console.log("Zipping complete");

  return zip;
}

//------------------------------------------------------------------------------

/**
 * Removes new line characters
 * from the end of a string.
 */
function removeNewLine(string) {

  return string.replace(/(\r\n\t|\n|\r\t)/gm,"");
}

//------------------------------------------------------------------------------

module.exports = {

  modify,
  cleanup
};
