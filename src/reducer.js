export default function reducer(state = {}, action) {
    if (action.type == "FRIENDS_LIST") {
        return (state = { ...state, friendsWannabes: action.friendsWannabes });
    }

    if (action.type == "ACCEPT_REQUEST") {
        return (state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (friend.id != action.id) {
                    return friend;
                } else {
                    friend["accepted"] = true;
                    return friend;
                }
            }),
        });
    }

    if (action.type == "END_FRIENDSHIP") {
        return (state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friend) => friend.id != action.id
            ),
        });
    }

    if (action.type == "TEN_LAST_MESSAGES") {
        return (state = {
            ...state,
            messages: action.messages,
        });
    }

    if (action.type == "SEND_MESSAGE") {
        return (state = {
            ...state,
            messages: [...state.messages, action.message],
        });
    }

    return state;
}

// src/reducer.js
// reducer is the actual function that makes the change to redux

// export default function reducer(state = {}, action) {
//     return state;
// }

// ... (spread operator) - useful for making clones of objects and arrays
// we can add new properties/elements to these cloned objects and arrays
// var obj = {
//     name: "paula",
// };

// var newObj = {
//     ...obj, // this is creating a clone of obj
//     last: "lohner", // after cloning obj, we can simply add new properties to it like - last: 'lohner'
// };

// var arr = [10, 20, 30];
// var newArr = [0, ...arr, 40]; //same thing but for cloning arrays
// and we can also add elements before ...arr
// if we want to add something to the middle, we need to use splice (or slice)

// useful array methods:

// map - useful for cloning an array; changing each element in array; finding one specific
// element(s) in an array and changing just that specific thing(s).
// map is a loop that by default returns a brand new array

// filter - useful for removing things from an array
// is also a loop that by default returns a brand new array

// concat - useful for merging 2 arrays together
// not a loop but still does by default return a new array
// we can also merge 2 arrays together using the spread operator
