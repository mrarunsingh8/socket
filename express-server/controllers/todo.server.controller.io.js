// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';

//import models
import toDoModel from '../models/todo.server.model';

export const getTodos = (req,res) => {
  toDoModel.getTodos().then(function(rows, fields){
    return res.json({'success':true,'message':'Todos fetched successfully',todos: rows});
  }).catch(function(reason){
    return res.json({'success':false,'message':'Some Error'});
  });
}

export const getTodoList = (io) => {
  let result;
  toDoModel.getTodos().then(function(rows, fields){
    result = {'success':true,'message':'Todos fetched successfully',todos: rows};
    io.emit("todolistRefreshed", result);
  }).catch(function(reason){
    result = {'success':false,'message':'Some Error'};
    io.emit("todolistRefreshed", result);
  });
}

export const addTodo = (io,T) => {
  let result;
  toDoModel.createTodo(T).then(function(response){
    result={'success':true,'message':'Todo added successfully',todo: response};
    io.emit('TodoAdded', result);
  }).catch(function(reason){
    result={'success':false,'message':reason};
    io.emit('TodoAdded', result);
  });
}

export const updateTodo = (io,T) => {
  let result;
  toDoModel.updateTodo(T).then(function(response){
    result={'success':true,'message':'Todo Updated Successfully',todo: response};
    io.emit('TodoUpdated', result);
  }).catch(function(reason){
    result= {'success':false,'message':reason};
    io.emit('TodoUpdated', result);
  });
}

export const getTodo = (req,res) => {
  toDoModel.getTodo(req.params.id).then(function(rows, fields){
    return res.json({'success':true,'message':'Todo fetched by id successfully',todo: rows});
  }).catch(function(reason){
    return res.json({'success':false,'message':'Todo with the given id not found'});
  });
}

export const deleteTodo = (io, data) => {
  let result;
  toDoModel.deleteTodo(data.id).then(function(todo){
    io.emit('TodoDeleted', {'success':true,'message':'Todo Deleted Successfully',todo});
  }).catch(function(reason){
    io.emit('TodoDeleted', {'success':false,'message':'Some Error'});
  });
}
