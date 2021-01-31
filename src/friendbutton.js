import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("");
    // console.log("id from other profile: ", id);

    useEffect(() => {
        axios
            .get(`/friendship-status/${id}`)
            .then(({ data }) => {
                // console.log("data in get /friendship-status: ", data);

                if (data.rows.length == 0) {
                    setButtonText("Make Friend Request");
                } else if (data.rows[0].accepted == true) {
                    setButtonText("End Friendship");
                } else if (data.rows[0].sender_id == id) {
                    setButtonText("Accept Friend Request");
                } else if (data.rows[0].receiver_id == id) {
                    setButtonText("Cancel Friend Request");
                }
            })
            .catch((err) => {
                console.log("error in get /friendship-status: ", err);
            });
    }, [id]);

    const handleClick = () => {
        if (buttonText == "Make Friend Request") {
            axios
                .post(`/make-friend-request/${id}`)
                .then(({ data }) => {
                    console.log("data in post /make-friend-request/: ", data);

                    setButtonText("Cancel Friend Request");
                })
                .catch((err) => {
                    console.log(
                        "error in post /change-friendship-status/: ",
                        err
                    );
                });
        } else if (buttonText == "Accept Friend Request") {
            axios
                .post(`/accept-friend-request/${id}`)
                .then(({ data }) => {
                    console.log("data in post /accept-friend-request/: ", data);

                    setButtonText("End Friendship");
                })
                .catch((err) => {
                    console.log("error in /accept-friend-request/: ", err);
                });
        } else if (buttonText == "End Friendship") {
            axios
                .post(`/end-friendship/${id}`)
                .then(({ data }) => {
                    console.log("data in post /end-friendship/: ", data);
                    setButtonText("Make Friend Request");
                })
                .catch((err) => {
                    console.log("error in post /end-friendship/: ", err);
                });
        } else if (buttonText == "Cancel Friend Request") {
            axios
                .post(`/end-friendship/${id}`)
                .then(({ data }) => {
                    console.log("data in post /end-friendship/: ", data);
                    setButtonText("Make Friend Request");
                })
                .catch((err) => {
                    console.log("error in post /end-friendship/: ", err);
                });
        }
    };

    return <button onClick={handleClick}>{buttonText}</button>;
}
