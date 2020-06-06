import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import Home from "./components/Home/Home";
import LogIn from "./components/Login/Login";
import Register from "./components/Register/Register";
import Boards from "./components/Boards/Boards";
import Board from "./components/Board/Board";
import FooterMemo from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LogIn} />
        <Route path="/register" component={Register} />
        <Route exact path="/trello/:userId/boards" component={Boards} />
        <Route path="/trello/:userId/boards/:boardId" component={Board} />
      </div>
      <FooterMemo />
    </Router>
  );
}

export default App;
