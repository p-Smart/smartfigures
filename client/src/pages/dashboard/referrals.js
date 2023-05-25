import { useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {ReferralsTable } from 'src/sections/customer/referrals-table';
import { ReferralsSearch } from 'src/sections/customer/referrals-search';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';
import { useRef } from 'react';
import { toastError, toastSuccess } from 'src/modules/toast';
import {useRouter} from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie';


const Page = ({data}) => {
  const [perPage, setPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('user_reg_date')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [searchToken, setSearchToken] = useState('')
  const [page, setPage] = useState(1)
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [loading, setLoading] = useState(false)
  const pagntCount = Math.ceil(totalReferrals / perPage)
  const copyRef = useRef(null);
  const router = useRouter()
  const { pathname, query } = router
  const [timeoutId, setTimeoutId] = useState(undefined)

  const handleGenerateRefLink = async () => {
    try{
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/referrals/generate-referral-id`,{
      headers: {
        'Authorization' : 'Bearer ' + Cookies.get('authToken'),
      }
    })
    if(data?.success){
      toastSuccess(data.message)
      router.replace({ pathname, query })
      
    }
    else{
      throw new Error(err.message)
    }
    }
    catch(err){
      toastError('Error generating referral link, try again later')
    }
  }

  const copyToClipboard = (text) => {
    copyRef.current = document.createElement("textarea");
    document.body.appendChild(copyRef.current);
    copyRef.current.value = text;
    copyRef.current.select();
    document.execCommand("copy");
    copyRef.current.remove();
    toastSuccess('Copied to Clipboard')
  }

  const handleReferralSearch = (value) => {
    if (totalReferrals !== 0){
      setLoading(true)
      setPage(1)
      clearTimeout(timeoutId)
      setTimeoutId( setTimeout( () => {
          setSearchToken(value)
      }, 700 ))
    }
  }

  return (
    <UserContext.Provider value={{data}}>
    <DashboardLayout>
      <Head>
        <title>
          Referrals | Smart Figures
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Referrals
                </Typography>
                {
                  !data?.referee_id ?
                  <div>
                  <Button
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                    size='small'
                    onClick={handleGenerateRefLink}
                  >
                    Generate Referral Link
                  </Button>
              </div>
                      :
                <>
                <Typography variant="span" color='primary.dark' style={{cursor: 'pointer'}} onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_CLIENT}/auth/register/${data?.referee_id}`)}>
                  Referral Link: {`${process.env.NEXT_PUBLIC_CLIENT}/auth/register/${data?.referee_id}`}
                </Typography>
                <Typography variant="span">
                  Your Referral Code: {data?.referee_id}
                </Typography>
                </>
                }
              </Stack>
              {/* <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack> */}
            </Stack>
            <ReferralsSearch onChange={(e) => handleReferralSearch(e.target.value)}/>
            <ReferralsTable
              options={{
                perPage: perPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: page,
                searchToken: searchToken
              }}
              totalReferrals={totalReferrals}
              setTotalReferrals={setTotalReferrals}
              pagntCount={pagntCount}
              page={page}
              setPage={setPage}
              setPerPage={setPerPage}
              setSortBy={setSortBy}
              setSortOrder={setSortOrder}
              refereeId={data?.referee_id}
              setSearchToken={setSearchToken}
              loading={loading}
              setLoading={setLoading}
            />
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
    </UserContext.Provider>
  );
};

export default Page;


export const getServerSideProps = authLayer
