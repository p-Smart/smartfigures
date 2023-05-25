import { useState } from "react";
import {TextField} from '@mui/material'
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import EyeSlashIcon from '@heroicons/react/24/solid/EyeSlashIcon';
import { SvgIcon } from '@mui/material';

export default function PasswordField({label, fullWidth, name, onChange, error, helperText, onBlur, value}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event
  ) => {
    event.preventDefault();
  };

  return (
      <div>
          <TextField
            error={error}
            helperText={helperText}
            onBlur={onBlur}
            value={value}
            fullWidth={fullWidth}
            label={label}
            name={name}
            type={showPassword ? "text" : "password"}
            onChange={onChange}
            InputProps={{
            endAdornment:
              (<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <SvgIcon fontSize="small"><EyeSlashIcon /></SvgIcon> : <SvgIcon fontSize="small"><EyeIcon /></SvgIcon>}
                </IconButton>
              </InputAdornment>)
            }}
          />
      </div>
  );
}
