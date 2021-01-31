import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("renders img with src set to imageUrl prop", () => {
    // this will return the DOM, which in react library is called container
    const { container } = render(<ProfilePic imageUrl="/puppy.jpg" />);

    // getAttribute is a DOM method! not React specific!
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/puppy.jpg"
    );
});

test("renders img with src set to default.png when no url prop is present", () => {
    const { container } = render(<ProfilePic />);

    // because here we're not defining a prop value, we must pass the ACTUAL name of our default picture:
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "default.png"
    );
});

test("renders first and last props in alt attribute", () => {
    const { container } = render(<ProfilePic first="Paula" last="Lohner" />);

    expect(container.querySelector("img").getAttribute("alt")).toBe(
        "Paula Lohner"
    );
});

// we're not testing the toggleModal function itself, but only testing if it's called when img is clicked:
test("toggleModal prop gets called when img is clicked", () => {
    const myMockToggleModal = jest.fn(); // i only pass something to jest.fn if i care about what
    // the original function is passed or what it returns

    const { container } = render(
        <ProfilePic toggleModal={myMockToggleModal} />
    );

    // how to trigger a "click" in the image in test:
    // i repeat this line of code how many times i want to trigger a click! in this case, 2!
    fireEvent.click(container.querySelector("img"));
    fireEvent.click(container.querySelector("img"));
    expect(myMockToggleModal.mock.calls.length).toBe(2);
});
