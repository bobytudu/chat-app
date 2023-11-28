import Page from "components/Page";
import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import ListItemButton from "@mui/material/ListItemButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "redux/hooks";
import get from "lodash/get";
import AddUserDialog from "components/dialog/AddUserDialog";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//images
import bgImg from "assets/background.jpg";

interface CustomListItemProps {
  name: string;
  email: string;
  selected: boolean;
  onClick: () => void;
}

function CustomListItem({
  name,
  email,
  onClick,
  selected,
}: CustomListItemProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Remove User</MenuItem>
      </Menu>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255,0.3)" }}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{
          color: "white",
          "& .MuiListItemText-secondary": {
            color: "rgba(255, 255, 255, 0.8)",
          },
        }}
        primary={name}
        secondary={email}
      />
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </ListItemButton>
  );
}

export default function Home() {
  const [showAddUserDialog, setShowAddUserDialog] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState("");
  const { ws, auth } = useAppSelector((state) => ({
    ws: state.ws.ws,
    auth: state.auth,
  }));
  const chats = [{ type: "request", message: "Hello", msgType: "text" }];
  const [activeUser, setActiveUser] = React.useState("123@gmail.com");

  const handleAddNewUser = () => {
    setShowAddUserDialog(true);
  };

  function handleChatMessage(data: any) {
    console.log("message", data);
    if (ws) {
      ws.send({
        type: "message",
        data: {
          message: data,
          to: activeUser,
          from: auth.user?.email,
        },
      });
    }
  }

  return (
    <Page title="Home">
      <AddUserDialog
        open={showAddUserDialog}
        onClose={() => setShowAddUserDialog(false)}
      />
      <Stack
        direction="row"
        sx={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            bgcolor: "yellow",
            minHeight: "calc(100vh - 74px )",
            maxWidth: "300px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(2px)",
          }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
            }}
          >
            {auth.user?.friends.map((user) => (
              <CustomListItem
                selected={activeUser === user.email}
                onClick={() => setActiveUser(user.email)}
                name={user.name}
                email={user.email}
              />
            ))}
            <ListItemButton
              onClick={handleAddNewUser}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "rgba(255, 255, 255,0.3)" }}>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  color: "white",
                  "& .MuiListItemText-secondary": {
                    color: "rgba(255, 255, 255, 0.8)",
                  },
                }}
                primary="Add New User"
              />
            </ListItemButton>
          </List>
        </Box>
        <Box
          sx={{
            minHeight: "calc(100vh - 74px)",
            width: "100%",
            position: "relative",
          }}
        >
          <Container
            sx={{
              width: "100%",
              height: "calc(100% - 74px)",
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              padding: 2,
            }}
          >
            {chats.map((chat) => (
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    chat.type === "request" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {chat.message}
                </div>
              </div>
            ))}
          </Container>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "74px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(2px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Container>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <IconButton>
                  <AddIcon />
                </IconButton>
                <OutlinedInput
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleChatMessage(get(e, "target.value", ""));
                    }
                  }}
                  sx={{ color: "white" }}
                  fullWidth
                  placeholder="Type a message"
                />
              </Stack>
            </Container>
          </Box>
        </Box>
      </Stack>
    </Page>
  );
}
