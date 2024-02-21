import React from 'react'

const RefundModal = (props) => {

    return (
        <div>
            {/* // Modal */}
            <div className={`refundModalContainer ${props.show ? 'show' : ''}`} onClick={props.onClose}>
                <div className="refundModalContent" onClick={(e) => e.stopPropagation()}>
                    {/* stopPropagation : - //if you click inside the content, it will stop at .modal-content and the onClick in .modal will never be called */}

                    <div className="modalHeader">
                        <h4 className='modalTitle'>{props.title}</h4>
                    </div>
                    {
                        props?.isAdditionalCharge && <div className='modal-input'>
                            <p>Amount</p>
                            <input type="text" value={props?.additionalAmount} onChange={props?.changeAdditonalChargeAmount} />
                        </div>
                    }
                    {
                        props?.isReason && <div className='modal-input'>
                            <p>Refund Reason</p>
                            <input type="text" value={props?.reasonValue} onChange={props.reason} required min={3} max={500} />
                        </div>
                    }
                    {
                        props?.BY && <div className='modal-input'>
                            <p>Your Name</p>
                            <input type="text" value={props?.BYValue} onChange={props.BY} required min={3} max={100} />
                        </div>
                    }
                    <div className="modalBody">
                        Are you sure?
                    </div>
                    {
                        props?.isError && <div>
                            <span className='error--msg'>Please fill all the required fields</span>
                        </div>
                    }
                    <div className="modalFooter">
                        <button className="btn btn-dark btn-sm" style={{ borderRadius: '5px' }} onClick={props.onSubmit} >Ok</button>
                        <button className="btn btn-danger cancle-spacing" style={{ borderRadius: '5px' }} onClick={props.onClose} >Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default RefundModal