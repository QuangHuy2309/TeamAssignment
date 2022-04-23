import Cookies from "js-cookie";
import React, { Component } from "react";
import { ChangePasswordModal } from "../login/Modal/ChangePasswordModal";

import "../admin/Sidebar/sidebar.css";
import UserSidebar from "./Sidebar/UserSidebar";
import { Col, Container, Row } from "reactstrap";
import UserAssignment from "./UserAssignment/UserAssignment";

export default class UserIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "Home",
    };
  }
  render() {
    return (
      <div>
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <UserSidebar activeTab={this.state.activeTab} />
            </Col>
            <Col xs="10">
              <UserAssignment />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
