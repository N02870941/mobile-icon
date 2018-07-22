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

# NOTE - https://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash

# Process command line args
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -p|--port)
    port="$2"
    shift # past argument
    shift # past value
    ;;

    -h|--host)
    host="$2"
    shift # past argument
    shift # past value
    ;;

    -r|--requests)
    posts="$2"
    shift # past argument
    shift # past value
    ;;

    -f|--file)
    file="$2"
    shift # past argument
    shift # past value
    ;;

    --default)
    DEFAULT=YES
    shift # past argument
    ;;

    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# Variables
url="${host}:${port}"
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

echo "${success} out of ${requests} requests were successful"

#-------------------------------------------------------------------------------

exit ${result}
