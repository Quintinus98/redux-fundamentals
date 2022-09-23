import { createSelector, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from "../../api/client"
import { StatusFilters } from '../filters/filtersSlice'


// createAsyncThunk accepts two arguments:
//     A string that will be used as the prefix for the generated action types
//     A "payload creator" callback function that should return a Promise. This is often written using the async/await syntax, since async functions automatically return a promise.
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return (response.todos)
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text) => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return (response.todo)
})



const initialState = {
  status: 'idle',
  entities: {}
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { todoId, color } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload]
    },
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach(todo => todo.completed = true );
    },
    completedTodosCleared(state, action) {
      Object.values(state.entities).forEach(todo => {
        if (todo.completed) {
          delete state.entities[todo.id]
        }
      })
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle'
        action.payload.forEach(todo => {
          state.entities[todo.id] = todo
        })
      })
      .addCase(saveNewTodo.fulfilled, (state, action) => {
        const todo = action.payload
        state.entities[todo.id] = todo
      })
  }
})

export const {
  todoToggled,
  todoColorSelected,
  todoDeleted,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions

export default todosSlice.reducer



const selectTodoEntities = state => state.todos.entities;

export const selectTodos = createSelector(
  selectTodoEntities,
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