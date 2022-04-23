import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form } from "reactstrap";
import { getAuth, postAuth } from "../../../../utils/httpHelpers";
import { checkName, checkAssetName } from "../../../../utils/utils";
import "../../ManageUser/CreateUser/CreateUser.css";
import "./CreateAsset.css";
import { Col, Container, Row } from "reactstrap";
import { ChangePasswordModal } from "../../../login/Modal/ChangePasswordModal";
import Navbar from "../../../header/Navbar";
import { NotifyModal } from "../../../modal/NotifyModal";
import AdminSidebar from "../../Sidebar/AdminSidebar";

export default class CreateAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      checkDisable: true,
      nameMessage: "",
      categoryMessage: "",
      specificationMessage: "",
      installedDateMessage: "",
      name: "",
      specification: "",
      installedDate: "",
      category: "",
      categoryId: "",
      State: "",
      dropdownOn: false,
      inputBox: false,
      categoryList: [],
      newcate_prefix: "",
      newcate_name: "",
      newCateMess: "",
      newCate_NameMess: "",
      defaultPassword: false,
      notify: false,
      notifyMessage: "",
    };
  }

  componentDidMount() {
    if (Cookies.get("status") === "1") {
      this.setState({
        defaultPassword: true,
      });
    }
    getAuth("categories")
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            categoryList: response.data,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  handleFormChange(e, key, prefix) {
    switch (key) {
      case "name":
        if (checkAssetName(e.target.value.trim())) {
          this.setState(
            {
              name: e.target.value.trim(),
              nameMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            name: e.target.value,
            buttonDisabled: true,
            nameMessage: "Name must only contains letters.",
          });
        }
        break;
      case "specification":
        if (e.target.value.trim() != "") {
          this.setState(
            {
              specification: e.target.value.trim(),
              specificationMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            specification: e.target.value,
            buttonDisabled: true,
            specificationMessage: "Please fill this field",
          });
        }
        break;
      case "installedDate":
        if (e.target.value != "") {
          this.setState(
            {
              installedDate: e.target.value.trim(),
              installedDateMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            installedDate: e.target.value,
            buttonDisabled: true,
            installedDateMessage: "Please choose installed Date",
          });
        }
        break;
      case "category":
        if (e.target.value != "") {
          this.setState(
            {
              category: e.target.innerText,
              dropdownOn: false,
              categoryId: prefix,
              categoryMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            category: e.target.innerText,
            buttonDisabled: true,
            categoryMessage: "Please choose category",
          });
        }
        break;
      default:
        break;
    }
    //validate form
  }

  validate() {
    if (
      this.state.name != "" &&
      this.state.specification != "" &&
      this.state.installedDate != "" &&
      this.state.category != ""
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

  submitForm(e) {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    const body = JSON.stringify({
      name: e.target.name.value,
      installedDate: e.target.installedDate.value,
      state: e.target.State.value,
      specification: e.target.specification.value,
      categoryId: this.state.categoryId,
    });
    console.log(body);
    postAuth("assets", body)
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

  handleFormChangeCategory(e, key) {
    switch (key) {
      case "newcate_prefix":
        if (checkName(e.target.value.trim())) {
          this.setState({
            newcate_prefix: e.target.value.trim(),
            newCateMess: "",
          });
          if (checkName(this.state.newcate_name)) {
            this.setState({
              checkDisable: false,
            });
          }
        } else {
          this.setState({
            newcate_prefix: e.target.value.trim(),
            newCateMess: "Prefix must only contains letters.",
            checkDisable: true,
          });
        }
        break;
      case "newcate_name":
        if (checkName(e.target.value)) {
          this.setState({
            newcate_name: e.target.value,
            newCate_NameMess: "",
          });
          if (checkName(this.state.newcate_prefix)) {
            this.setState({
              checkDisable: false,
            });
          }
        } else {
          this.setState({
            newcate_name: e.target.value,
            newCate_NameMess: "Name must only contains letters.",
            checkDisable: true,
          });
        }
        break;
      default:
        break;
    }
  }

  submitCategory(e) {
    e.preventDefault();
    if (
      this.state.newcate_prefix.trim() == "" ||
      this.state.newcate_name.trim() == ""
    ) {
      return;
    } else if (
      this.state.newCateMess != "" &&
      this.state.newCate_NameMess != ""
    ) {
      return;
    } else {
      for (let i = 0; i < this.state.categoryList.length; i++) {
        if (this.state.categoryList[i].prefix === this.state.newcate_prefix) {
          this.setState({
            notify: true,
            notifyMessage:
              "Prefix is already existed. Please enter a different prefix",
          });
          return;
        }
        if (this.state.categoryList[i].name === this.state.newcate_name) {
          this.setState({
            notify: true,
            notifyMessage:
              "Category is already existed. Please enter a different category",
          });
          return;
        }
      }
      const body = JSON.stringify({
        prefix: this.state.newcate_prefix.toUpperCase(),
        name: this.state.newcate_name,
      });

      postAuth("categories", body)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              categoryList: [...this.state.categoryList, response.data],
              newcate_prefix: "",
              newcate_name: "",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }
  handleStateChange = (defaultPassword) => {
    this.setState({
      defaultPassword: defaultPassword,
    });
  };
  handleNotifyChange = (notify) => {
    this.setState({
      notify: notify,
    });
  };
  render() {
    return (
      <div>
        <NotifyModal
          show={this.state.notify}
          onStateChange={this.handleNotifyChange}
          message={this.state.notifyMessage}
          data-backdrop="static"
          data-keyboard="false"
        ></NotifyModal>
        <ChangePasswordModal
          show={this.state.defaultPassword}
          onStateChange={this.handleStateChange}
          data-backdrop="static"
          data-keyboard="false"
        ></ChangePasswordModal>
        <Navbar titleName="Manage Asset > Create New Asset" />
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab="ManageAsset" />
            </Col>
            <Col xs="10">
              <Form
                className="form-create"
                onSubmit={(e) => this.submitForm(e)}
              >
                <div className="form-header-message-create">
                  <span>Create New Asset</span>
                </div>
                <div className="form-element-create">
                  <label for="name" className="form-label-create">
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
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
                    onClick={() =>
                      this.setState({ dropdownOn: !this.state.dropdownOn })
                    }
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
                  {this.state.dropdownOn && (
                    <div id="Dropdown_default">
                      {this.state.categoryList.map((category) => (
                        <div
                          key={category.prefix}
                          name="category"
                          className="form-select-custom"
                          onClick={(e) =>
                            this.handleFormChange(
                              e,
                              "category",
                              category.prefix
                            )
                          }
                        >
                          <div className="form-select-label">
                            <span>{category.name}</span>
                          </div>
                        </div>
                      ))}
                      <div id="Add_cate" class="Add_cate">
                        <div id="bluetooth_mouse">
                          <div
                            id="Component_38__16"
                            class="Component_38___16"
                          ></div>
                          <input
                            type="text"
                            className={
                              this.state.newCate_NameMess === ""
                                ? "Rectangle_332"
                                : "Rectangle_332_error"
                            }
                            name="newcate_name"
                            onChange={(e) =>
                              this.handleFormChangeCategory(e, "newcate_name")
                            }
                            value={this.state.newcate_name}
                          ></input>
                          <input
                            type="text"
                            className={
                              this.state.newCateMess === ""
                                ? "Rectangle_333"
                                : "Rectangle_333_error"
                            }
                            name="newcate_prefix"
                            onChange={(e) =>
                              this.handleFormChangeCategory(e, "newcate_prefix")
                            }
                            value={this.state.newcate_prefix}
                          ></input>
                          <div
                            id="iconcheck_fwn"
                            class="icon_check"
                            onClick={(e) => this.submitCategory(e)}
                          >
                            <svg
                              class="check_fwo"
                              viewBox="4.085 4.745 10.669 8.494"
                            >
                              <path
                                class={
                                  this.state.checkDisable
                                    ? "check"
                                    : "check-enable"
                                }
                                d="M 13.07553672790527 5.038809299468994 C 13.45412731170654 4.652503490447998 14.07420063018799 4.646364212036133 14.46043586730957 5.025026321411133 C 14.84667205810547 5.403688907623291 14.85281181335449 6.023761749267578 14.47414970397949 6.409997940063477 L 9.261214256286621 12.92600440979004 C 9.080191612243652 13.1209831237793 8.827631950378418 13.23392295837402 8.561620712280273 13.23884963989258 C 8.295608520507813 13.24377632141113 8.039040565490723 13.1402645111084 7.850921630859375 12.95212078094482 L 4.397008895874023 9.496902465820313 C 4.134993553161621 9.252751350402832 4.027139663696289 8.885051727294922 4.115757942199707 8.538051605224609 C 4.204376220703125 8.191051483154297 4.475334167480469 7.920094966888428 4.822333335876465 7.831475734710693 C 5.169333457946777 7.742857456207275 5.537033081054688 7.850711345672607 5.781185150146484 8.112726211547852 L 8.515586853027344 10.84582233428955 L 13.05072593688965 5.067537307739258 C 13.05881786346436 5.057421207427979 13.06754112243652 5.047826290130615 13.07684230804443 5.038808822631836 Z"
                              ></path>
                            </svg>
                            <svg class="base_fwp">
                              <rect
                                id="base_fwp"
                                rx="0"
                                ry="0"
                                x="0"
                                y="0"
                                width="1"
                                height="1"
                              ></rect>
                            </svg>
                          </div>
                          <div
                            className="cancel-icon"
                            onClick={() =>
                              this.setState({
                                inputBox: false,
                                newCate_NameMess: "",
                                newCateMess: "",
                              })
                            }
                          >
                            <svg
                              class="x-square-fill_fwq"
                              viewBox="4.499 4.499 7.001 7.001"
                            >
                              <path
                                id="x-square-fill_fwq"
                                d="M 5.354000091552734 4.645999908447266 L 8 7.293000221252441 L 10.64599990844727 4.645999908447266 C 10.84150886535645 4.450490951538086 11.15849208831787 4.450490951538086 11.35400009155273 4.645999908447266 C 11.54950904846191 4.841508388519287 11.54950904846191 5.158491134643555 11.35400009155273 5.354000091552734 L 8.706999778747559 8 L 11.35400009155273 10.64599990844727 C 11.54950904846191 10.84150886535645 11.54950904846191 11.15849208831787 11.35400009155273 11.35400009155273 C 11.15849208831787 11.54950904846191 10.84150886535645 11.54950904846191 10.64599990844727 11.35400009155273 L 8 8.706999778747559 L 5.354000091552734 11.35400009155273 C 5.158490657806396 11.54950904846191 4.841508388519287 11.54950904846191 4.645999431610107 11.35400009155273 C 4.450490951538086 11.15849208831787 4.450490951538086 10.84150791168213 4.646000385284424 10.64599990844727 L 7.293000221252441 8 L 4.645999908447266 5.354000091552734 C 4.450490951538086 5.158491134643555 4.450490951538086 4.841508865356445 4.645999908447266 4.645999908447266 C 4.841508865356445 4.450490951538086 5.158491134643555 4.450490951538086 5.354000091552734 4.645999908447266 Z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        {!this.state.inputBox && (
                          <div id="add_category">
                            <div
                              id="Component_38__2"
                              class="Component_38___2"
                            ></div>
                            <div
                              id="Add_new_category"
                              onClick={() => this.setState({ inputBox: true })}
                            >
                              <span>Add new category</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className="error-message-create"
                        style={{
                          position: "relative",
                          left: "0px",
                          top: "0px",
                          textAlign: "center",
                        }}
                      >
                        {this.state.newCate_NameMess}
                      </div>
                      <div
                        className="error-message-create"
                        style={{
                          position: "relative",
                          left: "0px",
                          top: "0px",
                          textAlign: "center",
                        }}
                      >
                        {this.state.newCateMess}
                      </div>
                    </div>
                  )}
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
                    name="specification"
                    rows="4"
                    cols="50"
                    name="specification"
                    className={
                      this.state.specificationMessage === ""
                        ? "form-textarea-create"
                        : "form-textarea-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "specification")}
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
                    className={
                      this.state.installedDateMessage === ""
                        ? "form-input-create"
                        : "form-input-create-error"
                    }
                    onChange={(e) => this.handleFormChange(e, "installedDate")}
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.installedDateMessage}
                </div>
                <div className="form-element-create">
                  <label for="state" className="form-label-create">
                    <span>State</span>
                  </label>
                  <div className="form-radio">
                    <input
                      type="radio"
                      id="Available"
                      name="State"
                      value="1"
                      className="form-radio-button"
                      defaultChecked
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
                      name="State"
                      value="2"
                    ></input>
                    <label className="form-radio-label" for="notavailable">
                      Not available
                    </label>
                  </div>
                </div>
                <div className="form-element-create">
                  <button
                    className="form-button-create"
                    type="submit"
                    disabled={this.state.buttonDisabled}
                  >
                    Save
                  </button>
                  <Link to="/assetmanagement">
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
