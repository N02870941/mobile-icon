$(document).ready(() => {
  const API_PROTOCOL = "http"
  const API_HOST = "localhost"
  const API_PORT = "5001"
  const API_BASE_PATH = "mobile-icon/us-central1/api/v1"
  const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_BASE_PATH}`
  const UPLOAD_API_URL = `${API_BASE_URL}/upload`

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

      title.innerHTML   = json.title || "Oops"
      message.innerHTML = json.message || "An error occured"

      $("#modal").modal()
    })
  }

  function resetForm() {
    const form = $("#form")

    form.trigger('reset')
    form.trigger('change')
    document.getElementById('spinner').style.display = 'none'
  }

  function configureForm() {
    $('#form').on('keyup change paste', () => {
      const file   = document.getElementById('file')
      const submit = document.getElementById('submit-button')

      submit.disabled = file.files.length < 1
    })

    $('#form').submit(function(event) {
      event.preventDefault()
      document.getElementById('spinner').style.display = 'block'

      const data = new FormData(this)

      fetch(UPLOAD_API_URL, { body: data, method: "post" })
      .then(parseResponse)
      .then(downloadZip)
      .catch(showErrorModal)
      .finally(resetForm)
    })
  }

  configureForm()
})
