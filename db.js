const spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social-network"
); // runs the database on heroku OR locally, similarly to the server in index.js (environment variables basically gives us info about who's running the file)

module.exports.registerUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1,$2,$3,$4) RETURNING id`,
        [first, last, email, password]
    );
};

module.exports.getUserInfo = (email) => {
    return db.query(`SELECT password, email, id FROM users WHERE email = $1`, [
        email,
    ]);
};

module.exports.insertCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING id`,
        [email, code]
    );
};

module.exports.verifyCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes
        WHERE email = $1 
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1`,
        [email]
    );
};

module.exports.resetPassword = (email, password) => {
    return db.query(`UPDATE users SET password = $2 WHERE email = $1`, [
        email,
        password,
    ]);
};

module.exports.getUserId = (id) => {
    return db.query(
        `SELECT first, last, id, imageUrl AS "imageUrl", bio FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.updateProfilePicture = (imageUrl, id) => {
    return db.query(`UPDATE users SET imageUrl = $1 WHERE id = $2`, [
        imageUrl,
        id,
    ]);
};

module.exports.updateBio = (bio, id) => {
    return db.query(`UPDATE users SET bio = $1 WHERE id = $2`, [bio, id]);
};

module.exports.recentUsers = () => {
    return db.query(
        `SELECT id, first, last, imageUrl AS "imageUrl" FROM users ORDER BY id DESC LIMIT 3;`
    );
};

module.exports.findUsers = (val) => {
    return db.query(
        `SELECT id, first, last, imageUrl AS "imageUrl" FROM users WHERE first ILIKE $1`,
        [val + "%"]
    );
};

module.exports.friendshipStatus = (receiver_id, sender_id) => {
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `,
        [receiver_id, sender_id]
    );
};

module.exports.makeFriendRequest = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendships (sender_id, receiver_id) VALUES ($1, $2) RETURNING accepted`,
        [receiver_id, sender_id]
    );
};

module.exports.acceptFriendRequest = (receiver_id, sender_id) => {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE (receiver_id = $1 AND sender_id = $2)`,
        [receiver_id, sender_id]
    );
};

module.exports.endFriendship = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver_id, sender_id]
    );
};

module.exports.getFriendsList = (id) => {
    return db.query(
        `
  SELECT users.id, first, last, imageUrl AS "imageUrl", accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`,
        [id]
    );
};

module.exports.getTenLastMessages = () => {
    return db.query(
        `SELECT chat_messages.id, chat_messages.user_id, chat_messages.message, chat_messages.created_at,
        users.first, last, imageUrl AS "imageUrl" FROM chat_messages
        JOIN users
        ON (users.id = chat_messages.user_id)
        ORDER BY chat_messages.id DESC
        LIMIT 10`
    );
};

module.exports.addNewMessage = (user_id, message) => {
    return db.query(
        `INSERT INTO chat_messages (user_id, message) VALUES ($1, $2) RETURNING 
        *`,
        [user_id, message]
    );
};
