import React from "react";
import { Routes, Route } from "react-router-dom";

import MainView from "../MainView";

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" Component={MainView} />
    </Routes>
  );
};

export default PrivateRoutes;
