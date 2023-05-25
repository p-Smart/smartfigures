import axios from 'axios'


export const authLayer = async ({req, res}) => {
    try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/loggedIn`, {
        headers: {
          'Authorization' : 'Bearer ' + req.cookies.authToken
        }
      })
      if (data.success){
        const newAuthToken = data.newAuthToken
        const expiryTime = new Date()
        expiryTime.setDate(expiryTime.getDate() + 1)
        res.setHeader('set-cookie', `authToken=${newAuthToken}; Path=/; expires=${expiryTime}; secure=true`)
        try{
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/fetchUser`, {
                headers: {
                  'Authorization' : 'Bearer ' + newAuthToken
                }
              })
              return({
                props: {
                data : data.userData
                }
              })
        }
        catch(err){
            return({
              redirect: {
                  destination: '/auth/login',
                  permanent: false
              }
          })
        }
      }
      else{
        return({
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        })
      }
    }
    catch(err){
      return({
        redirect: {
            destination: '/auth/login',
            permanent: false
        }
    })
    }
}