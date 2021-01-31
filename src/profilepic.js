import React from "react";

// we are passing props as argument to accept the info the parent component is passing down
export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    // ALWAYS console.log props to check if the info is actually being passed down!!
    // console.log("props: ", props);
    // using destructuring with props makes the code easiest to write! otherwise we could pass props as arguments
    // and to access its properties write props.first, props.last etc

    imageUrl = imageUrl || "default.png"; // put this default picture in the public folder
    // let firstLast = first + " " + last;

    return (
        <div className="profile-pic-container">
            <img
                src={imageUrl}
                alt={`${first} ${last}`}
                onClick={toggleModal}
            />
        </div>
    );
}

// {`${first} ${last}`}
