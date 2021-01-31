import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    const actualFriends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted == true)
    );

    const wannabeFriends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted == false)
    );

    return (
        <div className="friends-list-container">
            <h3>Friends</h3>
            <div className="friends-list-small-container">
                {actualFriends &&
                    actualFriends.map((user) => (
                        <div key={user.id} className="friends-list">
                            <Link to={`/user/${user.id}`}>
                                <img src={user.imageUrl || "default.png"} />
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                            <button onClick={() => dispatch(unfriend(user.id))}>
                                End Friendship
                            </button>
                        </div>
                    ))}
            </div>

            <h3>Friend Requests</h3>
            <div className="friends-list-small-container">
                {wannabeFriends &&
                    wannabeFriends.map((user) => (
                        <div key={user.id} className="friends-list">
                            <Link to={`/user/${user.id}`}>
                                <img src={user.imageUrl || "default.png"} />
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendRequest(user.id))
                                }
                            >
                                Accept Friend Request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
