import React, { useState } from 'react';
import TodoList from './TodoList';

export default function App() {
  const [count, setCount] = useState(0)
  const refresh = () => {
    setCount(c => c + 1)
  }
  const reload = () => {
    window.location.reload(true)
  }

  return (
    <>
      <button onClick={reload}>Reload</button>
      <button onClick={refresh}>Refresh</button>
      <TodoList count={count} />
    </>
  );
}

