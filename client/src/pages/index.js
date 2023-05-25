import Head from "next/head"

function Page(){

    return(
        <>
        <Head>
        <title>
          Home | Smart Figures
        </title>
      </Head>
        </>
    )
}
export default Page

export const getServerSideProps = ({req, res}) => {
  return({
    redirect: {
        destination: '/auth/register',
        permanent: false
    }
})
}