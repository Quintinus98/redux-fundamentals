export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: StatusFilters.All,
  colors: []
}

export const colorFilterChanged = (color, changeType) => {
  return {
    type: 'filters/colorFilterChanged',
    payload: { color, changeType }
  }
}

export const statusFilterChanged = (status) => ({ type: 'filters/statusFilterChanged', payload: status })

// Use initial state as default
const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case 'filters/statusFilterChanged': {
      return {
        // Copy the whole state
        ...state,
        // Replace the status field with the new value.
        status: action.payload
      }
    }

    case 'filters/colorFilterChanged': {
      let { color, changeType } = action.payload
      const { colors } = state

      switch (changeType) {
        case 'added':
          if (colors.includes(color)){
            // This color already is set as a filter. 
            // Don't change the state
            return state
          }
          return {
            ...state,
            colors: state.colors.concat(color),
          }

        case 'removed': {
          return {
            ...state,
            colors: state.colors.filter(
              (existingColor) => existingColor !== color
            ),
          }
        }
      
        default:
          return state
      }
    }
  
    default:
      return state;
  }
}
 
export default filtersReducer;
