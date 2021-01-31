import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.messages);
    console.log("here are my last 10 chat messages: ", chatMessages);
    const message = useSelector((state) => state && state.message);

    const keyCheck = (e) => {
        // console.log("value: ", e.target.value);
        // console.log("key pressed: ", e.key);

        if (e.key == "Enter") {
            e.preventDefault(); // this prevents the cursor form going to the next line when enter is pressed
            // console.log("our message: ", e.target.value);
            socket.emit("Sending a new message", e.target.value);
            e.target.value = "";
        }
    };

    useEffect(() => {
        console.log("chat hooks component has mounted");
        // console.log("elementRef: ", elemRef);
        // console.log("scroll Top: ", elemRef.current.scrollTop);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        // console.log("scrollHeight: ", elemRef.current.scrollHeight);

        // scrollTop = scrollHeight - clientHeight - that's how much I want my container to scroll from the top
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;

        // modify this function to run every single time we get a new chat message
    }, [chatMessages]);

    return (
        <div className="chat">
            <h2>Welcome to chat! :)</h2>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((user) => (
                        <div key={user.id} className="chat-messages">
                            <div className="chat-user">
                                <img src={user.imageUrl || "default.png"} />
                            </div>
                            <div className="message">
                                <p>
                                    {user.first} {user.last} on{" "}
                                    {user.created_at}
                                </p>
                                <h4>{user.message}</h4>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="Add your message here and press enter to send it!"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
