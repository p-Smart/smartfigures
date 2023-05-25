import {useRouter} from 'next/router'
import Cookies from 'js-cookie'



function Page(){
    const router = useRouter()
    Cookies.remove('authToken')
    router.push('/auth/login')
}


export default Page