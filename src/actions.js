/*
 * action types
 */
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_EDIT = 'TOGGLE_EDIT'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
/*
 * other constants
 */
export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const UPDATE_TEXT = 'UPDATE_TEXT'
export const RESET_TEXT = 'RESET_TEXT'

export const ADD_ACTIVE = 'ADD_ACTIVE'
export const REMOVE_ACTIVE = 'REMOVE_ACTIVE'
/*
 * action creators
 */
export function addTodo(id, text, completed) {
    return { type: ADD_TODO, id, text, completed }
}
export function toggleEdit(id) {
    return { type: TOGGLE_EDIT, id }
}
export function toggleTodo(id) {
    return { type: TOGGLE_TODO, id }
}
export function removeTodo(id) {
    return { type: REMOVE_TODO, id}
}
export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}
export function updateInputText(text) {
    return { type: UPDATE_TEXT, text}
}
export function resetInputText() {
    return {type: RESET_TEXT}
}
export function addActive(count) {
    return {type: ADD_ACTIVE, count}
}
export function removeActive(count) {
    return {type: REMOVE_ACTIVE, count}
}