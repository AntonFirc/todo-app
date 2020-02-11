import React from "react";
import {VisibilityFilters} from "./components/actions";

/**
 * class holding unnumbered list containing items of todos list
 */
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
            <ul className="todos">
                {itemSet.map(item => (
                    <li key={item.id}>
                        <div className={item.completed ? "checked done" : "checked active"}
                             onClick={(e) => this.props.changeComplete(e, item)}/>
                        {
                            item.edit ?
                                <form ref={ (ref) => { this.form = ref; }}
                                      onSubmit={ (e) => this.props.handleEditSubmit(e, item.id)}>
                                    <input defaultValue={item.text} onChange={ (e) =>
                                        this.props.handleEdit(e)} autoFocus={true}
                                        onBlur={ () => { this.form.dispatchEvent(new Event('submit')) } } type="text"/>
                                </form> :
                            <span className={item.completed ? "completed" : null}
                                  onDoubleClick={ (e) =>
                                      this.props.toggleEdit(e, item.id, item.text)}>
                                {item.text}</span>
                        }
                        <i onClick={(e) => this.props.removeElement(e, item.id)}
                           className="fas fa-times"/>
                    </li>
                ))}
            </ul>
        );

    }
}

export default TodoList;