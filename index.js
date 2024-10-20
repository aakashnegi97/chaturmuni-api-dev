// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelize, Master } = require('./src/model');
const routes = require('./src/routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/api', routes);
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Running",
    })
});

// Error Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json({
        status: false,
        message,
        errors
    });
});



// Start the server
const PORT = process.env.PORT || 8000;

// Sync with DB
sequelize.sync()
    .then(() => {
        try {
            Master.createIfNotExists()
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        } catch (err) {
            console.log(`Error occured ${err}`);
        }
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

