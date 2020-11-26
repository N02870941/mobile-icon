export default {
  header: {
    title: "Mobile Icon Converter",
    paragraphs: [
      `
      Are you a designer or a developer that is tired of manually resizing your assets not only
      for different screen sizes, but also for different platforms? Or are you simply new to app
      development and you want your first app to show off your shiny new icon without you having to
      buy photoshop or spend all day resizing your icon on the command line?`,
      `
      Either case, you came to the right place! Mobile Icon Converter is a simple tool for
      automatically resizing images for use on iOS and Android devices.
      `,
    ],
  },
  guidelines: {
    instructions: {
      title: "General Guidelines",
      paragraphs: [
        `
        Attach your original image, hit the "Upload" button, and you will recieve a zipped folder of all the
        properly resized and named assets all ready to go.
        `,
        `
        After you have downloaded your assets, unzip it, and copy the icons into your app directory and your app
        will be looking great on all screens in no time!
        `
      ],
    },

    description: {
      paragraphs: [
        "The image that you upload should follow the following guidelines:"
      ],
      constraints: [
        "File size no greater than 2mb (for now)",
        "Image should be square (width is equal to height)",
      ],
    },

    apple: {
      title: "Apple Guidelines",
      paragraphs: [
        `
        Xcode will require that your assets have the following sizes. All of the icons will be in the
        same directory, and you can copy all of them directly into your Assets as is.
        `
      ],
      table: {
        columns: [
          "Size",
          "Scale",
          "Resolution",
        ]
      }
    },

    android: {
      title: "Android Guidelines",
      paragraphs: [
        `
        Android works a little different from iOS. Android will be expecting all assets (independent of size)
        to have the exact same name. Different asset sizes will be seperated by folder where the
        name of the folder indicates the size of the asset. For example, if an asset is named icon.png, for devices
        that fall under the xxxhdpi category, we will expect the 192x192 version of icon.png to be in the xxhdpi/
        directory.
        `
      ],
      table: {
        columns: [
          "Size",
          "Resolution",
        ],
      },
    },
  },

  form: {
    button: {
      text: "Upload"
    },
  },

  footer: {

  },

  modal: {
    buttons: {
      close: {
        text: "Close"
      }
    }
  },
}
