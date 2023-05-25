import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';

const Page = ({data}) => {

  return(
  <UserContext.Provider value={{data}}>
  <DashboardLayout>
    <Head>
      <title>
        Settings | Smart Figures
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
          <Typography variant="h4">
            Settings
          </Typography>
          <SettingsNotifications />
          <SettingsPassword />
        </Stack>
      </Container>
    </Box>
  </DashboardLayout>
  </UserContext.Provider>
)};

export default Page;


export const getServerSideProps = authLayer
