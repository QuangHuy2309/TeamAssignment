import React, { useEffect, useState } from "react";

// import "../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { ChangePasswordModal } from "../../login/Modal/ChangePasswordModal";
import { getAuth, putAuth } from "../../../utils/httpHelpers";
import AssignmentDetailModal from "./AssignmentDetailModal/AssignmentDetailModal";
import "./UserAssignment.css";
import { ActionModal } from "../../modal/ActionModal";
import CreateRequest from "../../admin/RequestForReturning/CreateRequest/CreateRequest";

export default function UserAssignment(props) {
  const [defaultPassword, setDefaultPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [assignmentList, setAssignmentList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [acceptModalOn, setAcceptModalOn] = useState(false);
  const [declineModalOn, setDeclineModalOn] = useState(false);
  const [assignDetailId, setAssignDetailId] = useState("");
  const [activeAssignment, setActiveAssignment] = useState(Object);
  const [createRequestModalShow, setCreateRequestModalShow] = useState(false);

  useEffect(() => {
    if (Cookies.get("status") === "1") {
      setDefaultPassword(true);
    }
    fetchData();
  }, []);
  function fetchData() {
    getAuth(`assignments/assignedTo/${Cookies.get("id")}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setAssignmentList([...response.data]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleStateChange(defaultPassword) {
    setDefaultPassword(defaultPassword);
  }

  async function handleAssignRowClick(id) {
    // console.log("Row clicked");
    setModalState(!modalState);
    setAssignDetailId(id);
    // console.log(this.state.modalState);
  }

  async function handleModalShowChange(e) {
    setModalState(e);
    setAssignDetailId("");
  }

  function handleAcceptBtn(assignment) {
    setActiveAssignment(assignment);
    setAcceptModalOn(true);
  }
  function handleDeclineBtn(assignment) {
    setActiveAssignment(assignment);
    setDeclineModalOn(true);
  }
  async function handleAccept() {
    putAuth(`assignments/status/${activeAssignment.id}?status=1`)
      .then((response) => {
        if (response.status === 200) {
          setAcceptModalOn(false);
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  }
  async function handleDecline() {
    putAuth(`assignments/status/${activeAssignment.id}?status=0`)
      .then((response) => {
        if (response.status === 200) {
          setDeclineModalOn(false);
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  }
  function handleCancel() {
    setDeclineModalOn(false);
    setAcceptModalOn(false);
  }
  async function handleCreateRequestModalShowChange(e) {
    setCreateRequestModalShow(e);
    setAssignDetailId("");
  }
  function handleCreateRequestClick(e,id) {
    e.stopPropagation();
    setCreateRequestModalShow(!createRequestModalShow);
    setAssignDetailId(id);
  }
  return (
    <div>
      <ChangePasswordModal
        show={defaultPassword}
        onStateChange={handleStateChange}
        data-backdrop="static"
        data-keyboard="false"
      ></ChangePasswordModal>
      <ActionModal
        show={acceptModalOn}
        message="Do you want to accept this assignment?"
        actionName="Accept"
        title="Are you sure?"
        onClickCancel={handleCancel}
        onClickAction={handleAccept}
      ></ActionModal>
      <ActionModal
        show={declineModalOn}
        message="Do you want to decline this assignment?"
        actionName="Decline"
        title="Are you sure?"
        onClickCancel={handleCancel}
        onClickAction={handleDecline}
      ></ActionModal>
      <p className="title">My Assignment</p>
      <table className="tableAsset">
        <tr>
          <th className="assetCodeTitle-table">
            Asset Code
            <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
              <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
            </svg>
          </th>
          <th className="title-table">
            Asset Name
            <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
              <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
            </svg>
          </th>
          <th className="title-table">
            Category
            <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
              <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
            </svg>
          </th>
          <th className="title-table">
            Assigned Date
            <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
              <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
            </svg>
          </th>
          <th className="title-table">
            State
            <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
              <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
            </svg>
          </th>
          <th></th>
        </tr>
        {assignmentList.map((assignment) => (
            //only accepted (1) or waiting (2)
            (assignment.status === 1 || assignment.status === 2) &&
          <tr key={assignment.id}>
            <td
              className="row-table"
              onClick={() => handleAssignRowClick(assignment.id)}
            >
              {assignment.assetId}
            </td>
            <td
              className="row-table"
              onClick={() => handleAssignRowClick(assignment.id)}
            >
              {assignment.assetName}
            </td>
            <td
              className="row-table"
              onClick={() => handleAssignRowClick(assignment.id)}
            >
              {assignment.categoryName}
            </td>
            <td
              className="row-table"
              onClick={() => handleAssignRowClick(assignment.id)}
            >
              {assignment.createddate}
            </td>
            {assignment.status === 1 && (
              <td
                className="row-table"
                onClick={() => handleAssignRowClick(assignment.id)}
              >
                Accepted
              </td>
            )}
            {assignment.status === 2 && (
              <td
                className="row-table"
                onClick={() => handleAssignRowClick(assignment.id)}
              >
                Waiting
              </td>
            )}
            {assignment.status === 0 && (
              <td
                className="row-table"
                onClick={() => handleAssignRowClick(assignment.id)}
              >
                Declined
              </td>
            )}
            {assignment.status === 3 && (
                <td
                className="row-table"
                onClick={() => handleAssignRowClick(assignment.id)}
            >
              Completed
            </td>
            )}
            <td className="btn-table">
              <div className="edtBtn_Asset">
                <svg
                  className={
                    assignment.status === 2 ? "check_llz enable" : "check_llz"
                  }
                  viewBox="4.085 4.745 14 14"
                  onClick={
                    assignment.status === 2
                      ? () => handleAcceptBtn(assignment)
                      : (e) => e.stopPropagation()
                  }
                >
                  <path
                    id={
                      assignment.status === 2
                        ? "check_llz"
                        : "check_llz-disable"
                    }
                    d="M 15.88251972198486 5.22925853729248 C 16.37931823730469 4.592541694641113 17.1929931640625 4.582422256469727 17.69981956481934 5.206541061401367 C 18.20664978027344 5.830659866333008 18.21470642089844 6.852676868438721 17.71781730651855 7.489279270172119 L 10.87727165222168 18.22909164428711 C 10.63972759246826 18.55045890808105 10.30831336975098 18.73660850524902 9.959246635437012 18.74472999572754 C 9.610179901123047 18.75284767150879 9.273505210876465 18.58223915100098 9.026650428771973 18.27213668823242 L 4.494339942932129 12.57717704772949 C 4.150516510009766 12.17476177215576 4.008988380432129 11.56871318817139 4.125275611877441 10.9967794418335 C 4.241561889648438 10.42484664916992 4.59712028503418 9.978251457214355 5.052460670471191 9.832186698913574 C 5.507802963256836 9.686124801635742 5.990307807922363 9.8638916015625 6.310689926147461 10.29575061798096 L 9.898839950561523 14.80049419403076 L 15.8499641418457 5.276608467102051 C 15.86058139801025 5.25993537902832 15.87202930450439 5.244120597839355 15.88423347473145 5.229257583618164 Z"
                  ></path>
                </svg>
                <svg
                  class={
                    assignment.status === 2
                      ? "x-square-fill_ll enable"
                      : "x-square-fill_ll"
                  }
                  viewBox="4.499 4.499 12 12"
                  onClick={
                    assignment.status === 2
                      ? () => handleDeclineBtn(assignment)
                      : (e) => e.stopPropagation()
                  }
                >
                  <path
                    id={
                      assignment.status === 2
                        ? "x-square-fill_ll"
                        : "x-square-fill_ll-disable"
                    }
                    d="M 5.964186668395996 4.750691413879395 L 10.49936866760254 9.287588119506836 L 15.03454780578613 4.750691413879395 C 15.36964797973633 4.415594100952148 15.9129467010498 4.415594100952148 16.24804306030273 4.750691413879395 C 16.58314323425293 5.085788249969482 16.58314323425293 5.62908935546875 16.24804306030273 5.964186668395996 L 11.71114921569824 10.49936866760254 L 16.24804306030273 15.03454780578613 C 16.58314323425293 15.36964797973633 16.58314323425293 15.9129467010498 16.24804306030273 16.24804306030273 C 15.9129467010498 16.58314323425293 15.36964797973633 16.58314323425293 15.03454780578613 16.24804306030273 L 10.49936866760254 11.71114921569824 L 5.964186668395996 16.24804306030273 C 5.629088401794434 16.58314323425293 5.085788249969482 16.58314323425293 4.750690460205078 16.24804306030273 C 4.415594100952148 15.9129467010498 4.415594100952148 15.36964416503906 4.750692367553711 15.03454780578613 L 9.287588119506836 10.49936866760254 L 4.750691413879395 5.964186668395996 C 4.415594100952148 5.62908935546875 4.415594100952148 5.085789203643799 4.750691413879395 4.750691413879395 C 5.085789203643799 4.415594100952148 5.62908935546875 4.415594100952148 5.964186668395996 4.750691413879395 Z"
                  ></path>
                </svg>
                <div
                  className={(assignment.status === 1 && assignment.createRequest===false) ? "enable" : ""}
                  onClick={
                    (assignment.status === 1 && assignment.createRequest===false)
                      ? (e) => handleCreateRequestClick(e,assignment.id)
                      : (e) => e.stopPropagation()
                  }
                >
                  <svg class="Path_19_mh" viewBox="1.999 2 12.001 12">
                    <path
                      id={
                        (assignment.status === 1 && assignment.createRequest===false)
                          ? "Path_19_mh"
                          : "Path_19_mh-disable"
                      }
                      d="M 8 3 C 10.21961116790771 3.000855445861816 12.17296123504639 4.46489143371582 12.7966365814209 6.595078945159912 C 13.42031192779541 8.725265502929688 12.56500053405762 11.01162147521973 10.69633674621582 12.20943927764893 C 8.827674865722656 13.40725708007813 6.393033981323242 13.22977161407471 4.717846870422363 11.77360725402832 C 3.042660236358643 10.31744289398193 2.527979850769043 7.931215286254883 3.454000473022461 5.914000511169434 C 3.555971384048462 5.665886402130127 3.443979263305664 5.381513118743896 3.200206279754639 5.26956033706665 C 2.956433534622192 5.157607078552246 2.66775107383728 5.257969856262207 2.546000242233276 5.497000217437744 C 1.434823036193848 7.917786598205566 2.052634716033936 10.78134727478027 4.063076019287109 12.52864742279053 C 6.073515892028809 14.27594757080078 8.995233535766602 14.4886360168457 11.2375316619873 13.05091857910156 C 13.47983074188232 11.61320018768311 14.5058422088623 8.869303703308105 13.75696754455566 6.313110828399658 C 13.00809288024902 3.756919860839844 10.66363334655762 2.000452518463135 8.000001907348633 2 L 8 3 Z"
                    ></path>
                  </svg>
                  <svg class="Path_20_mh" viewBox="5.14 0.284 2.86 4.432">
                    <path
                      id={
                        (assignment.status === 1 && assignment.createRequest===false)
                          ? "Path_20_mh"
                          : "Path_20_mh-disable"
                      }
                      d="M 8 4.466000080108643 L 8 0.5339999794960022 C 7.999963760375977 0.437023401260376 7.943847179412842 0.3488165140151978 7.856023788452148 0.3076893091201782 C 7.768199920654297 0.2665620744228363 7.664514541625977 0.2799350023269653 7.590000152587891 0.3419999480247498 L 5.230000019073486 2.308000087738037 C 5.173041343688965 2.355498790740967 5.140112400054932 2.425835371017456 5.140112400054932 2.5 C 5.140112400054932 2.574164867401123 5.173041343688965 2.644501209259033 5.230000019073486 2.692000150680542 L 7.590000152587891 4.657999992370605 C 7.664514541625977 4.720065593719482 7.768199920654297 4.733438491821289 7.856023788452148 4.69231128692627 C 7.94384765625 4.651183605194092 7.999963760375977 4.562976837158203 8 4.466000080108643 Z"
                    ></path>
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </table>
      <AssignmentDetailModal
        show={modalState}
        assignDetailId={assignDetailId}
        onModalShow={(e) => handleModalShowChange(e)}
      />
      <CreateRequest
        show={createRequestModalShow}
        assignmentId={assignDetailId}
        onModalShow={(e) => handleCreateRequestModalShowChange(e)}
      />
    </div>
  );
}
