import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Strings from './Strings'

function Paragraphs() {
  return Strings.header.paragraphs.map((paragraph, index) => {
    return <p key={index}>{paragraph}</p>
  })
}

export default function Header() {
  return (
    <div>
      <Row>
        <Col>
          <h1>{Strings.header.title}</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <Paragraphs />
        </Col>
      </Row>
    </div>
  )
}
