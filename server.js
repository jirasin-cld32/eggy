const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json()); // Parsing json to object to add data into db

const database = 'mysql_nodejs'

// MySQL Connection phpmyadmin
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: database,
    port: 3310
})

connection.connect((err) => {
    if (err){
        console.log('Error connecting to MySQL db = ', err)
        return;
    }
    console.log('MySQL successfully connected');
})

// Create Routes
app.post("/create", async (req, res) => {
    const { name, team } = req.body

    try {
        connection.query(
            "INSERT INTO users(name, team) VALUES(?, ?)",
            [ name, team ],
            ( err, results, fields ) => {
                if (err) {
                    console.log('Error while inserting a user into db', err);
                    return res.status(400).send();
                }
                return res.status(201).json({message: 'Ner user successfully created'})
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ
app.get("/read", async (req, res) => {
    try {
        connection.query(
            "SELECT * FROM users",
            ( err, results, fields ) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                return res.status(200).json(results)
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ Single User
app.get("/read/single/:name", async (req, res) => {
    const name = req.params.name;

    try {
        connection.query(
            "SELECT * FROM users WHERE name = ?",
            [ name ],
            ( err, results, fields ) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results)
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// Update Data
app.patch("/update/:name", async (req, res) => {
    const name = req.params.name;
    const newTeam = req.body.newTeam;

    try {
        connection.query(
            "UPDATE users SET team = ? WHERE name = ?",
            [ newTeam, name ],
            ( err, results, fields ) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({ message: "User team is updated!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// Delete
app.delete("/delete/:name", async (req, res) => {
    const name = req.params.name;

    try {
        connection.query(
            "DELETE FROM users WHERE name = ?",
            [ name ],
            ( err, results, fields ) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "No user with that name" })
                }
                return res.status(200).json({ message: "User is deleted!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'));