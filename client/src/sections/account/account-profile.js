import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Input
} from '@mui/material';
import { useRef, useState, useContext } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';
import UserContext from 'src/contexts/userContext'
import {useRouter} from 'next/router'
import CustomButton from 'src/components/Button';





export const AccountProfile = () => {
  const {data} = useContext(UserContext)
  const formRef = useRef(null)
  const router = useRouter()
  const { pathname, query } = router
  const [isUploading, setIsUploading] = useState(false)


  const handleImageUpload = (e) => {
    setIsUploading(true)
    let formData = new FormData(formRef.current)
    let authToken = Cookies.get('authToken')
    axios.post(`${process.env.NEXT_PUBLIC_API}/changeProfileImage`, formData, {
      headers: {
        'Authorization' : 'Bearer ' + authToken
      },
      withCredentials: true
    })
    .then( ({data}) => {
      if(data.success){
        router.replace({ pathname, query })
        setIsUploading(false)
      }
      else{
        console.log('Error uploading image')
        setIsUploading(false)
      }
    } )
    .catch( (err) => {console.log(err.message); setIsUploading(false)} )
  }

  return(
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={data?.user_dp?.url}
          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {`${data?.user_fname} ${data?.user_lname}`}
        </Typography>
        <Typography
          gutterBottom
          variant=""
        >
          {data?.job_title}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {data?.city} {data?.country}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {data?.user_timezone}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
    <form ref={formRef} encType='multipart/form-data'><Input style={{display:'none',}} id='profile-image' type='file' name='profileImage' onChange={(e)=>handleImageUpload(e)}/></form>
    <label style={{width: '100%'}} htmlFor='profile-image'>
      <CustomButton component='span' fullWidth variant='text' innerText='Upload picture' isLoading={isUploading} loadingText='Uploading...' />
    </label>
    </CardActions>
  </Card>
  )
}
