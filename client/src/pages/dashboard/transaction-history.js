import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import UserContext from 'src/contexts/userContext';
import { authLayer } from 'src/auth/authLayer';
import { TransactionHistory } from 'src/sections/overview/transaction-history';
import {Grid, Container, Box} from '@mui/material'
import { useState } from 'react';



const Page = ({data}) => {
    const [perPage, setPerPage] = useState(10)
    const [sortBy, setSortBy] = useState('created_on')
    const [sortOrder, setSortOrder] = useState('DESC')
    const [page, setPage] = useState(1)
    const [filterDates, setFilterDates] = useState([])
    const [txType, setTxType] = useState('all')
    const [totalTransactions, setTotalTransactions] = useState(0)
    const pagntCount = Math.ceil(totalTransactions / perPage)
    


    return(
        <UserContext.Provider value={{data}}>
        <DashboardLayout>
        <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
        <Container maxWidth="xl">
        <Grid>
            <TransactionHistory
            title={'Transaction History'}
            options={{
                perPage: perPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: page,
                filterDates: filterDates,
                txType: txType
            }}
            totalTransactions={totalTransactions}
            setTotalTransactions={setTotalTransactions}
            pagntCount={pagntCount}
            page={page}
            setPage={setPage}
            setPerPage={setPerPage}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            setFilterDates={setFilterDates}
            setTxType={setTxType}
            />
            </Grid>
            </Container>
            </Box>
        </DashboardLayout>
        </UserContext.Provider>
    )
}


export default Page


export const getServerSideProps = authLayer