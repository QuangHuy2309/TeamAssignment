import React, { Component } from 'react';
import './ChangePassword.css';
import { putAuth } from '../../../utils/httpHelpers';
import Cookies from 'js-cookie';

export default class ChangePassword extends Component {
    state = {
        oldPassword: "",
        newPassword: "",
        changeSuccess: false,
        incorrectPasswordError: false,
        oldPasswordVisible: false,
        newPasswordVisible: false,
        errorMessage: "",
        disableSave: true
    }

    renderSaveBtn() {
        if (this.state.oldPassword === "" || this.state.newPassword === "") {
            return <button
                className="btn-save-change-pw"
                type="submit"
                disabled
            >
                Save
            </button>
        }
        return <button
            className="btn-save-change-pw"
            type="submit"
        >
            Save
        </button>
    }

    renderErrorMessage() {
        if (this.state.errorMessage !== "") {
            return <span className="error-message-top">{this.state.errorMessage}</span>
        }
    }

    handleOnchange(e, name) {
        if (name === "newPassword") {
            this.setState({ newPassword: e.target.value })
        }
        if (name === "oldPassword") {
            this.setState({ oldPassword: e.target.value })
        }
    }

    validateBeforeSubmit() {
        this.setState({ incorrectPasswordError: false });
        this.setState({ errorMessage: "" });
        var errorFlag = false;
        if (this.state.newPassword === this.state.oldPassword) {
            this.setState({ errorMessage: "New and old password must be different" });
            errorFlag = true;
        }
        return errorFlag;
    }

    handleSubmit(e) {
        e.preventDefault();
        var errorFlag = this.validateBeforeSubmit();
        if (errorFlag === false) {
            const body = JSON.stringify({
                newPassword: this.state.newPassword,
                oldPassword: this.state.oldPassword,
            });
            putAuth(`employees/updatePassword/${Cookies.get("id")}`, body)
                .then((response) => {
                    if (response.status === 200) {
                        this.setState({ changeSuccess: true });
                    }
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        this.setState({ incorrectPasswordError: true });
                    }
                });
        }
    }

    handleOnclickEye(passwordType) {
        if (passwordType === "newPassword") {
            this.setState({ newPasswordVisible: !this.state.newPasswordVisible });
        } else if (passwordType === "oldPassword") {
            this.setState({ oldPasswordVisible: !this.state.oldPasswordVisible });
        }
    }

    changePasswordForm() {
        return <div>
            <div className="form-container">
                <div id="login-form-change-pw" className="login-form">
                    <div className="form-header">
                        <div className="form-header-message" style={{ textAlign: "left" }}>
                            <span>Change Password</span>
                        </div>
                    </div>
                    <div className="form-body" id="form-body-pw">
                        <form id="login-form" method="post" onSubmit={(e) => this.handleSubmit(e)}>
                            {this.renderErrorMessage()}
                            <div id="old-pw-div" className="form-element">
                                <label id="form-label-change-pw" for="password" className="form-label">
                                    <span>Old password</span>
                                </label>
                                <input
                                    style={{ paddingLeft: "0.5rem" }}
                                    type={this.state.oldPasswordVisible ? "text" : "password"}
                                    onChange={(e) => this.handleOnchange(e, "oldPassword")}
                                    name="password"
                                    className={this.state.incorrectPasswordError ? "form-input red-border" : "form-input"}
                                    minLength="8"
                                    maxlength="50"
                                ></input>
                                <div id="eye-fill" onClick={() => this.handleOnclickEye("oldPassword")}>
                                    <svg class="Path_24" viewBox="5.5 5.5 5 5">
                                        <path id="Path_24" d="M 10.5 8 C 10.50000095367432 9.380711555480957 9.380712509155273 10.5 8.000000953674316 10.5 C 6.619288921356201 10.5 5.500000953674316 9.380711555480957 5.500000953674316 8 C 5.500000953674316 6.619287967681885 6.619289398193359 5.5 8.000000953674316 5.5 C 9.380712509155273 5.5 10.50000095367432 6.619288444519043 10.50000095367432 8 Z">
                                        </path>
                                    </svg>
                                    <svg class="Path_25" viewBox="0 2.5 16 11">
                                        <path id="Path_25" d="M 0 8 C 0 8 3 2.5 8 2.5 C 13 2.5 16 8 16 8 C 16 8 13 13.5 8 13.5 C 3 13.5 0 8 0 8 Z M 8 11.5 C 9.93299674987793 11.5 11.5 9.93299674987793 11.5 8 C 11.5 6.06700325012207 9.93299674987793 4.5 8 4.5 C 6.06700325012207 4.5 4.5 6.06700325012207 4.5 8 C 4.5 9.93299674987793 6.06700325012207 11.5 8 11.5 Z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            {this.state.incorrectPasswordError &&
                                <span id="error-message-old-pw" className="error-message">Password is incorrect</span>}
                            <div id="new-pw-div" className="form-element">
                                <label id="form-label-change-pw" for="password" className="form-label">
                                    <span>New password</span>
                                </label>
                                <input
                                    style={{ paddingLeft: "0.5rem" }}
                                    type={this.state.newPasswordVisible ? "text" : "password"}
                                    onChange={(e) => this.handleOnchange(e, "newPassword")}
                                    name="password"
                                    className="form-input"
                                    minLength="8"
                                    maxlength="50"
                                ></input>
                                <div id="eye-fill_lz" onClick={() => this.handleOnclickEye("newPassword")}>
                                    <svg class="Path_24_l" viewBox="5.5 5.5 5 5">
                                        <path id="Path_24_l" d="M 10.5 8 C 10.50000095367432 9.380711555480957 9.380712509155273 10.5 8.000000953674316 10.5 C 6.619288921356201 10.5 5.500000953674316 9.380711555480957 5.500000953674316 8 C 5.500000953674316 6.619287967681885 6.619289398193359 5.5 8.000000953674316 5.5 C 9.380712509155273 5.5 10.50000095367432 6.619288444519043 10.50000095367432 8 Z">
                                        </path>
                                    </svg>
                                    <svg class="Path_25_l" viewBox="0 2.5 16 11">
                                        <path id="Path_25_l" d="M 0 8 C 0 8 3 2.5 8 2.5 C 13 2.5 16 8 16 8 C 16 8 13 13.5 8 13.5 C 3 13.5 0 8 0 8 Z M 8 11.5 C 9.93299674987793 11.5 11.5 9.93299674987793 11.5 8 C 11.5 6.06700325012207 9.93299674987793 4.5 8 4.5 C 6.06700325012207 4.5 4.5 6.06700325012207 4.5 8 C 4.5 9.93299674987793 6.06700325012207 11.5 8 11.5 Z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div className="form-element" id="btn-div">
                                {this.renderSaveBtn()}
                                <button 
                                className="btn-cancel-change-pw"
                                onClick={() => this.props.onClickCancel()}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

    changeSuccessForm() {
        return <div>
            <div className="form-container">
                <div id="login-form-change-pw" className="login-form">
                    <div className="form-header">
                        <div className="form-header-message" style={{ textAlign: "left" }}>
                            <span>Change Password</span>
                        </div>
                    </div>
                    <div className="form-body" id="form-body-pw">
                        <div id="old-pw-div" className="form-element">
                            <label id="form-label-change-pw-msg" for="password" className="form-label">
                                <span>Your password has been changed successfully!</span>
                            </label>
                        </div>
                        <div style={{top:"6.2rem"}} className="form-element" id="btn-div">
                            <button 
                            className="btn-cancel-change-pw"
                            onClick={() => this.props.onClickCancel()}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    renderForm() {
        if (this.state.changeSuccess) {
            return this.changeSuccessForm();
        }
        return this.changePasswordForm();
    }

    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        )
    }
}
