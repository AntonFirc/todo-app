import React from "react";
import {VisibilityFilters} from "./actions";

class TodoList extends React.Component {
    render() {
        let itemSet = this.props.store.getState().todos;
        if (this.props.store.getState().visibilityFilter === VisibilityFilters.SHOW_COMPLETED) {
            itemSet = itemSet.filter( (item) => {
                if (item.completed) return item;
            });
        }
        if (this.props.store.getState().visibilityFilter === VisibilityFilters.SHOW_ACTIVE) {
            itemSet = itemSet.filter( (item) => {
                if (!item.completed) return item;
            });
        }
        return (
            <ul>
                {itemSet.map(item => (
                    <li key={item.id}>
                        <input defaultChecked={item.completed} onChange={ (e) =>
                            this.props.changeComplete(e, item.id)} type="checkbox"/>

                        {
                            item.edit ?
                                <form onSubmit={ (e) => this.props.handleEdit(e)}>
                                    <input type="text"/>
                                </form>:
                            <span onDoubleClick={ (e) => this.props.toggleEdit(e, item.id)}>
                                {item.text}</span>
                        }
                        <button onClick={ (e) => this.props.updateElement(e, item.id)}>
                            Edit
                        </button>
                        <button onClick={ (e) => this.props.removeElement(e, item.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        );

    }
}

export default TodoList;