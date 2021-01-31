import React, { Component } from "react";
import axios from "./axios"; // we have now a file called axios.js
import { Link } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        // console.log("e.target.value: ", e.target.value);
        // console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    submit() {
        console.log("about to submit!!!!");

        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log("data: ", data);
                if (data.success === true) {
                    // log the user into our app
                    location.replace("/"); // location.replace changes the url
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("error in post register: ", err));
    }

    render() {
        return (
            <>
                <div className="login-page-container">
                    <h3>Please login to use this amazing social network</h3>
                    {this.state.error && (
                        <div className="error-message">
                            oops... something went wrong!
                        </div>
                    )}
                    <div className="login-form">
                        <input
                            name="email"
                            placeholder="email"
                            type="email"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            name="password"
                            placeholder="password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.submit()}>Login</button>
                    </div>
                    <p>
                        Don't have an account yet? Click{" "}
                        <Link to="/">here</Link> to register!
                    </p>
                    <p>
                        <Link to="/reset-password" className="reset-link">
                            Forgot your password?
                        </Link>
                    </p>
                </div>
            </>
        );
    }
}

export default Login;
