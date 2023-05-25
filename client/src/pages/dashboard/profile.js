import Head from 'next/head';
import { createContext } from 'react';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';


const Page = ({data}) => {
  
  return(
    <UserContext.Provider value={{data}}>
    <DashboardLayout >
      <Head>
        <title>
          Profile Info | Smart Figures
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Profile Info
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile/>
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <AccountProfileDetails/>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  </UserContext.Provider>
)};

export default Page;


export const getServerSideProps = authLayer
