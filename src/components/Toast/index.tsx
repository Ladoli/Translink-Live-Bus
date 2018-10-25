import * as React from 'react';
import './toast.css';

interface ToastProps {
  error?: boolean
  message: string
}


class Toast extends React.Component<ToastProps>{
  public render(){
    const {error, message } = this.props;
    let toastClasses = "toastMessages";
    if(error){
      toastClasses += " errorToastMessages";
    }
    return (
        <div className={toastClasses}>
          <div className="flexCenterAll" style={{width:"100%", height: "100%"}}>
            <b>{message}</b>
          </div>
        </div>
    )
  }
}

export default Toast;
