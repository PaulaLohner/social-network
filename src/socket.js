import * as io from "socket.io-client";
import { getMessages, sendMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (messages) =>
            store.dispatch(getMessages(messages))
        );

        socket.on("addChatMsg", (message) => {
            console.log(`Got a message in the client, I'm about to start
            the whole Redux process by dispatching here. My message is ${message}`);
            store.dispatch(sendMessage(message));
        });

        // socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        // socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
