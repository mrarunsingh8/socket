// ./angular-client/src/app/todo/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

import * as io from "socket.io-client";

interface TodoItem{
  id?:number;
  createdAt?: string;
  defaultDate?: string;
  todoText?: string;
  todoDesc?: string;
}

interface TodoItemData{
  success?: boolean;
  message?: string;
  todos?: TodoItem[];
}

class ToDoModel {
  todos: TodoItem[];  
  constructor(){}

  set setTodos(data){
    this.todos = data;
  }

  get getTodos(){
    return this.todos;
  }
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[];
  todo: TodoItem = {};
  todoToEdit:any = {};
  todoToDelete:any = {};
  fetchingData:boolean = false;
  apiMessage:string;

  private url = 'http://192.168.3.20:3001/';
  private socket: any;

  todoModel;

  constructor(private todoService:TodoService) {
    console.clear();
    this.todoModel = new ToDoModel();
    this.socket = io(this.url);
  }

  ngOnInit(): void {
    this.todoService.showAddTodoBox = true;
    //this.todoService.getTodos().then(td => this.todos = td.todos );

    this.socket.on('todolistRefreshed', function(data){
      //if(data.success){
        this.todoModel.setTodos(data.todos);
      //}
    });
    this.todoService.refreshTodos(this.socket);

    this.socket.on('TodoUpdated', (data) => {
      if(data.success){
        this.apiMessage="Todo Updated Success fully.";
      }
    });

    this.socket.on('TodoAdded', (data) => {
      if(data.success){
        this.apiMessage="Todo Added Success fully.";
      }
    });

    //Receive Deleted Todo and remove it from liste
    this.socket.on('TodoDeleted', (data) => {
      this.apiMessage = data.message;
    });
  }

  AddTodo(todo:any):void{
    if(!todo){ return; }
    this.todoService.createTodo(todo,this.socket);
  }

  EditTodo(todo:any):void{
    if(!todo){ return; }
    todo.id = this.todoToEdit.id;
    this.todoService.updateTodo(todo,this.socket);
  }

  DeleteTodo(todo:any):void{
   if(!todo){ return; }
   this.todoService.deleteTodo(todo,this.socket);
 }

  /*AddTodo(todo:any):void{
    if(!todo){ return; }
    this.todoService.createTodo(todo)
                    .then(td => {
                      console.log(td);
                      this.todos.push(td.todo);
                    })
  }*/

  showEditTodo(todo:any):void{
    this.todoToEdit = todo;
    this.apiMessage = "";
  }

  /*EditTodo(todo:any):void{
    if(!todo){ return; }
    todo.id = this.todoToEdit.id;
    this.todoService.updateTodo(todo)
                    .then(td => {
                      const updatedTodos = this.todos.map(t => {
                        if(td.todo.id !== t.id){
                          return t;
                        }
                        return { ...t, ...td.todo };
                      })
                      this.apiMessage = td.message;
                      this.todos = updatedTodos;
                    })
  }*/

 showDeleteTodo(todo:any):void{
   this.todoToDelete = todo;
   this.apiMessage = "";
 }

 /*DeleteTodo(todo:any):void{
   if(!todo){ return; };
   this.todoService.deleteTodo(todo)
                   .then(td => {
                     const filteredTodos = this.todos.filter(t => t.id !== td.todo.id);
                     this.apiMessage = td.message;
                     this.todos = filteredTodos;
                   })
 }*/

}
