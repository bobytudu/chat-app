import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";
import Typography from "@mui/material/Typography";
import get from "lodash/get";
import find from "lodash/find";
import React from "react";
import { Control } from "react-hook-form";
import { BoxProps } from "@mui/material";

export interface SelectPropsTypes {
  options: { value: string | number; label: string }[];
  label: string;
  control: Control<any>;
  name: string;
  sx?: BoxProps;
  fullWidth?: boolean;
}

function CustomSelect({
  options,
  label,
  control,
  name,
  sx,
  fullWidth = true,
}: SelectPropsTypes) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, formState: { errors } }) => (
        <Box sx={{ minWidth: 250, ...sx }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 0.6, fontSize: 14, fontWeight: 600 }}
          >
            {label}
          </Typography>
          <Select
            value={value}
            fullWidth={fullWidth}
            onChange={onChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <p style={{ opacity: "0.6", margin: 0, padding: 0 }}>
                    Select {label}
                  </p>
                );
              }
              return get(
                find(options, { value: selected }),
                "label",
                "unknown"
              );
            }}
            error={Boolean(get(errors, name))}
          >
            <MenuItem value="">Select {label}</MenuItem>
            {options.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          {get(errors, name) && (
            <FormHelperText sx={{ color: "error.main" }}>
              <>error- {get(errors, `${name}.message`, "")}</>
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
export default CustomSelect;
