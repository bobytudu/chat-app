import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import get from "lodash/get";
import { Control, Controller } from "react-hook-form";
import Typography from "@mui/material/Typography";
import React from "react";
import { TextFieldProps } from "@mui/material";

export type InputPropsTypes = TextFieldProps & {
  control: Control<any>;
  name: string;
  label?: string;
  type?: string;
  rows?: string | number;
  multiline?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

const CustomInput = ({
  control,
  name,
  label,
  sx = {},
  inputProps,
  ...rest
}: InputPropsTypes) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange }, formState: { errors } }) => (
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 0.6, fontSize: 14, fontWeight: 600 }}
        >
          {label}
        </Typography>
        <TextField
          value={value}
          {...rest}
          variant={get(rest, "variant", "outlined")}
          onChange={(e) => onChange(e.target.value)}
          error={Boolean(get(errors, name))}
          sx={{ maxWidth: !rest.fullWidth ? 400 : "auto", ...sx }}
          helperText={<>{get(errors, `${name}.message`, "")}</>}
          inputProps={inputProps}
        />
        {!get(errors, name) && (
          <InputLabel sx={{ color: "transparent" }}>
            <>{get(errors, name, "")}</>
          </InputLabel>
        )}
      </Box>
    )}
  />
);

export default CustomInput;
