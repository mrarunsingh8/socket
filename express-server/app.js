// ./express-server/app.js
import express from 'express';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';
import bb from 'express-busboy';
var cors = require('cors');

// import routes
import todoRoutes from './routes/todo.server.route';
import * as todoController from './controllers/todo.server.controller.io';

// define our app using express
const app = express();

// set the port
const port = process.env.PORT || 3001;



// allow-cors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// express-busboy to parse multipart/form-data and x-www-form-urlencoded both
bb.extend(app);

app.use(cors());
// configure app
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


// connect to database

// add Source Map Support
SourceMapSupport.install();

app.use('/api', todoRoutes);

app.get('/', (req,res) => {
  return res.end('Api working');
})

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});



// start the server
/*app.listen(port,() => {
  console.log(`App Server Listening at ${port}`);
});*/

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  console.log("Connected.........");
  socket.on("getTodoList", function(){
    todoController.getTodoList(io.sockets);
  });

  socket.on('updateTodo', function (data) {
      todoController.updateTodo(io.sockets, data);
  });

  socket.on('addTodo', function (data) {
      todoController.addTodo(io.sockets, data);
  });

  socket.on('deleteTodo', function (data) {
      todoController.addTodo(io.sockets, data);
  });

  socket.on('disconnect', function (data) {
      console.log("disconnecting...");
  });
});