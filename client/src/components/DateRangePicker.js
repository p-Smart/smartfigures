import { useState } from 'react'
import {TextField} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, {Dayjs} from 'dayjs'
import CustomButton from './Button';

const formatDate = (dayjsObject) => dayjsObject.format('YYYY-MM-DD')


const DateRangePicker = ({startDate, endDate, filterByDate}) => {
    const [startDateValue, setStartDateValue] = useState(dayjs(null))
    const [endDateValue, setEndDateValue] = useState(dayjs(null))
    const [startDateError, setStartDateError] = useState(false)
    const [endDateError, setEndDateError] = useState(false)
    const [enableEndDate, setEnableEndDate] = useState(false)
    
    const handleStartDateChange = (newDate) => {
        const startDate = new Date(newDate)
        const endDate = new Date(endDateValue)
        startDate > endDate ? setStartDateError(true) : setStartDateError(false)
        startDate < endDate && setEndDateError(false)
        setStartDateValue(newDate)
    }

    const handleEndDateChange = (newDate) => {
        const startDate = new Date(startDateValue)
        const endDate = new Date(newDate)
        endDate < startDate ? setEndDateError(true) : setEndDateError(false)
        endDate > startDate && setStartDateError(false)
        setEndDateValue(newDate)
    }

    return(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='date-picker-wrapper'>
        <MobileDatePicker
          disableFuture
          label="Start date"
          openTo="year"
          views={['year', 'month', 'day']}
          value={startDateValue}
          onChange={handleStartDateChange}
          
          componentsProps={{ textField: {error: startDateError } }}
          onAccept={ () => {
            setEnableEndDate(true)
            enableEndDate !== false && startDateValue.isValid() && endDateValue.isValid() && !startDateError && !endDateError
              && filterByDate(formatDate(startDateValue), formatDate(endDateValue))
          } }
          
        />
        <MobileDatePicker
          disableFuture
          label="End date"
          openTo="year"
          views={['year', 'month', 'day']}
          value={endDateValue}
          onChange={handleEndDateChange}

          componentsProps={{ textField: {error: endDateError }, actionBar: 
            ( startDateError || endDateError || !startDateValue.isValid() || !endDateValue.isValid() ) ? 
            {actions : []}
            :
            {actions: ['accept'] }
           }}
          disabled={!enableEndDate}
          onAccept={() => { startDateValue.isValid() && endDateValue.isValid() && !startDateError && !endDateError
            && filterByDate(formatDate(startDateValue), formatDate(endDateValue))}}
        />
      </div>
    </LocalizationProvider>
    )
}


export default DateRangePicker