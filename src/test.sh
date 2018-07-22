#!/bin/bash
set -e

# Change working directory to that of this script
# cd "$( dirname "${BASH_SOURCE[0]}" )"

# Makes sure each endpoint is functional
#
# 1 * HTTP - GET:  /
# 1 * HTTP - GET:  /error
# N * HTTP - POST: /upload

# Constants and variables
#-------------------------------------------------------------------------------

# port=8080
# posts=50
# host="localhost"
# file="./template/img/icon.jpeg"

# NOTE - https://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash

# Process command line args
for i in "$@"
do
case $i in
    -p=*|--port=*)
    port="${i#*=}"
    shift # past argument=value
    ;;

    -r=*|--requests=*)
    posts="${i#*=}"
    shift # past argument=value
    ;;

    -h=*|--host=*)
    host="${i#*=}"
    shift # past argument=value
    ;;

    -f=*|--file=*)
    file="${i#*=}"
    shift # past argument=value
    ;;

    *)
    # unknown option
    ;;
esac
done

# Variables
url="${host}:${port}"
pids=""
result=0
success=0
requests=0

# Show variables
echo "POSTS: ${posts}"
echo "HOST:  ${host}"
echo "PORT:  ${port}"
echo "FILE:  ${file}"
echo "URL:   ${url}"

# Curl the .html pages
#-------------------------------------------------------------------------------

# Array of URLs to cURL
paths="/ /error"

for path in ${paths}
do
  curl --fail --silent --show-error "${url}${path}" > /dev/null &

  pids+="$! "
  ((requests++))
done


# Start N processes asynchronously and store their PIDs in the string
#-------------------------------------------------------------------------------

for i in {$(seq 1 ${posts})}
do
  curl --fail --silent --show-error -F "file=@${file}" "${url}/upload" > /dev/null &

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
