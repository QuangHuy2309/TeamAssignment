import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, Row } from "reactstrap";
import { postAuth } from "../../../../utils/httpHelpers";
import {
  checkDate,
  checkName,
  checkWeekend,
  getAge,
} from "../../../../utils/utils";
import Navbar from "../../../header/Navbar";
import { ChangePasswordModal } from "../../../login/Modal/ChangePasswordModal";
import AdminSidebar from "../../Sidebar/AdminSidebar";
import "./CreateUser.css";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      firstNameMessage: "",
      lastNameMessage: "",
      dobMessage: "",
      typeMessage: "",
      joinedDateMessage: "",
      dob: "",
      firstname: "",
      lastname: "",
      type: "",
      joinedDate: "",
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
  submitForm(e) {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    const body = JSON.stringify({
      firstname: e.target.firstname.value,
      lastname: e.target.lastname.value,
      dob: e.target.dob.value,
      gender: e.target.gender.value,
      joineddate: e.target.joineddate.value,
      type: e.target.type.value,
      location: Cookies.get("location"),
    });
    console.log(body);
    postAuth("employees", body)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push("/usermanagement", {
            user: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  validate() {
    if (
      checkName(this.state.firstname) &&
      checkName(this.state.lastname) &&
      this.state.dob !== "" &&
      getAge(this.state.dob) >= 18 &&
      checkDate(this.state.joinedDate, this.state.dob) &&
      !checkWeekend(this.state.joinedDate) &&
      this.state.type != ""
    ) {
      this.setState({
        buttonDisabled: false,
      });
    } else {
      this.setState({
        buttonDisabled: true,
      });
    }
  }
  handleFormChange(e, key) {
    switch (key) {
      case "firstname":
        if (checkName(e.target.value.trim())) {
          this.setState(
            {
              firstname: e.target.value.trim(),
              firstNameMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            firstname: e.target.value.trim(),
            buttonDisabled: true,
            firstNameMessage: "Name must only contains letters.",
          });
        }
        break;
      case "lastname":
        if (checkName(e.target.value.trim())) {
          this.setState(
            {
              lastname: e.target.value.trim(),
              lastNameMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            lastname: e.target.value.trim(),
            buttonDisabled: true,
            lastNameMessage: "Name must only contains letters.",
          });
        }
        break;
      case "dob":
        if (getAge(e.target.value) >= 18) {
          this.setState(
            {
              dobMessage: "",
              dob: e.target.value,
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            dob: e.target.value,
            buttonDisabled: true,
            dobMessage: "User is under 18. Please select a different date",
          });
        }
        break;
      case "joineddate":
        if (this.state.dob === "") {
          this.setState({
            buttonDisabled: true,
            joinedDate: e.target.value,
            joinedDateMessage: "Please choose date of birth first",
          });
        } else if (!checkDate(e.target.value, this.state.dob)) {
          this.setState({
            buttonDisabled: true,
            joinedDate: e.target.value,
            joinedDateMessage:
              "Joined date must be 18 years after Date of Birth. Please select a different date",
          });
        } else if (checkWeekend(e.target.value)) {
          this.setState({
            buttonDisabled: true,
            joinedDate: e.target.value,
            joinedDateMessage:
              "Joined date is Saturday or Sunday. Please select a different date",
          });
        } else {
          this.setState(
            {
              joinedDate: e.target.value,
              joinedDateMessage: "",
            },
            () => {
              this.validate();
            }
          );
        }
        break;
      case "type":
        if (e.target.value === "Admin" || e.target.value === "Staff") {
          this.setState(
            {
              type: e.target.value,
              typeMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            type: "",
            buttonDisabled: true,
            typeMessage: "Please choose type of user.",
          });
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <ChangePasswordModal
          show={this.state.defaultPassword}
          onStateChange={this.handleStateChange}
          data-backdrop="static"
          data-keyboard="false"
        ></ChangePasswordModal>
        <Navbar titleName="Manage User > Create New User" />
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab="ManageUser" />
            </Col>
            <Col xs="10">
              <Form
                className="form-create"
                onSubmit={(e) => this.submitForm(e)}
              >
                <div className="form-header-message-create">
                  <span>Create User</span>
                </div>
                <div className="form-element-create">
                  <label for="firstname" className="form-label-create">
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    className={
                      this.state.firstNameMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    maxlength="30"
                    onChange={(e) => this.handleFormChange(e, "firstname")}
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.firstNameMessage}
                </div>
                <div className="form-element-create">
                  <label for="lastname" className="form-label-create">
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    className={
                      this.state.lastNameMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "lastname")}
                    maxlength="30"
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.lastNameMessage}
                </div>
                <div className="form-element-create">
                  <label for="dob" className="form-label-create">
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className={
                      this.state.dobMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "dob")}
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.dobMessage}
                </div>
                <div className="form-element-create">
                  <label for="gender" className="form-label-create">
                    <span>Gender</span>
                  </label>
                  <div className="form-radio">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="true"
                      className="form-radio-button"
                      defaultChecked
                    ></input>
                    <label className="form-radio-label" for="female">
                      Female
                    </label>
                  </div>
                  <div className="form-radio">
                    <input
                      className="form-radio-button"
                      type="radio"
                      id="male"
                      name="gender"
                      value="false"
                    ></input>
                    <label className="form-radio-label" for="male">
                      Male
                    </label>
                  </div>
                </div>
                <div className="form-element-create">
                  <label for="joineddate" className="form-label-create">
                    <span>Joined Date</span>
                  </label>
                  <input
                    type="date"
                    name="joineddate"
                    className={
                      this.state.joinedDateMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "joineddate")}
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.joinedDateMessage}
                </div>
                <div className="form-element-create">
                  <label for="type" className="form-label-create">
                    <span>Type</span>
                  </label>
                  <select
                    name="type"
                    className={
                      this.state.typeMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "type")}
                  >
                    <option disabled selected value></option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="error-message-create">
                  {this.state.typeMessage}
                </div>
                <div className="form-element-create">
                  <button
                    className="form-button-create"
                    type="submit"
                    disabled={this.state.buttonDisabled}
                  >
                    Save
                  </button>
                  <Link to="/usermanagement">
                    <button className="form-button-create cancel" type="button">
                      Cancel
                    </button>
                  </Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
