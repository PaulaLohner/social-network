import React, { Component } from "react";
import axios from "./axios";

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log(("props in Uploader: ", props));
    }

    componentDidMount() {
        console.log("Uploader mounted!!!");
        console.log("this.props: ", this.props);
    }

    handleChange(e) {
        // console.log("e.target.value: ", e.target.value);
        // console.log("e.target.name: ", e.target.name);

        let file = e.target.files[0];

        this.setState(
            {
                image: file,
            },
            () => console.log("this.state: ", this.state)
        );

        let formData = new FormData();
        formData.append("image", file);

        axios
            .post("/user/upload-picture", formData)
            .then(({ data }) => {
                console.log("data in axios.post /user/upload-picture: ", data);

                this.props.methodInApp(data);
            })
            .catch((err) => {
                console.log("error in axios.post /user/upload-picture: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleClick() {
        document.getElementById("hiddenFileInput").click();
    }

    render() {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h3 className="upload-title">
                        UPLOAD A NEW PROFILE PICTURE!
                    </h3>
                    {this.state.error && (
                        <div className="error-message">
                            Image size must be 2MB max!
                        </div>
                    )}
                    <button onClick={() => this.handleClick()}>
                        <img id="upload-icon" src="/upload-icon.png"></img>
                    </button>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                        id="hiddenFileInput"
                        style={{ display: "none" }}
                    />
                    <p onClick={this.props.toggleModal} className="close-modal">
                        X
                    </p>
                </div>
            </div>
        );
    }
}

export default Uploader;

// we MUST use FormData when handling files!
