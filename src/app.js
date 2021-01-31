import React, { Component } from "react";
import axios from "axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // first: "Paula",
            // last: "Lohner",
            uploaderIsVisible: false,
        };
        // console.log("props in app.js: ", props);
    }

    componentDidMount() {
        console.log("App mounted!");
        // here is where we want to make an axios request to 'get' info about logged user
        // (first name, last name and profile pic url)
        // an axios route '/user' is a good path for it
        // when we have the info from the server, add it to the state of the component (this.setState)
        // we will create 2 components that will live inside App

        axios.get("/user").then(({ data }) => {
            console.log("response from axios.get /user: ", data);

            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                imageUrl: data.imageUrl,
                bio: data.bio,
            });

            // console.log("this.state: ", this.state);
        });
    }

    toggleModal() {
        // console.log("toggleModal function is running");

        this.setState({
            // !this.state.uploaderIsVisible basically means: do the opposite of what uploaderIsVisible
            // is at the moment, truthy or falsy
            // writting it this way gives us one function (toggleModal) to both open and close the modal
            // making the code cleaner
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        // console.log("I am running in app!!!!");
        // console.log("argument I passed to methodInApp: ", arg);

        this.setState({ imageUrl: arg });
        this.toggleModal();
    }

    changeBio(arg) {
        this.setState({ bio: arg });
    }

    render() {
        if (!this.state.id) {
            return null;
        }

        return (
            <div>
                <BrowserRouter>
                    <div className="header">
                        <Link to="/">
                            <Logo />
                        </Link>
                        <p>
                            <Link to="/users">Find People</Link>
                        </p>
                        <p>
                            <Link to="/friends">Friends</Link>
                        </p>
                        <p>
                            <Link to="/chat">Chat</Link>
                        </p>
                        <p>
                            <a href="/logout">Logout</a>
                        </p>
                        <ProfilePic
                            // this is how we pass the state info down to the children:
                            id={this.state.id}
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            toggleModal={() => this.toggleModal()}
                        />
                    </div>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            // passing down a function to Uploader
                            methodInApp={(arg) => this.methodInApp(arg)}
                            toggleModal={() => this.toggleModal()}
                            imageUrl={this.state.imageUrl}
                        />
                    )}
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    toggleModal={() => this.toggleModal()}
                                    bio={this.state.bio}
                                    changeBio={(arg) => this.changeBio(arg)}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/users"
                            render={() => (
                                <FindPeople
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;

// create a bio column in the users table!!

// app.get('/user', async function(req, res) {
//     const user = await decodeBase64.getUser();
//     res.json(user);
// });

// class App extends React.Component {
//     async componentDidMount() {
//         const {data} = await axios.get('/user');

//         this.setState(data);
//     }
// }

// HOW MAP() WORKS:
// var arr = [10, 20, 30];
// arr.map((elem) => {
// WHATEVER CODE WE WRITE HERE WILL EXECUTE WITH EACH ELEMENT OF THE ARRAY
//     console.log(elem);

// });

// MAP is basically a loop and returns a NEW array, doesn't change the original one!
// we can pass up to 3 arguments to map: the first is the item we are iterating over,
// the second one is its index, the third one is the actual array we are looping over (the original one)

// var arr = [10, 20, 30];
// var newArr = arr.map((elem) => {
//     return elem * 2;
// });
// console.log(newArr);
