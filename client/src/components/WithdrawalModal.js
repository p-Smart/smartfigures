import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {TextField,Typography, MenuItem, InputLabel} from '@mui/material'
import Slide from '@mui/material/Slide';
import { forwardRef, useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useRouter } from 'next/router';
import { customSort } from 'src/modules/customSort';
import CustomButton from './Button';
import Cookies from 'js-cookie';
import { toastSuccess, toastError } from 'src/modules/toast';



const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function DepositModal({open, setOpen, setUpdateTransactions}) {
    const router = useRouter()
    const { pathname, query } = router

  const form = useRef(null)
  const [banks, setBanks] = useState([])
  const [confirmAccountLoading, setConfirmAccountLoading] = useState(false)
  const [showAccountName, setShowAccountName] = useState(false)
  const [accountName, setAcountName] = useState('')

  const [withdrawalLoading, setWithdrawalLoading] = useState(false)
  
  const handleSubmit = async (values, helpers) => {
    const action = form.current.querySelector(`button[type='submit']`).ariaLabel
    const confirmed = action === 'confirm' ? 0 : 1

    confirmed === 0 ? (() => {
        setConfirmAccountLoading(true)
        setShowAccountName(false)
    })() : setWithdrawalLoading(true)

    let formData = new URLSearchParams(values).toString() + `&confirmed=${confirmed}`
    try{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API}/user/withdrawal/initiate`, formData, {
            headers: {
              'Authorization' : 'Bearer ' + Cookies.get('authToken'),
            }
          })
        if(confirmed === 0){
            data?.status === true && (() => {
                setAcountName(data.data.account_name)
                setShowAccountName(true)
            })()
            data?.error && (() => {
                setShowAccountName(false)
                helpers.setErrors({ submit: data.error.message });
            })()
        }
        else if(confirmed === 1){
            if(data.success === true){
                setShowAccountName(false)
                toastSuccess(data.message, 5000)
                resetForm()
                handleClose()
                router.replace({ pathname, query })
                setUpdateTransactions((prevVal) => !prevVal)
            }
            else{
                helpers.setErrors({ submit: data.error.message })
            }
        }
    }
    catch(err){
        setShowAccountName(false)
        helpers.setErrors({ submit: err.message })
    }
    finally{
        setConfirmAccountLoading(false)
        setWithdrawalLoading(false)
        helpers.setSubmitting(false);
        helpers.setStatus({ success: false })
    }
  }

    //   Load Banks
  useEffect( () => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/fetchBanks`, {
        headers: {
          'Authorization' : 'Bearer ' + Cookies.get('authToken'),
        }
      })
    .then(({data}) => {
        if(!data.error){
            let banks = [{name: '', code: ''} ,...customSort(data)]
            setBanks(banks)
        }
        else{
            throw new Error('Error fetching banks')
        }
    })
    .catch((err) => {
      console.log(err.message)
    });
  },[])

  const formik = useFormik({
    initialValues: {
      amount: '',
      acct_num: '',
      bankname: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number()
      .required('Enter amount to deposit')
      .min(100, 'Amount must be greater than or equal to ₦100.00'),
    //   .max(50000, 'Amount must be less than or equal to ₦50,000.00'),
      acct_num: Yup.string()
      .required('Enter account number'),
      bankname: Yup.string()
      .required('Bank is required')
    }),
    onSubmit: handleSubmit
  });
  
  // Accepts whatever you don't want to be cleared as parameter (the input name)
  const resetForm = (...except) => {
    for (let value in formik.values) {
        if (formik.values.hasOwnProperty(value) && !except.includes(value)) {
          formik.values[value] = '';
        }
    }
  }
  const clearErrors = () => {
    for (let error in formik.errors) {
      if (formik.errors.hasOwnProperty(error)) {
        formik.errors[error] = '';
      }
    }
  }

  const handleAcctNumChange = (e) => {
    setShowAccountName(false);
    formik.handleChange(e);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    !withdrawalLoading && !confirmAccountLoading && (() => {
      setOpen(false);
      resetForm()
      clearErrors()
    })()
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form ref={form} noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>{"WITHDRAW TO A BANK"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            How much would you like to withdraw?
          </DialogContentText>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            name='amount'
            type="number"
            fullWidth
            error={!!(formik.touched.amount && formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            InputProps={{ inputProps: {step: 1000} }}
            disabled={confirmAccountLoading || withdrawalLoading}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Account Number"
            name='acct_num'
            type="number"
            fullWidth
            error={!!(formik.touched.acct_num && formik.errors.acct_num)}
            helperText={formik.touched.acct_num && formik.errors.acct_num}
            onBlur={formik.handleBlur}
            onChange={handleAcctNumChange}
            value={formik.values.acct_num}
            disabled={confirmAccountLoading || withdrawalLoading}
          />
          { showAccountName &&
          <>
            <TextField
                style={{pointerEvents: 'none'}}
                id='acct-name'
                margin="dense"
                label="Account Name"
                type="text"
                fullWidth
                value={accountName}
                readOnly
                disabled={confirmAccountLoading || withdrawalLoading}
            />
            <InputLabel htmlFor='acct-name' variant='body2'>
                Not your account? 
                <CustomButton innerText={'Change'} onClick={() => {
                    setShowAccountName(false)
                    resetForm('amount')
                    }}/>
            </InputLabel>
          </>
          }
          <TextField
            error={!!(formik.touched.bankname && formik.errors.bankname)}
            fullWidth
            helperText={formik.touched.bankname && formik.errors.bankname}
            label="Bank Name"
            name="bankname"
            onBlur={formik.handleBlur}
            value={formik.values.bankname}
            onChange={formik.handleChange}
            select
            disabled={confirmAccountLoading || withdrawalLoading}
            SelectProps={{
            native: true,
          }}
        >
            {banks.map((bank, k) => (
            <option
                key={k}
                value={bank?.code}
            >
                {bank?.name}
            </option>
            ))}
        </TextField>

        {formik.errors.submit && (
            <Typography
                color="error"
                sx={{ mt: 3 }}
                variant="body2"
            >
                {formik.errors.submit}
            </Typography>
        )}
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={confirmAccountLoading || withdrawalLoading}>Close</Button>
          <CustomButton
          ariaLabel={!showAccountName ? 'confirm' : 'withdraw'}
          type='submit'
          innerText={!showAccountName ? 'Confirm Account' : 'Place withdrawal'}
          isLoading={confirmAccountLoading || withdrawalLoading}
          loadingText={confirmAccountLoading ? 'Checking...' : 'Please wait...'}
          />
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
