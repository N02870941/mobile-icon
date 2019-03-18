$(document).ready(function() {

  $.getJSON('scale.json', {
    format: "json"
  })
  .done(json => {
    let iosHTML = ''
    let andHTML = ''

    json.ios.forEach(pair => {
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

    json.android.forEach(pair => {
      andHTML += `
        <tr>
          <td>${pair.dpi}</td>
          <td>${pair.width}x${pair.width}</td>
        </tr>
      `
    })

    $('#ios-table').append(iosHTML)
    $('#android-table').append(andHTML)

    document
    .getElementById('scales-info-div')
    .style
    .display = 'block'
  })

  $('#form').on('keyup change paste', function() {
    const file   = document.getElementById('file')
    const submit = document.getElementById('submit-button')

    submit.disabled = file.files.length != 1
  })

  // https://stackoverflow.com/questions/34586671/download-pdf-file-using-jquery-ajax
  // https://stackoverflow.com/questions/10899384/uploading-both-data-and-files-in-one-form-using-ajax
  // https://stackoverflow.com/questions/10529476/javascript-window-url-is-undefined-in-function
  // https://stackoverflow.com/questions/17657184/using-jquerys-ajax-method-to-retrieve-images-as-a-blob
  $('#form').submit(function(event) {
    event.preventDefault()
    showSpinner()

    const form = $(this)
    const data = new FormData(this)

    $.ajax({
      type: 'POST',
      url: '/upload',
      enctype: "multipart/form-data",
      data: data,
      xhrFields: {
        responseType: 'blob'
      },
      xhr: function() {
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
      },
      success: function(blob) {
        const url     = window.URL || window.webkitURL
        const link    = document.createElement('a')
        link.href     = url.createObjectURL(blob)
        link.download = 'icon.zip'

        document.body.appendChild(link)
        link.click()
      },
      error: function(xhr, status, error) {
        const message = document.getElementById('error-msg')
        const url     = document.getElementById('error-url')
        const res     = JSON.parse(xhr.responseText)

        message.innerHTML = res.message

        if (res.url) {
          url.href = res.url
          url.setAttribute('target', '_blank')
          url.style.display = 'inline'
        }

        $("#modal").modal()
      },
      complete: function() {
        form.trigger('reset')
        form.trigger('change')
        hideSpinner()
      },
      cached: false,
      contentType: false,
      processData: false
    })
  })

  function showSpinner() {
    const spinner = document.getElementById('spinner')
    spinner.style.display = 'block'
  }

  function hideSpinner() {
    const spinner = document.getElementById('spinner')
    spinner.style.display = 'none'
  }

})
