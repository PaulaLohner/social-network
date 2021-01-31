import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket";

// REDUX BOILER PLATE//
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux"; // is an actual component we get from redux
// it renders the provider component and everything inside it will have access to redux
import reduxPromise from "redux-promise"; // a middleware for redux that makes redux promised based
import { composeWithDevTools } from "redux-devtools-extension"; // this it allow us to use the devtools extension for redux
import reducer from "./reducer"; // this is the reducer file we created

// here we create our store (a really big object where the state lives - read more about it!)
// it takes 2 arguments: reducer and some sort of customization for redux (our middlewares for example)
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
// REDUX BOILER PLATE//

let elem;
const userIsLoggedIn = location.pathname != "/welcome";
// console.log(location.pathname);
// console.log(userIsLoggedIn);

if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    init(store); // we only want logged in users to have access to store
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
