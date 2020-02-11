import { VisibilityFilters } from './actions.js'
import {SET_VISIBILITY_FILTER, TOGGLE_TODO, EDIT_TODO, ADD_TODO, TOGGLE_EDIT} from "./actions.js";
import {UPDATE_TEXT, RESET_TEXT, REMOVE_TODO} from "./actions.js";
import {ADD_ACTIVE, REMOVE_ACTIVE} from "./actions.js";
import {UPDATE_EDIT_TEXT, RESET_EDIT_TEXT} from "./actions.js";
import { combineReducers } from 'redux'

/*const initialState = {
    text: '',
    editText: '',
    visibilityFilter: VisibilityFilters.SHOW_ALL,
    todos: [],
    active_count: 0
}*/

function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state, {
                    id: action.id,
                    text: action.text,
                    completed: action.completed,
                    edit: false
                }
            ];
        case TOGGLE_EDIT:
            return state.map( (todo) => {
                if (todo) {
                    if (todo.id === action.id) {
                        return Object.assign({}, todo, {
                            edit: !todo.edit
                        });
                    }
                    return todo;
                }
            });
        case EDIT_TODO:
            return state.map( (todo) => {
                if (todo) {
                    if (todo.id === action.id) {
                        return Object.assign({}, todo, {
                            text: action.text
                        });
                    }
                    return todo;
                }
            });
        case TOGGLE_TODO:
            return state.map( (todo) => {
                if (todo) {
                    if (todo.id === action.id) {
                        return Object.assign({}, todo, {
                            completed: !todo.completed
                        });
                    }
                    return todo;
                }
            });
        case REMOVE_TODO:
            return state.filter( (todo) => {
                if (todo) {
                    if (todo.id !== action.id) {
                        return todo;
                    }
                }
            });
        default:
            return state;
    }
}

function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}

function inputText(state = '', action) {
    switch (action.type) {
        case UPDATE_TEXT:
            return action.text;
        case RESET_TEXT:
            return '';
        default:
            return state;
    }
}

function editText(state = '', action) {
    switch (action.type) {
        case UPDATE_EDIT_TEXT:
            return action.text;
        case RESET_EDIT_TEXT:
            return '';
        default:
            return state;
    }
}

function activeCount(state = 0, action) {
    switch (action.type) {
        case ADD_ACTIVE:
            return ++action.count;
        case REMOVE_ACTIVE:
            return --action.count;
        default:
            return state;
    }
}

const todoApp = combineReducers({
    visibilityFilter,
    todos,
    inputText,
    editText,
    activeCount
});

export default todoApp;