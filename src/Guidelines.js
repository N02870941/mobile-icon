import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import AppleGuidelines from './AppleGuidelines'
import AndroidGuidelines from './AndroidGuidelines'
import APIService from './APIService'
import Strings from './Strings'

function Instructions() {
  return (
    <Row>
      <Col>
        <h2>{Strings.guidelines.instructions.title}</h2>
        {
          Strings.guidelines.instructions.paragraphs.map((text, index) => {
            return <p key={index}>{text}</p>
          })
        }
      </Col>
    </Row>
  )
}

function Description() {
  return (
    <Row>
      <Col>
        {
          Strings.guidelines.description.paragraphs.map((text, index) => {
            return <p key={index}>{text}</p>
          })
        }

        <ul>
          {
            Strings.guidelines.description.constraints.map((item, index) => {
              return <li key={index}>{item}</li>
            })
          }
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
