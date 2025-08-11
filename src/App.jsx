import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./Layout/Navbar";
import Sidebar from "./Layout/Sidebar";
import Login from "./Auth/Login";
import StaffManagement from "./Component/AdminDashboard/StaffManagement/StaffManagement";
import TablesManagement from "./Component/StaffDashboard/TablesManagement/TablesManagement";
import BusinessSettings from "./Component/AdminDashboard/BusinessSettings/BusinessSettings";
import DeviceMonitor from "./Component/AdminDashboard/DeviceMonitor/DeviceMonitor";
import PrinterSetup from "./Component/AdminDashboard/PrinterSetup/PrinterSetup";
import ReportsAnalytics from "./Component/AdminDashboard/ReportsAnalytics/ReportsAnalytics";
import TablePlugSetup from "./Component/AdminDashboard/TablePlugSetup/TablePlugSetup";
import AlertsNotifications from "./Component/StaffDashboard/AlertsNotifications/AlertsNotifications";
import BillingPayment from "./Component/StaffDashboard/BillingPayment/BillingPayment";
import KOTQueue from "./Component/StaffDashboard/KOTQueue/KOTQueue";
import OrdersManagement from "./Component/StaffDashboard/OrdersManagement/OrdersManagement";
import ReservationsManagement from "./Component/StaffDashboard/ReservationsManagement/ReservationsManagement";
import MyReservations from "./Component/UserDashboard/MyReservations/MyReservations";
import MyBilling from "./Component/UserDashboard/MyBilling/MyBilling";
import SessionTracker from "./Component/UserDashboard/SessionTracker/SessionTracker";
import BookTable from "./Component/UserDashboard/BookTable/BookTable";
import SessionHistory from "./Component/UserDashboard/SessionHistory/SessionHistory";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Profile from "./Profile/Profile";
import Dashboard from "./Component/AdminDashboard/Dashboard/Dashboard";
import AdminItemManager from "./Component/AdminDashboard/AddItems/AdminItemManager";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const role = localStorage.getItem("role");

  // Check if device is mobile on initial render
  useEffect(() => {
    const checkIfMobile = () => {
      return window.innerWidth <= 768; // Standard mobile breakpoint
    };

    if (checkIfMobile()) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  // Pages that don't need layout (auth pages)
  const hideLayout = location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <>

      {hideLayout ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      ) : (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="main-content">
            <Sidebar
              collapsed={isSidebarCollapsed}
              setCollapsed={setIsSidebarCollapsed}
            />
            <div className={`right-side-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
              <Routes>


                {/* profile */}
                <Route path="/profile" element={<Profile />} />
                {/* profil end */}



                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="staffmanagement" element={<StaffManagement />} />
                      <Route path="additems" element={<AdminItemManager />} />
                      <Route path="businesssettings" element={<BusinessSettings />} />
                      <Route path="devicemonitor" element={<DeviceMonitor />} />
                      <Route path="printersetup" element={<PrinterSetup />} />
                      <Route path="reportanalytics" element={<ReportsAnalytics />} />
                      <Route path="tableplugsetup" element={<TablePlugSetup />} />
                    </Routes>
                  </ProtectedRoute>
                } />

                {/* Staff Routes */}
                <Route path="/staff/*" element={
                  <ProtectedRoute allowedRoles={["Staff"]}>
                    <Routes>
                      <Route path="tablesmanagement" element={<TablesManagement />} />
                      <Route path="ordermanagement" element={<OrdersManagement />} />
                      <Route path="kotqueue" element={<KOTQueue />} />
                      <Route path="reservationsmanagement" element={<ReservationsManagement />} />
                      <Route path="billingpayment" element={<BillingPayment />} />
                      <Route path="alertsnotifications" element={<AlertsNotifications />} />
                    </Routes>
                  </ProtectedRoute>
                } />

                {/* User Routes */}
                <Route path="/user/*" element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Routes>
                      <Route path="mybilling" element={<MyBilling />} />
                      <Route path="myreservations" element={<MyReservations />} />
                      <Route path="sessiontracker" element={<SessionTracker />} />
                      <Route path="myreservations" element={<MyReservations />} />
                      <Route path="booktable" element={<BookTable />} />
                      <Route path="sessionhistory" element={<SessionHistory />} />
                    </Routes>
                  </ProtectedRoute>
                } />

                {/* Redirect to appropriate dashboard based on role */}
                <Route path="/" element={
                  role === "Admin" ? <Navigate to="/admin/dashboard" /> :
                    role === "Staff" ? <Navigate to="/staff/tablesmanagement" /> :
                      role === "User" ? <Navigate to="/user/booktable" /> :
                        <Navigate to="/" />
                } />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;