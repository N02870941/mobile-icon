import React from 'react'
import GeneralGuidelines from './GeneralGuidelines'
import AppleGuidelines from './AppleGuidelines'
import AndroidGuidelines from './AndroidGuidelines'
import APIService from './APIService'

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
        <GeneralGuidelines />
        <AppleGuidelines scales={this.state.scales.ios} />
        <AndroidGuidelines scales={this.state.scales.android} />
      </div>
    )
  }
}
