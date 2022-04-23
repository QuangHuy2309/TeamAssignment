import React, { Component } from 'react'
import './Dropdown.css';
import DropdownItem from './DropdownItem';
import Cookies from 'js-cookie';

export default class Dropdown extends Component {
    container = React.createRef();
    state = {
        dropdownIsOpen: false,
        username: Cookies.get('username'),
        isLogin: true,
    }

    handleDropdownOnclick() {
        this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen })
    }

    handleCancelClick() {
        this.setState({ dropdownIsOpen: false });
    }

    render() {
        return (
            <div id="account_mig" className="account container">
                <div id="account_mih" className="account" onClick={() => this.handleDropdownOnclick()}>
                    <div id="icondropdown_arrowdefault_mii" className="icon_dropdown_arrow_default">
                        <svg className="DropdownButtonCarotDown_backgr_mij">
                            <rect id="DropdownButtonCarotDown_backgr_mij" rx="0" ry="0" x="0" y="0" width="14" height="14">
                            </rect>
                        </svg>
                        <svg className="icondropdown_arrow_mik" viewBox="0.023 -6 12 6">
                            <path id="icondropdown_arrow_mik" d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z">
                            </path>
                        </svg>
                    </div>
                    <div id="binhnv_mil">
                        <span>{this.state.username}</span>
                    </div>
                </div>
                {this.state.dropdownIsOpen && <DropdownItem cancelClick={() => this.handleCancelClick()} />}
            </div>
        )
    }
}
