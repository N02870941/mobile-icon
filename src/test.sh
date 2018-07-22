#!/bin/bash
set -e

# Change working directory to that of this script
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Makes sure each endpoint is functional
#
# 1 * HTTP - GET:  /
# 1 * HTTP - GET:  /error
# N * HTTP - POST: /upload

# Constants and variables
#-------------------------------------------------------------------------------

# Constants
readonly posts=50
readonly script_dir=""
readonly host="localhost"
readonly port="8080"
readonly url="${host}:${port}"
readonly file="template/img/icon.jpeg"

# Variables
pids=""
result=0
success=0
requests=0

# Curl the .html pages
#-------------------------------------------------------------------------------

# Array of URLs to cURL
declare -a arr=( \
  ""             \
  "error"        \
)

for path in "${arr[@]}"
do
  curl --silent --fail "${url}/$path" > /dev/null &

  pids+="$! "
  ((requests++))
done

# Start N processes asynchronously and store their PIDs in the string
#-------------------------------------------------------------------------------

for i in {$(seq 1 ${posts})}
do
  curl --silent --fail -F "file=@${file}" "${url}/upload" > /dev/null &

  pids+="$! "
  ((requests++))
done

# Wait for all subprocesses to finish and make sure that ALL of the exit successfully
#-------------------------------------------------------------------------------

for pid in ${pids}
do

  # Count number of
  # successful requests
  if ! wait ${pid}; then
    result=1
  else
    ((success++))
  fi
done

echo "${success} out of ${requests} images were successfully posted"

#-------------------------------------------------------------------------------

exit ${result}
