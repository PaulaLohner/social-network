import React, { Component } from "react";
import axios from "./axios"; // we have now a file called axios.js
import { Link } from "react-router-dom";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { step: 0 };
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

    getCurrentDisplay() {
        if (this.state.step == 0) {
            return (
                <div className="reset-password">
                    <h3 className="reset">RESET PASSWORD</h3>
                    <h3>
                        Please enter the email address with which you have
                        registered:
                    </h3>
                    {this.state.error && (
                        <div className="error-message">
                            we do not recognize this email, are you sure you
                            have an account?
                        </div>
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.submitEmail()}>Submit</button>
                    <Link to="/login">
                        <p>Go back to login page</p>
                    </Link>
                </div>
            );
        } else if (this.state.step == 1) {
            return (
                <div className="reset-password">
                    <h3 className="reset">RESET PASSWORD</h3>
                    <h3>Please enter the code you received:</h3>
                    {this.state.error && (
                        <div className="error-message">
                            something went wrong! please verify the code we sent
                            you is what you enter here:
                        </div>
                    )}
                    <input
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <h3>Please enter your new password:</h3>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.submitCode()}>Submit</button>
                </div>
            );
        } else {
            return (
                <div className="reset-password">
                    <h3 className="reset">RESET PASSWORD</h3>
                    <h4>SUCCESS!</h4>
                    <p>
                        You can now <Link to="/login">log in</Link> with your
                        new password!
                    </p>
                </div>
            );
        }
    }

    submitEmail() {
        console.log("about to submit email!!!!");

        axios
            .post("/reset-password/email", this.state)
            .then(({ data }) => {
                console.log("data: ", data);
                if (data.success === true) {
                    this.setState({ step: 1 });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in posting email: ", err);
            });
    }

    submitCode() {
        console.log("about to submit code!!!!");

        axios.post("/reset-password/verify", this.state).then(({ data }) => {
            console.log("data: ", data);

            if (data.success === true) {
                this.setState({ step: 2 });
            } else {
                this.setState({ error: true });
            }
        });
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default ResetPassword;
