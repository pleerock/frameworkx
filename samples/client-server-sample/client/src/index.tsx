import React from "react"
import ReactDOM from "react-dom"
import { App } from "./component/App"
import * as serviceWorker from "./serviceWorker"
import {app} from "@microframework/client-server-sample-common";
import {defaultReactClient} from "@microframework/core";

app.setClient(defaultReactClient({
  serverUrl: "http://localhost:3000/graphql",
}))

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()