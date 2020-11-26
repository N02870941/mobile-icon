import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Strings from './Strings'

function Description() {
  return (
    <div>
      <h2>{Strings.guidelines.android.title}</h2>
      {
        Strings.guidelines.android.paragraphs.map((text, index) => {
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
          Strings.guidelines.android.table.columns.map((name, index) => {
            return <th key={index} scope="col">{name}</th>
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
              <td>{pair.dpi}</td>
              <td>{pair.width}x{pair.width}</td>
            </tr>
          )
        })
      }
    </tbody>
  )
}

function Table(props) {
  return (
    <table className="table table-sm">
      <TableHead />
      <TableBody scales={props.scales} />
    </table>
  )
}

export default function AndroidGuidelines(props) {
  return (
    <Row>
      <Col>
        <Description />
        <Table scales={props.scales} />
      </Col>
    </Row>
  )
}
