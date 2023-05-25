import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Alert, Box, Button, Link, Stack, Grid, TextField, Typography } from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import axios from 'axios'
import { useRef, useState } from 'react';
import PasswordField from 'src/components/PasswordField';
import CustomButton from 'src/components/Button';

const Page = () => {
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const router = useRouter();
  const form = useRef(null);

  const handleSubmit = (values, helpers) => {
    setRegLoading(true)
      let formData = new URLSearchParams( new FormData(form.current) ).toString()
      // console.log(Array.from(formData.entries()))
      axios.post(`${process.env.NEXT_PUBLIC_API}/register`, formData)
      .then( ({data}) => {
        if(!data.error && data.success && !data.emailExist && !data.telExist){
          setRegSuccess(true)
          setTimeout( () => {
            router.push('/auth/login')
          }, 1000 )
          setRegLoading(false)
        }
        else{
          try{
            if(data.error){
              throw new Error(data.error.message)
            }
          }
          catch (err) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
            setRegLoading(false)
          }
        }
      } )
      .catch( (err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
          setRegLoading(false)
      } )
  }
  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      mname: '',
      tel: '',
      email: '',
      pass: '',
      ref_code: '',
      submit: null
    },
    validationSchema: Yup.object({
      fname: Yup.string().required('First name is required'),
      lname: Yup.string().required('Last name is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      tel: Yup.string().matches(/^\d{11}$/,"Phone number is not valid"),
      pass: Yup.string().min(8).required('Choose a password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_])(?=.{8,})/,'Password must contain at least one uppercase letter, one lowercase letter, one number and a special character'),
    }),
    onSubmit: handleSubmit
  });

  return (
    <>
      <Head>
        <title>
          Register | Smart Figures
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              ref={form}
              noValidate
              onSubmit={formik.handleSubmit}
            >
            {
              regSuccess && (
                <Alert
                  color="success"
                  severity="info"
                  sx={{ mt: 3 }}
                  style={{marginBottom:'10px'}}
                  >
                    <div>
                      <b>Registration Successful</b>
                    </div>
                </Alert>
              )
            }
                  
              <Grid container spacing={3} >
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    error={!!(formik.touched.fname && formik.errors.fname)}
                    // sx={{width: {sm: '50%'}}}
                    helperText={formik.touched.fname && formik.errors.fname}
                    label="First Name"
                    name="fname"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.fname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    error={!!(formik.touched.lname && formik.errors.lname)}
                    helperText={formik.touched.lname && formik.errors.lname}
                    label="Last Name"
                    name="lname"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Middle Name (Optional)"
                    name="mname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                  fullWidth
                    error={!!(formik.touched.tel && formik.errors.tel)}
                    helperText={formik.touched.tel && formik.errors.tel}
                    label="Phone Number (Optional)"
                    name="tel"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.tel}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordField
                    error={!!(formik.touched.pass && formik.errors.pass)}
                    fullWidth
                    helperText={formik.touched.pass && formik.errors.pass}
                    label="Password"
                    name="pass"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.pass}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!(formik.touched.ref_code && formik.errors.ref_code)}
                    fullWidth
                    helperText={formik.touched.ref_code && formik.errors.ref_code}
                    label="Referral Code (Optional)"
                    name="ref_code"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.ref_code}
                  />
                </Grid>
              </Grid>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <CustomButton
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                innerText={'Sign up'}
                isLoading={regLoading}
              />
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;