import Cookies from "js-cookie";
import { useState } from "react";
import { putAuth } from "../../../utils/httpHelpers";
import "../Login.css";
import "./modal.css";

export const ChangePasswordModal = ({ onStateChange, show }) => {
  const showHideClassName = show
    ? "my-modal display-block"
    : "my-modal display-none";
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  function handlePassword(e) {
    if (e.target.value.trim().length != 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  const handleSave = (formData) => {
    formData.preventDefault();
    const body = JSON.stringify({
      newPassword: formData.target.password.value.trim(),
    });
    putAuth(`employees/updatePassword/${Cookies.get("id")}`, body)
      .then((response) => {
        if (response.status === 200) {
          Cookies.set("status", "2", { expires: 1 });
          onStateChange(false);
        }
      })
      .catch((error) => {
        setErrorMessage("Password must have between 6 and 50 characters.");
      });
  };
  return (
    <div className={showHideClassName}>
      <div className="form-container">
        <div className="login-form">
          <div className="form-header">
            <div className="form-header-message" style={{ textAlign: "left" }}>
              <span>Change Password</span>
            </div>
          </div>
          <div className="form-body">
            <form id="login-form" onSubmit={handleSave}>
              <div
                style={{
                  paddingLeft: "50px",
                  textAlign: "left",
                  paddingTop: "10px",
                }}
              >
                <span>This is the first time you logged in.</span>
                <br></br>
                <span>You have to change your password to continue.</span>
              </div>
              <div className="error-message " style={{ fontSize: "16px" }}>
                {errorMessage}
              </div>
              <div className="form-element">
                <label for="password" className="form-label">
                  <span>New password</span>
                  <span style={{ color: "rgba(233, 66, 77, 1)" }}> *</span>
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="form-input"
                  minLength="8"
                  maxLength="50"
                  onChange={(e) => handlePassword(e)}
                ></input>
                <div
                  id="eye-fill_lz"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <svg class="Path_24_l" viewBox="5.5 5.5 5 5">
                    <path
                      id="Path_24_l"
                      d="M 10.5 8 C 10.50000095367432 9.380711555480957 9.380712509155273 10.5 8.000000953674316 10.5 C 6.619288921356201 10.5 5.500000953674316 9.380711555480957 5.500000953674316 8 C 5.500000953674316 6.619287967681885 6.619289398193359 5.5 8.000000953674316 5.5 C 9.380712509155273 5.5 10.50000095367432 6.619288444519043 10.50000095367432 8 Z"
                    ></path>
                  </svg>
                  <svg class="Path_25_l" viewBox="0 2.5 16 11">
                    <path
                      id="Path_25_l"
                      d="M 0 8 C 0 8 3 2.5 8 2.5 C 13 2.5 16 8 16 8 C 16 8 13 13.5 8 13.5 C 3 13.5 0 8 0 8 Z M 8 11.5 C 9.93299674987793 11.5 11.5 9.93299674987793 11.5 8 C 11.5 6.06700325012207 9.93299674987793 4.5 8 4.5 C 6.06700325012207 4.5 4.5 6.06700325012207 4.5 8 C 4.5 9.93299674987793 6.06700325012207 11.5 8 11.5 Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="form-element">
                <button
                  className="form-button"
                  type="submit"
                  disabled={disabled}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
