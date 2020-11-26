import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import AppleGuidelines from './AppleGuidelines'
import AndroidGuidelines from './AndroidGuidelines'
import APIService from './APIService'

function Instructions() {
  return (
    <Row>
      <Col>
        <h2>General guidelines</h2>

        <p>
           Attach your original image, hit the "Upload" button, and you will recieve a zipped folder of all the
           properly resized and named assets all ready to go.
        </p>

        <p>
          After you have downloaded your assets, unzip it, and copy the icons into your app directory and your app
          will be looking great on all screens in no time!
        </p>
      </Col>
    </Row>
  )
}

function Description() {
  return (
    <Row>
      <Col>
        <p>The image that you upload should follow the following guidelines:</p>

        <ul>
          <li>File size no greater than 2mb (for now)</li>
          <li>Image should be square (width is equal to height)</li>
        </ul>
      </Col>
    </Row>
  )
}

export default class Guidelines extends React.Component {
  constructor() {
    super()
    this.state = {
      scales: {
        ios: [],
        android: [],
      }
    }
  }

  componentDidMount() {
    APIService.loadScales()
    .then(scales => this.setState({ scales: scales }))
  }

  render() {
    return (
      <div>
        <Instructions />
        <Description />
        <AppleGuidelines scales={this.state.scales.ios} />
        <AndroidGuidelines scales={this.state.scales.android} />
      </div>
    )
  }
}
