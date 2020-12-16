const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const database = require("./database");
const http = require('http');
const { default: Axios } = require('axios');
const server = http.Server(app);


app.use(bodyParser.json({ limit: '10mb' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

app.get("/", (req, res) => {
  database.getCollection((result) => {
    res.send(result);
  })
})

app.get("/getCart", (req, res) => {
  database.getCart((result) => {
    res.send(result);
  })
})

app.get("/getContact", (req, res) => {
  database.getContact(data => {
    res.send(data);
  })
})

app.post("/pushCart", (req, res) => {
  database.pushCart(req.body.item, (result) => {
    res.send(result);
  })
})

app.post("/buy", (req, res) => {
  database.Buy(req.body.id, (result) => {
    res.send(result);
  })
})

app.post("/edit", (req, res) => {
  database.Edit(req.body.data, (result) => {
    res.send(result);
  })
})

const port = process.env.PORT || 5000;

server.listen(port, '192.168.0.106', () => {
  database.connectDB();
  `Server running on port ${port}`
});
