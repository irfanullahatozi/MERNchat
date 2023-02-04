import { TextField, Button, Box, Container, Typography,OutlinedInput,InputLabel,InputAdornment,IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SendIcon from '@mui/icons-material/Send';


function App() {
  const [socket, setSocket] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("server-message", (data) => {
      setChat((chat) => [...chat, data.message]);
    });
  }, [socket]);

  const handleForm = (e) => {
    e.preventDefault();
    socket.emit("send-message", { message });
    setMessage("");
  };

  return (
    <div>
      <Container>
        <Box sx={{ marginBottom: 5 }}>
          {chat.map((message) => (
            <Typography key={message}>{message}</Typography>
          ))}
        </Box>
        <Box component="form" onSubmit={handleForm}>
          <TextField
            label="Write your message"
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <InputLabel htmlFor="message">
            Message
          </InputLabel>
          <OutlinedInput
            id="message"
            type="text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  // onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  <SendIcon/>
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

          <Button variant="contained" type="submit">
            Send
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default App;
