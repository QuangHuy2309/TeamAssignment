import React, { useState, useEffect } from "react";
import { getAuth } from "../../../../utils/httpHelpers";
import { dateConvert } from "../../../../utils/utils";
import { format } from "date-fns";
import { Col, Row, Label } from "reactstrap";
import "./UserDetailModal.css";

export default function UserDetailModal(props) {
  // const [statusModal, setStatusModal] = useState(props.show)
  const [showHideClassName, setShowHideClassName] = useState("");
  const [userDetail, setUserDetail] = useState(Object);

  useEffect(() => {
    //  console.log(props.userId);
    showModal();
    if (props.show) {
      getUserDetail();
    }
  }, [props.show]);
  async function showModal() {
    const nameClass = props.show
      ? "my-modal display-block"
      : "my-modal display-none";
    setShowHideClassName(nameClass);
  }
  async function getUserDetail() {
    getAuth(`employees/${props.userId}`)
      .then((response) => {
        if (response.status === 200) {
          setUserDetail(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function handleCloseModal() {
    props.onModalShow(false);
  }
  return (
    <div className={showHideClassName}>
      <div className="form-container-userdetail">
        <div className="login-form-userdetail">
          <div className="form-header-userdetail">
            <div className="form-header-message-userdetail">
              <span>Detail User Infomation</span>
              <div className="exit-btn-modal">
                <svg
                  class="x-square-fill_kx"
                  viewBox="0 0 20 20"
                  onClick={() => handleCloseModal()}
                >
                  <path
                    // onClick="application.goToTargetView(event)"
                    id="x-square-fill_kx"
                    d="M 2.5 0 C 1.119288086891174 0 -2.980232238769531e-07 1.119288444519043 0 2.500000238418579 L 0 17.5 C 0 18.88071250915527 1.119288206100464 20 2.5 20 L 17.5 20 C 18.88071250915527 20 20 18.88071250915527 20 17.5 L 20 2.5 C 20 1.119288086891174 18.88071250915527 0 17.5 0 L 2.5 0 Z M 6.692500114440918 5.807499885559082 L 10 9.116250038146973 L 13.30749988555908 5.807499885559082 C 13.5518856048584 5.563113689422607 13.9481143951416 5.563113689422607 14.19250011444092 5.807499885559082 C 14.43688583374023 6.051885604858398 14.43688583374023 6.448113918304443 14.19250011444092 6.692500114440918 L 10.88374996185303 10 L 14.19250011444092 13.30749988555908 C 14.43688583374023 13.5518856048584 14.43688583374023 13.9481143951416 14.19250011444092 14.19250011444092 C 13.9481143951416 14.43688583374023 13.5518856048584 14.43688583374023 13.30749988555908 14.19250011444092 L 10 10.88374996185303 L 6.692500114440918 14.19250011444092 C 6.448113441467285 14.43688583374023 6.051885604858398 14.43688583374023 5.807499408721924 14.19250011444092 C 5.563113689422607 13.9481143951416 5.563113689422607 13.55188465118408 5.80750036239624 13.30749988555908 L 9.116250038146973 10 L 5.807499885559082 6.692500114440918 C 5.563113689422607 6.448113918304443 5.563113689422607 6.051886081695557 5.807499885559082 5.807499885559082 C 6.051886081695557 5.563113689422607 6.448113918304443 5.563113689422607 6.692500114440918 5.807499885559082 Z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="form-body-userdetail">
            {/* <div className="form-element">
                <label for="password" className="form-label">
                  <span>New password</span> 
                </label>
              </div> */}
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Staff Code</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userCode" className="text-userdetail">
                  {userDetail.id}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Full Name</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userFullName" className="text-userdetail">
                  {userDetail.firstname} {userDetail.lastname}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Username</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userUsername" className="text-userdetail">
                  {userDetail.username}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Date of Birth</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userDOB" className="text-userdetail">
                  {/* {userDetail.dob} */}
                  {/* {format(new Date(userDetail.dob), "dd/MM/yyyy")} */}
                  {dateConvert(userDetail.dob)}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Gender</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userGender" className="text-userdetail">
                  {userDetail.gender ? "Female" : "Male"}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Joined Date</Label>
              </Col>
              <Col className="col-5">
                <Label
                  id="userdetail-userJoinedDate"
                  className="text-userdetail"
                >
                  {/* {format(new Date(userDetail.joineddate), "dd/MM/yyyy")} */}
                  {dateConvert(userDetail.joineddate)}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Type</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userType" className="text-userdetail">
                  {userDetail.type}
                </Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="col-5">
                <Label className="text-userdetail">Location</Label>
              </Col>
              <Col className="col-5">
                <Label id="userdetail-userLocation" className="text-userdetail">
                  {userDetail.location}
                </Label>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
