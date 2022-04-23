import React, { useRef, useState, useEffect } from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
import { format } from "date-fns";
import "../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { ChangePasswordModal } from "../../login/Modal/ChangePasswordModal";
import { Col, Container, Row, Button, Label, Input } from "reactstrap";
import { BsSearch } from "react-icons/bs";
import "./ManageUser.css";
import { getAuth } from "../../../utils/httpHelpers";
import Navbar from "../../header/Navbar";
import { Link } from "react-router-dom";
import UserDetailModal from "./UserDetailModal/UserDetailModal";
import Pagination from "../../pagination/Pagination";
import Paginate from "../../pagination/Pagination";
import DisableUserModal from "./DisableUser/DisableUserModal";

export default function ManageUser(props) {
  const [defaultPassword, setDefaultPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [employeeList, setEmployeeList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [disableModalShow, setDisableModalShow] = useState(false);
  const [typeModalState, setTypeModalState] = useState(false);
  const [staffTypeChecked, setStaffTypeChecked] = useState(false);
  const [adminTypeChecked, setAdminTypeChecked] = useState(false);
  const [allTypeChecked, setAllTypeChecked] = useState(true);
  const [idUserDetail, setIdUserDetail] = useState("");
  const [search, setSearch] = useState("");
  let totalPage = useRef(0);
  const size = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const location = Cookies.get("location");
  const [sortable, setSortable] = useState(false);
  useEffect(() => {
    if (Cookies.get("status") === "1") {
      setDefaultPassword(true);
    }
    getAllEmployeeList();
    //remove state on reload
    window.onbeforeunload = function () {
      window.history.replaceState(null, "");
    }.bind(this);
  }, []);

  useEffect(() => {
    totalPage.current = employeeList.length;

    if (
      allTypeChecked &&
      props.location.state &&
      employeeList[0] &&
      employeeList[0].id !== props.location.state.user.id
    ) {
      var arr = employeeList;
      arr = arr.filter((el) => el.id !== props.location.state.user.id);
      arr.unshift(props.location.state.user);
      setEmployeeList(arr);
    }

    calculateEmpsOnPage();
  }, [employeeList]);

  useEffect(() => {}, [sortable]);

  async function getAllEmployeeList() {
    getAuth(`employees`)
      .then((response) => {
        if (response.status === 200) {
          var arr = [...response.data];
          setEmployeeList(arr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getEmployeeListByType(type) {
    getAuth(`employees?type=${type}`)
      .then((response) => {
        if (response.status === 200) {
          setEmployeeList([...response.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleStateChange(defaultPassword) {
    setDefaultPassword(defaultPassword);
  }

  function handleDeleteClick(e, id) {
    e.stopPropagation();
    setDisableModalShow(!disableModalShow);
    setIdUserDetail(id);
  }

  async function handleTypeClick() {
    setTypeModalState(!typeModalState);
  }

  async function handleCheckedType(key) {
    if (key === "All") {
      setAllTypeChecked(true);
      setStaffTypeChecked(false);
      setAdminTypeChecked(false);
      getAllEmployeeList();
    } else if (key === "Admin") {
      setAllTypeChecked(false);
      setStaffTypeChecked(false);
      setAdminTypeChecked(true);
      getEmployeeListByType("Admin");
    } else if (key === "Staff") {
      setAllTypeChecked(false);
      setStaffTypeChecked(true);
      setAdminTypeChecked(false);
      getEmployeeListByType("Staff");
    }
  }

  async function handleModalShowChange(e) {
    setModalShow(e);
    setIdUserDetail("");
  }

  function handleUserRowClick(id) {
    setModalShow(!modalShow);
    setIdUserDetail(id);
  }

  function handleFieldChange(e) {
    setSearch(e.target.value);
    getAuth(`employees/search?criteria=${e.target.value}&location=${location}`)
      .then((response) => {
        if (response.status === 200) {
          setEmployeeList([...response.data]);
          setCurrentPage(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCurrentPage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function calculateEmpsOnPage() {
    const indexOfLastItem = currentPage * size;
    const indexOfFirstItem = indexOfLastItem - size;
    return employeeList.slice(indexOfFirstItem, indexOfLastItem);
  }

  function handleSortByCode() {
    setSortable(true);
    employeeList.sort((e1, e2) => (e1.id < e2.id ? 1 : -1));
    console.log("sort by code");
  }

  function handleSortByFullname() {
    console.log("sort by fullname");
    setSortable(true);
    employeeList.sort((e1, e2) => {
      var fullname1 =
        e1.firstname.replace(/\s/g, "") + e1.lastname.replace(/\s/g, "");
      var fullname2 =
        e2.firstname.replace(/\s/g, "") + e2.lastname.replace(/\s/g, "");
      if (fullname1 < fullname2) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  function handleSortByJoinedDate() {
    console.log("sort by joined date");
    setSortable(true);
    employeeList.sort((e1, e2) => (e1.joineddate < e2.joineddate ? 1 : -1));
  }

  function handleDefault() {
    console.log("default triggered");
    setSortable(false);
    getAllEmployeeList();
  }

  async function handleDisableModalShowChange(e) {
    setDisableModalShow(e);
    setIdUserDetail("");
  }

  return (
    <div>
      {}
      <ChangePasswordModal
        show={defaultPassword}
        onStateChange={handleStateChange}
        data-backdrop="static"
        data-keyboard="false"
      ></ChangePasswordModal>
      <Navbar titleName="Manage User" />
      <Container className="container-style">
        <Row>
          <Col xs="2">
            <AdminSidebar activeTab="ManageUser" />
          </Col>
          <Col xs="10">
            <p className="title">User List</p>
            <Row>
              <Col className="col-4">
                <div className="filter" onClick={() => handleTypeClick()}>
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
                {typeModalState ? (
                  <div className="typeSelect">
                    <div>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={allTypeChecked}
                          onChange={() => handleCheckedType("All")}
                        />{" "}
                        All
                      </Label>
                    </div>
                    <div>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={adminTypeChecked}
                          onChange={() => handleCheckedType("Admin")}
                        />{" "}
                        Admin
                      </Label>
                    </div>
                    <div>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={staffTypeChecked}
                          onChange={() => handleCheckedType("Staff")}
                        />{" "}
                        Staff
                      </Label>
                    </div>
                  </div>
                ) : null}
              </Col>
              <Col>
                <div class="searchFormUser">
                  <input
                    type="text"
                    placeholder=""
                    name="search"
                    class="searchFieldUser"
                    onChange={(e) => handleFieldChange(e)}
                  />
                  <button type="submit" class="searchButtonUser">
                    <BsSearch />
                  </button>
                </div>
              </Col>
              <Col className="searchGroup">
                <Link to="/usermanagement/createuser">
                  <button
                    className="btn-create"
                    type="button"
                    style={{ left: "auto" }}
                  >
                    Create New User
                  </button>
                </Link>
              </Col>
            </Row>
            <table className="tableUser">
              <tr>
                <th className="staffCodeTitle-table">
                  <span onClick={handleDefault} className="default-header">
                    Staff Code
                  </span>
                  <span onClick={handleSortByCode} id="sorting">
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  <span onClick={handleDefault} className="default-header">
                    Full Name
                  </span>
                  <span onClick={handleSortByFullname} id="sorting">
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">Username</th>
                <th className="title-table">
                  <span onClick={handleDefault} className="default-header">
                    Joined Date
                  </span>
                  <span onClick={handleSortByJoinedDate} id="sorting">
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-table">
                  Type
                  <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                    <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                  </svg>
                </th>
                <th></th>
              </tr>
              {calculateEmpsOnPage().map((user) => (
                <tr key={user.id} onClick={() => handleUserRowClick(user.id)}>
                  <td className="row-table">{user.id}</td>
                  <td className="row-table fullname-col">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="row-table username-col">{user.username}</td>
                  <td className="row-table">
                    {format(new Date(user.joineddate), "dd/MM/yyyy")}
                  </td>
                  <td className="row-table">{user.type}</td>
                  <td className="btn-table">
                    <Link to={`/usermanagement/edituser/${user.id}`}>
                      <div className="edtBtn_User">
                        <svg class="edit_icon_kh" viewBox="0 0 16.001 16">
                          <path d="M 12.85400009155273 0.1459999978542328 C 12.65875053405762 -0.04919072985649109 12.34224987030029 -0.04919090867042542 12.14700031280518 0.1459997892379761 L 10.5 1.792999982833862 L 14.20699977874756 5.5 L 15.85400009155273 3.854000091552734 C 15.94804191589355 3.760195732116699 16.00089263916016 3.632827281951904 16.00089263916016 3.5 C 16.00089263916016 3.367172718048096 15.94804191589355 3.239804267883301 15.85400009155273 3.146000146865845 L 12.85400009155273 0.1460001468658447 Z M 13.5 6.206999778747559 L 9.793000221252441 2.5 L 3.292999982833862 9 L 3.5 9 C 3.776142358779907 9 4 9.223857879638672 4 9.5 L 4 10 L 4.5 10 C 4.776142597198486 10 5 10.22385787963867 5 10.5 L 5 11 L 5.5 11 C 5.776142597198486 11 6 11.22385787963867 6 11.5 L 6 12 L 6.5 12 C 6.776142597198486 12 7 12.22385787963867 7 12.5 L 7 12.70699977874756 L 13.5 6.206999778747559 Z M 6.032000064849854 13.67499923706055 C 6.010957717895508 13.61904811859131 6.000119686126709 13.55977725982666 5.999999523162842 13.5 L 6 13 L 5.5 13 C 5.223857402801514 13 5 12.77614212036133 5 12.5 L 5 12 L 4.5 12 C 4.223857402801514 12 4 11.77614212036133 4 11.5 L 4 11 L 3.5 11 C 3.223857641220093 11 3 10.77614212036133 3 10.5 L 3 10 L 2.5 10 C 2.440221071243286 9.999902725219727 2.380945920944214 9.98906421661377 2.325000286102295 9.968001365661621 L 2.146000146865845 10.14600086212158 C 2.098350048065186 10.19398593902588 2.060928821563721 10.25113868713379 2.03600025177002 10.31400108337402 L 0.03600025177001953 15.31400108337402 C -0.03834319114685059 15.49973201751709 0.005179375410079956 15.71189785003662 0.1466411948204041 15.85336017608643 C 0.288102924823761 15.99482154846191 0.5002692937850952 16.03834342956543 0.6860000491142273 15.9640007019043 L 5.686000347137451 13.9640007019043 C 5.748862743377686 13.93907165527344 5.806015014648438 13.90165138244629 5.854000568389893 13.85400104522705 L 6.032000541687012 13.67600059509277 Z"></path>
                        </svg>
                      </div>
                    </Link>
                    <div
                      className="delBtn_User"
                      onClick={(e) => handleDeleteClick(e, user.id)}
                    >
                      <svg class="x-circle-fill_kj" viewBox="0 0 16 16">
                        <path d="M 16 8 C 16 12.41827774047852 12.41827774047852 16 7.999999523162842 16 C 3.581721782684326 16 0 12.41827774047852 0 7.999999523162842 C 0 3.581722259521484 3.581721782684326 4.76837158203125e-07 7.999999523162842 0 C 12.41827774047852 0 16 3.581721782684326 16 7.999999523162842 Z M 5.354000091552734 4.645999908447266 C 5.158491134643555 4.450490951538086 4.841508865356445 4.450490951538086 4.645999908447266 4.645999908447266 C 4.450490951538086 4.841508865356445 4.450490951538086 5.158491134643555 4.645999908447266 5.354000091552734 L 7.293000221252441 8 L 4.645999908447266 10.64599990844727 C 4.450490951538086 10.84150791168213 4.450490951538086 11.15849113464355 4.645999908447266 11.35400009155273 C 4.841508388519287 11.54950904846191 5.158491134643555 11.54950904846191 5.354000091552734 11.35400009155273 L 8 8.706999778747559 L 10.64599990844727 11.35400009155273 C 10.84150886535645 11.54950904846191 11.15849113464355 11.54950904846191 11.35400009155273 11.35400009155273 C 11.54950904846191 11.15849113464355 11.54950904846191 10.84150886535645 11.35400009155273 10.64599990844727 L 8.706999778747559 8 L 11.35400009155273 5.354000091552734 C 11.54950904846191 5.158490657806396 11.54950904846191 4.841508388519287 11.35400009155273 4.645999431610107 C 11.15849113464355 4.450490951538086 10.84150791168213 4.450490951538086 10.64599990844727 4.646000385284424 L 8 7.293000221252441 L 5.354000091552734 4.645999908447266 Z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
            <Paginate
              size={size}
              total={employeeList.length}
              handleCurrentPage={handleCurrentPage}
            />
          </Col>
        </Row>
      </Container>
      <UserDetailModal
        show={modalShow}
        userId={idUserDetail}
        onModalShow={(e) => handleModalShowChange(e)}
      />
      <DisableUserModal
        show={disableModalShow}
        userId={idUserDetail}
        onModalShow={(e) => handleDisableModalShowChange(e)}
      />
    </div>
  );
}
