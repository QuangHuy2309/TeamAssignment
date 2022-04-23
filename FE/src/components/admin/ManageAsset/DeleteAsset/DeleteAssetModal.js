import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteAuth, getAuth } from "../../../../utils/httpHelpers";
import './DeleteAsset.css';


export default function DeleteAssetModal(props) {
    const [showHideClassName, setShowHideClassName] = useState("");
    const [modalTitle, setModalTitle] = useState("")
    const [assetCanDelete, setAssetCanDelete] = useState(false);
    const [newOpen, setNewOpen] = useState(true);

    useEffect(() => {
        setNewOpen(true);
        checkAssetHistory();
        showModal();
    }, [props.show]);

    async function showModal() {
        const nameClass = props.show
            ? "my-modal display-block"
            : "my-modal display-none";
        setShowHideClassName(nameClass);
        setModalTitle("");
    }
    async function checkAssetHistory() {
        getAuth(`assets/${props.assetId}/assignments?state=1,2,3`)
            .then((response) => {
                var arr = [...response.data]
                if(arr.length===0) {
                    setModalTitle("Are you sure?");
                    setAssetCanDelete(true);
                    setNewOpen(false);
                } else {
                    setModalTitle("Cannot delete asset");
                    setAssetCanDelete(false);
                    setNewOpen(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    async function handleCloseModal() {
        props.onModalShow(false);
    }

    function handleDeleteOnclick() {
        deleteAuth(`assets/${props.assetId}`)
        .then((response) => {
            if (response.status === 200) {
                props.onModalShow(false);
                window.location.reload();
            }
        })
        .catch((error) => console.log(error));
    }

    function retrieveBody() {
        if (newOpen) {
            return <div id="delete-modal-width" className="form-body-assetdetail">
            </div>
        }
        if (assetCanDelete) {
            return <div id="delete-modal-width" className="form-body-assetdetail">
                <div className="div-message">Do you want to delete this asset</div>
                <div className="div-btn">
                    <button
                        id="btn-delete"
                        className="btn-save-change-pw"
                        onClick={() => handleDeleteOnclick()}>
                        Delete
                    </button>
                    <button
                        id="btn-cancel"
                        className="btn-cancel-change-pw"
                        onClick={() => handleCloseModal()}>
                        Close
                    </button>
                </div>
            </div>
        }

        return <div id="delete-modal-width" className="form-body-assetdetail">
            <div className="div-message">
                Cannot delete the asset because it belongs to one or more historical assignments.
                If the asset is not able to be used anymore, please update its state in &nbsp;
                <Link to={`/assetmanagement/editasset/${props.assetId}`}>
                    Edit Asset
                </Link>
                &nbsp; page
            </div>
        </div>
    }

    return (
        <div className={showHideClassName}>
            <div className="form-container-assetdetail" style={{marginTop: "3rem"}}>
                <div className="login-form-assetdetail">
                    <div id="delete-modal-width" className="form-header-assetdetail">
                        <div className="form-header-message-assetdetail">
                            <span style={{ marginLeft: "2rem" }}>{modalTitle}</span>
                            <div className="exit-btn-modal">
                                <svg
                                    class="x-square-fill_kx"
                                    viewBox="0 0 20 20"
                                    onClick={() => handleCloseModal()}
                                >
                                    <path
                                        // onclick="application.goToTargetView(event)"
                                        id="x-square-fill_kx"
                                        d="M 2.5 0 C 1.119288086891174 0 -2.980232238769531e-07 1.119288444519043 0 2.500000238418579 L 0 17.5 C 0 18.88071250915527 1.119288206100464 20 2.5 20 L 17.5 20 C 18.88071250915527 20 20 18.88071250915527 20 17.5 L 20 2.5 C 20 1.119288086891174 18.88071250915527 0 17.5 0 L 2.5 0 Z M 6.692500114440918 5.807499885559082 L 10 9.116250038146973 L 13.30749988555908 5.807499885559082 C 13.5518856048584 5.563113689422607 13.9481143951416 5.563113689422607 14.19250011444092 5.807499885559082 C 14.43688583374023 6.051885604858398 14.43688583374023 6.448113918304443 14.19250011444092 6.692500114440918 L 10.88374996185303 10 L 14.19250011444092 13.30749988555908 C 14.43688583374023 13.5518856048584 14.43688583374023 13.9481143951416 14.19250011444092 14.19250011444092 C 13.9481143951416 14.43688583374023 13.5518856048584 14.43688583374023 13.30749988555908 14.19250011444092 L 10 10.88374996185303 L 6.692500114440918 14.19250011444092 C 6.448113441467285 14.43688583374023 6.051885604858398 14.43688583374023 5.807499408721924 14.19250011444092 C 5.563113689422607 13.9481143951416 5.563113689422607 13.55188465118408 5.80750036239624 13.30749988555908 L 9.116250038146973 10 L 5.807499885559082 6.692500114440918 C 5.563113689422607 6.448113918304443 5.563113689422607 6.051886081695557 5.807499885559082 5.807499885559082 C 6.051886081695557 5.563113689422607 6.448113918304443 5.563113689422607 6.692500114440918 5.807499885559082 Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    {retrieveBody()}
                </div>
            </div>
        </div>
    );
}

