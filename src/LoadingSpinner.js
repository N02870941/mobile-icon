import 'load-awesome/css/ball-clip-rotate.css'

export default function LoadingSpinner() {
  return (
    <div id="spinner" className='form-group initially-hidden'>
      <div className="la-ball-clip-rotate" style={{ color: "#79bbb5"}}>
        <div></div>
      </div>
    </div>
  )
}
