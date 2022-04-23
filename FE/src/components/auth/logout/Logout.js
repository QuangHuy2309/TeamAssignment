import React, { Component } from 'react'
import './Logout.css';
import '../changepassword/ChangePassword.css';
import Cookies from 'js-cookie';
import { getAuth } from '../../../utils/httpHelpers';

export default class Logout extends Component {
    handleLogout() {
        getAuth(`auth/logout`)
            .then((response) => {
                if (response.status === 200) {
                    Cookies.remove("token");
                    Cookies.remove("username");
                    Cookies.remove("id");
                    Cookies.remove("status");
                    Cookies.remove("roles");
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <div>
                    <div className="form-container">
                        <div id="login-form-logout" className="login-form">
                            <div id="header-logout" className="form-header">
                                <div className="form-header-message" style={{ textAlign: "left", marginLeft: "9rem" }}>
                                    <span style={{ fontSize: "1.5rem" }}>Are you sure?</span>
                                </div>
                            </div>
                            <div className="form-body" id="body-logout">
                                <div id="old-pw-div" className="form-element">
                                    <label id="form-label-logout" for="password" className="form-label">
                                        <span>Do you want to log out?</span>
                                    </label>
                                </div>
                                <div className="form-element" id="btn-div-logout">
                                    <button
                                        className="btn-save-change-pw"
                                        onClick={() => this.handleLogout()}
                                    >
                                        Log out
                                    </button>
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
            </div>
        )
    }
}
