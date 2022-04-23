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
import "./SelectAssetModal.css";

export default function SelectAssetModal(props) {
  const [showHideClassName, setShowHideClassName] = useState("");
  const [assetList, setAssetList] = useState([]);
  const [search, setSearch] = useState("");
  const location = Cookies.get("location");

  useEffect(() => {
    //  console.log(props.userId);
    showModal();
    if (props.show) {
      getAssetList();
    }
  }, [props.show]);
  async function showModal() {
    const nameClass = props.show
      ? "my-modal-selectAssetModal display-block"
      : "my-modal-selectAssetModal display-none";
    setShowHideClassName(nameClass);
  }
  async function getAssetList() {
    getAuth("assets?state=1")
    .then((response) => {
      if (response.status === 200) {
        var arr = [...response.data];
        setAssetList(arr);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    props.onValueChange(e.target.selectedUser.value);
    props.onModalShow(false);
  }

  async function handleSearchFieldChange(e) {
    e.preventDefault();
    if(e.target.value.trim() != ""){
    getAuth(`assets/search?criteria=${e.target.value}&location=${location}`)
      .then((response) => {
        if (response.status === 200) {
          setAssetList([...response.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else getAssetList();
    
  }
  async function handleCancelClick() {
    props.onModalShow(false);
  }
  return (
    <div>
      <div className={showHideClassName}>
        <div className="form-container-selectAssetModal">
          <div className="login-form-selectAssetModal">
            <div className="form-body-selectAssetModal">
              <Row className="title-selectAssetModal">
                <Col className="titleModal-selectAssetModal col-4">
                  Select Asset
                </Col>
                <Col className="colSearch">
                  <form
                    class="searchForm"
                    onSubmit={(e) => handleSearchFieldChange(e)}
                  >
                    <input
                      type="text"
                      name="search"
                      class="searchField-Asset"
                      onChange={(e) => handleSearchFieldChange(e)}
                    />
                    <button type="submit" class="searchButton-Asset">
                      <BsSearch />
                    </button>
                  </form>
                </Col>
              </Row>
              <Form onSubmit={(e) => handleFormSubmit(e)}>
                <div class="scroll-table-selectAssetModal">
                  <table className="tableUser-selectAssetModal">
                    <tr>
                      <th></th>
                      <th className="staffCodeTitle-table">
                        <span>Asset Code</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                      <th className="title-table-FullName">
                        <span>Asset Name</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                      <th className="title-table">
                        <span>Category</span>
                        <svg
                          class="icondropdown_arrow_m"
                          viewBox="0.023 -6 12 6"
                          id="sorting"
                        >
                          <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                        </svg>
                      </th>
                    </tr>
                    {assetList.map((asset) => (
                      <tr
                        key={asset.id}
                        // onClick={() => handleUserRowClick(user.id)}
                      >
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="selectedUser"
                                value={`${
                                  asset.id
                                }-${asset.name.trim()}`}
                                required="required"
                              />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="row-table">{asset.id}</td>
                        <td className="row-table fullname-col">
                          {asset.name}
                        </td>
                        <td className="row-table">{asset.categoryName}</td>
                      </tr>
                    ))}
                    {/* </div> */}
                  </table>
                </div>
                <div className="btn-UserSelect">
                <button className="btn-save-selectAssetModal" type="submit">
                  Save
                </button>
                <button
                  className="btn-cancel-selectAssetModal"
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
