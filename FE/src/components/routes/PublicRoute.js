import Cookies from "js-cookie";
import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...restOfProps }) => (
  <Route
    {...restOfProps}
    render={(props) => {
      const role = Cookies.get("roles");
      let authorized = true;
      //   not login
      if (!role) {
        authorized = false;
      }
      console.log(authorized);
      console.log(role);

      if (authorized) {
        return <Redirect to="/" />;
      } else {
        return <Component {...props} />;
      }
    }}
  />
);
