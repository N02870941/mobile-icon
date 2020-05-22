# Mobile Icon

[![Build Status](https://travis-ci.com/N02870941/mobile-icon.svg?branch=master)](https://travis-ci.com/N02870941/mobile-icon)

Mobile Icon is a web app that takes an image and returns a zip file of the
image resized to all of the required sizes for Android and iOS application compliance.

# How to use

Install the following dependencies:

- `brew install imagemagick` on Mac or `apt-get install imagemagick` on Linux
- `zip` (comes with macOS by default) or `apt-get install zip` on Linux

Run the app on port 80 like follows:

```bash
git clone https://github.com/N02870941/mobile-icon.git
cd mobile-icon
npm install
npm start
```

If port 80 is already in use, you can set the environment variable `PORT` to the port number that
you wish to run the application on:

```bash
export PORT=8080
```

You can also run the node script passing the desired port as the first argument:

```bash
node app/server 80
```

It is worth noting that the environment variable `PORT` takes precedence. If that variable is not set,
then the first command line argument argument will be used. If no argument is passed, the application
will default to running on port 80.

The application has one function. You navigate to the homepage, upload an image an a zip
file called `icon.zip` will be returned. Once unzipped, the directory is structured as follows:

```
/icon
├── /original
|   └── icon.png
|  
├── /ios
|   ├── icon-20@1x.png
|   ├── icon-1024@1x.png
|   .
|   .
|   .
|   └── icon-20@2x.png
|  
└── /android
    ├── /xxxhdpi
    |   └── icon.png
    |
    ├── /mdpi
    .   └── icon.png
    .
    .
    └── /ldpi
        └── icon.png
```

All iOS assets are in a single directory where the file names represent the image resolution. Android assets are separated by folder where the folder name represents the DPI the contained asset was created for.

# Endpoints
There are three endpoints. We will assume the app is running on port `8080`.

## `/`
This serves the `index.html` page that has a simple upload file form.

```
curl localhost
```

## `/upload`
This requires an `HTTP - POST` request of a form with an image file called `file`
as the body. This endpoint is used by the form in the `index.html`. It can be
used directly as a service via a REST call.

```
curl -F "file=@icon.jpeg" localhost/upload --fail -o icon.zip
```

You may also find this documentation on [GitHub Pages](https://n02870941.github.io/mobile-icon/).
