import "../login/Login.css";
import "../login/Modal/modal.css";

export const ActionModal = ({
  onClickAction,
  show,
  message,
  actionName,
  cancelName,
  title,
  onClickCancel,
}) => {
  const showHideClassName = show
    ? "my-modal display-block"
    : "my-modal display-none";
  return (
    <div className={showHideClassName}>
      <div className="form-container">
        <div className="login-form">
          <div className="form-header">
            <div className="form-header-message">
              <span>{title}</span>
            </div>
          </div>
          <div
            className="form-body"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "200px",
            }}
          >
            <h5 className="action-content">{message}</h5>
            <div className="form-element" style={{ left: "0px" }}>
              <button
                className="action-button btn-action"
                type="button"
                onClick={onClickAction}
              >
                {actionName}
              </button>
              <button
                className="action-button btn-cancel"
                type="button"
                onClick={onClickCancel}
              >
                {cancelName !== undefined ? cancelName : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
