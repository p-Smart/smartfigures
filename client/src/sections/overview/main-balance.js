import CreditCardIcon from '@heroicons/react/24/solid/CreditCardIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import CustomButton from 'src/components/Button';
import UserContext from 'src/contexts/userContext';
import { useContext } from 'react';

export const MainBalance = ({sx, value, setOpenDepositModal, setOpenWithdrawalModal}) => {
  const {data} = useContext(UserContext)

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Main Balance
            </Typography>
            <Typography variant='h5'>
              {`₦${(parseFloat(data.main_balance)).toLocaleString()}`}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CreditCardIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
          <Stack
            alignItems="center"
            justifyContent='space-between'
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
           <CustomButton 
            innerText='DEPOSIT'
            variant='contained'
            onClick={setOpenDepositModal}
            size='small'
           />
           <CustomButton 
            innerText='WITHDRAW'
            variant='contained'
            color='success'
            size='small'
            onClick={setOpenWithdrawalModal}
            
           />
          </Stack>
      </CardContent>
    </Card>
  );
};
