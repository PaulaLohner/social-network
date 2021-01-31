import React, { Component } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // console.log("props: ", props);
    }

    componentDidMount() {
        // console.log("this.props.match.params.id: ", this.props.match.params.id);

        console.log("this.state: ", this.state);

        let id = this.props.match.params.id;

        axios
            .get(`/user/${id}.json`)
            .then(({ data }) => {
                // console.log("data in /user/:id.json: ", data);
                if (data.sameUser) {
                    // console.log("I am the same user!!!");

                    this.props.history.push("/");
                } else {
                    console.log("data inside other profile: ", data);

                    // if (data.imageUrl == null) {
                    //     data.imageUrl = "default.png";
                    // }

                    this.setState(data);
                    // console.log("this.state inside get request: ", this.state);
                }
            })
            .catch((err) => {
                console.log("error in /user/:id.json: ", err);
            });
    }

    render() {
        return (
            <div>
                <div className="profile">
                    <div className="big-profile-picture">
                        <img
                            src={this.state.imageUrl || "default.png"}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                    </div>

                    <h2>
                        {this.state.first} {this.state.last}
                    </h2>
                    <FriendButton id={this.state.id} />
                    <div className="bio-editor">
                        <p>{this.state.bio}</p>
                    </div>
                    <Link to="/users">
                        <p>Go back to find people</p>
                    </Link>
                </div>
            </div>
        );
    }
}

export default OtherProfile;
