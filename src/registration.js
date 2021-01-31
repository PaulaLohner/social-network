import React, { Component } from "react";
import axios from "./axios"; // we have now a file called axios.js
import { Link } from "react-router-dom";

class Registration extends Component {
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
            .post("/register", this.state)
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
                <div className="register-page-container">
                    <h3>Please register to start working your social net!</h3>
                    {this.state.error && (
                        <div className="error-message">
                            oops... something went wrong!
                        </div>
                    )}
                    <div className="register-form">
                        <input
                            name="first"
                            placeholder="first"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            name="last"
                            placeholder="last"
                            onChange={(e) => this.handleChange(e)}
                        />
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
                        <button onClick={() => this.submit()}>Register</button>
                    </div>
                    <p>
                        Already have an account? <Link to="/login">Login!</Link>
                    </p>
                </div>
            </>
        );
    }
}

export default Registration;
