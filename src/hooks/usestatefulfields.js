// hooks/usestatefulfields.js

import React, { useState } from "react";

// every hooks must start with the word use:
export function useStatefulFields() {
    const [values, setValues] = useState({}); // its nice to set the initial value as the kind of data it will be

    const handleChange = (e) => {
        // setValues deletes the previous state and replaces it with the new state
        // to preserve the old state we have to copy the old one into the new one:
        setValues({
            ...values, // this is the syntax to copy it into the new state using the SPREAD OPERATOR
            [e.target.name]: e.target.value,
        });
    };

    return [values, handleChange]; // we need to either put the items we want to return inside an array or object
}

// SPREAD OPERATOR is ES6 sxntax!
// it takes the content of one object and copy that into a new object

// var obj = {
//     name: "Paula",
// };

// var newObj = {
//     ...obj,
//     lastName: "Lohner",
// };

// console.log(newObj); // should return all the properties form obj AND newObj
