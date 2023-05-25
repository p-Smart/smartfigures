import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import PasswordField from 'src/components/PasswordField';
import axios from 'axios'
import Cookies from 'js-cookie'
import CustomButton from 'src/components/Button';



const Page = () => {
  
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [method, setMethod] = useState('email');
  const form = useRef(null)

  const handleSubmit = (values, helpers) => {
    setLoginLoading(true)
      let formData = new URLSearchParams(new FormData(form.current)).toString()
      axios.post(`${process.env.NEXT_PUBLIC_API}/login`, formData)
      .then( ({data}) => {
        if(!data.error && data.success){
          setLoginSuccess(true)
          setLoginLoading(false)
          Cookies.set('authToken', data.authToken, {path:'/', sameSite: 'none', secure: true })
          router.push('/dashboard')
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
          setLoginLoading(false)
        }
        }
      } )
      .catch( (err) => {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        setLoginLoading(false)
      } )
  }

  const formikForEmail = useFormik({
    initialValues: {
      email: '',
      pass: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      pass: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: handleSubmit
  });
  const formikForTel = useFormik({
    initialValues: {
      tel: '',
      pass: '',
      submit: null
    },
    validationSchema: Yup.object({
      tel: Yup.string().required('Phone number is required').matches(/^\d{11}$/,"Phone number is not valid"),
      pass: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: handleSubmit
  });


  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  const submitButton = useRef(null)
  const handleSkip = () => {
    // Set the formikForEmail values to the hardcoded email and password
    formikForEmail.setFieldValue('email', 'princeayokunle2002@gmail.com');
    formikForEmail.setFieldValue('pass', 'Admin1234@')

    // Submit the form programmatically;
    setTimeout( () => {
      submitButton.current.click()
    }, 100 )
  }

  return (
    <AuthLayout>
      <Head>
        <title>
          Login | Smart Figures
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Email"
                value="email"
              />
              <Tab
                label="Phone Number"
                value="phoneNumber"
              />
            </Tabs>
            {method === 'email' && (
              <form
                ref={form}
                noValidate
                onSubmit={formikForEmail.handleSubmit}
              >
              {
              loginSuccess && (
                <Alert
                  color="success"
                  severity="info"
                  sx={{ mt: 3 }}
                  style={{marginBottom:'10px'}}
                  >
                    <div>
                      <b>Login Successful</b>
                    </div>
                </Alert>
              )
            }
                <Stack spacing={3}>
                  <TextField
                    error={!!(formikForEmail.touched.email && formikForEmail.errors.email)}
                    fullWidth
                    helperText={formikForEmail.touched.email && formikForEmail.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formikForEmail.handleBlur}
                    onChange={formikForEmail.handleChange}
                    type="email"
                    value={formikForEmail.values.email}
                  />
                  <PasswordField
                    error={!!(formikForEmail.touched.pass && formikForEmail.errors.pass)}
                    fullWidth
                    helperText={formikForEmail.touched.pass && formikForEmail.errors.pass}
                    label="Password"
                    name="pass"
                    onBlur={formikForEmail.handleBlur}
                    onChange={formikForEmail.handleChange}
                    type="password"
                    value={formikForEmail.values.pass}
                  />
                </Stack>
                <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText>
                {formikForEmail.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formikForEmail.errors.submit}
                  </Typography>
                )}
                <CustomButton
                  buttonRef={submitButton}
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  innerText={'Sign in'}
                  isLoading={loginLoading}
                />
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  Skip authentication
                </Button>
              </form>
            )}
            {method === 'phoneNumber' && (
              <form
                ref={form}
                noValidate
                onSubmit={formikForTel.handleSubmit}
              >
              {
              loginSuccess && (
                <Alert
                  color="success"
                  severity="info"
                  sx={{ mt: 3 }}
                  style={{marginBottom:'10px'}}
                  >
                    <div>
                      <b>Login Successful</b>
                    </div>
                </Alert>
              )
            }
                <Stack spacing={3}>
                  <TextField
                    error={!!(formikForTel.touched.tel && formikForTel.errors.tel)}
                    fullWidth
                    helperText={formikForTel.touched.tel && formikForTel.errors.tel}
                    label="Phone Number"
                    name="tel"
                    onBlur={formikForTel.handleBlur}
                    onChange={formikForTel.handleChange}
                    type="tel"
                    value={formikForTel.values.tel}
                  />
                  <TextField
                    error={!!(formikForTel.touched.pass && formikForTel.errors.pass)}
                    fullWidth
                    helperText={formikForTel.touched.pass && formikForTel.errors.pass}
                    label="Password"
                    name="pass"
                    onBlur={formikForTel.handleBlur}
                    onChange={formikForTel.handleChange}
                    type="password"
                    value={formikForTel.values.pass}
                  />
                </Stack>
                <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText>
                {formikForTel.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formikForTel.errors.submit}
                  </Typography>
                )}
                <CustomButton
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  innerText={'Continue'}
                  isLoading={loginLoading}
                />
              </form>
            )}
          </div>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Page;