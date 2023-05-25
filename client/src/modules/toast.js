import {toast } from 'react-toastify';


export const toastSuccess = (string, timeout=2000) => {
    toast.success(<div style={{textAlign: 'center'}}>{`🦄 ${string}!`}</div>, {
        position: "top-center",
        autoClose: timeout,
        pauseOnHover: true,
        });
}
export const toastError = (string, emoji=true, timeout=2000) => {
    toast.error(<div style={{textAlign: 'center'}}>{`😖 ${string}!`}</div>, {
        position: "top-center",
        autoClose: timeout,
        pauseOnHover: true,
        });
}