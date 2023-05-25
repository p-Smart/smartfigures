import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'


const AutoLogout = ({children}) => {
    // const [intereactedWithUI, setIntereactedWithUI] = useState(false)
    // const [timeoutId, setTimeoutId] = useState(null)
    // const router = useRouter()

    // const handleEvents = () => {
    //     setIntereactedWithUI((prevVal) => !prevVal)
    // }

    // useEffect( () => {
    //     const id = setTimeout( () => {
    //         setIntereactedWithUI('false')
    //     }, 15 * 60 * 1000 )
    //     setTimeoutId(id)

    //     return(
    //         clearTimeout(timeoutId)
    //     )
    // },[intereactedWithUI] )

    // intereactedWithUI === 'false' && router.push('/auth/signout')
    return(
        <div 
        // onClick={handleEvents}
        // onContextMenu={handleEvents}
        // onKeyDown={handleEvents}
        >
        {children}
        </div>
    )
}

export default AutoLogout