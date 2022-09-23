import React from "react";
import { useSelector } from "react-redux";
// import { useSelector, shallowEqual } from "react-redux";
import TodoListItem from "./TodoListItem";
import { selectFilteredTodoIds } from "./todosSlice";

// const selectTodoIds = (state) => state.todos.map(todo => todo.id)

const TodoList = () => {

  // shallowEqual = Comparison fn we can use to check if the
  // items inside the array are still the same.
  // const todoIds = useSelector(selectTodoIds, shallowEqual)
  // const todos = useSelector(state => state.todos)

  const todoIds = useSelector(selectFilteredTodoIds)

  const loadingStatus = useSelector(state => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader"></div>
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return ( 
    <ul className="todo-list">{renderedListItems}</ul>
   );
}
 
export default TodoList;