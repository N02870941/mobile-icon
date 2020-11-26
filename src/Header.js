import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function Header() {
  return (
    <div>
      <Row className="text">
        <Col>
          <h1>Mobile Icon Converter</h1>
        </Col>
      </Row>

      <Row className="text">
        <Col>
          <p>
            Are you a designer or a developer that is tired of manually resizing your assets not only
            for different screen sizes, but also for different platforms? Or are you simply new to app
            development and you want your first app to show off your shiny new icon without you having to
             buy photoshop or spend all day resizing your icon on the command line?
          </p>

          <p>
            Either case, you came to the right place! Mobile Icon Converter is a simple tool for
            automatically resizing images for use on iOS and Android devices.
          </p>
        </Col>
      </Row>
    </div>
  )
}
