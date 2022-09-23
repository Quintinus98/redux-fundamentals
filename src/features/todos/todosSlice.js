import { createSelector } from 'reselect'
import { client } from "../../api/client"
import { StatusFilters } from '../filters/filtersSlice'

// Normalizing state.

const initialState = {
  status: 'idle',
  entities: {}
}

// Use initial state as default
export default function todosReducer(state = initialState, action) {
  switch (action.type) {

    case 'todos/todoAdded': {
      const todo = action.payload
      return {
        ...state,
        entities: {...state.entities,
          [todo.id]: todo}
      }
    }
    
    case 'todos/todoToggled': {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {...todo, completed: !todo.completed}
        }
      }
      }

    case 'todos/colorSelected': {
      // Check this!
      let { todoId, color } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {...todo, color}
        }
      }
    }

    case 'todos/todoDeleted': {
      const newEntities = { ...state.entities }
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities
      }
    }
    
    case 'todos/allcompleted': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }

    case 'todos/completedCleared': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      });
      return {
        ...state,
        entities: newEntities
      }
    }

    case 'todos/todosLoaded': {
      const newEntities = {};
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo;
      })
      // Replace the existing state entirely by returning the new value
      return {
        ...state,
        status: 'idle',
        entities: newEntities
      };
    }

    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }

    default:
      return state;
  }
}

// Action creators
export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })

export const todosLoading = () => ({ type: 'todos/todosLoading' })

export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })

export const todoToggled = todoId => ({ type: 'todos/todoToggled', payload: todoId })

export const todoColorSelected = (todoId, color) => ({ type: 'todos/colorSelected', payload: {todoId, color} })

export const todoDeleted = (todoId) => ({ type: 'todos/todoDeleted', payload: todoId })

export const allTodosCompleted = () => ({ type: 'todos/allcompleted' })

export const completedTodosCleared = () => ({ type: 'todos/completedCleared' })

// Thunk function
export const fetchTodos = () => async (dispatch) => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

export const saveNewTodo = (text) => async (dispatch) => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  dispatch(todoAdded(response.todo))
}

const selectTodoEntities = state => state.todos.entities;

export const selectTodos = createSelector(
  // Pass an Input Selector
  selectTodoEntities,
  // Output selector that receives the input selectors.
  (entities) => Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}

export const selectTodoIds = createSelector(
  selectTodos,
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,

  // Output selector
  (todos, filters) => {
    const { status, colors} = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed

    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  // Derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)