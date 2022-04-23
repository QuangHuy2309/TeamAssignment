import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, Row } from "reactstrap";
import { get, getAuth, putAuth } from "../../../../utils/httpHelpers";
import {
  checkDate,
  checkName,
  checkWeekend,
  getAge,
} from "../../../../utils/utils";
import Navbar from "../../../header/Navbar";
import { ChangePasswordModal } from "../../../login/Modal/ChangePasswordModal";
import AdminSidebar from "../../Sidebar/AdminSidebar";
import "../CreateUser/CreateUser.css";

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      dobMessage: "",
      typeMessage: "",
      joinedDateMessage: "",
      dob: "",
      type: "",
      joinedDate: "",
      gender: "",
      firstname: "",
      lastname: "",
      defaultPassword: false,
      activeTab: "Home",
      id: this.props.match.params.id,
    };
  }
  componentDidMount() {
    this.fetchUser(this.state.id);
    if (Cookies.get("status") === "1") {
      this.setState({
        defaultPassword: true,
      });
    }
  }
  fetchUser(id) {
    getAuth(`employees/${this.state.id}`).then((response) => {
      if (response.status === 200) {
        this.setState({
          dob: response.data.dob,
          type: response.data.type,
          joinedDate: response.data.joineddate,
          gender: response.data.gender.toString(),
          firstname: response.data.firstname,
          lastname: response.data.lastname,
        });
      }
    });
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
      dob: e.target.dob.value,
      gender: e.target.gender.value,
      joineddate: e.target.joineddate.value,
      type: e.target.type.value,
    });
    console.log(body);
    putAuth(`employees/${this.state.id}`, body)
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
    if (this.state.dob === "" || getAge(this.state.dob) < 18) {
      this.setState({
        buttonDisabled: true,
        dobMessage:
          "User is under 18. Please select a different date or use current selection",
      });
      return;
    }
    if (!checkDate(this.state.joinedDate, this.state.dob)) {
      this.setState({
        buttonDisabled: true,
        joinedDateMessage:
          "Joined date must be 18 years after Date of Birth. Please select a different date or use current selection.",
      });
      return;
    } else if (checkWeekend(this.state.joinedDate)) {
      this.setState({
        buttonDisabled: true,
        joinedDateMessage:
          "Joined date is Saturday or Sunday. Please select a different date or use current selection.",
      });
      return;
    } else {
      this.setState({
        joinedDateMessage: "",
      });
    }
    this.setState({
      buttonDisabled: false,
    });
  }
  handleFormChange(e, key) {
    console.log(this.state.gender);
    switch (key) {
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
            buttonDisabled: true,
            dob: e.target.value,
            dobMessage:
              "User is under 18. Please select a different date or use current selection",
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
              "Joined date must be 18 years after Date of Birth. Please select a different date or use current selection.",
          });
        } else if (checkWeekend(e.target.value)) {
          this.setState({
            buttonDisabled: true,
            joinedDate: e.target.value,
            joinedDateMessage:
              "Joined date is Saturday or Sunday. Please select a different date or use current selection.",
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
      case "gender": {
        this.setState(
          {
            gender: e.target.value,
          },
          () => {
            this.validate();
          }
        );
      }
      default:
        this.validate();
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
        <Navbar titleName="Manage User > Edit User" />
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
                  <span>Edit User</span>
                </div>
                <div className="form-element-create">
                  <label for="firstname" className="form-label-create">
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-input-create"
                    value={this.state.firstname}
                    disabled
                  ></input>
                </div>
                <div className="form-element-create">
                  <label for="lastname" className="form-label-create">
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-input-create"
                    disabled
                    value={this.state.lastname}
                  ></input>
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
                    value={this.state.dob}
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
                      checked={this.state.gender === "true"}
                      onClick={(e) => this.handleFormChange(e, "gender")}
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
                      checked={this.state.gender === "false"}
                      onClick={(e) => this.handleFormChange(e, "gender")}
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
                    value={this.state.joinedDate}
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
                    disabled={
                      this.state.id === Cookies.get("id") ? true : false
                    }
                    onChange={(e) => this.handleFormChange(e, "type")}
                  >
                    <option
                      value="Admin"
                      selected={this.state.type === "Admin" ? true : false}
                    >
                      Admin
                    </option>
                    <option
                      value="Staff"
                      selected={this.state.type === "Staff" ? true : false}
                    >
                      Staff
                    </option>
                  </select>
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
