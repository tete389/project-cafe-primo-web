import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RoutesPages from "./routes/RoutesPages.jsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./App.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <RoutesPages />
    </Provider>
  </>
);
