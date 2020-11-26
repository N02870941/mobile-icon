import LoadingSpinner from './LoadingSpinner'

export default function Form() {
  return (
    <div className='row text'>
      <div className="col-sm">

        <form id="form">
          <div className="form-group">
            <label className="form-element">
              <input
                id="file"
                type="file"
                name="image"
                accept="image/*"
                multiple
                className="btn btn-outline-info"
              ></input>
            </label>
          </div>

          <LoadingSpinner />

          <div className="form-group">
            <button id="submit-button" type="submit" className="btn btn-primary" disabled>Upload</button>
          </div>
        </form>
      </div>
    </div>
  )
}
