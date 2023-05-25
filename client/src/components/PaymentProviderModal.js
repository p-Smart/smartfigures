import { useState } from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert} from '@mui/material'
import { useRouter } from 'next/router';
import axios from 'axios'
import Cookies from 'js-cookie';
import CustomButton from './Button';
import Image from 'next/image';

export default function PaymentProviderModal({open, setOpen, amount}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Error 500')

  const handleFlutterPayment = async () => {
    setError(false)
    setLoading(true)
    try{
      const {data} = (await axios.post(`${process.env.NEXT_PUBLIC_API}/user/deposit/flutter`, amount, {
        headers: {
          'Authorization' : 'Bearer ' + Cookies.get('authToken')
        }
      }))
      setRedirecting(true)
      router.push(data.data.link)
    }
    catch(err){
      setErrorMessage(err.message)
      setError(true)
      setLoading(false)
    }  
  }

  const handlePaystackPayment = async() => {
    setError(false)
    setLoading(true)
    try{
      const {data} = (await axios.post(`${process.env.NEXT_PUBLIC_API}/user/deposit/paystack`, amount, {
        headers: {
          'Authorization' : 'Bearer ' + Cookies.get('authToken')
        }
      }))
      setRedirecting(true)
      router.push(data.data.authorization_url)
    }
    catch(err){
      setErrorMessage(err.message)
      setError(true)
      setLoading(false)
    }

  }

  

  
  
  
  
  
  
  
  const handleClose = () => {
    !loading && !redirecting && (() => {
      setOpen(false)
      setError(false)
    })()
  };

  return (
    <div>
      <Dialog
        open={open}
        // onClose={handleClose}
        fullWidth={window.innerWidth<=490}
      >
        <DialogTitle>
          {"Choose a payment provider"}
        </DialogTitle>
        <DialogContent>
            {
              error && (
                <Alert
                  color="error"
                  severity="info"
                  >
                    <b>{errorMessage}</b>
                </Alert>
              )
            }
        <div style={{width: 'maxContent', display: 'flex', gap: 50, ...(window.innerWidth<=490 && {flexDirection: 'column'})}}>
        <Button>
        <div onClick={handleFlutterPayment}>
          <Image width={120} height={50} src='assets/logos/flutterwave.svg' />
        </div>
        </Button>
        <Button>
        <div onClick={handlePaystackPayment}>
          <Image width={120} height={50} src='assets/logos/paystack.svg' />
        </div>
        </Button>
        </div>
        </DialogContent>
        <DialogActions>
          <CustomButton innerText={'Close'} disabled={loading} onClick={handleClose} isLoading={loading} loadingText={redirecting ? 'Redirecting...' : ''}/>
        </DialogActions>
      </Dialog>
    </div>
  );
}