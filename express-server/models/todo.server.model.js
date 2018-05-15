import db from './../lib/dbConfig';

let toDoModel = {
	getTodos: function(){
		return new Promise(function(resolve, reject){
			db.all("SELECT * FROM tbl_todo ORDER BY id DESC ",[],function(err, rows, fields){
				if (err) reject(err);
				resolve(rows, fields);
			});
		});
	},

	getTodo: function(id){
		return new Promise(function(resolve, reject){
			db.all("SELECT * FROM tbl_todo where id=? ORDER BY id DESC ",[id],function(err, rows, fields){
				if (err) reject(err);
				resolve(rows, fields);
			});
		});
	},

	createTodo: function(data){
		return new Promise(function (resolve, reject) {
            db.run('INSERT INTO tbl_todo (createdAt, defaultDate, todoText, todoDesc) VALUES(?,?,?,?) ', [Date(), Date.now(), data.todoText, data.todoDesc], function(err){
            	if(err) reject(err);
                resolve({affectedRows: this.changes, insertId: this.lastID});
            });
        });
	},

	updateTodo: function(data){
		return new Promise(function (resolve, reject) {
            db.run('UPDATE tbl_todo SET todoText=?, todoDesc=? WHERE id=?', [data.todoText, data.todoDesc, data.id], function(err){
            	if(err) reject(err);
                resolve({affectedRows: this.changes, updateId: data.id});
            });
        });
	},

	deleteTodo: function(id){
		return new Promise(function (resolve, reject) {
	        db.run('DELETE FROM tbl_todo  WHERE id="'+id+'" ', function(err){
	            if(err) reject(err);
	            resolve({affectedRows: this.changes, deletedId:id});
	        });
	    });
	}
}

module.exports = toDoModel;