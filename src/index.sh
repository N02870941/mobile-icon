#!/bin/bash
set -e

readonly script_dir="$( dirname "${BASH_SOURCE[0]}" )"

# Change working directory to that of this script
cd "${script_dir}"

#-------------------------------------------------------------------------------

# Makes a new folder if it
# does not already exist
create_dir() {
  local dir="${1}"; shift

  if [ ! -d "${dir}" ]; then
    mkdir -p "${dir}"
  fi
}

#-------------------------------------------------------------------------------

# Zips a folder
zip_dir() {

  local in="${1}";  shift
  local out="${1}"; shift

  zip -r "${out}" "${in}" 2>&1 1>/dev/null
}

#-------------------------------------------------------------------------------

# Creates iOS and Android
# icons from input image
create_icons() {

  # Function arguments
  local readonly img="${1}"; shift
  local readonly dir="${1}"; shift
  local readonly ext="${1}"; shift

  # Output directories
  local readonly ios_dir="${dir}/ios"
  local readonly android_dir="${dir}/android"
  local readonly original_dir="${dir}/original"

  # Create output directories
  create_dir "${dir}"
  create_dir "${ios_dir}"
  create_dir "${android_dir}"
  create_dir "${original_dir}"

  # Copy original into output dir
  cp "${img}" "${original_dir}"

  # TODO - Make asynchronous?

  # Populate ./ios
  convert "${img}" -resize 20x20!    -quality 100 "${ios_dir}/icon-20x1pt${ext}"
  convert "${img}" -resize 40x40!    -quality 100 "${ios_dir}/icon-20x2pt${ext}"
  convert "${img}" -resize 60x60!    -quality 100 "${ios_dir}/icon-20x3pt${ext}"

  convert "${img}" -resize 29x29!    -quality 100 "${ios_dir}/icon-29x1pt${ext}"
  convert "${img}" -resize 58x58!    -quality 100 "${ios_dir}/icon-29x2pt${ext}"
  convert "${img}" -resize 87x87!    -quality 100 "${ios_dir}/icon-29x3pt${ext}"

  convert "${img}" -resize 40x40!     -quality 100 "${ios_dir}/icon-40x1pt${ext}"
  convert "${img}" -resize 80x80!     -quality 100 "${ios_dir}/icon-40x2pt${ext}"
  convert "${img}" -resize 120x120!   -quality 100 "${ios_dir}/icon-40x3pt${ext}"

  convert "${img}" -resize 120x120!   -quality 100 "${ios_dir}/icon-60x2pt${ext}"
  convert "${img}" -resize 180x180!   -quality 100 "${ios_dir}/icon-60x3pt${ext}"

  convert "${img}" -resize 76x76!     -quality 100 "${ios_dir}/icon-76x1pt${ext}"
  convert "${img}" -resize 152x152!   -quality 100 "${ios_dir}/icon-76x2pt${ext}"

  convert "${img}" -resize 167x167!   -quality 100 "${ios_dir}/icon-83.5x2pt${ext}"
  convert "${img}" -resize 1024x1024! -quality 100 "${ios_dir}/icon-1024x1pt${ext}"

  # TODO - Populate ./android

  # Zip the output directory
  zip_dir "${dir}" "${dir}.zip"

  # Print output dir to stdout
  echo "${dir}.zip"

  # Clean up temp files
  rm -rf "${dir}"
}

#-------------------------------------------------------------------------------

# Main function
main() {

  local img="${1}"; shift
  local dir="${1}"; shift
  local ext="${1}"; shift

  create_icons "${img}" "${dir}" "${ext}"
}

#-------------------------------------------------------------------------------

# Execute main
# function
main "${@}"
