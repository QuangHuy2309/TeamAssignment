import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Label,
  Input,
  Form,
  FormGroup,
} from "reactstrap";
import Cookies from "js-cookie";
import { getAuth } from "../../../../../utils/httpHelpers";
import { BsSearch } from "react-icons/bs";
import "./SelectUserModal.css";

export default function SelectUserModal(props) {
  const [showHideClassName, setShowHideClassName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [search, setSearch] = useState("");
  const location = Cookies.get("location");

  useEffect(() => {
    //  console.log(props.userId);
    showModal();
    if (props.show) {
      getUserList();
    }
  }, [props.show]);
  async function showModal() {
    const nameClass = props.show
      ? "my-modal-UserSelect display-block"
      : "my-modal-UserSelect display-none";
    setShowHideClassName(nameClass);
  }
  async function getUserList() {
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
  function handleFormSearchSubmit(e) {
    // e.preventDefault();
    // getAuth(`employees/search?criteria=${search}&location=${location}`)
    //     .then((response) => {
    //         if (response.status === 200) {
    //             setEmployeeList([...response.data]);
    //             setCurrentPage(1);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    props.onValueChange(e.target.selectedUser.value);
    props.onModalShow(false);
    // console.log("Form submit");
    // console.log(`${e.target.selectedUser.value}`);
  }
  // function handleUserRowClick(id) {
  //   console.log(id);
  // }
  async function handleSearchFieldChange(e) {
    // console.log(e.target.value);
    // setSearch(e.target.value);
    e.preventDefault();
    getAuth(`employees/search?criteria=${e.target.value}&location=${location}`)
      .then((response) => {
        if (response.status === 200) {
          setEmployeeList([...response.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function handleCancelClick() {
    props.onModalShow(false);
  }
  return (
    <div>
      <div className={showHideClassName}>
        <div className="form-container-selectUserModal">
          <div className="login-form-selectUserModal">
            <div className="form-body-selectUserModal">
              <Row className="title-selectUserModal">
                <Col className="titleModal-selectUserModal col-4">
                  Select User
                </Col>
                <Col className="colSearch">
                  <form
                    class="searchForm"
                    onSubmit={(e) => handleSearchFieldChange(e)}
                  >
                    <input
                      type="text"
                      name="search"
                      class="searchField-User"
                      onChange={(e) => handleSearchFieldChange(e)}
                    />
                    <button type="submit" class="searchButton-User">
                      <BsSearch />
                    </button>
                  </form>
                </Col>
              </Row>
              <Form onSubmit={(e) => handleFormSubmit(e)}>
                <div class="scroll-table-selectUserModal">
                  <table className="tableUser-selectUserModal">
                    <tr>
                      <th></th>
                      <th className="staffCodeTitle-table">
                        <span>Staff Code</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                      <th className="title-table-FullName">
                        <span>Full Name</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                      <th className="title-table">
                        <span>Type</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                    </tr>
                    {/* </table> */}
                    {/* <table className="tableUser-data-selectUserModal"> */}
                    {/* <div class="scroll-table-selectUserModal"> */}
                    {employeeList.map((user) => (
                      <tr
                        key={user.id}
                        // onClick={() => handleUserRowClick(user.id)}
                      >
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="selectedUser"
                                value={`${
                                  user.id
                                }-${user.firstname.trim()} ${user.lastname.trim()}`}
                                required="required"
                              />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="row-table">{user.id}</td>
                        <td className="row-table fullname-col">
                          {user.firstname} {user.lastname}
                        </td>
                        <td className="row-table">{user.type}</td>
                      </tr>
                    ))}
                    {/* </div> */}
                  </table>
                </div>
                <div className="btn-UserSelect">
                <button className="btn-save-selectUserModal" type="submit">
                  Save
                </button>
                <button
                  className="btn-cancel-selectUserModal"
                  type="button"
                  style={{ left: "auto" }}
                  onClick={() => handleCancelClick()}
                >
                  Cancel
                </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
