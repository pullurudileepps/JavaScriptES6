import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import TodoList from "./components/Todo";
import TodoListFunc from "./components/TodoFunc";
import Counter from "./components/Counter";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home name={"Shashwat"} />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/todo-func" element={<TodoListFunc />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
