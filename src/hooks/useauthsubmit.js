// hooks/useauthsubmit.js
import React, { useState } from "react";
import axios from "./axios";

// we pass path as arguments to make it more dynamic: it can work for multiples routes
// we will call it in the right component and pass it the actual path we want to make the request to
export function useAuthSubmit(path, values) {
    const [error, setError] = useState(false);

    const handleClick = (e) => {
        e.preventDefault;
        axios
            .post(path, values)
            .then(({ data }) => {
                // this if block detects if something went wrong
                if (!data.success) {
                    setError(true);
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    };

    return [error, handleClick];
}

// writing the same function with new syntax:
// const handleClick = async () => {
//     try{
//         const {data} = await axios.post(path, values);
//         if (!data.success) {
//             setError(true);
//         } else {
//             location.replace("/");
//         }
//     } catch (err) {
//         console.log(err);
//         setError(true);
//     }
// }
