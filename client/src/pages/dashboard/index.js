import { useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MainBalance } from 'src/sections/overview/main-balance';
import { TransactionHistory } from 'src/sections/overview/transaction-history';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { Graph } from 'src/sections/overview/graph';
import { Progress } from 'src/sections/overview/progress';
import { InvestmentBalance } from 'src/sections/overview/investment-balance';
import { Profit } from 'src/sections/overview/profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';
import DepositModal from 'src/components/DepositModal'
import WithdrawalModal from 'src/components/WithdrawalModal'
import PaymentProviderModal from 'src/components/PaymentProviderModal';

const Page = ({data}) => {
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
  const [openPaymentProviderModal, setOpenPaymentProviderModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState(0);
  const [update, setUpdate] = useState(false)

  return(
    <UserContext.Provider value={{data}}>
  <DashboardLayout>
    <Head>
      <title>
        Dashboard | Smart Figures
      </title>
    </Head>
    <DepositModal open={openDepositModal} setOpen={setOpenDepositModal} setDepositAmount={setDepositAmount} setOpenPaymentProviderModal={setOpenPaymentProviderModal}/>
    <WithdrawalModal open={openWithdrawalModal} setOpen={setOpenWithdrawalModal} setUpdateTransactions={setUpdate}/>
    <PaymentProviderModal open={openPaymentProviderModal} setOpen={setOpenPaymentProviderModal} amount={depositAmount}/>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <MainBalance
              difference={12}
              positive
              sx={{ height: '100%' }}
              value="$24k"
              setOpenDepositModal={setOpenDepositModal}
              setOpenWithdrawalModal={setOpenWithdrawalModal}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <InvestmentBalance
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value=""
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <Progress
              sx={{ height: '100%' }}
              value={75.5}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <Profit
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
          {/* <Grid
            xs={12}
            lg={6}
          >
            <Graph
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          {/* <Grid
            xs={12}
            md={6}
            lg={6}
          >
            <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={['Desktop', 'Tablet', 'Phone']}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          {/* <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLatestProducts
              products={[
                {
                  id: '5ece2c077e39da27658aa8a9',
                  image: '/assets/products/product-1.png',
                  name: 'Healthcare Erbology',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '5ece2c0d16f70bff2cf86cd8',
                  image: '/assets/products/product-2.png',
                  name: 'Makeup Lancome Rouge',
                  updatedAt: subDays(subHours(now, 8), 2).getTime()
                },
                {
                  id: 'b393ce1b09c1254c3a92c827',
                  image: '/assets/products/product-5.png',
                  name: 'Skincare Soja CO',
                  updatedAt: subDays(subHours(now, 1), 1).getTime()
                },
                {
                  id: 'a6ede15670da63f49f752c89',
                  image: '/assets/products/product-6.png',
                  name: 'Makeup Lipstick',
                  updatedAt: subDays(subHours(now, 3), 3).getTime()
                },
                {
                  id: 'bcad5524fe3a2f8f8620ceda',
                  image: '/assets/products/product-7.png',
                  name: 'Healthcare Ritual',
                  updatedAt: subDays(subHours(now, 5), 6).getTime()
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          <Grid
            xs={12}
            md={12}
            lg={12}
          >
            <TransactionHistory
              title={'Recent Transactions'}
              update={update}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </DashboardLayout>
  </UserContext.Provider>
)};

export default Page;


export const getServerSideProps = authLayer
