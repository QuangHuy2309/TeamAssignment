import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form } from "reactstrap";
import { getAuth, postAuth } from "../../../../utils/httpHelpers";
import {
  checkName,
  checkAssetName,
  convertToday,
} from "../../../../utils/utils";
import SelectUserModal from "./SelectUserModal/SelectUserModal";
import SelectAssetModal from "./SelectAssetModal/SelectAssetModal";
import "../../ManageUser/CreateUser/CreateUser.css";
import "./CreateAssignment.css";
import { Col, Container, Row } from "reactstrap";
import { ChangePasswordModal } from "../../../login/Modal/ChangePasswordModal";
import Navbar from "../../../header/Navbar";
import { NotifyModal } from "../../../modal/NotifyModal";
import AdminSidebar from "../../Sidebar/AdminSidebar";

export default class CreateAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      checkDisable: true,
      userMessage: "",
      assetMessage: "",
      assignedDateMessage: "",
      user_id: "",
      user_name: "",
      userSelectModalState: false,
      assignedDate: convertToday(),
      asset_id: "",
      asset_name: "",
      assetSelectModalState: false,
      dropdownOn: false,
      inputBox: false,
      defaultPassword: false,
      notify: false,
      notifyMessage: "",
      note: ""
    };
  }

  componentDidMount() {
    if (Cookies.get("status") === "1") {
      this.setState({
        defaultPassword: true,
      });
    }
  }

  handleFormChange(e, key) {
    switch (key) {
      case "assignedDate":
        if (e.target.value != "") {
          this.setState(
            {
              assignedDate: e.target.value.trim(),
              assignedDateMessage: "",
            },
            () => {
              this.validate();
            }
          );
        } else {
          this.setState({
            assignedDate: e.target.value,
            buttonDisabled: true,
            assignedDateMessage: "Please choose assigned Date",
          });
        }
        break;
      case "note":
        this.setState({
            note: e.target.value.trim()
        })
        break;
      default:
        break;
    }
    //validate form
  }

  validate() {
    if (this.state.user_id != "" && this.state.asset_id != "") {
      this.setState({
        buttonDisabled: false,
      });
    } else {
      this.setState({
        buttonDisabled: true,
      });
    }
  }
  handleUserSelectClick() {
    this.setState({
      userSelectModalState: !this.state.userSelectModalState,
    });
  }
  handleAssetSelectClick() {
    this.setState({
      assetSelectModalState: !this.state.userSelectModalState,
    });
  }
  handleUserModalShowChange(e) {
    this.setState({
      userSelectModalState: !this.state.userSelectModalState,
    });
    // console.log(e);
  }
  handleValueAssetSelect(e) {
    console.log(e);
    const assetSelected = e.split("-");
    this.setState({
      asset_id: assetSelected[0],
      asset_name: assetSelected[1]
    }, () => this.validate());
  }
  handleAssetModalShowChange(e) {
    this.setState({
      assetSelectModalState: !this.state.assetSelectModalState,
    });
    // console.log(e);
  }
  handleValueUserSelect(e) {
    console.log(e);
    const userSelected = e.split("-");
    this.setState({
      user_id: userSelected[0],
      user_name: userSelected[1]
    }, () => this.validate());
  }
  handleCreateClick(e) {
    // e.preventDefault();
    this.setState({ buttonDisabled: true });
    const body = JSON.stringify({
      assetId: this.state.asset_id,
      createddate: this.state.assignedDate,
      assignedtoEmployee: this.state.user_id,
      note: this.state.note,
    });
    console.log(body);
    postAuth("assignments", body)
      .then((response) => {
        if (response.status === 200) {
          this.props.history.push("/assignmentmanagement", {
            assignment: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        <Navbar titleName="Manage Assignment > Create New Assignment" />
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab="ManageAssignment" />
            </Col>
            <Col xs="10">
                <div className="form-header-message-create">
                  <span>Create New Assignment</span>
                </div>
                <div className="form-element-create" onClick={() => this.handleUserSelectClick()}>
                  <label for="assignedtoEmployee" className="form-label-create">
                    <span>User</span>
                  </label>
                  <p
                    type="text"
                    name="assignedtoEmployee"
                    className="form-input-create textselect"
                  >{this.state.user_name}
                    </p>
                  <svg class="search_etg" viewBox="-0.001 0.002 16.001 15.998">
                    <path
                      id="search_etg"
                      d="M 11.74199962615967 10.3439998626709 C 13.75034236907959 7.603466033935547 13.3092155456543 3.77855372428894 10.72976493835449 1.567129611968994 C 8.150315284729004 -0.6442947387695313 4.30290412902832 -0.4960470199584961 1.90126895904541 1.907307624816895 C -0.5003666877746582 4.310660362243652 -0.6458611488342285 8.158176422119141 1.567407608032227 10.73604393005371 C 3.780675888061523 13.31391143798828 7.605902671813965 13.75230312347412 10.34499931335449 11.74200057983398 L 10.34399890899658 11.74199962615967 C 10.37399864196777 11.7819995880127 10.40599918365479 11.81999969482422 10.44199848175049 11.85699939727783 L 14.2919979095459 15.70699882507324 C 14.68246269226074 16.09774017333984 15.31575584411621 16.09796333312988 15.70649719238281 15.70749855041504 C 16.09723854064941 15.3170337677002 16.09746170043945 14.68374061584473 15.70699787139893 14.29299926757813 L 11.85699844360352 10.4429988861084 C 11.82124614715576 10.4068078994751 11.78280258178711 10.37337875366211 11.74199867248535 10.34299850463867 Z M 12 6.5 C 12 9.537567138671875 9.537566184997559 12 6.5 12 C 3.4624342918396 12 1.000000476837158 9.537566184997559 1.000000476837158 6.5 C 1.000000476837158 3.4624342918396 3.462434530258179 1.000000476837158 6.500000953674316 1.000000476837158 C 9.537567138671875 1.000000476837158 12 3.462434530258179 12 6.500000953674316 Z"
                    ></path>
                  </svg>
                </div>
                <div className="error-message-create">
                  {this.state.userMessage}
                </div>
                <SelectUserModal
                  show={this.state.userSelectModalState}
                  onModalShow={(e) => this.handleUserModalShowChange(e)}
                  onValueChange={(e) => this.handleValueUserSelect(e)}
                />
                <div className="form-element-create" onClick={() => this.handleAssetSelectClick()}>
                  <label for="asset" className="form-label-create">
                    <span>Asset</span>
                  </label>
                  <p
                    type="text"
                    name="asset"
                    className="form-input-create textselect"
                  >{this.state.asset_name}</p>
                  <svg class="search_etg" viewBox="-0.001 0.002 16.001 15.998">
                    <path
                      id="search_etg"
                      d="M 11.74199962615967 10.3439998626709 C 13.75034236907959 7.603466033935547 13.3092155456543 3.77855372428894 10.72976493835449 1.567129611968994 C 8.150315284729004 -0.6442947387695313 4.30290412902832 -0.4960470199584961 1.90126895904541 1.907307624816895 C -0.5003666877746582 4.310660362243652 -0.6458611488342285 8.158176422119141 1.567407608032227 10.73604393005371 C 3.780675888061523 13.31391143798828 7.605902671813965 13.75230312347412 10.34499931335449 11.74200057983398 L 10.34399890899658 11.74199962615967 C 10.37399864196777 11.7819995880127 10.40599918365479 11.81999969482422 10.44199848175049 11.85699939727783 L 14.2919979095459 15.70699882507324 C 14.68246269226074 16.09774017333984 15.31575584411621 16.09796333312988 15.70649719238281 15.70749855041504 C 16.09723854064941 15.3170337677002 16.09746170043945 14.68374061584473 15.70699787139893 14.29299926757813 L 11.85699844360352 10.4429988861084 C 11.82124614715576 10.4068078994751 11.78280258178711 10.37337875366211 11.74199867248535 10.34299850463867 Z M 12 6.5 C 12 9.537567138671875 9.537566184997559 12 6.5 12 C 3.4624342918396 12 1.000000476837158 9.537566184997559 1.000000476837158 6.5 C 1.000000476837158 3.4624342918396 3.462434530258179 1.000000476837158 6.500000953674316 1.000000476837158 C 9.537567138671875 1.000000476837158 12 3.462434530258179 12 6.500000953674316 Z"
                    ></path>
                  </svg>
                </div>
                <div className="error-message-create">
                  {this.state.assetMessage}
                </div>
                <SelectAssetModal
                  show={this.state.assetSelectModalState}
                  onModalShow={(e) => this.handleAssetModalShowChange(e)}
                  onValueChange={(e) => this.handleValueAssetSelect(e)}
                />
                <div className="form-element-create">
                  <label for="assignedDate" className="form-label-create">
                    <span>Assigned Date</span>
                  </label>
                  <input
                    type="date"
                    name="assignedDate"
                    min={convertToday()}
                    defaultValue={convertToday()}
                    className={
                      this.state.assignedDateMessage === ""
                        ? "form-input-create textselect"
                        : "form-input-create-error textselect"
                    }
                    onChange={(e) => this.handleFormChange(e, "assignedDate")}
                  ></input>
                </div>
                <div className="error-message-create">
                  {this.state.assignedDateMessage}
                </div>
                <div className="form-element-create form-textarea">
                  <label for="note" className="form-label-create">
                    <span>Note</span>
                  </label>
                  <textarea
                    name="note"
                    className="form-area-create textselect"
                    onChange={(e) => this.handleFormChange(e, "note")}
                  ></textarea>
                </div>
                <div className="form-element-create-btn">
                  <button
                    className="form-button-create"
                    onClick={() => this.handleCreateClick()}
                    disabled={this.state.buttonDisabled}
                  >
                    Save
                  </button>
                  <Link to="/assignmentmanagement">
                    <button className="form-button-create cancel" type="button">
                      Cancel
                    </button>
                  </Link>
                </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
