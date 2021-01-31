import React, { useState, useEffect } from "react";
import axios from "./axios";
// useState is a hook that will allow us to use state within a function component

export default function SayHello() {
    const [greetee, setGreetee] = useState("Vanilla"); // 'Vanilla' will be the default value for greetee property
    // if I want to have multiple things in my state, I need to call the line above as many times

    const [country, setCountry] = useState(""); // it is nice to set the argument as en ampty string
    // since country will end up being a string

    const [countries, setCountries] = useState([]);

    // useEffect is the hook replacement for componentDidMount and it takes a function as argument
    // by default it runs when the component mounts and every time I update state
    // adding an empty array as the second argument makes it behave exactly like componentDidMount
    // meaning, it runs only when the component mounts and that's it
    // if we pass a variable to this array means useEffect will run:
    // 1. when the component mounts
    // 2. when this variable changes
    useEffect(() => {
        // console.log("country: ", country);
        // if we want to use async and await we need this async iife:
        (async () => {
            const { data } = await axios.get(
                "https://spicedworld.herokuapp.com/?q=" + country
            );
            // console.log("data: ", data);

            setCountries(data); // setCountries is async, so the console.log(countries) runs before setCountries
            // console.log("countries: ", countries);
        })();
    }, [country]);

    const handleChange = (e) => {
        // console.log(e.target.value);
        setGreetee(e.target.value); // setGreetee is async!
    };

    const handleCountryChange = (e) => {
        // console.log(e.target.value);
        setCountry(e.target.value);
    };

    return (
        <div>
            <h1>Hello {greetee}</h1>
            <input onChange={handleChange}></input>
            <input
                onChange={handleCountryChange}
                placeholder="enter a country"
            ></input>
            {countries.map((elem, idx) => {
                return <p key={idx}>{elem}</p>;
            })}
        </div>
    );
} // idx is the index of each item we iterate over

// HOW TO USE A HOOK INSIDE A FUNCTIONAL COMPONENT:

// first import it:
// import { useStatefulFields } from './hooks/useStatefulFields;
// import { useAuthSubmit } from './hooks/useAuthSubmit;

// function Login() {
//     const [values, handleChange] = useStatefulFields();
//     const [error, handleClick] = useAuthSubmit('/login', values);
//     return (
//         <div>
//             { error && <p>something broke :(</p>}
//             <input name="email" onChange={handleChange}></input>
//             <button onClick={handleClick}>submit</button>
//         </div>
//     )
// }
