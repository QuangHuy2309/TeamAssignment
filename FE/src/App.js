import logo from "./logo.svg";
import "./App.css";
import Login from "./components/login/Login";
import AdminIndex from "./components/admin";
import UserIndex from "./components/user";
import { BrowserRouter, Route } from "react-router-dom";
import { PublicRoute } from "./components/routes/PublicRoute";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import ManageAsset from "./components/admin/ManageAsset";
import ManageUser from "./components/admin/ManageUser";
import ManageAssignment from "./components/admin/ManageAssignment";
import RequestForReturning from "./components/admin/RequestForReturning";
import Report from "./components/admin/Report";
import Home from "./components/home";
import CreateUser from "./components/admin/ManageUser/CreateUser/CreateUser";
import EditUser from "./components/admin/ManageUser/EditUser/EditUser";
import EditAsset from "./components/admin/ManageAsset/EditAsset/EditAsset";
import CreateAsset from "./components/admin/ManageAsset/CreateAsset/CreateAsset";
import CreateAssignment from "./components/admin/ManageAssignment/CreateAssignment/CreateAssignmentClass";
import EditAssignment from "./components/admin/ManageAssignment/EditAssignment/EditAssignment"

{
  /* Notes:
    Unauthorized: PublicRoute
    Admin: PrivateRoute< role="admin" />
    User: PrivateRoute< role="user" />
*/
}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="App">
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/" role="" component={Home} />
          <PrivateRoute
            exact
            path="/usermanagement"
            role="admin"
            component={ManageUser}
          />
          <PrivateRoute
            path="/usermanagement/createuser"
            role="admin"
            component={CreateUser}
          />
          <PrivateRoute
            path="/usermanagement/edituser/:id"
            role="admin"
            component={EditUser}
          />
          <PrivateRoute
            exact
            path="/assetmanagement"
            role="admin"
            component={ManageAsset}
          />
          <PrivateRoute
            exact
            path="/assetmanagement/createasset"
            role="admin"
            component={CreateAsset}
          />
          <PrivateRoute
            exact
            path="/assetmanagement/editasset/:id"
            role="admin"
            component={EditAsset}
          />
          <PrivateRoute
            exact
            path="/assignmentmanagement"
            role="admin"
            component={ManageAssignment}
          />
          <PrivateRoute
            exact
            path="/assignmentmanagement/createassignment"
            role="admin"
            component={CreateAssignment}
          />
          <PrivateRoute
            exact
            path="/assignmentmanagement/editassignment/:id"
            role="admin"
            component={EditAssignment}
          />
          <PrivateRoute
            exact
            path="/requestmanagement"
            role="admin"
            component={RequestForReturning}
          />
          <PrivateRoute exact path="/report" role="admin" component={Report} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
