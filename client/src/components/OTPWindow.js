import { useEffect, useState } from 'react';
import { MuiOtpInput } from "mui-one-time-password-input";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Typography, InputLabel} from '@mui/material'
import { useRouter } from 'next/router';
import axios from 'axios'
import Cookies from 'js-cookie';
import CustomButton from './Button';
import { toastSuccess, toastError } from 'src/modules/toast';


const OTPWindow = ({open, setOpen, email, name}) => {
    const [value, setValue] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [countdown, setCountdown] = useState(60);
    const [sending, setSending] = useState(true)
    const [verifying, setVerifying] = useState(false)
    const router = useRouter()
    const { pathname, query } = router

    // Resend Countdown Code
    useEffect(() => {
        if(sending === false && open === true){
            const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
        
            if (countdown === 0) clearInterval(timer);
        
            return () => clearInterval(timer);
        }
      }, [countdown, sending])

      const handleSendOTP = async () => {
        setErrorMessage('')
        setSending(true)
        try{
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/verify-email?email=${email}&name=${name}`, {
                headers: {
                    Authorization: 'Bearer ' + Cookies.get('authToken')
                }
            })
            data?.success === true && setCountdown(60)
            data?.error && (() => {
                setErrorMessage(data.error.message)
                setCountdown(0)
            })()
        }
        catch(err){
            setErrorMessage(data.error.message)
        }
        finally{
            setSending(false)
        }
      }

      const handleVerifyOTP = async (value) => {
        setVerifying(true)
        setErrorMessage('')
        const formData = new URLSearchParams({otp: value, email: email}).toString()
        try{
            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API}/verify-email`, formData, {
                headers: {
                    Authorization: 'Bearer ' + Cookies.get('authToken')
                }
            })
            data?.success === true && (() => {
                toastSuccess(data?.message, 5000)
                handleClose()
                router.replace({ pathname, query })
            })()
            data?.error && setErrorMessage(data.error.message)
        }
        catch(err){
            setErrorMessage(data.error.message)
        }
        finally{
            setVerifying(false)
            setValue(0)
        }
      }

    useEffect( () => {
        open === true && (async () => await handleSendOTP())()
    }, [open])


    const handleClose = () => {
        setOpen(false)
        setValue(0)
        setErrorMessage('')
    };

    return(
        <div className='otp-modal'>
        <Dialog
        open={open}
        // onClose={handleClose}
        fullWidth
        // fullScreen
        >
            <DialogTitle style={{textAlign: 'center'}}>
            {"ENTER OTP CODE"}
            </DialogTitle>
            <DialogContent>
                <span>An OTP code will be sent to {email}. Enter it below</span>
            </DialogContent>
            <DialogContent>
            <div>
            <MuiOtpInput
            onComplete={async (value) => await handleVerifyOTP(value)}
            length={6}
            value={value}
            onChange={(value) => setValue(value)}
            TextFieldsProps={{
            disabled: false,
            size: "small",
            placeholder: "-",
            type: 'number',
            }}
            />
            
            <InputLabel 
            htmlFor='acct-name' 
            variant='body2'
            >
                Didn&apos;t receive code?
                <CustomButton 
                disabled={countdown !== 0 || sending || verifying}
                innerText={(countdown!==0 && sending === false) ? `Wait for ${countdown}s` : 'Resend'}
                onClick={async () => {
                    await handleSendOTP()
                }}
                />
            </InputLabel>
            </div>

            {
                true && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {errorMessage}
                </Typography>
                )
                }
            </DialogContent>
            <DialogActions>
            <CustomButton 
            innerText={'Close'} 
            disabled={sending || verifying} 
            onClick={handleClose} 
            isLoading={sending || verifying} 
            loadingText={sending ? 'Sending OTP...' : 'Verifying OTP'} />
            </DialogActions>
      </Dialog>
    </div>
    )
}


export default OTPWindow