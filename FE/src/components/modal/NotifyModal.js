import "../login/Login.css";
import "../login/Modal/modal.css";

export const NotifyModal = ({ onStateChange, show, message }) => {
  const showHideClassName = show
    ? "my-modal display-block"
    : "my-modal display-none";
  function onClickCancel() {
    onStateChange(false);
  }
  return (
    <div className={showHideClassName}>
      <div className="form-container">
        <div className="login-form">
          <div className="form-header">
            <div
              className="form-header-message"
              style={{ textAlign: "center" }}
            >
              <span>Online Asset Management</span>
            </div>
          </div>
          <div
            className="form-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h5>{message}</h5>
            <div className="form-element">
              <button
                className="form-button"
                type="button"
                style={{
                  top: "20px",
                  right: "50px",
                }}
                onClick={onClickCancel}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
