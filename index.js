const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path"); // core module that helps with handling files by making path manipulation easier

app.use(express.static("./public"));

app.use(compression());

app.use(express.json());

//////// COOKIE SESSION //////
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
}); // this setup gives socket access to the cookie session object we are creating (userId)
//////// COOKIE SESSION //////

// always call csurf after cookieSession!!
app.use(csurf());

app.use(function (req, res, next) {
    // the first argument is the name we want to give the token and the second argument generates it
    res.cookie("myToken", req.csrfToken());
    next();
});

const secretCode = cryptoRandomString({
    length: 6,
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`)); // npm build
}

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);

    let { first, last, email, password } = req.body;

    hash(password)
        .then((hashedPw) => {
            password = hashedPw;

            db.registerUser(first, last, email, password)
                .then((response) => {
                    // console.log("response in registerUser query: ", response);

                    req.session.userId = response.rows[0].id;
                    // console.log("req.session.userId: ", req.session.userId);

                    // res.redirect("/");
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in registerUser query: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in hash: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    // console.log("req.body in post /login: ", req.body);

    let { email, password } = req.body;

    db.getUserInfo(email)
        .then((response) => {
            // console.log("response in getUserInfo query: ", response);

            let dbPassword = response.rows[0].password;
            // console.log("dbPassword: ", dbPassword);

            compare(password, dbPassword).then((match) => {
                // console.log("match from compare: ", match);

                if (match === true) {
                    req.session.userId = response.rows[0].id;
                    res.json({ success: true });
                }
            });
        })
        .catch((err) => {
            console.log("error in post /login: ", err);
            res.json({ success: false });
        });
});

app.post("/reset-password/email", (req, res) => {
    let { email } = req.body;
    // console.log("email: ", email);

    db.getUserInfo(email)
        .then((response) => {
            // console.log("response from post /reset-password/email: ", response);

            let dbEmail = response.rows[0].email;
            // console.log("dbEmail: ", dbEmail);

            if (dbEmail == email) {
                // console.log("we're the same!");

                let code = secretCode;

                db.insertCode(email, code)
                    .then(() => {
                        sendEmail(
                            email,
                            `This is your reset code: ${code}`,
                            "Your reset password code"
                        );

                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in insert code query: ", err);
                    });
            } else {
                res.json({ sucess: false });
            }
        })
        .catch((err) => {
            console.log("error in post reset-password/email: ", err);
            res.json({ success: false });
        });
});

app.post("/reset-password/verify", (req, res) => {
    // console.log("req.body in post /reset-password/verify: ", req.body);

    let { email, code, password } = req.body;

    db.verifyCode(email)
        .then((response) => {
            // console.log("response in verifyCode query: ", response);

            if (code == response.rows[0].code) {
                hash(password).then((hashedPw) => {
                    password = hashedPw;

                    db.resetPassword(email, password)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("error in resetPassword query: ", err);
                            res.json({ success: false });
                        });
                });
            }
        })
        .catch((err) => {
            console.log("error in verifyCode query: ", err);
            res.json({ success: false });
        });
});

// uploader triggers our multer boilerplate that handles that files are being stored in our harddisk,
// to be precise, in our uploads folder
// single is a method that uploader gives us
// and 'file' comes from the property we have set on our formData
app.post(
    "/user/upload-picture",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        // console.log("req.file in post /user/upload-picture: ", req.file);

        let imageUrl =
            "https://s3.amazonaws.com/vanilla-imageboard/" + req.file.filename;

        db.updateProfilePicture(imageUrl, req.session.userId)
            .then(() => {
                res.json(imageUrl);
            })
            .catch((err) => {
                console.log("error in updateProfilePicture query: ", err);
                res.json({ sucess: false });
            });
    }
);

app.post("/update-bio", (req, res) => {
    // console.log("req.body in post /update bio: ", req.body);

    let bio = req.body.textarea;

    db.updateBio(bio, req.session.userId)
        .then(() => {
            // console.log("bio: ", bio);

            res.json(bio);
        })
        .catch((err) => {
            console.log("error in updateBio query: ", err);
            res.json({ sucess: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", (req, res) => {
    // console.log("req.session.userId in app.get/user: ", req.session.userId);

    let id = req.session.userId;

    db.getUserId(id)
        .then((response) => {
            // console.log("response from loggedUserInfo query: ", response);

            res.json(response.rows[0]);
        })
        .catch((err) => {
            console.log("error in getUserId query: ", err);
        });
});

app.get("/user/:id.json", (req, res) => {
    // console.log("req.body /user/:id.json: ", req.body);
    // console.log("req.params /user/:id.json: ", req.params);
    // console.log("req.session.userId in /user/:id.json: ", req.session.userId);

    if (req.session.userId == req.params.id) {
        console.log("i am the same user!!!!");

        res.json({ sameUser: true });
    } else {
        db.getUserId(req.params.id)
            .then((response) => {
                console.log("response in getUserId query: ", response.rows[0]);

                if (response.rows[0].imageUrl == null) {
                    response.rows[0].imageUrl = "/default.png";
                }

                res.json(response.rows[0]);
            })
            .catch((err) => {
                console.log("error in getUserId query: ", err);
            });
    }
});

app.get("/users.json", (req, res) => {
    db.recentUsers().then((response) => {
        // console.log("response in recentUsers query: ", response);

        res.json(response.rows);
    });
});

app.get("/users/:find.json", (req, res) => {
    // console.log("req.params: ", req.params);

    let find = req.params.find;

    db.findUsers(find)
        .then((response) => {
            // console.log("response in findUsers query: ", response);

            res.json(response.rows);
        })
        .catch((err) => {
            console.log("error in findUsers query: ", err);
        });
});

app.get("/friendship-status/:id", (req, res) => {
    console.log("req.params.id in /friendship-status/:id: ", req.params.id);

    if (req.params.id) {
        db.friendshipStatus(req.session.userId, req.params.id)
            .then((response) => {
                console.log("response from friendshipStatus query: ", response);
                res.json(response);
            })
            .catch((err) => {
                console.log("error in friendshipStatus query: ", err);
            });
    }
});

app.post("/make-friend-request/:id", (req, res) => {
    db.makeFriendRequest(req.session.userId, req.params.id)
        .then((response) => {
            // console.log(
            //     "response from makeFriendRequest query: ",
            //     response.rows[0].accepted
            // );
            res.json(response.rows[0].accepted);
        })
        .catch((err) => {
            console.log("error in makeFriendRequest query: ", err);
        });
});

app.post("/accept-friend-request/:id", (req, res) => {
    db.acceptFriendRequest(req.session.userId, req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error from acceptFriendRequest query: ", err);
        });
});

app.post("/end-friendship/:id", (req, res) => {
    db.endFriendship(req.session.userId, req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in endFriendship query: ", err);
        });
});

app.get("/friends-wannabes", (req, res) => {
    db.getFriendsList(req.session.userId)
        .then((response) => {
            console.log("response from getFriendsList query: ", response);

            res.json(response.rows);
        })
        .catch((err) => {
            console.log("error in getFriendsList query: ", err);
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

io.on("connection", function (socket) {
    // all of our socket code will go inside here

    console.log(`socket id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    // this is a good place to get our last 10 chat messages
    // we'll need to make a new table for chats and call a db.query here the same way we make with routes:
    // db.getLastTenMessages().then((data) => {
    //     io.sockets.emit("chatmessages", data.rows);
    // });
    // the db query for getting last 10 msgs will need to be a JOIN
    // we'll need info from both users table and chats!
    // i.e. user's name, image and chat msg
    // the most recent msg should be displayed at the bottom!
    // we won't need an axios request inside actions for this part!!!!

    db.getTenLastMessages()
        .then((response) => {
            console.log("response from getTenLast Messages query: ", response);
            let messages = response.rows.reverse();
            // console.log("messages: ", messages);

            io.sockets.emit("chatMessages", messages);
        })
        .catch((err) =>
            console.log("error in getTenLastMessages query: ", err)
        );

    // 1st argument (Sending a new message) listens to the event that will be coming from chat.js
    // 2nd argument (newMsg) is the info that comes along with the emit from chat.js
    socket.on("Sending a new message", (newMsg) => {
        console.log("This message is coming from chat.js component:", newMsg);
        console.log("user who sent new message is: ", userId);

        // 1st: do a db query to insert the new chat message into the chats table!
        // 2nd: do a db query to get info about the user (first, last, img) - probably a JOIN

        Promise.all([db.addNewMessage(userId, newMsg), db.getUserId(userId)])
            .then((response) => {
                // console.log(
                //     "response from both queries: ",
                //     response[0].rows[0]
                // );
                // console.log(
                //     "response from both queries: ",
                //     response[1].rows[0]
                // );

                let msgObj = {
                    ...response[0].rows[0],
                    ...response[1].rows[0],
                };

                console.log("msgObj: ", msgObj);

                io.sockets.emit("addChatMsg", msgObj);
            })
            .catch((err) => {
                console.log("error in both queries: ", err);
            });

        // create a chat obj (if needed) that looks like the one we received from getLastTenMessages
        // once we have this info, emit our message obj to everyone so they can see t immediately
    });
});
