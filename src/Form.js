export default function Form() {
  return (
    <div class='row text'>
      <div class="col-sm">

        <form id="form">
          <div class="form-group">
            <label class="form-element">
              <input
                id="file"
                type="file"
                name="image"
                accept="image/*"
                multiple
                class="btn btn-outline-info"
              ></input>
            </label>
          </div>

          <div id="spinner" class='form-group initially-hidden'>
            <div class="la-ball-clip-rotate">
              <div></div>
            </div>
          </div>

          <div class="form-group">
            <button id="submit-button" type="submit" class="btn btn-primary" disabled>Upload</button>
          </div>
        </form>
      </div>
    </div>
  )
}
