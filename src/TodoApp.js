import React from "react";
import TodoList from "./TodoList";
import * as utils from "./utility.js";
import {
    addTodo, toggleTodo, removeTodo,
    resetInputText, updateInputText,
    VisibilityFilters, setVisibilityFilter,
    addActive, removeActive, editTodo, toggleEdit, updateEditText
} from "./actions";
import {setupConn} from "./utility";

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        const unsubscribe = this.props.store.subscribe( () => {});
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeElement = this.removeElement.bind(this);
        this.changeComplete = this.changeComplete.bind(this);
        this.changeVisibility = this.changeVisibility.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.fetchTodos();
        this.getState = () => this.props.store.getState();
        this.dispatch = (message) => this.props.store.dispatch(message);
    }

    /**
     * Fetch all todos from database and display them.
     */
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

    /**
     * Delete todos item from app state and from database.
     * @param e
     * @param id
     */
    removeElement(e, id) {
        e.preventDefault();
        console.log(id + " removed");
        //find item to be removed and check whether it is active or not and modify activeCount
        let removed = this.getState().todos.find( (item) => item.id === id);
        //if removed item was marked as completed, update completed counter
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

    /**
     * Marks todos item as completed or active depending on its actual state. Stores new item state into database.
     * @param e javascript change event
     * @param id id of item that was (un)assigned as completed
     */
    changeComplete(e, id) {
        this.props.store.dispatch(toggleTodo(id));
        let xhr = utils.setupConn();
        // mark as completed or active (respectively) in database according to actual state
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

    /**
     * Stores new visibility filter value to app state
     * @param e javascript click event
     * @param type value of VisibilityFilters to be set
     */
    changeVisibility(e, type) {
        e.preventDefault();
        this.dispatch(setVisibilityFilter(type));
        this.forceUpdate();
    }

    /**
     * Writes text of new todos from input form to state.inputText
     * @param e javascript change action
     */
    handleChange(e) {
        this.props.store.dispatch(updateInputText(e.target.value));
        this.forceUpdate();
    }

    /**
     * Creates new item in todos list using text stored in state.inputText then creates new entry in DB.
     * @param e javascript submit action
     */
    handleSubmit(e) {
        e.preventDefault();
        if (!this.getState().inputText.length) {
            return;
        }
        // item to be inserted into DB (contains only text, other is generated in DB)
        const DBItem = {
            text: this.getState().inputText
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

    /**
     * Marks item as "in edit" to show textbox input
     * @param e javascript doubleclick action
     * @param id id of clicked todos item
     */
    toggleEdit(e, id) {
        e.preventDefault();
        this.dispatch(toggleEdit(id));
        this.forceUpdate();
    }

    /**
     *  Stores value of edit input textbox to state.editText
     * @param e javascript change action
     */
    handleEdit(e) {
        this.dispatch(updateEditText(e.target.value));
    }

    /*
    *   Replaces original item text by new text from state.editText and sends update request to DB
    *   @param e javascript submit event
    *   @param id id of edited todos item
    * */
    handleEditSubmit(e, id) {
        e.preventDefault();
        if (!this.getState().editText.length) {
            return;
        }
        this.dispatch(editTodo(id, this.getState().editText));
        this.dispatch(toggleEdit(id));
        this.forceUpdate();
        const DBItem = {    //create new item for insertion into DB
            text: this.getState().editText
        };
        let xhr = setupConn();
        xhr.open('POST', "http://localhost:8080/todos/"+id);   // open the request with the verb and the url
        xhr.setRequestHeader("Content-Type", "application/json" );  //set header to send JSON
        xhr.send(JSON.stringify(DBItem));   // send the request
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
                          handleEdit={this.handleEdit}
                          handleEditSubmit={this.handleEditSubmit}/>
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
