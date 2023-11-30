import Page from "components/Page";
import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ListItemButton from "@mui/material/ListItemButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "redux/hooks";
import get from "lodash/get";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { v4 as uuid } from "uuid";
import moment from "moment";

//images
import bgImg from "assets/background.jpg";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "services/firebase";
import { scrollToBottom, scrollToTop } from "utils/functions/helper";

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
  const [showScrollTop, setshowScrollTop] = React.useState(false);
  const [showScrollBottom, setshowScrollBottom] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState("");
  const { ws, auth } = useAppSelector((state) => ({
    ws: state.ws.ws,
    auth: state.auth,
  }));
  const [chats, setChats] = React.useState<any[]>([]);
  const [activeUser, setActiveUser] = React.useState("");

  const handleActiveUser = async (email: string) => {
    setActiveUser(email);
    const query1 = query(
      collection(db, "chats"),
      where("from", "==", email),
      where("to", "==", auth.user?.email)
    );

    const query2 = query(
      collection(db, "chats"),
      where("from", "==", auth.user?.email),
      where("to", "==", email)
    );

    // Fetch data for both queries
    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(query1),
      getDocs(query2),
    ]);
    const result = [...querySnapshot1.docs, ...querySnapshot2.docs].map((doc) =>
      doc.data()
    );
    setChats(
      result.sort(
        (a, b) =>
          (new Date(a.timestamp) as any) - (new Date(b.timestamp) as any)
      )
    );
    scrollToBottom("chat-container");
  };

  React.useEffect(() => {
    if (ws) {
      const handleMessage = (data: any) => {
        console.log({ data });
        setChats((prev) => [...prev, data]);
        scrollToBottom("chat-container");
      };
      ws.on(`response`, handleMessage);

      return () => {
        ws.off(`response`, handleMessage);
      };
    }
  }, [ws]);

  async function handleChatMessage(data: any) {
    if (ws) {
      const msgObj = {
        id: uuid(),
        type: "text",
        from: auth.user?.email,
        to: activeUser,
        message: data,
        timestamp: new Date().toISOString(),
      };
      setChatMessage("");
      ws.emit("msg", msgObj);
      setChats((prev) => [...prev, msgObj]);
      await setDoc(doc(db, "chats", msgObj.id), msgObj);
      scrollToBottom("chat-container");
    }
  }

  React.useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer?.addEventListener("scroll", (e) => {
      const { scrollTop } = chatContainer;
      if (scrollTop > 100) {
        setshowScrollTop(true);
        setshowScrollBottom(false);
      } else {
        setshowScrollTop(false);
        setshowScrollBottom(true);
      }
    });
    return () => {
      chatContainer?.removeEventListener("scroll", (e) => {
        // setScrollTop(chatContainer.scrollTop);
      });
    };
  }, []);

  return (
    <Page title="Home">
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
            {auth.users.map((user) => (
              <CustomListItem
                key={`${user.email}`}
                selected={activeUser === user.email}
                onClick={() => handleActiveUser(`${user.email}`)}
                name={`${user.displayName}`}
                email={`${user.email}`}
              />
            ))}
          </List>
        </Box>
        <Box
          sx={{
            minHeight: "calc(100vh - 74px)",
            width: "100%",
            position: "relative",
          }}
        >
          {activeUser ? (
            <>
              <Box
                id="chat-container"
                sx={{
                  width: "100%",
                  maxHeight: "calc(100vh - 150px)",
                  overflowY: "auto",
                }}
              >
                {showScrollTop && (
                  <Tooltip title="Scroll to top" arrow>
                    <Fab
                      onClick={() => scrollToTop("chat-container")}
                      color="primary"
                      size="small"
                      aria-label="add"
                      sx={{
                        position: "fixed",
                        bottom: 100,
                        right: 20,
                        borderRadius: "8px",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        color: "black",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    >
                      <ArrowUpwardIcon />
                    </Fab>
                  </Tooltip>
                )}
                {showScrollBottom && (
                  <Tooltip title="Scroll to Bottom" arrow>
                    <Fab
                      onClick={() => scrollToBottom("chat-container", 0)}
                      color="primary"
                      size="small"
                      aria-label="add"
                      sx={{
                        position: "fixed",
                        bottom: 100,
                        right: 20,
                        borderRadius: "8px",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        color: "black",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    >
                      <ArrowDownwardIcon />
                    </Fab>
                  </Tooltip>
                )}
                <Container
                  sx={{
                    width: "100%",
                    height: "calc(100% - 74px)",
                    maxHeight: "calc(100% - 74px)",
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    padding: 2,
                  }}
                >
                  {chats.map((chat) => {
                    const email = auth.user?.email;
                    return (
                      <div
                        key={chat.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            chat.from !== email ? "flex-end" : "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius:
                              chat.from !== email
                                ? "15px 0px 15px 15px"
                                : "0px 15px 15px 15px",
                            background:
                              chat.from !== email
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(255,255,255,1)",
                            position: "relative",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {chat.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, color: "rgba(0,0,0,0.6)" }}
                          >
                            {moment(chat.timestamp).format("hh:mm A")}
                          </Typography>
                        </Box>
                      </div>
                    );
                  })}
                </Container>
              </Box>
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
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography variant="h5" color="white">
                Select a user to start chat
              </Typography>
            </div>
          )}
        </Box>
      </Stack>
    </Page>
  );
}
