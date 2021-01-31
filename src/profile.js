import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    id,
    first,
    last,
    imageUrl,
    toggleModal,
    bio,
    changeBio,
}) {
    return (
        <div className="profile">
            <div className="big-profile-picture">
                <ProfilePic imageUrl={imageUrl} toggleModal={toggleModal} />
            </div>
            <h2>
                {first} {last}
            </h2>
            <BioEditor id={id} bio={bio} changeBio={changeBio} />
        </div>
    );
}
