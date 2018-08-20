const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    comments = express.Router();

comments.get('/:id', (req, res) => {
    // post id
    let { id } = req.params;

    db.query(`
    SELECT comments.id, body, CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author, post_id, pub_date
    FROM comments
    LEFT OUTER JOIN users ON (comments.author_id = users.id)
    WHERE post_id = $1
    ORDER BY pub_date DESC;
    `, [id], (error, result) => {
        let comments = result.rows;
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (comments.length) {
            return res.status(200).send(comments);
        }
        else {
            return res.status(204).send({ message: 'There are no comments on this post.' });
        }
    })
})

module.exports = comments;
