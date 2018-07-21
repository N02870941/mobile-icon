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
|   ├── icon-20x1pt.png
|   ├── icon-1024x1pt.png
|   .
|   .
|   .
|   └── icon-20x2pt.png
|  
└── /android
    ├── icon-20x2pt.png
    ├── icon-30x2pt.png
    .
    .
    .
    └── icon-40x2pt.png
```

# Endpoints
There are two endpoints. We will assume the app is running on port 8080.

## `/`
This serves the `index.html` page that has a simple upload file form.

```
curl localhost:8080
```

## `/upload`
This requires an `HTTP - POST` and an image file as the body. This endpoint is
used by the form in the `index.html`. It can be used directly as a service via
a REST call.

```
curl -F "file=@icon.jpeg" localhost:8080/upload --fail
```
