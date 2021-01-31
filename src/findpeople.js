import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [found, setFound] = useState();

    useEffect(() => {
        axios
            .get("/users.json")
            .then(({ data }) => {
                setUsers(data);
                console.log("data in /users: ", data);
            })
            .catch((err) => {
                console.log("error in /users: ", err);
            });
    }, []);

    const handleChange = (e) => {
        console.log("e.target.value: ", e.target.value);

        if (e.target.value) {
            setFound(true);

            let find = e.target.value;
            axios
                .get(`/users/${find}.json`)
                .then(({ data }) => {
                    console.log("data in users/find.json: ", data);
                    setUsers(data);
                })
                .catch((err) => console.log("error in /users/:find: ", err));
        } else {
            setFound(false);
            axios
                .get("/users.json")
                .then(({ data }) => {
                    setUsers(data);
                    console.log("data in /users: ", data);
                })
                .catch((err) => {
                    console.log("error in /users: ", err);
                }); // is there a better way of doing it? ask instructors tomorrow
        }
    };

    return (
        <div className="find-people">
            <h1>FIND PEOPLE</h1>
            <h3>Are you looking for someone in particular?</h3>
            <input onChange={handleChange} placeholder="type user name here" />

            <div className="friends-list-container">
                {!found && <h3>Check out who just joined!</h3>}
                <div className="friends-list-small-container">
                    {users.map((user) => (
                        <div key={user.id} className="found-users">
                            <Link to={`/user/${user.id}`}>
                                <img src={user.imageUrl || "default.png"} />
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
