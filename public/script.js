$(document).ready(() => {
  const BASE_API_URL = "http://localhost:5001/mobile-icon/us-central1/api/v1"
  const UPLOAD_API_URL = `${BASE_API_URL}/upload`
  const SCALES_API_URL = `${BASE_API_URL}/scales`

  function buildiOSTable(data) {
    $('#ios-table').append(
      data.map(pair => {
        const pixels = pair.width * pair.scale

        return `
          <tr>
            <td>${pair.width}x${pair.width}</td>
            <td>${pair.scale}</td>
            <td>${pixels}x${pixels}</td>
          </tr>
        `
      })
    )
  }

  function buildAndroidTable(data) {
    $('#android-table').append(
      data.map(pair => {
        return `
          <tr>
            <td>${pair.dpi}</td>
            <td>${pair.width}x${pair.width}</td>
          </tr>
        `
      })
    )
  }

  function showTables(json) {
    buildiOSTable(json.ios)
    buildAndroidTable(json.android)

    document.getElementById('scales-info').style.display = 'block'
  }

  function showModal() {
    $("#modal").modal()
  }

  function showSpinner() {
    document.getElementById('spinner').style.display = 'block'
  }

  function hideSpinner() {
    document.getElementById('spinner').style.display = 'none'
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

  function onSuccess(blob) {
    const url     = window.URL || window.webkitURL
    const link    = document.createElement('a')
    link.href     = url.createObjectURL(blob)
    link.download = 'icon.zip'

    document.body.appendChild(link)
    link.click()
  }

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

  function onComplete() {
    const form = $("#form")

    form.trigger('reset')
    form.trigger('change')
    hideSpinner()
  }

  function configureForm() {
    // Listener for enabling or disabling upload button
    $('#form').on('keyup change paste', () => {
      const file   = document.getElementById('file')
      const submit = document.getElementById('submit-button')

      submit.disabled = file.files.length < 1
    })

    // https://stackoverflow.com/questions/34586671/download-pdf-file-using-jquery-ajax
    // https://stackoverflow.com/questions/10899384/uploading-both-data-and-files-in-one-form-using-ajax
    // https://stackoverflow.com/questions/10529476/javascript-window-url-is-undefined-in-function
    // https://stackoverflow.com/questions/17657184/using-jquerys-ajax-method-to-retrieve-images-as-a-blob

    $('#form').submit(function(event) {
      event.preventDefault()
      showSpinner()

      const data = new FormData(this)

      $.ajax({
        type: 'POST',
        url: UPLOAD_API_URL,
        enctype: "multipart/form-data",
        data: data,
        xhrFields: { responseType: 'blob' },
        xhr: onXHR,
        success: onSuccess,
        error: onError,
        complete: onComplete,
        cached: false,
        contentType: false,
        processData: false
      })
    })
  }

  function loadScales() {
    fetch(SCALES_API_URL)
    .then(response => response.json())
    .then(showTables)
  }

  loadScales()
  configureForm()
})
