import React, { Component } from "react";
import "./Navbar.css";
import Dropdown from "./dropdown/Dropdown";
import Cookies from "js-cookie";

export default class Navbar extends Component {
  checkLogin() {
    const username = Cookies.get("username");
    if (!username) return false;
    return true;
  }

  renderTitle() {
    if (this.checkLogin()) {
      return (
        <div id="Home_mif">
          <span>{this.props.titleName}</span>
        </div>
      );
    }

    return (
      <div id="Logo_mjv">
        <div id="Online_Asset_Management_mjw">
          <span>Online Asset Management</span>
        </div>
        <img id="Logo_mjx" src="./Logo_lk.png" />
      </div>
    );
  }

  render() {
    return (
      <div id="narbav_mid">
        <svg className="Rectangle_329_mie">
          <rect
            id="Rectangle_329_mie"
            rx="0"
            ry="0"
            x="0"
            y="0"
            width="100%"
            height="3.6rem"
          ></rect>
        </svg>
        {this.renderTitle()}
        {this.checkLogin() && <Dropdown />}
      </div>
    );
  }
}
