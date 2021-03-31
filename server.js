// SQLite3 database variables
const DB = "./database.db";
const sqlite3 = require("sqlite3").verbose();

// Creates a new database if none exists
const db = new sqlite3.Database(DB, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        // Creates a new table articles if none exists
        db.run(
            `CREATE TABLE articles IF NOT EXISTS
        (
            id INT PRIMARY KEY,
            userId INT,
            title VARCHAR(200),
            body VARCHAR(10000)
        )`,
            (err) => {
                if (err) {
                    console.log("Table already created");
                } else {
                    console.log("Table created successfully");
                }
            }
        );
    }
});

// Express variables
const express = require("express");
const cors = require("cors");

// Creating a new express()-variable
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This line enables CORS for us to be able to run the backend locally
app.use(cors());

// Root of the API, landing page
app.get("/", (request, response) => {
    response.send(`
    <h1>This is an example API application.</h1>
    You can begin exploring by navigating to HOST:PORT/api/info (the address that landed you here).
    Remember to read the README!
    `);
});

app.get("/api", (request, response) => {
    response.send(`
    <h1>This is an example API application.</h1>
    You can begin exploring by navigating to HOST:PORT/api/info (the address that landed you here).
    Remember to read the README!
    `);
});

// Info page
app.get("/api/info", (request, response) => {
    response.send(`
    <h1>COMMANDS</h1>
    <h2>GET</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">GET HOST:PORT/api/articles</pre>
    <h2>GET BY USERID</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">GET HOST:PORT/api/articles/:uid</pre>
    <h2>GET BY ID</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">GET HOST:PORT/api/articles/:uid/:id</pre>
    <h2>POST</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">POST HOST:PORT/api/articles</pre>
    <h2>PATCH BY ID</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">PATCH HOST:PORT/api/articles/:uid/:id</pre>
    <h2>DELETE BY ID</h2>
    <pre style="background-color:black;padding:1rem;margin-right:60%;">DELETE HOST:PORT/api/articles/:uid/:id</pre>
    `);
});

// GET
app.get("/api/articles", (request, response) => {
    db.all(
        `SELECT
        *
        FROM articles`,
        [],
        (err, rows) => {
            if (err) {
                response.status(400).json({ error: err.message });
            }
            response.status(200).json({ rows });
        }
    );
});

// GET BY UID

app.get("/api/articles/:uid", (request, response) => {
    db.all(
        `SELECT *
        FROM articles
        WHERE userId = ?
        `,
        [request.params.uid],
        (err, row) => {
            if (err) {
                response.status(400).json({ error: err.message });
            }

            response.status(200).json(row);
        }
    );
});

// GET BY ID
app.get("/api/articles/:uid/:id", (request, response) => {
    db.all(
        `SELECT *
        FROM articles
        WHERE userId = ?
        AND (id IS NULL OR id = ?)`,
        [request.params.uid, request.params.id],
        (err, row) => {
            if (err) {
                response.status(400).json({ error: err.message });
            }

            response.status(200).json(row);
        }
    );
});

// POST
app.post("/api/articles", (request, response) => {
    const reqBody = request.body;
    db.run(
        `INSERT INTO
        articles
        (
            userId,
            title,
            body
        )
        VALUES
        (
            ?,
            ?,
            ?
        )`,
        [reqBody.userId, reqBody.title, reqBody.body],
        (err, result) => {
            if (err) {
                response.status(400).json({ error: err.message });
            } else
                response.status(201).json({
                    message: "success",
                    data: reqBody,
                    id: this.lastID,
                });
        }
    );
});

// PATCH
app.patch("/api/articles/:uid/:id", (request, response) => {
    const reqBody = request.body;
    db.run(
        `UPDATE 
        articles SET 
        userId = COALESCE(?, userId),
        title = COALESCE(?, title),
        body = COALESCE(?,body)
        WHERE id = ?`,
        [request.params.uid, reqBody.title, reqBody.body, request.params.id],
        (err, result) => {
            if (err) {
                response.status(400).json({ error: err.message });
                return;
            }
            response.json({
                message: "success",
                data: reqBody,
                changes: this.changes,
            });
        }
    );
});

// DELETE
app.delete("/api/articles/:uid/:id", (request, response) => {
    db.run(
        `
    DELETE FROM articles
    WHERE userId = ?
    AND id = ?
    `,
        [request.params.uid, request.params.id],
        (err, result) => {
            if (err) {
                response.status(400).json({ error: err.message });
            }
            response.json({ message: "deleted", changes: this.changes });
        }
    );
});

// Handles unknown endpoints
const unknownEndpoint = (error, request, response, next) => {
    response.status(404).send({ error: "unknown endpoint" });
    next(error);
};

app.use(unknownEndpoint);

// Error handler for a few common errors
// const errorHandler = (error, request, response, next) => {
//     console.log(error.message);
//     if (error.name === "CastError") {
//         return response.status(400).send({ error: "malformatted id" });
//     } else if (error.name === "ValidationError") {
//         return response.status(400).json({ error: error.message });
//     } else {
//         return response.status(400).json({ error: error.message });
//     }
//     next(error);
// };

// app.use(errorHandler);

// Setting up express to listen on the specified host and port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
