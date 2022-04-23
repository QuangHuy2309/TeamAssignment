import React, { Component } from 'react'
import './Dropdown.css';
import ChangePassword from '../../auth/changepassword/ChangePassword';
import Logout from '../../auth/logout/Logout';
import { Modal } from 'reactstrap';

export default class DropdownItem extends Component {
    state = {
        changePassModal: false,
        logoutModal: false,
    };

    toggleChangePass = () => {
        this.setState({ changePassModal: !this.state.changePassModal });
    };


    toggleLogout = () => {
        this.setState({ logoutModal: !this.state.logoutModal });
    };

    handleCancelClick(modalName) {
        if (modalName === "changePass") {
            this.setState({ changePassModal: false });
        }
        if (modalName === "logout") {
            this.setState({ logoutModal: false });
        }
        this.props.cancelClick();
    }

    render() {
        return (
            <div className={!(this.state.changePassModal||this.state.logoutModal) ? 'div-contain-dropdown' : 'div-contain-dropdown display-none'}>
                <div id="change_pw_mip" className="change_pw">
                    <svg className="Path_1_miq" viewBox="0 0 198 40">
                        <path id="Path_1_miq" d="M 0 0 L 198 0 L 198 40.00000381469727 L 0 40.00000381469727 L 0 0 Z">
                        </path>
                    </svg>
                    <div id="Change_password_mir">
                        <span onClick={this.toggleChangePass}>Change password</span>
                        <Modal contentClassName="Modal-content-h" isOpen={this.state.changePassModal} toggle={this.toggleChangePass}>
                            <ChangePassword onClickCancel={() => this.handleCancelClick("changePass")} />
                        </Modal>
                    </div>
                </div>
                <div id="log_out_mim" className="log_out">
                    <svg className="Path_1_min" viewBox="0 0 198 40">
                        <path id="Path_1_min" d="M 0 0 L 198 0 L 198 40 L 0 40 L 0 0 Z">
                        </path>
                    </svg>
                    <div id="Log_out_mio">
                        <span onClick={this.toggleLogout}>Log out</span>
                        <Modal contentClassName="Modal-content-h" isOpen={this.state.logoutModal} toggle={this.toggleLogout}>
                            <Logout onClickCancel={() => this.handleCancelClick("logout")} />
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}
