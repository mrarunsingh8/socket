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

export const addTodo = (req,res) => {
  toDoModel.createTodo(req.body).then(function(response){
    return res.json({'success':true,'message':'Todo added successfully',todo: response});
  }).catch(function(reason){
    return res.json({'success':false,'message':reason});
  });
}

export const updateTodo = (req,res) => {
  toDoModel.updateTodo(req.body).then(function(response){
    return res.json({'success':true,'message':'Todo Updated Successfully',todo: response});
  }).catch(function(reason){
    return res.json({'success':false,'message':reason});
  });
}

export const getTodo = (req,res) => {
  toDoModel.getTodo(req.params.id).then(function(rows, fields){
    return res.json({'success':true,'message':'Todo fetched by id successfully',todo: rows});
  }).catch(function(reason){
    return res.json({'success':false,'message':'Todo with the given id not found'});
  });
}

export const deleteTodo = (req,res) => {
  toDoModel.deleteTodo(req.params.id).then(function(todo){
    return res.json({'success':true,'message':'Todo Deleted Successfully',todo});
  }).catch(function(reason){
    return res.json({'success':false,'message':'Some Error'});
  });
}
