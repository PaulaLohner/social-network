import React from "react";

// class component:
export default class Name extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log("this.props: ", this.props);
        return <p>Welcome! {this.props.first}</p>;
    }
}

// function component:
// export default function Name(props) {
//     // console.log("props: ", props);

//     // we cannot change the value of a prop
//     return <p>Welcome! {props.first}</p>;
// }

// both behave exactly the same way!
