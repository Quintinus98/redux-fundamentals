import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { saveNewTodo } from "../todos/todosSlice";

const Header = () => {
  const dispatch = useDispatch()

  const [ text, setText ] = useState('')
  const [ status, setStatus ] = useState('idle')

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async(e) => {
    // Remove whitespace before and after the text.
    const trimmedText = text.trim()

    // Use either e.key === 'Enter' or e.which === 13
    if (e.which === 13 && trimmedText) {
      setStatus('loading')
      // Create the thunk function with the text the user wrote.
      // Dispatch the thunk function
      await dispatch(saveNewTodo(trimmedText))
      setText('')
      setStatus('idle')
    }
  }
  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader"></div> : null

  return ( 
    <header className="header">
      <input 
        type="text"
        className="new-todo"
        placeholder={placeholder}
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
   );
}
 
export default Header;