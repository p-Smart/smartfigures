import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {Box, Button, Skeleton, Card, CardActions, CardHeader,  Divider, SvgIcon, TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableSortLabel, TableRow, Pagination, TablePagination, Typography, TextField, MenuItem} from '@mui/material'

import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import DateRangePicker from 'src/components/DateRangePicker';

const statusMap = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error'
};
const dateOptions = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric',
  timeZone: "Africa/Lagos"
};
const timeOptions = {
  hour: 'numeric', 
  minute: 'numeric', 
  // second: 'numeric', 
  hour12: false,
  timeZone: "Africa/Lagos"
}








export const TransactionHistory = ({title, update, sx, options, totalTransactions, setTotalTransactions, pagntCount, page, setPage, setPerPage, setSortBy, setSortOrder, setFilterDates, setTxType}) => {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const defaultPerPage = 5
  
  // To remove duplicate and sort the per page options
  const perPageOptions = [...new Set([options?.perPage, 5, 10, 25, 50, 100])]
  perPageOptions.sort((a, b) => a - b)

  const prevSortValue = useRef(options?.sortBy)


  useEffect( () => {
  
    (async () => {
      setLoading(true)
      const urlQuery = `?${new URLSearchParams(options).toString()}`
      const apiUrl = `${process.env.NEXT_PUBLIC_API}/fetchTransactionHistory${options ? urlQuery : ''}`
    try{
    const {data} = await axios.get(apiUrl,{
      headers: {
        'Authorization' : 'Bearer ' + Cookies.get('authToken'),
      }
    })
    setTransactions(data.data)
    options && setTotalTransactions(data.totalRecords)
    setLoading(false)
  }
  catch(err){ console.log(err.message) }
  })()

  },[options?.perPage, options?.sortBy, options?.sortOrder, options?.page, options?.filterDates, options?.txType, update] )


  const handleSortChange = (value) => () => {
    let sortOrder = value === prevSortValue.current ? (options.sortOrder==='DESC' ? 'ASC' : 'DESC') : 'ASC'
    setSortOrder(sortOrder)
    setSortBy(value)


    prevSortValue.current = value
  }



  const tableHeadData = [
{label:'Date', value: 'created_on'},
{label:'Amount', value: 'amount'}, 
{label:'Type', value: 'tx_type'}, 
{label:'Status', value: 'status'}, 
{label:'Reference', value: 'tx_ref'}, 
]
const txTypes = [
  {label: 'All', value:'all'},
  {label: 'Deposit', value:'DEPOSIT'},
{label: 'Withdrawal', value:'WITHDRAWAL'},
  {label: 'Refunds', value:'REFUND'}
]

  return (
    <Card size={sx} className='transaction-history'>
      <CardHeader title={title} />
        
    {options &&
    <>
      <div className='filters-wrapper'>
      <TextField
      fullWidth
      helperText=''
      label="Type"
      name="tx_type"
      onChange={(e) => {setPage(1); setTxType(e.target.value)}}
      defaultValue='all'
      select
    >
      {txTypes.map((txType, k) => (
        <MenuItem
          key={k}
          value={txType.value}
        >
          {txType.label}
        </MenuItem>
      ))}
    </TextField>
      </div>
      <DateRangePicker
      filterByDate={(start, end) => {
        setFilterDates([start, end])
        setPage(1)
      } }
      />
    </>
  }
  <Scrollbar sx={{ flexGrow: 1 }}>
        <Box>
          <TableContainer component={Paper} className='table__body'>
            <Table aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  {
                    tableHeadData.map((head, k) => {
                      return(
                        options 
                          ?
                        <TableCell key={k}>
                          <TableSortLabel
                          active={options.sortBy === head.value}
                          direction={options.sortOrder.toLowerCase()}
                          onClick={handleSortChange(head.value)}
                          >
                            {head.label}
                          </TableSortLabel>
                        </TableCell>
                          :
                        <TableCell key={k}>{head.label}</TableCell>
                      )
                    })
                  }
                </TableRow>
              </TableHead>
              { !loading
                ?
              <TableBody>
              {
                transactions.length===0 && 
                <TableRow>
                  <TableCell colSpan={5} style={{whiteSpace: 'nowrap'}}>
                    <Typography >
                      No results found
                    </Typography>
                  </TableCell>
                </TableRow>
              }
                {transactions.map((transaction, k) => {
                  const newDate = new Date(transaction?.created_on)
                  const date = newDate.toLocaleString('en-GB', dateOptions)
                  const time = newDate.toLocaleString('en-GB', timeOptions)

                  return (
                    <TableRow
                      hover
                      key={k}
                    >
                      <TableCell style={{whiteSpace: 'nowrap'}}>
                        <div>{date}</div>
                        <div>{time}</div>
                      </TableCell>
                      <TableCell>
                        {`₦${transaction?.amount}`}
                      </TableCell>
                      <TableCell>
                        {transaction?.tx_type}
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[transaction.status]}>
                          {transaction?.status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell>
                        {transaction?.tx_ref}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
                :
                <TableBody>
                {[...Array(options?.perPage || defaultPerPage)].map((el, k) => {

                  return (
                    <TableRow
                      hover
                      key={k}
                    >
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              }
            </Table>
          </TableContainer>
          </Box>
      </Scrollbar>
      <Divider />
      { options && transactions.length!==0 &&
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 2,
            gap: 5
          }}
            >
        <Pagination
          count={pagntCount}
          size={`${window.innerWidth <= 500 ? 'medium' : 'large'}`}
          page={page}
          onChange={(e, page) => setPage(page)}
        />
        <TablePagination
          rowsPerPageOptions={perPageOptions}
          component="div"
          count={totalTransactions}
          rowsPerPage={options.perPage}
          page={page-1}
          onPageChange={(e, page) => setPage(page+1)}
          onRowsPerPageChange={(e) => {setPage(1); setPerPage(e.target.value)}}
        />
      </Box>
    }
      <CardActions sx={{ justifyContent: 'flex-end' }}>
      {router.pathname!=='/dashboard/transaction-history' && (
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
          onClick={() => router.push('/dashboard/transaction-history')}
        >
          View all
        </Button>
        )}
      </CardActions>
    </Card>
  );
}