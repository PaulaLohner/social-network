import React from "react"; // every single component we write need to have react imported
import Name from "./Name";

// how to make HelloWorld as a class component:
export default class HelloWorld extends React.Component {
    constructor() {
        super();
        // how to create the state:
        // we can leave it empty at first and add stuff later or already add stuff:
        this.state = {
            first: "Paula",
        };
    }

    // React equivalent of the mounted life cycle method in VueJs:
    componentDidMount() {
        // how to update the state object:
        this.setState(
            {
                first: "Vanilla",
            },
            () => console.log("this.state: ", this.state)
        ); // passing it as callback function makes sure the console.log happens
        // only after component finishes mounting
    }

    // when we write our own methods, "this" loses its meaning and becomes undefined
    // we get the error: "cannot read property setState of undefined"
    // solution number 1: onClick = { () => this.handleClick()}
    // solution number 2: in constructor: this.handleClick = this.handleCLick.bind(this)

    handleClick() {
        // console.log("handleClick is running!");

        this.setState({
            first: "Ziggy",
        });
    } // we can call the function whatever we want

    render() {
        return (
            <div className="container">
                <h1>Hi, {this.state.first}</h1>
                <p onClick={() => this.handleClick()}>I am a p tag!</p>
                <Name first={this.state.first} />
            </div>
        ); // we can only return one element, but inside this one element we can return as many things we want
    }
}
// the reason we would want prefer class over function is that class components can have STATE
// STATE is just the React equivalent for DATA  in VueJs
// class components aren't hoisted, so we have to put ReactDOM.render below the component
// if writing the component in the same file as ReactDOM.render()

// HelloWorld as a function component:
// function HelloWorld() {
//     return (
//         // this div looks like HTML but it's actualy JS, or JSX.
//         // JSX is basically JS that looks like HTML
//         <div>Hello, World!</div>
//     );
// }
