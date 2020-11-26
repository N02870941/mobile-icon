import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Strings from './Strings'

function Description() {
  return (
    <div>
      <h2>{Strings.guidelines.apple.title}</h2>
      {
        Strings.guidelines.apple.paragraphs.map((text, index) => {
          return <p key={index}>{text}</p>
        })
      }
    </div>
  )
}

function TableHead() {
  return (
    <thead>
      <tr>
        {
          Strings.guidelines.apple.table.columns.map((name, index) => {
            return <th scope="col" key={index}>{name}</th>
          })
        }
      </tr>
    </thead>
  )
}

function TableBody(props) {
  return (
    <tbody>
      {
        props.scales.map((pair, index) => {
          return (
            <tr key={index}>
              <td>{pair.width}x{pair.width}</td>
              <td>{pair.scale}</td>
              <td>{pair.resolution.width}x{pair.resolution.height}</td>
            </tr>
          )
        })
      }
    </tbody>
  )
}

function Table(props) {
  return (
    <table id='ios-table' className="table table-sm">
      <TableHead />
      <TableBody scales={props.scales} />
    </table>
  )
}

export default function AppleGuidelines(props) {
  return (
    <Row>
      <Col>
        <Description />
        <Table scales={props.scales} />

        <p>If you would like more information on iOS icons, see the <a target="_blank" href="https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/">iOS Human Interface Guidelines.</a></p>
      </Col>
    </Row>
  )
}
