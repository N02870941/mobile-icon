import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function AndroidGuidelines(props) {
  return (
    <Row className="text">
      <Col>
        <h2>Android guidelines</h2>

        <p>
          Android works a little different from iOS. Android will be expecting all assets (independent of size)
          to have the exact same name. Different asset sizes will be seperated by <strong>folder</strong> where the
          name of the folder indicates the size of the asset. For example, if an asset is named icon.png, for devices
          that fall under the xxxhdpi category, we will expect the 192x192 version of icon.png to be in the xxhdpi/
          directory.
        </p>

        <table id='android-table' className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Resolution</th>
            </tr>
          </thead>
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
        </table>
      </Col>
    </Row>
  )
}
