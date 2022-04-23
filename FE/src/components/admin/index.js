import Cookies from "js-cookie";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { putAuth } from "../../utils/httpHelpers";
import { ChangePasswordModal } from "../login/Modal/ChangePasswordModal";
import AdminSidebar from "./Sidebar/AdminSidebar";
import "./Sidebar/sidebar.css";
import UserAssignment from "../user/UserAssignment/UserAssignment";

export default class AdminIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPassword: false,
      activeTab: "Home",
    };
  }
  componentDidMount() {
    if (Cookies.get("status") === "1") {
      this.setState({
        defaultPassword: true,
      });
    }
  }
  handleStateChange = (defaultPassword) => {
    this.setState({
      defaultPassword: defaultPassword,
    });
  };
  render() {
    return (
      <div>
        <ChangePasswordModal
          show={this.state.defaultPassword}
          onStateChange={this.handleStateChange}
          data-backdrop="static"
          data-keyboard="false"
        ></ChangePasswordModal>
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab={this.state.activeTab} />
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
