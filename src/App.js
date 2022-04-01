import React from "react";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/about">
          <About />
        </Route>
        {/* <Route exact path="/users">
          <Users />
        </Route> */}
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
