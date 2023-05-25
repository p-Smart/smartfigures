import {useContext, useEffect, useRef, useState } from 'react'
import UserContext from 'src/contexts/userContext'
import { Box,Typography, Alert, Card, CardActions, CardContent, CardHeader, Divider, TextField, MenuItem, InputAdornment, SvgIcon, IconButton,Unstable_Grid2 as Grid} from '@mui/material'
import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon';
import axios from 'axios'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomButton from 'src/components/Button';
import { customSort } from 'src/modules/customSort';
import OTPWindow from 'src/components/OTPWindow';





export const AccountProfileDetails = () => {
  const {data} = useContext(UserContext)
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [stateLoading, setStateLoading] = useState(false)
  const [stateAvaliable, setStateAvaliable] = useState(true)
  const form = useRef(null)
  const [loading, setLoading] = useState(false)
  const [updateSuccessful, setUpdateSuccessful] = useState(false)
  const [openOTPWindow, setOpenOTPWindow] = useState(false)

  const handleVerifyEmail = () => {
    setOpenOTPWindow(true)
  }

  const handleVerifyTel = () => {
  
  }

  useEffect( () => {
    axios.get('https://api.countrystatecity.in/v1/countries', {
      headers: {
        'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_WORLD_API_KEY
      }
    })
    .then((response) => {
      let countries = customSort(response.data)
      setCountries(countries)
    })
    .catch((err) => {
      console.log(err.message);
    });
    // If user's country has been set, load the states too from api
    data?.user_country && handleCountryChange(data?.user_country)
  },[])

  const handleCountryChange = async (e) => {
    setStateLoading(true)
    const countryVal = e?.target?.value || e
    try{
        const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryVal}/states`, {
          headers: {
            'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_WORLD_API_KEY
          }
        })
        var fetchedStates = customSort(res.data)
        setStates(fetchedStates)
    }
    catch(err){
      console.log(err.message)
    }
    finally{
      setStateLoading(false)
      setStateAvaliable(fetchedStates.length === 0 ? false : true)
    }
  }

  const handleSubmit = async (values, helpers) => {
    setLoading(true)
    const formData = new URLSearchParams(new FormData(form.current)).toString()
    try{
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/user/profile/update`, formData,{
        headers: {
          'Authorization' : 'Bearer ' + data.authToken,
        }
      })
      if(response.data?.success){
        setUpdateSuccessful(true)
        form.current.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(()=>{
          setUpdateSuccessful(false)
        }, 3000)
      }
      else{
        helpers.setErrors({ submit: response.data.error.message});
      }
    }
    catch(err){
      helpers.setErrors({ submit: err.message });
    }
    finally{
      helpers.setStatus({ success: false });
      helpers.setSubmitting(false);
      setLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      fname: data?.user_fname,
      lname: data?.user_lname,
      email: data?.user_email,
      tel: data?.user_tel,
      country: data?.user_country,
      state: data?.user_state
    },
    validationSchema: Yup.object({
      fname: Yup.string().required('First name cannot be empty'),
      lname: Yup.string().required('Last name cannot be empty'),
      email: Yup.string().email('Must be a valid email').required('Email is required'),
    }),
    onSubmit: handleSubmit
  });

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={formik.handleSubmit}
      ref={form}
    >
    <OTPWindow 
    email={formik.values.email} 
    name={formik.values.fname} 
    open={openOTPWindow}
    setOpen={setOpenOTPWindow}
    formikError={formik.errors.email}
    />
      <Card>
        <CardHeader
          subheader="You can edit your profile information"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
            {
              updateSuccessful && (
              <Grid xs={12}>
                <Alert
                    color="success"
                    severity="info"
                    sx={{ mt: 3 }}
                    style={{marginBottom:'10px'}}
                    >
                      <div>
                        <b>Profile updated successfully</b>
                      </div>
                </Alert>
              </Grid>
              )
            }
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.fname && formik.errors.fname)}
                  fullWidth
                  helperText={formik.touched.fname && formik.errors.fname}
                  label="First Name"
                  name="fname"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.lname && formik.errors.lname)}
                  fullWidth
                  helperText={formik.touched.lname && formik.errors.lname}
                  label="Last Name"
                  name="lname"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={data.user_email_verified==1}
                  InputProps={{
                  endAdornment:
                    (<InputAdornment position="end">
                      <IconButton
                        aria-label="email-verification"
                        title={`${data.user_email_verified==1 ? 'Verified' : 'Not Verified'}`}
                        onClick={data.user_email_verified==0 && !formik.errors.email ? handleVerifyEmail : null}
                        edge="end"
                      >
                      { data.user_email_verified==1 ?
                        <SvgIcon 
                        fontSize="medium"
                        color='success'
                        >
                        <CheckBadgeIcon />
                        </SvgIcon>
                        :
                        <CustomButton innerText='Verify'variant='contained' color='greyish' size='small'/>
                      }
                      </IconButton>
                    </InputAdornment>)
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.tel && formik.errors.tel)}
                  fullWidth
                  helperText={formik.touched.tel && formik.errors.tel}
                  label="Phone number"
                  name="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tel}
                  InputProps={{
                  endAdornment:
                    (<InputAdornment position="end">
                      <IconButton
                        aria-label="phone-number-verification"
                        title={`${data.user_tel_verified==1 ? 'Verified' : 'Not Verified'}`}
                        onClick={data.user_tel_verified==0 ? handleVerifyTel : null}
                        edge="end"
                      >
                        {<SvgIcon sx={{color: `
                        ${data.user_tel_verified==1 ? 'green' : 'gray'}
                        `}} fontSize="medium"><CheckBadgeIcon /></SvgIcon>}
                      </IconButton>
                    </InputAdornment>)
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.country && formik.errors.country)}
                  fullWidth
                  helperText={formik.touched.country && formik.errors.country}
                  label="Country"
                  name="country"
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                  defaultValue={formik.values.country}
                  select
                >
                  {countries.map((country, k) => (
                    <MenuItem
                      key={k}
                      value={country?.iso2}
                    >
                      {country?.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              { stateAvaliable &&
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.state && formik.errors.state)}
                  fullWidth
                  helperText={formik.touched.state && formik.errors.state}
                  label={`${!stateLoading ? 'State' : 'States loading...'}`}
                  name="state"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  defaultValue={formik.values.state}
                  disabled={states.length===0 && !formik.values.state}
                  select
                >
                  {states.map((state, k) => (
                    <MenuItem
                      key={k}
                      value={state?.iso2}
                    >
                      {state?.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              }
              {formik.errors.submit && (
              <Grid xs={12}>
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
            </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <CustomButton variant='contained' type='submit' innerText='Save details' isLoading={loading} />
        </CardActions>
      </Card>
    </form>
  );
};
