import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import "./sidebar.css";

export default function AdminSidebar(props) {
  const history = useHistory();
  function handleOnClick(url) {
    history.push(url);
  }
  function SidebarElement(key, name, url) {
    const elementClass =
      props.activeTab === key ? "sidebar-element active" : "sidebar-element";
    return (
      <div id={key} className={elementClass} onClick={() => handleOnClick(url)}>
        <span className="sidebar-title">{name}</span>
      </div>
    );
  }
  return (
    <div style={{ transformOrigin: "0px 0px", transform: "scale(0.7)" }}>
      <div>
        <div className="logo">
          <div className="logo-name">
            <span>Online Asset Management</span>
          </div>
          <img
            className="logo-img"
            src={process.env.PUBLIC_URL + "/Logo_lk.png"}
          ></img>
        </div>
        <div className="sidebar">
          {SidebarElement("Home", "Home", "/")}
          {SidebarElement("ManageUser", "Manage User", "/usermanagement")}
          {SidebarElement("ManageAsset", "Manage Asset", "/assetmanagement")}
          {SidebarElement(
            "ManageAssignment",
            "Manage Assignment",
            "/assignmentmanagement"
          )}
          {SidebarElement(
            "RqsForReturning",
            "Request for Returning",
            "/requestmanagement"
          )}
          {SidebarElement("Report", "Report", "/report")}
        </div>
      </div>
    </div>
  );
}
