import React from "react";
import { Router } from "react-router-dom";
import { history } from "./store/history";
import ArrayRoute from "./router/ArrayRoute";
import { root } from "./router";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router history={history}>
        <ArrayRoute routes={root} />
      </Router>
    </div>
  );
};

export default App;
