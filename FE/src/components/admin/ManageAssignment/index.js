import React, { Component, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../Sidebar/AdminSidebar";
import Paginate from "../../pagination/Pagination";
import "../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { ChangePasswordModal } from "../../login/Modal/ChangePasswordModal";
import { Col, Container, Row, Label, Input } from "reactstrap";
import { deleteAuth, getAuth, putAuth } from "../../../utils/httpHelpers";
import { BsSearch } from "react-icons/bs";
import Navbar from "../../header/Navbar";
import CreateAssignment from "./CreateAssignment/CreateAssignmentClass";
import "./ManageAssignment.css";
import CreateRequest from "../RequestForReturning/CreateRequest/CreateRequest";
import AssignmentDetailModal from "./AssigmentDetailModal/AssigmentDetailModal";
import { ActionModal } from "../../modal/ActionModal";

export default function ManageAssignment(props) {
  const [defaultPassword, setDefaultPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [assignmentList, setAssignmentList] = useState([]);
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [stateModalState, setStateModalState] = useState(false);
  const [dateModalState, setDateModalState] = useState(false);
  const [filterStateOn, setFilterStateOn] = useState(false);
  const [filterDateOn, setFilterDateOn] = useState(false);
  const stateFilter = [
    { name: "Accepted", value: 1 },
    { name: "Waiting for Accepted", value: 2 },
    { name: "Declined", value: 0 },
  ];
  const [checkStateFilter, setCheckStageFilter] = useState(
    new Array(stateFilter.length).fill(false)
  );
  const [stateFilterString, setStateFilterString] = useState("");
  const [dateFilter, setDateFilter] = useState();
  let totalPage = useRef(0);
  const size = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [createRequestModalShow, setCreateRequestModalShow] = useState(false);
  const [idAssignmentDetail, setIdAssignmentDetail] = useState("");
  const [deleteState, setDeleteState] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(Object);
  const [search, setSearch] = useState("");
  const location = Cookies.get("location");
  const [sortable, setSortalbe] = useState(false);
  const [firstload, setFirstLoad] = useState(true);

  useEffect(() => {}, [sortable]);

  useEffect(() => {
    if (Cookies.get("status") === "1") {
      setDefaultPassword(true);
    }
    getAssignmentList();
  }, []);
  useEffect(() => {
    totalPage.current = assignmentList.length;
    calculateAssignsOnPage();
  }, [assignmentList]);
  function handleStateChange(defaultPassword) {
    setDefaultPassword(defaultPassword);
  }

  async function getAssignmentList() {
    getAuth(`assignments`)
      .then((response) => {
        if (response.status === 200) {
          var arr = [...response.data];
          console.log(arr);
          console.log(props);
          if (props.location.state && firstload) {
            arr = arr.filter(
              (el) => el.id !== props.location.state.assignment.id
            );
            arr.unshift(props.location.state.assignment);
            setFirstLoad(false);
          }
          setAssignmentList(arr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    window.onbeforeunload = function () {
      window.history.replaceState(null, "");
    }.bind(this);
  }

  async function getAssignmentListFilter(filterItem, key) {
    if (key === "state") {
      if (filterDateOn) {
        getAuth(`assignments?state=${filterItem}&date=${dateFilter}`)
          .then((response) => {
            if (response.status === 200) {
              setAssignmentList([...response.data]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getAuth(`assignments?state=${filterItem}`)
          .then((response) => {
            if (response.status === 200) {
              setAssignmentList([...response.data]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (key === "date") {
      if (filterStateOn) {
        getAuth(`assignments?date=${filterItem}&state=${stateFilterString}`)
          .then((response) => {
            if (response.status === 200) {
              setAssignmentList([...response.data]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getAuth(`assignments?date=${filterItem}`)
          .then((response) => {
            if (response.status === 200) {
              setAssignmentList([...response.data]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      getAssignmentList();
    }
  }
  async function handleCheckedStateAssignment(position) {
    const updateCheckedState = checkStateFilter.map((item, index) =>
      index === position ? !item : item
    );
    setCheckStageFilter(updateCheckedState);
    const getStateString = updateCheckedState
      .map((item, index) => {
        if (item) {
          return stateFilter[index].value.toString();
        }
      })
      .filter((x) => {
        return x !== undefined;
      })
      .join(",");
    setStateFilterString(getStateString);
    if (updateCheckedState.some((x) => x)) {
      setFilterStateOn(true);
      getAssignmentListFilter(getStateString, "state");
    } else {
      setFilterStateOn(false);
      getAssignmentList();
    }
  }

  async function handleCheckedDateAssignment(e) {
    const date = e.target.value.trim();
    if (date != "") {
      setFilterDateOn(true);
      setDateFilter(date);
      getAssignmentListFilter(date, "date");
    } else {
      setFilterDateOn(false);
      getAssignmentList();
    }
  }
  function handleStateClick() {
    setStateModalState(!stateModalState);
  }

  function handleDateClick() {
    setDateModalState(!dateModalState);
  }
  function handleCurrentPage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function calculateAssignsOnPage() {
    const indexOfLastItem = currentPage * size;
    const indexOfFirstItem = indexOfLastItem - size;
    return assignmentList.slice(indexOfFirstItem, indexOfLastItem);
  }

  function handleCreateRequestClick(e, id) {
    e.stopPropagation();
    setCreateRequestModalShow(!createRequestModalShow);
    setIdAssignmentDetail(id);
  }
  async function handleDetailModalShowChange(e) {
    setDetailModalShow(e);
    setIdAssignmentDetail("");
  }
  function handleAssignmentRowClick(id) {
    setDetailModalShow(!detailModalShow);
    setIdAssignmentDetail(id);
  }
  async function handleCreateRequestModalShowChange(e) {
    setCreateRequestModalShow(e);
    setIdAssignmentDetail("");
  }
  function handleDeleteBtn(e, assignment) {
    e.stopPropagation();
    setDeleteState(true);
    setActiveAssignment(assignment);
  }
  function handleDelete() {
    deleteAuth(`assignments/${activeAssignment.id}`)
      .then((response) => {
        if (response.status === 200) {
          setDeleteState(false);
          getAssignmentList();
        }
      })
      .catch((error) => console.log(error));
  }
  function handleCancel() {
    setDeleteState(false);
  }

  function handleFieldChange(e) {
    setSearch(e.target.value);
    getAuth(`assignments/search?criteria=${e.target.value}`)
      .then((response) => {
        if (response.status === 200) {
          setAssignmentList([...response.data]);
          setCurrentPage(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDefault() {
    setSortalbe(false);
    getAssignmentList();
  }

  function handleSort(e, key) {
    e.preventDefault();
    setSortalbe(true);
    switch (key) {
      case "id":
        assignmentList.sort((a1, a2) => (a1.id < a2.id ? 1 : -1));
        break;
      case "assetId":
        assignmentList.sort((a1, a2) => (a1.assetId < a2.assetId ? 1 : -1));
        break;
      case "assetName":
        assignmentList.sort((a1, a2) => (a1.assetName < a2.assetName ? 1 : -1));
        break;
      case "assignedToUsername":
        assignmentList.sort((a1, a2) =>
          a1.assignedToUsername < a2.assignedToUsername ? 1 : -1
        );
        break;
      case "assignedByUsername":
        assignmentList.sort((a1, a2) =>
          a1.assignedByUsername < a2.assignedByUsername ? 1 : -1
        );
        break;
      case "createdate":
        assignmentList.sort((a1, a2) =>
          a1.createddate < a2.createddate ? 1 : -1
        );
        break;
      case "status":
        assignmentList.sort((a1, a2) => (a1.status < a2.status ? 1 : -1));
        break;
    }
  }

  return (
    <div>
      <Navbar titleName="Manage Assignment" />
      <Container className="container-style">
        <Row>
          <Col xs="2">
            <AdminSidebar activeTab="ManageAssignment" />
          </Col>
          <Col xs="10">
            <p className="title">Assignment List</p>
            <Row>
              <Col className="col-3">
                <div className="filter" onClick={() => handleStateClick()}>
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
                    State
                  </p>
                  <svg class="funnel-fill" viewBox="1.5 1 15 15">
                    <path
                      id="funnel-fill"
                      d="M 1.49999988079071 1.535728693008423 C 1.49999988079071 1.239854097366333 1.758297204971313 0.9999999403953552 2.076923131942749 1 L 15.92307758331299 1 C 16.24170112609863 1 16.49999809265137 1.239854097366333 16.49999809265137 1.535728693008423 L 16.49999809265137 3.678643465042114 C 16.49999809265137 3.81066632270813 16.44742393493652 3.938126087188721 16.35237503051758 4.036438941955566 L 11.307692527771 9.24165153503418 L 11.307692527771 14.39321804046631 C 11.30750370025635 14.62370872497559 11.14857292175293 14.8282527923584 10.91307735443115 14.90108776092529 L 7.451538562774658 15.9725456237793 C 7.275689601898193 16.02693367004395 7.08240795135498 15.99955558776855 6.932019710540771 15.89895534515381 C 6.781630516052246 15.79835605621338 6.692448616027832 15.63678741455078 6.692307472229004 15.464674949646 L 6.692307472229004 9.24165153503418 L 1.647692322731018 4.036510467529297 C 1.552624702453613 3.93821382522583 1.500025510787964 3.810762882232666 1.49999988079071 3.678643465042114 L 1.49999988079071 1.535728693008423 Z"
                    ></path>
                  </svg>
                </div>
                {stateModalState ? (
                  <div className="stateSelect">
                    {stateFilter.map(({ name, value }, index) => (
                      <li key={index}>
                        <Label check>
                          <Input
                            type="checkbox"
                            id={`custom-checkbox-state-${index}`}
                            value={value}
                            checked={checkStateFilter[index]}
                            onChange={() => handleCheckedStateAssignment(index)}
                          />{" "}
                          {name}
                        </Label>
                      </li>
                    ))}
                  </div>
                ) : null}
              </Col>
              <Col className="col-3">
                <div className="filter" onClick={() => handleDateClick()}>
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
                {dateModalState ? (
                  <div className="dateSelect">
                    <Label check>
                      <Input
                        type="date"
                        id={`custom-date-filter`}
                        onChange={(e) => handleCheckedDateAssignment(e)}
                      />{" "}
                      {}
                    </Label>
                  </div>
                ) : null}
              </Col>
              <Col>
                <div class="searchFormAssignment">
                  <input
                    type="text"
                    placeholder=""
                    name="search"
                    class="searchFieldAssignment"
                    onChange={(e) => handleFieldChange(e)}
                  />
                  <button type="submit" class="searchButtonAssignment">
                    <BsSearch />
                  </button>
                </div>
              </Col>
              <Col className="searchGroup">
                <Link to="/assignmentmanagement/createassignment">
                  <button className="btn-create-assignment" type="button">
                    Create New Assignment
                  </button>
                </Link>
              </Col>
            </Row>
            <table className="tableAssignemnt">
              <tr>
                <th className="NoTitle-table">
                  <span className="default-header" onClick={handleDefault}>
                    No.
                  </span>
                  <span id="sorting" onClick={(e) => handleSort(e, "id")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    Asset Code
                  </span>
                  <span id="sorting" onClick={(e) => handleSort(e, "assetId")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    Asset Name
                  </span>
                  <span
                    id="sorting"
                    onClick={(e) => handleSort(e, "assetName")}
                  >
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    Assigned to
                  </span>
                  <span
                    id="sorting"
                    onClick={(e) => handleSort(e, "assignedToUsername")}
                  >
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    Assigned by
                  </span>
                  <span
                    id="sorting"
                    onClick={(e) => handleSort(e, "assignedByUsername")}
                  >
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    Assigned Date
                  </span>
                  <span
                    id="sorting"
                    onClick={(e) => handleSort(e, "createdate")}
                  >
                    <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span className="default-header" onClick={handleDefault}>
                    State
                  </span>
                  <span id="sorting" onClick={(e) => handleSort(e, "status")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th></th>
              </tr>
              {calculateAssignsOnPage().map((item) => (
                  item.status !== 3 &&
                <tr
                  key={item.id}
                  onClick={() => handleAssignmentRowClick(item.id)}
                >
                  <td className="No-row-table">{item.id}</td>
                  <td className="row-table">{item.assetId}</td>
                  <td className="row-table">{item.assetName}</td>
                  <td className="row-table">{item.assignedToUsername}</td>
                  <td className="row-table">{item.assignedByUsername}</td>
                  <td className="row-table">{item.createddate}</td>
                  {item.status === 1 && <td className="row-table">Accepted</td>}
                  {item.status === 2 && (
                    <td className="row-table">Waiting for Acceptance</td>
                  )}
                  {item.status === 0 && <td className="row-table">Declined</td>}
                  {item.status === 3 && <td className="row-table">Completed</td>}
                  <td className="btn-table">
                    <div className="edtBtn_Assignment">
                      <Link
                        to={`/assignmentmanagement/editassignment/${item.id}`}
                        onClick={
                          item.status !== 2 ? (e) => e.preventDefault() : ""
                        }
                        className={item.status !== 2 ? "disable-link" : ""}
                      >
                        <svg
                          className={
                            item.status === 2
                              ? "edit_icon_kh"
                              : "edit_icon_kh disable"
                          }
                          viewBox="0 0 16.001 16"
                        >
                          <path d="M 12.85400009155273 0.1459999978542328 C 12.65875053405762 -0.04919072985649109 12.34224987030029 -0.04919090867042542 12.14700031280518 0.1459997892379761 L 10.5 1.792999982833862 L 14.20699977874756 5.5 L 15.85400009155273 3.854000091552734 C 15.94804191589355 3.760195732116699 16.00089263916016 3.632827281951904 16.00089263916016 3.5 C 16.00089263916016 3.367172718048096 15.94804191589355 3.239804267883301 15.85400009155273 3.146000146865845 L 12.85400009155273 0.1460001468658447 Z M 13.5 6.206999778747559 L 9.793000221252441 2.5 L 3.292999982833862 9 L 3.5 9 C 3.776142358779907 9 4 9.223857879638672 4 9.5 L 4 10 L 4.5 10 C 4.776142597198486 10 5 10.22385787963867 5 10.5 L 5 11 L 5.5 11 C 5.776142597198486 11 6 11.22385787963867 6 11.5 L 6 12 L 6.5 12 C 6.776142597198486 12 7 12.22385787963867 7 12.5 L 7 12.70699977874756 L 13.5 6.206999778747559 Z M 6.032000064849854 13.67499923706055 C 6.010957717895508 13.61904811859131 6.000119686126709 13.55977725982666 5.999999523162842 13.5 L 6 13 L 5.5 13 C 5.223857402801514 13 5 12.77614212036133 5 12.5 L 5 12 L 4.5 12 C 4.223857402801514 12 4 11.77614212036133 4 11.5 L 4 11 L 3.5 11 C 3.223857641220093 11 3 10.77614212036133 3 10.5 L 3 10 L 2.5 10 C 2.440221071243286 9.999902725219727 2.380945920944214 9.98906421661377 2.325000286102295 9.968001365661621 L 2.146000146865845 10.14600086212158 C 2.098350048065186 10.19398593902588 2.060928821563721 10.25113868713379 2.03600025177002 10.31400108337402 L 0.03600025177001953 15.31400108337402 C -0.03834319114685059 15.49973201751709 0.005179375410079956 15.71189785003662 0.1466411948204041 15.85336017608643 C 0.288102924823761 15.99482154846191 0.5002692937850952 16.03834342956543 0.6860000491142273 15.9640007019043 L 5.686000347137451 13.9640007019043 C 5.748862743377686 13.93907165527344 5.806015014648438 13.90165138244629 5.854000568389893 13.85400104522705 L 6.032000541687012 13.67600059509277 Z"></path>
                        </svg>
                      </Link>
                    </div>
                    <div
                      className="delBtn_Assignment"
                      onClick={
                        item.status !== 1
                          ? (e) => handleDeleteBtn(e, item)
                          : (e) => e.stopPropagation()
                      }
                    >
                      <svg
                        class={
                          item.status === 1
                            ? "x-circle-fill_kj-disable"
                            : "x-circle-fill_kj"
                        }
                        viewBox="0 0 16 16"
                      >
                        <path d="M 16 8 C 16 12.41827774047852 12.41827774047852 16 7.999999523162842 16 C 3.581721782684326 16 0 12.41827774047852 0 7.999999523162842 C 0 3.581722259521484 3.581721782684326 4.76837158203125e-07 7.999999523162842 0 C 12.41827774047852 0 16 3.581721782684326 16 7.999999523162842 Z M 5.354000091552734 4.645999908447266 C 5.158491134643555 4.450490951538086 4.841508865356445 4.450490951538086 4.645999908447266 4.645999908447266 C 4.450490951538086 4.841508865356445 4.450490951538086 5.158491134643555 4.645999908447266 5.354000091552734 L 7.293000221252441 8 L 4.645999908447266 10.64599990844727 C 4.450490951538086 10.84150791168213 4.450490951538086 11.15849113464355 4.645999908447266 11.35400009155273 C 4.841508388519287 11.54950904846191 5.158491134643555 11.54950904846191 5.354000091552734 11.35400009155273 L 8 8.706999778747559 L 10.64599990844727 11.35400009155273 C 10.84150886535645 11.54950904846191 11.15849113464355 11.54950904846191 11.35400009155273 11.35400009155273 C 11.54950904846191 11.15849113464355 11.54950904846191 10.84150886535645 11.35400009155273 10.64599990844727 L 8.706999778747559 8 L 11.35400009155273 5.354000091552734 C 11.54950904846191 5.158490657806396 11.54950904846191 4.841508388519287 11.35400009155273 4.645999431610107 C 11.15849113464355 4.450490951538086 10.84150791168213 4.450490951538086 10.64599990844727 4.646000385284424 L 8 7.293000221252441 L 5.354000091552734 4.645999908447266 Z"></path>
                      </svg>
                    </div>
                    <div
                      id={
                        (item.status === 1 && item.createRequest === false)
                          ? "arrow-counterclockwise"
                          : "arrow-counterclockwise-disable"
                      }
                      onClick={
                        (item.status === 1 && item.createRequest === false)
                          ? (e) => handleCreateRequestClick(e, item.id)
                          : (e) => e.stopPropagation()
                      }
                    >
                      <svg class="Path_19" viewBox="1.999 2 12.001 12">
                        <path
                          id={(item.status === 1 && item.createRequest === false) ? "Path_19" : "Path_19-disable"}
                          d="M 8 3 C 10.21961116790771 3.000855445861816 12.17296123504639 4.46489143371582 12.7966365814209 6.595078945159912 C 13.42031192779541 8.725265502929688 12.56500053405762 11.01162147521973 10.69633674621582 12.20943927764893 C 8.827674865722656 13.40725708007813 6.393033981323242 13.22977161407471 4.717846870422363 11.77360725402832 C 3.042660236358643 10.31744289398193 2.527979850769043 7.931215286254883 3.454000473022461 5.914000511169434 C 3.555971384048462 5.665886402130127 3.443979263305664 5.381513118743896 3.200206279754639 5.26956033706665 C 2.956433534622192 5.157607078552246 2.66775107383728 5.257969856262207 2.546000242233276 5.497000217437744 C 1.434823036193848 7.917786598205566 2.052634716033936 10.78134727478027 4.063076019287109 12.52864742279053 C 6.073515892028809 14.27594757080078 8.995233535766602 14.4886360168457 11.2375316619873 13.05091857910156 C 13.47983074188232 11.61320018768311 14.5058422088623 8.869303703308105 13.75696754455566 6.313110828399658 C 13.00809288024902 3.756919860839844 10.66363334655762 2.000452518463135 8.000001907348633 2 L 8 3 Z"
                        ></path>
                      </svg>
                      <svg class="Path_20" viewBox="5.14 0.284 2.86 4.432">
                        <path
                          id={(item.status === 1 && item.createRequest === false) ? "Path_19" : "Path_19-disable"}
                          d="M 8 4.466000080108643 L 8 0.5339999794960022 C 7.999963760375977 0.437023401260376 7.943847179412842 0.3488165140151978 7.856023788452148 0.3076893091201782 C 7.768199920654297 0.2665620744228363 7.664514541625977 0.2799350023269653 7.590000152587891 0.3419999480247498 L 5.230000019073486 2.308000087738037 C 5.173041343688965 2.355498790740967 5.140112400054932 2.425835371017456 5.140112400054932 2.5 C 5.140112400054932 2.574164867401123 5.173041343688965 2.644501209259033 5.230000019073486 2.692000150680542 L 7.590000152587891 4.657999992370605 C 7.664514541625977 4.720065593719482 7.768199920654297 4.733438491821289 7.856023788452148 4.69231128692627 C 7.94384765625 4.651183605194092 7.999963760375977 4.562976837158203 8 4.466000080108643 Z"
                        ></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            <Paginate
              size={size}
              total={assignmentList.length}
              handleCurrentPage={handleCurrentPage}
            />
          </Col>
        </Row>
      </Container>
      <CreateRequest
        show={createRequestModalShow}
        assignmentId={idAssignmentDetail}
        onModalShow={(e) => handleCreateRequestModalShowChange(e)}
      />
      <AssignmentDetailModal
        show={detailModalShow}
        assignmentId={idAssignmentDetail}
        onModalShow={(e) => handleDetailModalShowChange(e)}
      />
      <ChangePasswordModal
        show={defaultPassword}
        onStateChange={handleStateChange}
        data-backdrop="static"
        data-keyboard="false"
      ></ChangePasswordModal>
      <ActionModal
        show={deleteState}
        message="Do you want to delete this assignment?"
        actionName="Delete"
        title="Are you sure?"
        onClickCancel={handleCancel}
        onClickAction={handleDelete}
      ></ActionModal>
    </div>
  );
}
