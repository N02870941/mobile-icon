// https://www.w3schools.com/bootstrap4/bootstrap_modal.asp
export default function Modal() {
  return (
    <div id="modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h4 id="error-title" class="modal-title"></h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <div class="modal-body" >
            <p id='error-msg'></p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  )
}
