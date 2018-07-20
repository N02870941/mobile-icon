const util = require('util');
const exec = util.promisify(require('child_process').exec);

//------------------------------------------------------------------------------

/**
 * Runs the scripts that modify
 * the uploaded image
 */
async function modify(in_file, out_dir, callback) {

  // TODO - Edit image using NPM package instead

  console.log("Executing imagemagick shell script");

  const {stdout, stderr} =  await exec(`./index.sh ${in_file} ${out_dir}`);
  const zip              = removeNewLine(stdout);

  console.log("Zipping complete");

  callback(zip);
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

  modify
};
