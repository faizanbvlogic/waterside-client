import React from 'react';

function Loading() {
  return <div>
    <div className='loadingContainer'>
      <div className="lds-ellipsis">
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>;
}

export default Loading;