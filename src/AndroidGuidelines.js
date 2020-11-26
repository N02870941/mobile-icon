export default function AndroidGuidelines() {
  return (
    <div className="row text">
      <div className="col">
        <h2>Android guidelines</h2>

        <p>
          Android works a little different from iOS. Android will be expecting all assets (independent of size)
          to have the exact same name. Different asset sizes will be seperated by <strong>folder</strong> where the
          name of the folder indicates the size of the asset. For example, if an asset is named icon.png, for devices
          that fall under the xxxhdpi category, we will expect the 192x192 version of icon.png to be in the xxhdpi/
          directory.
        </p>

        <table id='android-table' class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Resolution</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}
