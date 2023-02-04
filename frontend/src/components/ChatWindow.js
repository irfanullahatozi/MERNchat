import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Card,
} from "@mui/material";
import { io } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";

const ChatWindow = () => {
  const [socket, setSocket] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => setSocket(io("http://localhost:5000")), []);

  useEffect(() => {
    if (!socket) return;
    socket.on("server-message", (data) =>
      setChat((chat) => [...chat, { message: data.message, recived: true }])
    );
    socket.on("typing-started-from-server", () => setTyping(true));

    socket.on("typing-stoped-from-server", () => setTyping(false));
  }, [socket]);

  const handleForm = (e) => {
    e.preventDefault();
    socket.emit("send-message", { message });
    setChat((chat) => [...chat, { message, recived: false }]);
    setMessage("");
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    socket.emit("typing-started");
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("typing-stoped");
      }, 2000)
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ padding: 2, marginTop: 10, width: "60%" }}>
        <Box sx={{ marginBottom: 5 }}>
          {chat.map((data) => (
            <Typography
              key={data.message}
              sx={{ textAlign: data.recived ? "left" : "right" }}
            >
              {data.message}
            </Typography>
          ))}
        </Box>
        <Box component="form" onSubmit={handleForm}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <InputLabel htmlFor="message">Message</InputLabel>
            {typing && <InputLabel>Typing....</InputLabel>}
          </Box>
          <OutlinedInput
            sx={{ width: "100%" }}
            id="message"
            type="text"
            placeholder="Enter your message"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  type="submit"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            value={message}
            onChange={handleInput}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ChatWindow;
