import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {TextField,Typography} from '@mui/material'
import Slide from '@mui/material/Slide';
import { forwardRef, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function DepositModal({open, setOpen, setDepositAmount, setOpenPaymentProviderModal}) {
  const form = useRef(null)
  
  const handleSubmit = async (values, helpers) => {
    let formData = new URLSearchParams(new FormData(form.current)).toString()
    setDepositAmount(formData)
    setOpenPaymentProviderModal(true)
  }

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
      .required('Enter amount to deposit')
      .min(500, 'Amount must be greater than or equal to ₦500.00')
      .max(100000, 'Amount must be less than or equal to ₦100,000.00')
    }),
    onSubmit: handleSubmit
  });
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


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
    resetForm()
    clearErrors()
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
        <DialogTitle>{"MAKE A DEPOSIT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            How much would you like to deposit?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            name='amount'
            type="number"
            fullWidth
            variant="standard"
            error={!!(formik.touched.amount && formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            InputProps={{ inputProps: {step: 1000} }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button type='submit'>{'Pay now'}</Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
