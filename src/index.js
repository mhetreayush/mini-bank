import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserDetailsContextProvider } from "./Context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const persistor = persistStore(store);

root.render(
  // <React.StrictMode>
  <UserDetailsContextProvider>
    <App />
  </UserDetailsContextProvider>
  // </React.StrictMode>
);
