import {
  Avatar,
  Box,
  Card,
  Stack,
  TableContainer,
  TableSortLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  Divider,
  Pagination,
  TablePagination
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';


const statusMap = {
  1: 'success',
  0: 'error',
  true: 'success',
  false: 'error'
};
const dateOptions = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric', 
};
const timeOptions = {
  hour: 'numeric', 
  minute: 'numeric', 
  // second: 'numeric', 
  hour12: false
}
const tableHeadData = [
  {label:'Name', value: 'name'},
  {label:'Email', value: 'email'}, 
  {label:'Phone Number', value: 'tel'}, 
  {label:'Verified', value: 'verified'}, 
  {label:'Registration Date', value: 'reg_date'},
  ]

export const ReferralsTable = ({update, loading, setLoading, options, totalReferrals, setTotalReferrals, pagntCount, page, setPage, setPerPage, setSortBy, setSortOrder, refereeId}) => {

  const [referrals, setReferrals] = useState([])
  const defaultPerPage = 5
  
  // To remove duplicate and sort the per page options
  const perPageOptions = [...new Set([options?.perPage, 5, 10, 25, 50, 100])]
  perPageOptions.sort((a, b) => a - b)

  const prevSortValue = useRef(options?.sortBy)

  const handleSortChange = (value) => () => {
    let sortOrder = value === prevSortValue.current ? (options.sortOrder==='DESC' ? 'ASC' : 'DESC') : 'ASC'
    setSortOrder(sortOrder)
    setSortBy(value)


    prevSortValue.current = value
  }

  useEffect( () => {
  
    (async () => {
      setLoading(true)
      const urlQuery = `?${new URLSearchParams(options).toString()}`
      const apiUrl = `${process.env.NEXT_PUBLIC_API}/referrals/fetch-referrals${urlQuery}`
    try{
    const {data} = await axios.get(apiUrl,{
      headers: {
        'Authorization' : 'Bearer ' + Cookies.get('authToken'),
      }
    })
    setReferrals(data.data)
    setTotalReferrals(data.totalRecords)
    options.searchToken !== '' && Object.keys(data.data).length === 0 && console.log('gi')
    setLoading(false)
  }
  catch(err){ console.log(err.message) }
  })()

  },[options?.perPage, options?.sortBy, options?.sortOrder, options?.page, options?.searchToken] )


  return (
    <Card className='transaction-history'>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box>
          <TableContainer className='table__body'>
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
                referrals.length===0 && 
                <TableRow>
                  <TableCell colSpan={5} style={{whiteSpace: 'nowrap'}}>
                    <Typography >
                      {totalReferrals === 0 ? `You have no referrals, ${refereeId ? 'invite new users' : 'generate a ref link'}` : 'No result found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
                {referrals.map((referral, k) => {
                  const newDate = new Date(referral?.user_reg_date)
                  const date = newDate.toLocaleString('en-US', dateOptions)
                  const time = newDate.toLocaleString('en-US', timeOptions)

                  return (
                    <TableRow
                      hover
                      key={k}
                    >
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Avatar src={referral?.user_dp?.url} />
                          <Typography variant="subtitle2">
                            {`${referral?.user_fname} ${referral?.user_lname}`}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {referral?.user_email}
                      </TableCell>
                      <TableCell>
                          {referral?.user_tel}
                      </TableCell>
                      <TableCell>
                      <SeverityPill color={statusMap[referral?.user_email_verified]}>
                        {(referral?.user_email_verified === 0 || referral?.user_email_verified === false) ? 'NO' : 'YES'}
                      </SeverityPill>
                      </TableCell>
                      <TableCell style={{whiteSpace: 'nowrap'}}>
                        <div>{date}</div>
                        <div>{time}</div>
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
      { options && referrals.length!==0 &&
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
          count={totalReferrals}
          rowsPerPage={options.perPage}
          page={page-1}
          onPageChange={(e, page) => setPage(page+1)}
          onRowsPerPageChange={(e) => {setPage(1); setPerPage(e.target.value)}}
        />
      </Box>
    }
    </Card>
  );
};
