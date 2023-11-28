import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

export interface DatePickerPropsTypes {
  control: Control<any>;
  label: string;
  name: string;
  fullWidth?: boolean;
}

function CustomDatePicker({
  control,
  label,
  name,
  fullWidth = true,
}: DatePickerPropsTypes) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 0.6, fontSize: 14, fontWeight: 600 }}
          >
            {label}
          </Typography>
          <DatePicker
            disableFuture
            value={value}
            onChange={(value: any) => onChange(value)}
            slotProps={{
              textField: {
                fullWidth: fullWidth,
              },
            }}
          />
        </Box>
      )}
    />
  );
}
export default CustomDatePicker;
