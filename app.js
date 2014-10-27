 //This function will show the login page (home page) of the website
 function showHomePage(){
 	var home = "";
 	home += '<h> Welcome to NextCapital </h>';
	home += '<div class="form">';
	home += '<p>Email: </p><input type="text" name="email" id="email"><br>';
	home += '<p>Password: </p><input type="password" name="pass" id="pass"><br>';
	home += '<input type="submit" class= "sButton" value="Sign Up" onclick="signUp()">';
	home += '<input type="submit" class= "iButton" value="Log In" onclick="logIn()">';
	home += '</div>';
	$("body").html(home);

 }

//This function will get the email and password form the first time user and sign him up 
 function signUp(){
 		var obj = new Object();
 	 	obj.email = $('#email').val();
		obj.password = $('#pass').val();

		obj.success = function(e){
			showTodoListPage();
		};

		obj.error = function(e){
			alert("Error in Sign Up!");
		}

		Todo.createUser(obj);
}

//This function will get the email and password from the already signed up user and log him in
function logIn(){
 		var obj = new Object();
 		obj.email = $('#email').val();
		obj.password = $('#pass').val();

		obj.success = function(e){
			showTodoListPage();
		}

		obj.error = function(e){
			alert("Error in Login!");
		}

		Todo.startSession(obj);
}

//This function will end the user's session (sign him out) and direct him to the login page again
function logOut(){
	 	var obj = new Object();

	 	obj.success = function(e){
	 		showHomePage();
	 	}

	 	obj.error = function(e){
	 		alert("Error in Logout!");
	 	}

		Todo.endSession(obj);
}

//This function will show the todo list of the user
function showTodoListPage(){
	tmp = '<button class= "lButton" id="logOutButton" onClick="logOut()">Logout</button>';
	tmp += '<div id="todolist-container">';
	tmp += '<div id="todoform">';
	tmp += '<input type="text" id="todotext"></input>';
	tmp += ' <button id="button" class="myButton" onClick="addTodo()">Add Todo</button>';
	tmp += '</div>';
	tmp += '<div id="todolist">';
	tmp += '</div>';
	tmp += '</div>';

	$("body").html(tmp);
	generateTodos();
} 

//This function comes up with two lists for complete and incomplete todo items
function generateTodos(){
	var obj = new Object();

	obj.success = function(e){
		var tmp = '<div id="incompList"><b>Incomplete</b><ul class="sortable">';
		for(var i=0; i<e.length; i++){
			var button = ' <button class="compButton" tid="'+e[i].id+'">Done</button>';
			if(e[i].is_complete == false){
				var cls = "incomplete";
				tmp += '<li class='+cls+'>'+e[i].description+button+'</li>';
			}
		}
		tmp += '</ul></div>';

		tmp += '<div id="compList"><b>Completed</b><ul class="sortable">';
		for(var i=0; i<e.length; i++){
			if(e[i].is_complete == true){
				var cls = "complete";
				tmp += '<li class='+cls+'>'+e[i].description+'</li>';
			}
		}
		tmp+='</ul></div>';


		$("#todolist").html(tmp);

		$('.compButton').click(completeTodo);
		sorting();

	}

	obj.error = function(e){
		alert("Error in Loading Todo List!");
	}

	Todo.loadTodos(obj);
}

//This function puts the complete to do items to the bottom of the complete list
function completeTodo(e){

	var obj = new Object();
	var desc = e.target.parentNode.childNodes[0].data;
	obj.data = {"description":desc, "is_complete": true};
	obj.todoId = e.target.getAttribute("tid"); 

	obj.success=function(o){
		$(e.target.parentNode).fadeOut();
		$('<li class="complete">'+desc+'</li>').appendTo($("#compList ul")).hide().fadeIn();
		sorting();

	}

	obj.error = function(e){
		alert("Error in Updating Todo List!");
	}

	Todo.updateTodo(obj);
}

//This function adds the incomplete to do items to the bottom of the incomplete list
function addTodo(){
	var text = $('#todotext').val();
	if(text == null)
		alert("Text is null");
	else{
		var obj = new Object();
		obj.todo = {"description":text};

		obj.success = function(e){
			$('<li class="incomplete">'+e.description+' <button class="compButton" tid="'+e.id+'">Done</button></li>').appendTo($("#incompList ul")).hide().fadeIn();
			$('.compButton').click(completeTodo);
			sorting();
		}

		obj.error = function(e){
			alert("Error in Creating Todo List!");
		}

		Todo.createTodo(obj);
	}
}

//This function allows the user to sort the items in todo lists by dragging and dropping
function sorting(){
    $( ".sortable" ).sortable();
    $( ".sortable" ).disableSelection();
}