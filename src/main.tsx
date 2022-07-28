import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { usersSlice } from "./features/users/usersSlice";
import { postsSlice } from "./features/posts/postsSlice";

store.dispatch(usersSlice.endpoints.getUsers.initiate());
store.dispatch(postsSlice.endpoints.getPosts.initiate());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
