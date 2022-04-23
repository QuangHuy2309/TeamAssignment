import React, {useEffect, useRef, useState} from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
import { getAuth } from "../../../utils/httpHelpers";
import "../Sidebar/sidebar.css";
import Cookies from "js-cookie";
import { ChangePasswordModal } from "../../login/Modal/ChangePasswordModal";
import { Col, Container, Row } from "reactstrap";
import { putAuth } from "../../../utils/httpHelpers";
import Navbar from "../../header/Navbar";
import "./Report.css";
import ReactExport from "react-data-export";
import Paginate from "../../pagination/Pagination";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ExcelFile.ExcelSheet;

export default function Report(props) {
  const [defaultPassword, setDefaultPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [reportList, setReportList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  let totalPage = useRef(0);
  const size = 10;
  const [sortable, setSortable] = useState(false);
  const DataSet = [
    {
        columns: [
          {title: "Category"},
          {title: "Total"},
          {title: "Assigned"},
          {title: "Available"},
          {title: "Not available"},
          {title: "Waiting for recycling"},
          {title: "Recycled"},
        ],
        data: reportList.map(report => [
          {value: report.categoryName},
          {value: report.totalAsset},
          {value: report.assetAssign},
          {value: report.assetAvailable},
          {value: report.assetNotAvailable},
          {value: report.assetWaiting},
          {value: report.assetRecycled}
        ])
    }
  ]
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     defaultPassword: false,
  //     activeTab: "Home",
  //   };
  // }
  useEffect(() => {
    if (Cookies.get("status") === "1") {
      setDefaultPassword(true);
    }
    getReportList();
  }, []);

  useEffect(() => {

  }, [sortable]);
  
  
  useEffect(() => {
    totalPage.current = reportList.length;
    calculateItemsOnPage();
  }, [reportList]);

  function calculateItemsOnPage() {
    const indexOfLastItem = currentPage * size;
    const indexOfFirstItem = indexOfLastItem - size;
    return reportList.slice(indexOfFirstItem, indexOfLastItem);
  }

  function handleCurrentPage(pageNumber){
    setCurrentPage(pageNumber);
  }
  
  async function getReportList(){
    getAuth("reports")
      .then((response) => {
        if (response.status === 200) {
          setReportList([...response.data]);
        }
      })
      .catch((error) => console.log(error));
  }

  async function handleStateChange(defaultPasswordInput) {
    // this.setState({
    //   defaultPassword: defaultPassword,
    // });
    setDefaultPassword(defaultPasswordInput);
  }

  function handleDefault() {
    console.log("default trigger")
    setSortable(false);
    getReportList();
  }

  function handleSort(e, key) {
    e.preventDefault();
    setSortable(true);
    switch (key) {
      case "category":
        reportList.sort((a1, a2) => (a1.categoryName < a2.categoryName ? 1 : -1));
        break;
      case "total":
        reportList.sort((a1, a2) => (a1.totalAsset < a2.totalAsset ? 1 : -1));
        break;
      case "assigned":
        reportList.sort((a1, a2) => (a1.assetAssign < a2.assetAssign ? 1 : -1));
        break;
      case "available":
        reportList.sort((a1, a2) =>
            a1.assetAvailable < a2.assetAvailable ? 1 : -1
        );
        break;
      case "not_available":
        reportList.sort((a1, a2) =>
            a1.assetNotAvailable < a2.assetNotAvailable ? 1 : -1
        );
        break;
      case "waiting":
        reportList.sort((a1, a2) =>
            a1.assetWaiting < a2.assetWaiting ? 1 : -1
        );
        break;
      case "recycled":
        reportList.sort((a1, a2) => (a1.assetRecycled < a2.assetRecycled ? 1 : -1));
        break;
    }
  }

  return (
    <div>
      <ChangePasswordModal
        show={defaultPassword}
        onStateChange={handleStateChange}
        data-backdrop="static"
        data-keyboard="false"
      ></ChangePasswordModal>
      <Navbar titleName="Report" />
      <Container className="container-style">
        <Row>
          <Col xs="2">
            <AdminSidebar activeTab="Report" />
          </Col>
          <Col xs="10">
            <p className="title">Report</p>
            <div className="exportBtn">
              <ExcelFile filename="Report" element={<button className="btn-exportReport">Export</button>}>
                <ExcelSheet dataSet={DataSet} name="Report_Sheet"/>
              </ExcelFile>
              {/* <Link to="/usermanagement/createuser"> */}
              {/* </Link> */}
            </div>
            <table className="tableReport">
              <tr>
                <th className="category-title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Category</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "category")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Total</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "total")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Assigned</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "assigned")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Available</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "available")}>
                    <svg
                      className="icondropdown_arrow_m"
                      viewBox="0.023 -6 12 6"
                    >
                      <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                    </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Not available</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "not_available")}>
                  <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                    <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                  </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Waiting for recycling</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "waiting")}>
                  <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                    <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                  </svg>
                  </span>
                </th>
                <th className="title-tableReport">
                  <span className="default-header" onClick={handleDefault}>Recycled</span>
                  <span id="sorting" onClick={(e) => handleSort(e, "recycled")}>
                  <svg class="icondropdown_arrow_m" viewBox="0.023 -6 12 6">
                    <path d="M 0.02301025576889515 -6 L 12.02301120758057 -6 L 6.002416610717773 1.862645149230957e-09 L 0.02301025576889515 -6 Z"></path>
                  </svg>
                  </span>
                </th>
              </tr>
              {calculateItemsOnPage().map((cate) => (
              <tr key={cate.categoryPrefix}>
                <td className="row-table-tableReport">{cate.categoryName}</td>
                <td className="row-table-tableReport">{cate.totalAsset}</td>
                <td className="row-table-tableReport">{cate.assetAssign}</td>
                <td className="row-table-tableReport">{cate.assetAvailable}</td>
                <td className="row-table-tableReport">{cate.assetNotAvailable}</td>
                <td className="row-table-tableReport">{cate.assetWaiting}</td>
                <td className="row-table-tableReport">{cate.assetRecycled}</td>
              </tr>
              ))}
            </table>
            <Paginate
                size={size}
                total={reportList.length}
                handleCurrentPage={handleCurrentPage}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
