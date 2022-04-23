import Cookies from "js-cookie";
import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoute = ({
  component: Component,
  role,
  ...restOfProps
}) => (
  <Route
    {...restOfProps}
    render={(props) => {
      const roles = Cookies.get("roles");
      //   not login
      if (!roles) {
        return <Redirect to="/login" />;
      }
      if (role === "") {
        return <Component {...props} />;
      } else if (roles.toLowerCase().includes(role)) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/" />;
      }
    }}
  />
);
