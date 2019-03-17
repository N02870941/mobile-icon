# Mobile Icon

[![Build Status](https://travis-ci.com/N02870941/mobile-icon.svg?branch=master)](https://travis-ci.com/N02870941/mobile-icon)

Mobile Icon is a web app that takes an image and returns a zip file of the
image resized to all of the required sizes for Android and iOS application compliance.

# How to use

The app has one function. You navigate to the homepage, upload an image an a zip
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
    ├── icon-20@2x.png
    ├── icon-30@2x.png
    .
    .
    .
    └── icon-40@2x.png
```

# Endpoints
There are three endpoints. We will assume the app is running on port `8080`.

## `/`
This serves the `index.html` page that has a simple upload file form.

```
curl localhost:8080
```

## `/upload`
This requires an `HTTP - POST` request of a form with an image file called `file`
as the body. This endpoint is used by the form in the `index.html`. It can be
used directly as a service via a REST call.

## `/error`
All server-side errors will redirect to this page with a message describing the
error. The client is then redirected to the homepage.

```
curl -F "file=@icon.jpeg" localhost:8080/upload --fail -o icon.zip
```

You may also find this documentation on [GitHub Pages](https://n02870941.github.io/mobile-icon/).
