import React, { Component } from "react";
import Cookies from "js-cookie";
import Navbar from "../header/Navbar";
import "./Login.css";
import { post } from "../../utils/httpHelpers";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      username: "",
      password: "",
      loginError: "",
      passwordVisible: false,
    };
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    const body = JSON.stringify({
      username: e.target.username.value.trim(),
      password: e.target.password.value,
    });
    post("auth/login", body)
      .then((response) => {
        if (response.status === 200) {
          Cookies.set("token", response.data.token, { expires: 1 });
          Cookies.set("username", response.data.username, { expires: 1 });
          Cookies.set("id", response.data.id, { expires: 1 });
          Cookies.set("status", response.data.status, { expires: 1 });
          const roles = response.data.types[0];
          Cookies.set("roles", roles, { expires: 1 });
          Cookies.set("location", response.data.location, { expires: 1 });
          this.props.history.push("/");
        }
      })
      .catch((error) => {
        this.setState({
          loginError: "Username or password is incorrect. Please try again",
          password: "",
        });
      });
  }

  handleEmailChange(e) {
    this.setState({ username: e.target.value.trim() });
    if (
      e.target.value.trim().length !== 0 &&
      this.state.password.length !== 0
    ) {
      this.setState({ buttonDisabled: false });
    } else {
      this.setState({ buttonDisabled: true });
    }
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value.trim() });
    if (
      e.target.value.trim().length !== 0 &&
      this.state.username.length !== 0
    ) {
      this.setState({ buttonDisabled: false });
    } else {
      this.setState({ buttonDisabled: true });
    }
  }

  handleOnclickEye() {
    this.setState({ passwordVisible: !this.state.passwordVisible });
  }

  render() {
    return (
      <div>
        <Navbar titleName="Online Asset Management" />
        <div className="form-container">
          <div className="login-form">
            <div className="form-header">
              <div className="form-header-message">
                <span>Welcome to Online Asset Management</span>
              </div>
            </div>
            <div className="form-body">
              <form id="login-form" onSubmit={(e) => this.handleFormSubmit(e)}>
                <div className="error-message">{this.state.loginError}</div>
                <div className="form-element">
                  <label for="username" className="form-label">
                    <span>Username</span>
                    <span style={{ color: "rgba(233, 66, 77, 1)" }}> *</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    maxlength="50"
                    value={this.state.username}
                    onChange={(e) => this.handleEmailChange(e)}
                  ></input>
                </div>
                <div className="form-element">
                  <label for="password" className="form-label">
                    <span>Password</span>
                    <span style={{ color: "rgba(233, 66, 77, 1)" }}> *</span>
                  </label>
                  <input
                    type={this.state.passwordVisible ? "text" : "password"}
                    name="password"
                    className="form-input"
                    value={this.state.password}
                    maxlength="50"
                    onChange={(e) => this.handlePasswordChange(e)}
                  ></input>
                  <div id="eye-fill_lz" onClick={() => this.handleOnclickEye()}>
                    <svg class="Path_24_l" viewBox="5.5 5.5 5 5">
                      <path
                        id="Path_24_l"
                        d="M 10.5 8 C 10.50000095367432 9.380711555480957 9.380712509155273 10.5 8.000000953674316 10.5 C 6.619288921356201 10.5 5.500000953674316 9.380711555480957 5.500000953674316 8 C 5.500000953674316 6.619287967681885 6.619289398193359 5.5 8.000000953674316 5.5 C 9.380712509155273 5.5 10.50000095367432 6.619288444519043 10.50000095367432 8 Z"
                      ></path>
                    </svg>
                    <svg class="Path_25_l" viewBox="0 2.5 16 11">
                      <path
                        id="Path_25_l"
                        d="M 0 8 C 0 8 3 2.5 8 2.5 C 13 2.5 16 8 16 8 C 16 8 13 13.5 8 13.5 C 3 13.5 0 8 0 8 Z M 8 11.5 C 9.93299674987793 11.5 11.5 9.93299674987793 11.5 8 C 11.5 6.06700325012207 9.93299674987793 4.5 8 4.5 C 6.06700325012207 4.5 4.5 6.06700325012207 4.5 8 C 4.5 9.93299674987793 6.06700325012207 11.5 8 11.5 Z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="form-element">
                  <button
                    className="form-button"
                    type="submit"
                    disabled={this.state.buttonDisabled}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
