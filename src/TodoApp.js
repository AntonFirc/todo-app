import React from "react";
import TodoList from "./TodoList";
import * as utils from "./utility.js";
import {
    addTodo, toggleTodo, removeTodo,
    resetInputText, updateInputText,
    VisibilityFilters, setVisibilityFilter,
    addActive, removeActive, editTodo, toggleEdit
} from "./actions";

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.store.getState());
        const unsubscribe = this.props.store.subscribe( () => console.log(this.props.store.getState()));
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeElement = this.removeElement.bind(this);
        this.updateElement = this.updateElement.bind(this);
        this.changeComplete = this.changeComplete.bind(this);
        this.changeVisibility = this.changeVisibility.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.fetchTodos();
        this.getState = () => this.props.store.getState();
        this.dispatch = (message) => this.props.store.dispatch(message);
    }
    
    fetchTodos() {
        fetch("http://localhost:8080/todos")
            .then(response => response.json())
            .then((jsonData) => {
                // jsonData is parsed json object received from url
                console.log("Got " + jsonData.length + " entries from DB");
                jsonData.forEach( (item) => {
                    this.props.store.dispatch(addTodo(item.id, item.text, item.completed));
                    if (item.completed) {
                        this.props.store.dispatch(addActive(this.getState().activeCount));
                    }
                    this.forceUpdate();
                });
            })
            .catch( (error) => {
                // fetch failed, print error message
                console.error(error)
            })
    }

    removeElement(e, id) {
        e.preventDefault();
        console.log(id + " removed");
        //find item to be removed and check whether it is active or not and modify activeCount
        let removed = this.getState().todos.find( (item) => item.id === id);
        if (removed.completed) {
            this.props.store.dispatch(removeActive(this.getState().activeCount));
        }
        //remove item from app state
        this.props.store.dispatch(removeTodo(id));
        this.forceUpdate();
        //write changes into DB
        let xhr = utils.setupConn();
        xhr.open('DELETE', "http://localhost:8080/todos/"+id); // open the request with the verb and the url
        xhr.send(); // send the request
    }

    updateElement(e, id) {
        e.preventDefault();
        console.log(id);
        let itemIdx = this.getState().todos.findIndex( item => item.id === id );
        console.log(this.getState().todos[itemIdx].text);
        this.getState().todos[itemIdx].text = "asdf";
        this.forceUpdate();
    }

    changeComplete(e, id) {
        this.props.store.dispatch(toggleTodo(id));
        let xhr = utils.setupConn();
        if (e.target.checked) {
            xhr.open('POST', "http://localhost:8080/todos/"+id+"/complete");
            this.props.store.dispatch(addActive(this.getState().activeCount));
        }
        else {
            xhr.open('POST', "http://localhost:8080/todos/"+id+"/incomplete");
            this.props.store.dispatch(removeActive(this.getState().activeCount));
        }
        xhr.send();
        this.forceUpdate();
        console.log(this.state);
    }

    changeVisibility(e, type) {
        e.preventDefault();
        this.props.store.dispatch(setVisibilityFilter(type));
        this.forceUpdate();
    }

    handleChange(e) {
        this.props.store.dispatch(updateInputText(e.target.value));
        this.forceUpdate();
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.props.store.getState().inputText.length) {
            return;
        }
        // item to be inserted into DB (contains only text, other is generated in DB)
        const DBItem = {
            text: this.props.store.getState().inputText
        };
        let xhr = new XMLHttpRequest();
        // get a callback when the server responds
        xhr.addEventListener('load', () => {
            console.log(xhr.responseText);
            //get item inserted into DB with generated ID and other attributes
            let newItem = JSON.parse(xhr.responseText);
            this.props.store.dispatch(resetInputText());
            this.props.store.dispatch(addTodo(newItem.id, newItem.text, newItem.completed));
            this.forceUpdate();
        });
        xhr.open('POST', "http://localhost:8080/todos/");   // open the request with the verb and the url
        xhr.setRequestHeader("Content-Type", "application/json" );  //set header to send JSON
        xhr.send(JSON.stringify(DBItem));   // send the request
    }

    toggleEdit(e, id) {
        e.preventDefault();
        this.dispatch(toggleEdit(id));
        this.forceUpdate();
        console.log(e.target);
    }

    handleEdit(e) {
        e.preventDefault();
        console.log(e.target);
    }

    render() {
        return (
            <div>
                <h3>TODO List</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="new-todo">
                        What needs to be done?
                    </label>
                    <input
                        id="new-todo"
                        onChange={this.handleChange}
                        value={this.props.store.getState().inputText}
                    />
                    <button>
                        Add #{this.getState().todos.length + 1}
                    </button>
                </form>
                <TodoList store={this.props.store}
                          changeComplete={this.changeComplete}
                          updateElement={this.updateElement}
                          removeElement={this.removeElement}
                          toggleEdit={this.toggleEdit}
                          handleEdit={this.handleEdit}/>
                <div>
                    <span>{this.getState().activeCount}</span>
                    <button onClick={ (e) => this.changeVisibility(e, VisibilityFilters.SHOW_ALL)}>
                        All
                    </button>
                    <button onClick={ (e) => this.changeVisibility(e, VisibilityFilters.SHOW_ACTIVE)}>
                        Active
                    </button>
                    <button onClick={ (e) => this.changeVisibility(e, VisibilityFilters.SHOW_COMPLETED)}>
                        Completed
                    </button>
                </div>
            </div>
        );
    }
}

export default TodoApp;
