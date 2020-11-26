import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function AppleGuidelines(props) {
  return (
    <Row className="text">
      <Col>
        <h2>iOS guidelines</h2>

        <p>
          Xcode will require that your assets have the following sizes. All of the icons will be in the
          same directory, and you can copy all of them directly into your Assets as is.
        </p>

        <table id='ios-table' className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Scale</th>
              <th scope="col">Resolution</th>
            </tr>
          </thead>
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
        </table>

        <p>If you would like more information on iOS icons, see the <a target="_blank" href="https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/">iOS Human Interface Guidelines.</a></p>
      </Col>
    </Row>
  )
}
