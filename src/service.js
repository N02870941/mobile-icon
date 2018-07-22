const util  = require('util');
const shell = require('shelljs');
const exec  = util.promisify(require('child_process').exec);

//------------------------------------------------------------------------------

/**
 * Removes the extension
 * and returns just a filename.
 */
function removeExtension(filename) {

  return filename.split('.').slice(0, -1).join('.');
}

//------------------------------------------------------------------------------

/**
 * Deletes temporary files
 * used at runtime.
 */
async function cleanup() {

  let files = [];

  for (let i = 0; i < arguments.length; i++) {

      files.push(arguments[i]);
  }

  console.log('Deleting temporary files: ' + files);

  // Delete old files
  shell.rm('-rf', files);

  console.log('Cleanup complete');
}

//------------------------------------------------------------------------------

/**
 * Runs the scripts that modify
 * the uploaded image.
 */
async function modify(in_file, out_dir, ext) {

  // TODO - Edit image using NPM package instead
  // https://github.com/EyalAr/lwip

  console.log("Executing imagemagick shell script");

  const {stdout, stderr} = await exec(`./index.sh \"${in_file}\" \"${out_dir}\" \"${ext}\"`);
  const zip              = removeNewLine(stdout);

  console.log("Script complete");

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
  cleanup,
  removeExtension
};
