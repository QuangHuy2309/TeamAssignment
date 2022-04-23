import React, { Component } from "react";

import "../../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { Col, Container, Form, Row } from "reactstrap";
import { ChangePasswordModal } from "../../../login/Modal/ChangePasswordModal";
import Navbar from "../../../header/Navbar";
import AdminSidebar from "../../Sidebar/AdminSidebar";

import "../../ManageUser/CreateUser/CreateUser.css";
import "../CreateAsset/CreateAsset.css";
import { Link } from "react-router-dom";
import { checkAssetName } from "../../../../utils/utils";
import { getAuth, putAuth } from "../../../../utils/httpHelpers";

export default class EditAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPassword: false,
      activeTab: "Home",
      nameMessage: "",
      specificationMessage: "",
      name: "",
      category: "",
      installedDate: "",
      stateOption: 0,
      specification: "",
      buttonDisabled: true,
      id: this.props.match.params.id,
      available: true,
    };
  }
  componentDidMount() {
    this.fetchAsset(this.state.id);
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
  fetchAsset(id) {
    getAuth(`assets/${this.state.id}`).then((response) => {
      if (response.status === 200) {
        this.setState({
          name: response.data.name,
          category: response.data.categoryName,
          installedDate: response.data.installedDate,
          stateOption: response.data.state,
          specification: response.data.specification,
        });
        console.log(response);
      }
    });
  }
  submitForm(e) {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    const body = JSON.stringify({
      name: e.target.name.value,
      installedDate: e.target.installedDate.value,
      state: e.target.state.value,
      specification: e.target.specification.value,
    });
    console.log(body);
    putAuth(`assets/${this.state.id}`, body)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push("/assetmanagement", {
            asset: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleFormChange(e, key) {
    switch (key) {
      case "name":
        if (checkAssetName(e.target.value.trim())) {
          this.setState({
            name: e.target.value.trim(),
            nameMessage: "",
          });
          if (this.state.specification !== "") {
            this.setState({
              buttonDisabled: false,
            });
          }
        } else {
          this.setState({
            buttonDisabled: true,
            nameMessage: "Name must not contains special characters or empty.",
            name: e.target.value,
          });
        }
        break;
      case "specification":
        if (e.target.value != 0) {
          this.setState({
            specification: e.target.value,
            specificationMessage: "",
          });
          if (checkAssetName(this.state.name.trim())) {
            this.setState({
              buttonDisabled: false,
            });
          }
        } else {
          this.setState({
            buttonDisabled: true,
            specificationMessage: "This field cannot be empty",
            specification: "",
          });
        }
        break;
      case "installedDate":
        if (
          e.target.value != this.state.installedDate &&
          checkAssetName(this.state.name.trim()) &&
          this.state.specification !== ""
        ) {
          this.setState({
            buttonDisabled: false,
          });
        }
        this.setState({ installedDate: e.target.value });
        break;
      case "state":
        if (e.target.value != this.state.stateOption) {
          this.setState({
            stateOption: e.target.value,
          });
          if (
            checkAssetName(this.state.name.trim()) &&
            this.state.specification !== ""
          ) {
            this.setState({
              buttonDisabled: false,
            });
          }
        }
        this.setState({ state: e.target.value });
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
        <Navbar titleName="Manage Asset > Edit Asset" />
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab="ManageAsset" />
            </Col>
            <Col xs="10">
              <div>
                <Form
                  className="form-create"
                  onSubmit={(e) => this.submitForm(e)}
                >
                  <div className="form-header-message-create">
                    <span>Edit Asset</span>
                  </div>
                  <div className="form-element-create">
                    <label for="name" className="form-label-create">
                      <span>Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={this.state.name}
                      className={
                        this.state.nameMessage === ""
                          ? "form-input-create"
                          : "form-input-create-error"
                      }
                      maxlength="30"
                      onChange={(e) => this.handleFormChange(e, "name")}
                    ></input>
                  </div>
                  <div className="error-message-create">
                    {this.state.nameMessage}
                  </div>
                  <div className="form-element-create">
                    <label for="category" className="form-label-create">
                      <span>Category</span>
                    </label>
                    <div
                      id="dropdown_cat"
                      className="form-input-create"
                      value={this.state.category}
                      style={{
                        backgroundColor: "rgba(239,241,245,1)",
                        cursor: "default",
                      }}
                    >
                      <div id="Personal_Computer_fy">
                        <span>{this.state.category}</span>
                      </div>
                    </div>
                    <svg class="icondropdown_arrow_fy" viewBox="0.023 -6 12 6">
                      <path
                        id="icondropdown_arrow_fy"
                        d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="error-message-create">
                    {this.state.categoryMessage}
                  </div>
                  <div className="form-element-create form-textarea">
                    <label for="specification" className="form-label-create">
                      <span>Specification</span>
                    </label>
                    <textarea
                      id="w3review"
                      name="w3review"
                      rows="4"
                      cols="50"
                      name="specification"
                      defaultValue={this.state.specification}
                      className="form-textarea-create"
                      onChange={(e) =>
                        this.handleFormChange(e, "specification")
                      }
                    ></textarea>
                  </div>
                  <div className="error-message-create">
                    {this.state.specificationMessage}
                  </div>
                  <div className="form-element-create">
                    <label for="installedDate" className="form-label-create">
                      <span>Installed Date</span>
                    </label>
                    <input
                      type="date"
                      name="installedDate"
                      className="form-input-create"
                      defaultValue={this.state.installedDate}
                      onChange={(e) =>
                        this.handleFormChange(e, "installedDate")
                      }
                    ></input>
                  </div>
                  <div className="error-message-create">
                    {this.state.installedDateMessage}
                  </div>
                  <div className="form-element-create">
                    <label for="state" className="form-label-create">
                      <span>State</span>
                    </label>
                    <div className="radio-list">
                      <div className="form-radio">
                        <input
                          type="radio"
                          id="Available"
                          name="state"
                          value="1"
                          className="form-radio-button"
                          checked={this.state.stateOption == 1}
                          onClick={(e) => this.handleFormChange(e, "state")}
                        ></input>
                        <label className="form-radio-label" for="Available">
                          Available
                        </label>
                      </div>
                      <div className="form-radio">
                        <input
                          className="form-radio-button"
                          type="radio"
                          id="notavailable"
                          name="state"
                          value="2"
                          checked={this.state.stateOption == 2}
                          onClick={(e) => this.handleFormChange(e, "state")}
                        ></input>
                        <label className="form-radio-label" for="notavailable">
                          Not available
                        </label>
                      </div>
                      <div className="form-radio">
                        <input
                          type="radio"
                          id="waiting"
                          name="state"
                          value="4"
                          className="form-radio-button"
                          checked={this.state.stateOption == 4}
                          onClick={(e) => this.handleFormChange(e, "state")}
                        ></input>
                        <label className="form-radio-label" for="waiting">
                          Waiting for recycling
                        </label>
                      </div>
                      <div className="form-radio">
                        <input
                          type="radio"
                          id="recycled"
                          name="state"
                          value="5"
                          className="form-radio-button"
                          checked={this.state.stateOption == 5}
                          onClick={(e) => this.handleFormChange(e, "state")}
                        ></input>
                        <label className="form-radio-label" for="recycled">
                          Recycled
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    className="form-element-create"
                    style={{ marginTop: "30px" }}
                  >
                    <button
                      className="form-button-create"
                      type="submit"
                      disabled={this.state.buttonDisabled}
                    >
                      Save
                    </button>
                    <Link to="/assetmanagement" className="form-button-create">
                      <button
                        className="cancel"
                        style={{
                          width: "53px",
                          height: "25px",
                          borderRadius: "5px",
                          fontSize: "11px",
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    </Link>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
