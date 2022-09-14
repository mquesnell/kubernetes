import { Button, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import { get } from "./RequestHelper";

function App() {
  const [currentTime, setCurrentTime] = useState<string>();

  const getTime = async (): Promise<string> => {
    const response: AxiosResponse<any> = await get("time");
    return response.data;
  };

  function handleClick() {
    getTime()
      .then((time) => {
        setCurrentTime(time);
      })
      .catch((err) => {
        alert("something went wrong:  " + err);
      });
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>I'm running in a Kubernetes cluster!</p>

          <Button variant="contained" onClick={handleClick}>
            Click me for a big surprise!
          </Button>
          <div>
            <Typography>The current time is: {currentTime}</Typography>
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
