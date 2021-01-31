import React, { Component } from "react";
import axios from "./axios";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    updateBio() {
        // console.log("save bio was clicked!!");

        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                console.log("data in axios.post /update-bio: ", data);

                this.props.changeBio(data);
                this.toggleEditor();
            })
            .catch((err) => {
                console.log("error in axios.post /update-bio: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    toggleEditor() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    getCurrentDisplay() {
        if (this.state.editing) {
            return (
                <div className="bio-editor">
                    {this.state.error && (
                        <div className="error-message">
                            oops! something went wrong!
                        </div>
                    )}
                    <textarea
                        name="textarea"
                        rows="7"
                        cols="30"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                    ></textarea>
                    <button onClick={() => this.updateBio()}>SAVE BIO</button>
                </div>
            );
        } else if (!this.props.bio) {
            return (
                <div className="bio-editor">
                    <h3 onClick={() => this.toggleEditor()}>
                        Click to add a bio to your profile :)
                    </h3>
                </div>
            );
        } else {
            return (
                <div className="bio-editor">
                    <p>{this.props.bio}</p>
                    <h3 onClick={() => this.toggleEditor()}>Edit bio :)</h3>
                </div>
            );
        }
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default BioEditor;

// the info contained in bio needs to live in the app state
// bio editor needs a text area and a function to handle change inside it and update its state and pass it along to app!
// it needs to know wheater the bio is being added or edited and render different displays according to it
// make a axios post request to UPDATE the bio column in users table
// the function to send the new bio to app needs to be created in app and in here, like when updating profile pic
// refer to the logic of asking if uploader is visible in app or not! need a flag to know wheater it's n editing mode or not
// needs to be a class component
// profile component is basically a middle man
// we can pass also components as props

// the diff between profile and other profile is that in otherpforile there's a need for a get request to get the user's info
// while in profile this info is just passed down by app
// to make this component appear we're gonna BROWSER ROUTING
// use the LINK component with it
// to figure out which user, get the id of the user!
// this would happen in app:

// import { BrowserRouter, Route, Link } from "react-router-dom";
// import OtherProfile from "./otherpforile";

// this comes after the other components (?)
{
    /* <BrowserRouter>
    <div>
        <Route path="/" render={() => ( insert Profile component with all the props )}></Route>
        <Route component={OtherProfile} path="/user/:id"></Route>
        <Link to="user/5"></Link>
    </div>
</BrowserRouter>; */
}

// otherProfile receives a very important prop called match that will have a key of params with value of id
// it needs to be a class component because of lifecycle method componentdidmount

// const id = this.props.match.params.id; // match is a prop from React (?)
// const { data } = await Axios.get(`/api/user/${id}.json`); // this route cannot match the route in express (?)

// if (data.isSelf) {
//     // redirect
//     this.props.history.push('/'); // ler sobre!
// } else {
//     this.setState(data);
// }
