$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "/sentry",
    success: function(dsnData) {
      Sentry.init(dsnData);
    },

    error: function() {
      // REPORT ERROR???
    }
  })

  // Draw tables that show icon resolutions
  $.getJSON('scale.json', {
    format: "json"
  })
  .done(showTables)

  // Listener for enabling or disabling upload button
  $('#form').on('keyup change paste', function() {
    const file   = document.getElementById('file')
    const submit = document.getElementById('submit-button')

    submit.disabled = file.files.length != 1
  })

  // https://stackoverflow.com/questions/34586671/download-pdf-file-using-jquery-ajax
  // https://stackoverflow.com/questions/10899384/uploading-both-data-and-files-in-one-form-using-ajax
  // https://stackoverflow.com/questions/10529476/javascript-window-url-is-undefined-in-function
  // https://stackoverflow.com/questions/17657184/using-jquerys-ajax-method-to-retrieve-images-as-a-blob

  // Prevent default submit and manually submit the form
  // with overridden XHR function.
  $('#form').submit(function(event) {
    event.preventDefault()
    showSpinner()

    const data = new FormData(this)

    $.ajax({
      type: 'POST',
      url: '/upload',
      enctype: "multipart/form-data",
      data: data,
      xhrFields: {
        responseType: 'blob'
      },
      xhr: onXHR,
      success: onSuccess,
      error: onError,
      complete: onComplete,
      cached: false,
      contentType: false,
      processData: false
    })
  })

  // Build table of iOS resolutions
  function buildiOSTable(data) {
    let iosHTML = ''

    data.forEach(pair => {
      const width = pair.width
      const scale = pair.scale
      const pixels = width * scale

      iosHTML += `
        <tr>
          <td>${width}x${width}</td>
          <td>${scale}</td>
          <td>${pixels}x${pixels}</td>
        </tr>
      `
    })

    $('#ios-table').append(iosHTML)
  }

  // Build table of Android resolutions
  function buildAndroidTable(data) {
    let andHTML = ''

    data.forEach(pair => {
      andHTML += `
        <tr>
          <td>${pair.dpi}</td>
          <td>${pair.width}x${pair.width}</td>
        </tr>
      `
    })

    $('#android-table').append(andHTML)
  }

  function showTables(json) {
    buildiOSTable(json.ios)
    buildAndroidTable(json.android)

    document.getElementById('scales-info-div')
            .style
            .display = 'block'
  }

  function showModal() {
    $("#modal").modal()
  }

  function showSpinner() {
    const spinner = document.getElementById('spinner')
    spinner.style.display = 'block'
  }

  function hideSpinner() {
    const spinner = document.getElementById('spinner')
    spinner.style.display = 'none'
  }

  // Manual XHR override that intercepts response and choses to interpret response as
  // a blob (file) if it succeeds or as text if it fails
  function onXHR() {
    let xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 2) {
            if(xhr.status == 200) {
                xhr.responseType = "blob";
            } else {
                xhr.responseType = "text";
            }
        }
    }

    return xhr
  }

  // Callback after form submission succeeds
  function onSuccess(blob) {
    const url     = window.URL || window.webkitURL
    const link    = document.createElement('a')
    link.href     = url.createObjectURL(blob)
    link.download = 'icon.zip'

    document.body.appendChild(link)
    link.click()
  }

  // Callback after form submission fails
  function onError(xhr, status, error) {
    const title   = document.getElementById('error-title')
    const message = document.getElementById('error-msg')
    const url     = document.getElementById('error-url')
    const res     = JSON.parse(xhr.responseText)

    title.innerHTML   = res.title
    message.innerHTML = res.message

    if (res.url) {
      url.href = res.url
      url.setAttribute('target', '_blank')
      url.style.display = 'inline'
    }

    showModal()
  }

  // Callback after form submission is complete. Executes whether submit succeeds or fails.
  function onComplete() {
    const form = $("#form")

    form.trigger('reset')
    form.trigger('change')
    hideSpinner()
  }
})
