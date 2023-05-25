import { useCallback, useState, useContext, useRef } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Alert,
  Typography
} from '@mui/material';
import UserContext from 'src/contexts/userContext';
import PasswordField from 'src/components/PasswordField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import Cookies from 'js-cookie';
import CustomButton from 'src/components/Button';




export const SettingsPassword = () => {
  const {data} = useContext(UserContext)
  const [passwordChangeSuccessful, setPasswordChangeSucessful] = useState(false)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const form = useRef()
  const handleSubmit = async (values, helpers) => {
    setIsUpdateLoading(true)
    let formData = new URLSearchParams(new FormData(form.current)).toString()
    try{
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/user/changePassword`, formData,{
        headers: {
          'Authorization' : 'Bearer ' + data.authToken,
        }
      })
      if(response.data?.success){
        setPasswordChangeSucessful(true)
        setIsUpdateLoading(false)
        helpers.resetForm()
        
        setTimeout(()=>{
          setPasswordChangeSucessful(false)
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
      setIsUpdateLoading(false)
    }
  }
  const formik = useFormik({
    initialValues: {
      pass: '',
      newpass: '',
      confirmnewpass: ''
    },
    validationSchema: Yup.object({
      pass: Yup.string().required('Old password is required'),
      newpass: Yup.string().min(8).required('Choose a password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\-#\$%\^&\*_])(?=.{8,})/,'Password must contain at least one uppercase letter, one lowercase letter, one number and a special character').notOneOf([Yup.ref('pass'), null], 'New password must be different from the old password'),
      confirmnewpass: Yup.string().oneOf([Yup.ref("newpass"), null], "Passwords do not match").required("Confirm new password"),
    }),
    onSubmit: handleSubmit
  });

  return (
    <form ref={form} noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />

        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
          {
              passwordChangeSuccessful && (
                <Alert
                  color="success"
                  severity="info"
                  sx={{ mt: 3 }}
                  style={{marginBottom:'10px'}}
                  >
                    <div>
                      <b>Password changed successfully</b>
                    </div>
                </Alert>
              )
            }
            <PasswordField
              fullWidth
              label="Current Password"
              name="pass"
              error={!!(formik.touched.pass && formik.errors.pass)}
              helperText={formik.touched.pass && formik.errors.pass}
              onBlur={formik.handleBlur}
              value={formik.values.pass}
              onChange={formik.handleChange}
            />
            <PasswordField
              fullWidth
              label="New Password"
              name="newpass"
              error={!!(formik.touched.newpass && formik.errors.newpass)}
              helperText={formik.touched.newpass && formik.errors.newpass}
              onBlur={formik.handleBlur}
              value={formik.values.newpass}
              onChange={formik.handleChange}
            />
            <PasswordField
              fullWidth
              label="Password (Confirm)"
              name="confirmnewpass"
              error={!!(formik.touched.confirmnewpass && formik.errors.confirmnewpass)}
              helperText={formik.touched.confirmnewpass && formik.errors.confirmnewpass}
              onBlur={formik.handleBlur}
              value={formik.values.confirmnewpass}
              onChange={formik.handleChange}
            />
            {formik.errors.submit && (
            <Typography
              color="error"
              sx={{ mt: 3 }}
              variant="body2"
            >
              {formik.errors.submit}
            </Typography>
              )}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <CustomButton variant="contained" type='submit' innerText={'Update'} isLoading={isUpdateLoading}/>
        </CardActions>
      </Card>
    </form>
  );
};
