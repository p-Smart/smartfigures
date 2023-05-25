import {Button, CircularProgress, Typography} from '@mui/material'

const CustomButton = ({innerText, fullWidth, size, sx, onClick, type, variant, isLoading, color, disabled, loadingText, ariaLabel, component, buttonRef}) => {

    return(
    <Button
    ref={buttonRef}
    fullWidth={fullWidth}
    size={size}
    sx={sx}
    type={type}
    variant={variant}
    disabled={isLoading || disabled}
    onClick={onClick}
    color={color}
    aria-label={ariaLabel}
    component={component}
  >
    {!isLoading ? `${innerText}` : 
    <div style={{display: 'flex', alignItems: 'center', gap:10}}>
      <CircularProgress size={25} />
      <p>{loadingText}</p>
    </div>}
  </Button>
  )
}


export default CustomButton