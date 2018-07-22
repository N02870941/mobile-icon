#!/bin/bash
set -e

# Change working directory to that of this script
cd "$( dirname "${BASH_SOURCE[0]}" )"

#-------------------------------------------------------------------------------

# Constants
readonly script_dir=""
readonly url="localhost:8080/upload"
readonly file="static/img/icon.jpeg"

#-------------------------------------------------------------------------------

# TODO - Parse command line arguments

# Variables
pids=""
result=0

# Curl the homepage
#-------------------------------------------------------------------------------

curl --silent --fail "${url}" > /dev/null &

if ! wait ${pid}; then

  echo "Could not fetch index.html"

  exit 1

else
  echo "Successfully fetched index.html"
fi

# Start 10 processes asynchronously and store their PIDs in the string
#-------------------------------------------------------------------------------

for i in {1..50}
do
  curl --silent --fail -F "file=@${file}" "${url}" > /dev/null &

  pids+="$! "
done

# Wait for all subprocesses to finish and make sure that ALL of the exit successfully
#-------------------------------------------------------------------------------

for pid in ${pids}
do

  if ! wait ${pid}; then
    result=1

    echo "PID ${pid} exited unsuccessfully"
  else
    echo "PID ${pid} exited successfully"
  fi
done

#-------------------------------------------------------------------------------

exit ${result}
