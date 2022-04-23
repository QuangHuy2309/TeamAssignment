import React, { Component } from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
import { format, isThisSecond } from "date-fns";
import "../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { ChangePasswordModal } from "../../login/Modal/ChangePasswordModal";
import { Col, Container, Row, Label, Input } from "reactstrap";
import { BsSearch } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getAuth, putAuth } from "../../../utils/httpHelpers";
import Navbar from "../../header/Navbar";
import "./RequestForReturning.css";
import RequestForReturningDetail from "./RequestReturnDetailModal/RequestReturnDetailModal";
import CancelRequest from "./CancelRequest/CancelRequest";
import { ActionModal } from "../../modal/ActionModal";

export default class RequestForReturning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPassword: false,
      activeTab: "Home",
      stateModalState: false,
      dateModalState: false,
      allStateChecked: true,
      completeStateChecked: false,
      waitingStateChecked: false,
      dateStateChecked: false,
      requestList: [],
      stateValue: 0,
      date: "",
      search: "",
      requestIdDetail: "",
      cancelRequestModalShow: false,
      completeState: false,
      activeRequest: Object,
    };
  }

  componentDidMount() {
    if (Cookies.get("status") === "1") {
      this.setState({
        defaultPassword: true,
      });
    }
    this.fetchRequestList();
  }

  handleStateChange = (defaultPassword) => {
    this.setState({
      defaultPassword: defaultPassword,
    });
  };

  handleStateClick() {
    this.setState({ stateModalState: !this.state.stateModalState });
  }

  handleDateClick() {
    this.setState({ dateModalState: !this.state.dateModalState });
  }

  async handleCheckedState(key) {
    if (key === "All") {
      this.setState({
        allStateChecked: true,
        completeStateChecked: false,
        waitingStateChecked: false,
        stateValue: 0,
      });
      this.fetchRequestList();
    } else if (key === "Completed") {
      this.setState({
        allStateChecked: false,
        completeStateChecked: true,
        waitingStateChecked: false,
        stateValue: 2,
      });
      this.fetchRequestListFilter(2, "state");
    } else if (key === "Waiting") {
      this.setState({
        allStateChecked: false,
        completeStateChecked: false,
        waitingStateChecked: true,
        stateValue: 1,
      });
      this.fetchRequestListFilter(1, "state");
    }
  }

  async handleCheckedDate(e) {
    const date = e.target.value.trim();
    if (date != "") {
      await this.setState({
        dateStateChecked: true,
        date: date,
      });
      console.log(this.state.date);
      this.fetchRequestListFilter(date, "date");
    } else {
      await this.setState({
        dateStateChecked: false,
        date,
      });
      this.fetchRequestList();
    }
  }

  async fetchRequestList() {
    getAuth(`requests`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          this.setState({ requestList: response.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async fetchRequestListFilter(filterItem, key) {
    if (key === "state") {
      if (this.state.dateStateChecked) {
        getAuth(`requests?state=${filterItem}&date=${this.state.date}`)
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                requestList: response.data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getAuth(`requests?state=${filterItem}`)
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                requestList: response.data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (key === "date") {
      if (this.state.allStateChecked) {
        getAuth(`requests?date=${filterItem}`)
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                requestList: response.data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getAuth(`requests?state=${this.state.stateValue}&date=${filterItem}`)
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                requestList: response.data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      this.fetchRequestList();
    }
  }

  handleFieldChange(e) {
    this.setState({ search: e.target.value });
    getAuth(`requests/search?criteria=${e.target.value}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            requestList: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleCompleteBtn(request) {
    this.setState({
      completeState: true,
      activeRequest: request,
    });
  }

  handleComplete = () => {
    putAuth(`requests/complete/${this.state.activeRequest.id}?acceptedBy=${Cookies.get('id')}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ completeState: false });
          this.fetchRequestList();
        }
      })
      .catch((error) => console.log(error));
  };

  handleCancel = () => {
    this.setState({ completeState: false });
  };

  handleCreateRequestModalShowChange = (e) => {
    this.setState({
      cancelRequestModalShow: e,
      requestIdDetail: "",
    });
  };
  handleCancelRequestClick = (id) => {
    this.setState({
      cancelRequestModalShow: !this.state.cancelRequestModalShow,
      requestIdDetail: id,
    });
  };

  sortBy(key) {
    let arrayCopy = [...this.state.requestList];
    switch(key) {
      case "id":
        arrayCopy.sort((e1, e2) => (e1.id < e2.id) ? 1 : -1);
        break;
      case "asset_name":
        arrayCopy.sort((e1, e2) => (e1.asset_name < e2.asset_name) ? 1 : -1);
        break;
      case "asset_code":
        arrayCopy.sort((e1, e2) => (e1.asset_code < e2.asset_code) ? 1 : -1);
        break;
      case "requestBy_name":
        arrayCopy.sort((e1, e2) => (e1.requestBy_name < e2.requestBy_name) ? 1 : -1);
        break;
      case "assigned_date":
        arrayCopy.sort((e1, e2) => (e1.assigned_date < e2.assigned_date) ? 1 : -1);
        break;
      case "acceptedBy_name":
        arrayCopy.sort((e1, e2) => (e1.acceptedBy_name < e2.acceptedBy_name) ? 1 : -1);
        break;
      case "returned_date":
        arrayCopy.sort((e1, e2) => (e1.returned_date < e2.returned_date) ? 1 : -1);
        break;
      case "state":
        arrayCopy.sort((e1, e2) => (e1.state < e2.state) ? 1 : -1);
        break;
    }
    this.setState({
      requestList: arrayCopy
    });
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
        <ActionModal
          show={this.state.completeState}
          message='Do you want to mark this returning request as "Completed"?'
          actionName="Yes"
          cancelName="No"
          title="Are you sure?"
          onClickCancel={this.handleCancel}
          onClickAction={this.handleComplete}
        ></ActionModal>
        <Navbar titleName="Request For Returning" />
        <Container className="container-style">
          <Row>
            <Col xs="2">
              <AdminSidebar activeTab="RqsForReturning" />
            </Col>
            <Col xs="10">
              <p className="title">Request List</p>
              <Row>
                <Col className="col-4">
                  <div
                    className="filter"
                    onClick={() => this.handleStateClick()}
                  >
                    <div id="Group_199">
                      <svg class="Rectangle_336_wj">
                        <rect
                          id="Rectangle_336_wj"
                          rx="5"
                          ry="5"
                          x="0"
                          y="0"
                          width="129"
                          height="2rem"
                        ></rect>
                      </svg>
                      <svg class="Line_5_wk" viewBox="0 0 1 33">
                        <path id="Line_5_wk" d="M 0 0 L 0 33"></path>
                      </svg>
                    </div>
                    <p name="type" id="type" className="filter-text">
                      Type
                    </p>
                    <svg class="funnel-fill" viewBox="1.5 1 15 15">
                      <path
                        id="funnel-fill"
                        d="M 1.49999988079071 1.535728693008423 C 1.49999988079071 1.239854097366333 1.758297204971313 0.9999999403953552 2.076923131942749 1 L 15.92307758331299 1 C 16.24170112609863 1 16.49999809265137 1.239854097366333 16.49999809265137 1.535728693008423 L 16.49999809265137 3.678643465042114 C 16.49999809265137 3.81066632270813 16.44742393493652 3.938126087188721 16.35237503051758 4.036438941955566 L 11.307692527771 9.24165153503418 L 11.307692527771 14.39321804046631 C 11.30750370025635 14.62370872497559 11.14857292175293 14.8282527923584 10.91307735443115 14.90108776092529 L 7.451538562774658 15.9725456237793 C 7.275689601898193 16.02693367004395 7.08240795135498 15.99955558776855 6.932019710540771 15.89895534515381 C 6.781630516052246 15.79835605621338 6.692448616027832 15.63678741455078 6.692307472229004 15.464674949646 L 6.692307472229004 9.24165153503418 L 1.647692322731018 4.036510467529297 C 1.552624702453613 3.93821382522583 1.500025510787964 3.810762882232666 1.49999988079071 3.678643465042114 L 1.49999988079071 1.535728693008423 Z"
                      ></path>
                    </svg>
                  </div>
                  {this.state.stateModalState ? (
                    <div className="typeSelect">
                      <div>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={this.state.allStateChecked}
                            onChange={() => this.handleCheckedState("All")}
                          />{" "}
                          All
                        </Label>
                      </div>
                      <div>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={this.state.completeStateChecked}
                            onChange={() =>
                              this.handleCheckedState("Completed")
                            }
                          />{" "}
                          Completed
                        </Label>
                      </div>
                      <div>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={this.state.waitingStateChecked}
                            onChange={() => this.handleCheckedState("Waiting")}
                          />{" "}
                          Waiting for returning
                        </Label>
                      </div>
                    </div>
                  ) : null}
                </Col>
                <Col className="col-3">
                  <div
                    className="filter"
                    onClick={() => this.handleDateClick()}
                  >
                    <div id="Group_199">
                      <svg class="Rectangle_336_wj">
                        <rect
                          id="Rectangle_336_wj"
                          rx="5"
                          ry="5"
                          x="0"
                          y="0"
                          width="129"
                          height="2rem"
                        ></rect>
                      </svg>
                      <svg class="Line_5_wk" viewBox="0 0 1 33">
                        <path id="Line_5_wk" d="M 0 0 L 0 33"></path>
                      </svg>
                    </div>
                    <p name="type" id="type" className="filter-text">
                      Date
                    </p>
                    <svg class="funnel-fill" viewBox="1.5 1 13 13">
                      <path
                        id="funnel-fill"
                        d="M 1.49999988079071 1.464298129081726 C 1.49999988079071 1.207873582839966 1.723857641220093 0.9999999403953552 2.000000238418579 1 L 14.00000286102295 1 C 14.27614307403564 1 14.5 1.207873582839966 14.5 1.464298129081726 L 14.5 3.32149076461792 C 14.5 3.43591046333313 14.45443630218506 3.546375513076782 14.37205982208252 3.631580114364624 L 10.00000190734863 8.142763137817383 L 10.00000190734863 12.60745429992676 C 9.999837875366211 12.80721282958984 9.86209774017334 12.98448371887207 9.658001899719238 13.047607421875 L 6.658000946044922 13.97620391845703 C 6.505598545074463 14.02334022521973 6.338087558746338 13.99961280822754 6.207751274108887 13.91242599487305 C 6.077413558959961 13.82524013519287 6.000123023986816 13.68521404266357 6.000000476837158 13.53604984283447 L 6.000000476837158 8.142763137817383 L 1.628000020980835 3.63164210319519 C 1.545608043670654 3.546451568603516 1.500022053718567 3.435994148254395 1.49999988079071 3.32149076461792 L 1.49999988079071 1.464298129081726 Z"
                      ></path>
                    </svg>
                  </div>
                  {this.state.dateModalState ? (
                    <div className="dateSelect">
                      <Label check>
                        <Input
                          type="date"
                          id={`custom-date-filter`}
                          onChange={(e) => this.handleCheckedDate(e)}
                        />{" "}
                        {}
                      </Label>
                    </div>
                  ) : null}
                </Col>
                <Col className="col-3">
                  <div class="searchFormRequest">
                    <input
                      type="text"
                      placeholder=""
                      name="search"
                      class="searchFieldRequest"
                      onChange={(e) => this.handleFieldChange(e)}
                    />
                    <button type="submit" class="searchButtonRequest">
                      <BsSearch />
                    </button>
                  </div>
                </Col>
              </Row>
              <table className="tableUser">
                <tr>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("id")} className="default-header">No.</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("asset_code")} className="default-header">Asset Code</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("asset_name")} className="default-header">Asset Name</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("requestBy_name")} className="default-header">Request by</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("assigned_date")} className="default-header">Assigned Date</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("acceptedBy_name")} className="default-header">Accepted by</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                    <span onClick={() => this.sortBy("returned_date")} className="default-header">Returned Date</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th className="title-table">
                  <span onClick={() => this.sortBy("state")} className="default-header">State</span>
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </th>
                  <th></th>
                </tr>
                {this.state.requestList.map((request) => (
                  <tr key={request.id}>
                    <td className="row-table">{request.id}</td>
                    <td className="row-table">{request.asset_code}</td>
                    <td className="row-table">{request.asset_name}</td>
                    <td className="row-table">{request.requestBy_name}</td>
                    <td className="row-table">
                      {format(new Date(request.assigned_date), "dd/MM/yyyy")}
                    </td>
                    <td className="row-table">
                      {!request.acceptedBy_name ? "" : request.acceptedBy_name}
                    </td>
                    <td className="row-table">
                      {request.returned_date != undefined
                        ? format(new Date(request.returned_date), "dd/MM/yyyy")
                        : request.returned_date}
                    </td>
                    <td className="row-table">
                      {request.state === 2
                        ? "Completed"
                        : "Waiting"}
                    </td>
                    <td className="btn-table">
                      <div
                        class={
                          request.state === 2
                            ? "checkBtn_Request-disable"
                            : "checkBtn_Request"
                        }
                        onClick={
                          request.state === 2
                            ? (e) => e.stopPropagation()
                            : () => this.handleCompleteBtn(request)
                        }
                      >
                        <FaCheck />
                      </div>
                      <div
                        className={
                          request.state === 1
                            ? "cancelBtn_Request enable"
                            : "cancelBtn_Request"
                        }
                        onClick={
                          request.state === 1
                            ? () => this.handleCancelRequestClick(request.id)
                            : undefined
                        }
                      >
                        <FaTimes color={request.state === 2 ? "#DEDFE0" : ""} />
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
            </Col>
          </Row>
        </Container>
        <CancelRequest
          show={this.state.cancelRequestModalShow}
          requestId={this.state.requestIdDetail}
          onModalShow={(e) => this.handleCreateRequestModalShowChange(e)}
        />
      </div>
    );
  }
}
