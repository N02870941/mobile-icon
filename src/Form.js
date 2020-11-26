import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import APIService from './APIService'
import LoadingSpinner from './LoadingSpinner'
import $ from 'jquery';

export default class Form extends React.Component {
  componentDidMount() {
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

        APIService.upload(data)
        .then(downloadZip)
        .catch(showErrorModal)
        .finally(resetForm)
      })
    }

    configureForm()
  }

  render() {
    return (
      <Row>
        <Col>

          <form id="form">
            <div className="form-group">
              <label className="form-element">
                <input
                  id="file"
                  type="file"
                  name="image"
                  accept="image/*"
                  multiple
                  className="btn btn-outline-info"
                ></input>
              </label>
            </div>

            <LoadingSpinner />

            <div className="form-group">
              <button id="submit-button" type="submit" className="btn btn-primary" disabled>Upload</button>
            </div>
          </form>
        </Col>
      </Row>
    )
  }
}
