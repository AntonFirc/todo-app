import React from "react";
import {VisibilityFilters} from "./components/actions";

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
            <ul class="todos">
                {itemSet.map(item => (
                    <li key={item.id}>
                        <input defaultChecked={item.completed} onChange={(e) =>
                            this.props.changeComplete(e, item)} type="checkbox"/>
                        {
                            item.edit ?
                                <form onSubmit={ (e) => this.props.handleEditSubmit(e, item.id)}>
                                    <input onChange={ (e) => this.props.handleEdit(e)} type="text"/>
                                </form>:
                            <span onDoubleClick={ (e) => this.props.toggleEdit(e, item.id)}>
                                {item.text}</span>
                        }
                        <i onClick={ (e) => this.props.removeElement(e, item.id)}  className="fas fa-times"></i>
                    </li>
                ))}
            </ul>
        );

    }
}

export default TodoList;