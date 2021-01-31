import React from "react";
import App from "./app";
import { render, waitForElement } from "@testing-library/react";
import axios from "axios";

// to mock axios:
jest.mock("axios");

test("App shows nothing at first, and then renders a div after axios has finished", async () => {
    // mock the response data we get back from axios:
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "paula",
            last: "lohner",
            imageUrl: "/puppy.jpg",
        },
    });

    const { container } = render(<App />);
    // console.log(container.children); // .children is a DOM property! it tells me if my container has children...

    // tell our test to wait for the async stuff to finish:
    // it waits for the div to appear in the DOM!
    // waitForElement is promise based so we can use await and async
    await waitForElement(() => container.querySelector("div"));

    // make sure the container now has a child, which means the div finally was rendered:
    expect(container.children.length).toBe(1); // 1 because each component only renders one component
});
