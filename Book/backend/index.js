import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

// MySQL Connection Pool
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Densingh@2005",
    database: "test",
    connectionLimit: 10,
});

app.use(express.json());
app.use(cors());

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});

// Default Route to Check Server Status
app.get("/", (req, res) => {
    res.json("Hello, This is Server!");
});

// Get All Books
app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: 'Error fetching books', error: err });
        return res.json(data);
    });
});

// Add New Book
app.post("/books", (req, res) => {
    const { title, desc, price, cover } = req.body;
    const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
    const Values = [title, desc, price, cover];

    db.query(q, [Values], (err, data) => {
        if (err) {
            console.error('Error inserting book:', err);
            return res.status(500).json({ message: 'Error inserting book', error: err });
        }
        return res.json({ message: "Book has been created" });
    });
});

// Update Book by ID
app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const { title, desc, price, cover } = req.body;
    const q = "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";
    const Values = [title, desc, price, cover, bookId];

    db.query(q, Values, (err, data) => {
        if (err) {
            console.error('Error updating book:', err);
            return res.status(500).json({ message: 'Error updating book', error: err });
        }
        return res.json({ message: "Book has been updated" });
    });
});

// Delete a Book
app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id=?";
    db.query(q, [bookId], (err, data) => {
        if (err) {
            console.error('Error deleting book:', err);
            return res.status(500).json({ message: 'Error deleting book', error: err });
        }
        return res.json({ message: "Book has been deleted successfully" });
    });
});

// Start the Server
app.listen(8800, () => {
    console.log("Server connected on port 8800");
});
