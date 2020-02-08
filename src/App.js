import React from 'react';
import TodoApp from './TodoApp'
import './App.css';
import { createStore } from 'redux';
import todoApp from './reducers';

const store = createStore(todoApp);

function App() {
  return (
    <TodoApp store={store} />
  );
}

export default App;