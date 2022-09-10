import React from "react";
import { Switch, Route } from "react-router-dom";

import MainView from "../MainView";

const PrivateRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={MainView} />
    </Switch>
  );
};

export default PrivateRoutes;
