import React from 'react';
import TodoApp from './TodoApp'
import './style/style.css';
import { createStore } from 'redux';
import todoApp from './components/reducers';

const store = createStore(todoApp);

function App() {
  return (
    <TodoApp store={store} />
  );
}

export default App;