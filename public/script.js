$(document).ready(() => {
  const BASE_API_URL = "http://localhost:5001/mobile-icon/us-central1/api/v1"
  const UPLOAD_API_URL = `${BASE_API_URL}/upload`
  const SCALES_API_URL = `${BASE_API_URL}/scales`

  const spinnerElement = document.getElementById('spinner')

  function showTables(scales) {
    $('#ios-table').append(
      scales.ios.map(pair => {
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

    $('#android-table').append(
      scales.android.map(pair => {
        return `
          <tr>
            <td>${pair.dpi}</td>
            <td>${pair.width}x${pair.width}</td>
          </tr>
        `
      })
    )

    document.getElementById('scales-info').style.display = 'block'
  }

  function parseResponse(response) {
    if (!response.ok) { throw response }
    return response.blob()
  }

  function downloadZip(blob) {
    // https://stackoverflow.com/questions/10529476/javascript-window-url-is-undefined-in-function
    const url     = window.URL || window.webkitURL
    const link    = document.createElement('a')
    link.href     = url.createObjectURL(blob)
    link.download = 'icons.zip'

    document.body.appendChild(link)
    link.click()
  }

  function showErrorModal(response) {
    response.json().then(json => {
      const title   = document.getElementById('error-title')
      const message = document.getElementById('error-msg')

      title.innerHTML   = json.title
      message.innerHTML = json.message

      $("#modal").modal()
    })
  }

  function resetForm() {
    const form = $("#form")

    form.trigger('reset')
    form.trigger('change')
    spinnerElement.style.display = 'none'
  }

  function configureForm() {
    $('#form').on('keyup change paste', () => {
      const file   = document.getElementById('file')
      const submit = document.getElementById('submit-button')

      submit.disabled = file.files.length < 1
    })

    $('#form').submit(function(event) {
      event.preventDefault()
      spinnerElement.style.display = 'block'

      const data = new FormData(this)

      fetch(UPLOAD_API_URL, { body: data, method: "post" })
      .then(parseResponse)
      .then(downloadZip)
      .catch(showErrorModal)
      .finally(resetForm)
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
