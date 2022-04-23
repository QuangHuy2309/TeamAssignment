import Cookies from "js-cookie";
import React, { Component } from "react";
import AdminIndex from "../admin";
import UserIndex from "../user";
import Navbar from "../header/Navbar";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: Cookies.get("roles"),
    };
  }
  componentDidMount() {}

  render() {
    return (
      <div>
        <Navbar titleName="Home" />
        {this.state.role && this.state.role.toLowerCase().includes("admin") ? (
          <AdminIndex />
        ) : (
          <UserIndex />
        )}
      </div>
    );
  }
}
