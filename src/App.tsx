import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import ThemeProvider from "theme";
import { BrowserRouter } from "react-router-dom";
import Routes from "routes/Routes";
import store from "redux/store";
import WebsocketProvider from "hoc/WebsocketProvider";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <WebsocketProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </ThemeProvider>
        </WebsocketProvider>
      </Provider>
    </div>
  );
}

export default App;
