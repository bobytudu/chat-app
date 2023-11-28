import React from "react";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import XMarkIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Input } from "components/forms";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "redux/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "services/firebase";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
});

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddUserDialog({ open, onClose }: AddUserDialogProps) {
  const user = useAppSelector((state) => state.auth.user);
  const initValues = {
    email: "",
    name: "",
  };
  const { control, handleSubmit, reset } = useForm({
    defaultValues: initValues,
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: any) => {
    try {
      if (user) {
        await updateDoc(doc(db, "users", `${user.uid}`), {
          friends: [...user.friends, data],
        });
        reset(initValues);
        onClose();
      }
    } catch (error) {}
  };
  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <Tooltip title="Close">
        <IconButton
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            bgcolor: "black",
            position: "absolute",
            top: -36,
            right: -36,
            width: 36,
            height: 36,
          }}
        >
          <XMarkIcon style={{ color: "white", width: 24, height: 24 }} />
        </IconButton>
      </Tooltip>
      <Typography variant="h3" sx={{ my: 2, textAlign: "center" }}>
        Add User
      </Typography>
      <Divider />
      <Box p={3}>
        <Input
          fullWidth
          control={control}
          placeholder="Enter name"
          label="Name"
          name="name"
        />
        <Input
          fullWidth
          control={control}
          label="Email"
          placeholder="Enter email"
          name="email"
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
        >
          Add
        </Button>
      </Box>
    </Dialog>
  );
}
