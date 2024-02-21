
  
import React from 'react'

const Modal = (props) =>{

  return (
    <div>
         {/* // Modal */}
         <div className={`modalContainer ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className="modalContent" onClick={(e)=> e.stopPropagation()}> 
            {/* stopPropagation : - //if you click inside the content, it will stop at .modal-content and the onClick in .modal will never be called */}

                <div className="modalHeader mx-3">
                    <h4 className='modalTitle'>{props.title}</h4>
                </div>
                <div className="modalBody mx-3">
                    Are you sure?
                </div>
                <div className="modalFooter">
                    <button className="btn btn-danger mx-2" style={{ borderRadius: '5px' }} onClick={props.onClose} >Cancel</button>
                    <button className="btn btn-light btn-sm mx-2" style={{ borderRadius: '5px' }} onClick={props.onSubmit} >Ok</button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Modal