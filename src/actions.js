import React from "react";
import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("data in receiveFriendsWannabes: ", data);

    return {
        type: "FRIENDS_LIST",
        friendsWannabes: data,
    };

    // to do it without async and await:
    // axios.get("/friends-wannabes").then(({data}) => {
    //     return {
    //         type: "FRIENDS_LIST",
    //         friendsWannabes: data,
    //     };
    // });
}

export async function acceptFriendRequest(id) {
    console.log("id: ", id);

    await axios.post(`/accept-friend-request/${id}`);

    return {
        type: "ACCEPT_REQUEST",
        id,
    };
}

export async function unfriend(id) {
    await axios.post(`/end-friendship/${id}`);

    return {
        type: "END_FRIENDSHIP",
        id,
    };
}

export function getMessages(messages) {
    return {
        type: "TEN_LAST_MESSAGES",
        messages,
    };
}

export function sendMessage(message) {
    return {
        type: "SEND_MESSAGE",
        message,
    };
}

// all of our action creator functions will go here
// it is a function that returns objects called actions that have TYPE property inside it

// export function fn() {
//     return {
//         type: "CHANGE_STATE",
//     };
// }
