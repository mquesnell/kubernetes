import { Button, TextField, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import { get } from "./RequestHelper";

function App() {
  const [currentTime, setCurrentTime] = useState<string>();
  const [backendURL, setBackendURL] = useState<string>("http://127.0.0.1:8080");

  const getTime = async (): Promise<string> => {
    const response: AxiosResponse<any> = await get(backendURL, "time");
    return response.data;
  };

  function handleClick() {
    getTime()
      .then((time) => {
        setCurrentTime(time + " from " + backendURL);
      })
      .catch((err) => {
        alert(
          "something went wrong getting the time from " +
            backendURL +
            ":  " +
            err
        );
      });
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>I'm running in a Kubernetes cluster!</p>

          <Button
            variant="contained"
            onClick={handleClick}
            style={{ margin: "20px" }}
          >
            Click me for a big surprise!
          </Button>
          <div>
            <Typography>Enter the backend URL:</Typography>
            <TextField
              style={{ background: "white" }}
              variant="outlined"
              value={backendURL}
              onChange={(event) => setBackendURL(event.target.value)}
            />
          </div>
          <div>
            <Typography style={{ marginTop: "20px", height: "30px" }}>
              The current time is: {currentTime}
            </Typography>
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
