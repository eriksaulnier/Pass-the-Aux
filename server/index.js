require('dotenv').config()

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketEvents = require('./socket.events.js');

if (process.env.NODE_ENV !== 'production') {
    io.origins('*:*');
}

// connect to mongo database
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Connected to MongoDB server ${process.env.MONGO_URI}`);
}, (err) => {
    console.error(err);
});

// serve static files from the react app
app.use(express.static(path.join(__dirname, '../client/build')));

// send back reacts index file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'../client/build/index.html'));
});

// start the express server
const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));

// start socket event listener
socketEvents(io);
