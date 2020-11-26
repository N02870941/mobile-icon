import Strings from './Strings'

// https://www.w3schools.com/bootstrap4/bootstrap_modal.asp
export default function Modal() {
  return (
    <div id="modal" className="modal fade">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h4 id="error-title" className="modal-title"></h4>
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>

          <div className="modal-body" >
            <p id='error-msg'></p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
            >
            {Strings.modal.buttons.close.text}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
