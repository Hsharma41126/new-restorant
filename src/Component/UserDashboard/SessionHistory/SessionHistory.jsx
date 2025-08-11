import React, { useState } from "react";
import {
  RiArrowLeftLine,
  RiNotification3Line,
  RiNotification3Fill,
  RiSearchLine,
  RiArrowDownSLine,
  RiBilliardsLine,
  RiGamepadLine,
  RiPlaystationLine,
  RiRestaurantLine,
  RiHistoryLine,
  RiArrowRightLine,
} from "react-icons/ri";

const SessionHistory = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState("All Table Types");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions] = useState([
    {
      id: "PKR-2025-0718-7432",
      type: "Premium Snooker Table",
      icon: <RiBilliardsLine className="text-warning" />,
      status: "completed",
      date: "Jul 18, 2025 14:30",
      duration: "02:15:30",
      cost: "$56.25",
    },
    {
      id: "PKR-2025-0717-6891",
      type: "Pool Table Standard",
      icon: <RiGamepadLine className="text-warning" />,
      status: "extended",
      date: "Jul 17, 2025 16:45",
      duration: "03:30:00",
      cost: "$70.00",
    },
    {
      id: "PKR-2025-0716-5234",
      type: "PlayStation Station Pro",
      icon: <RiPlaystationLine className="text-warning" />,
      status: "completed",
      date: "Jul 16, 2025 19:20",
      duration: "01:45:15",
      cost: "$35.00",
    },
    {
      id: "PKR-2025-0715-4567",
      type: "VIP Dining Table",
      icon: <RiRestaurantLine className="text-warning" />,
      status: "cancelled",
      date: "Jul 15, 2025 12:15",
      duration: "00:30:00",
      cost: "$15.00",
    },
    {
      id: "PKR-2025-0714-3891",
      type: "Premium Snooker Table",
      icon: <RiBilliardsLine className="text-warning" />,
      status: "completed",
      date: "Jul 14, 2025 15:00",
      duration: "01:30:45",
      cost: "$37.50",
    },
    {
      id: "PKR-2025-0713-2456",
      type: "Pool Table Deluxe",
      icon: <RiGamepadLine className="text-warning" />,
      status: "extended",
      date: "Jul 13, 2025 18:30",
      duration: "02:45:20",
      cost: "$68.75",
    },
  ]);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTableType === "All Table Types" ||
      session.type.includes(selectedTableType.replace(" Table", ""));
    return matchesSearch && matchesType;
  });

  const handleTableTypeSelect = (type) => {
    setSelectedTableType(type);
    setIsDropdownOpen(false);
  };

  const clearFilters = () => {
    setSelectedTableType("All Table Types");
    setSearchTerm("");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      case "extended":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="p-3">
      {/* Page Header */}
      <div className="">
        <h2 className="fs-3 fw-bold mb-2 text-start">Session History</h2>
        <p className="text-muted text-start">
          View and manage your past gaming sessions
        </p>
      </div>

      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-2 align-items-stretch">
          {/* Search Input */}
          <div className="col-12 col-sm-6 col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search sessions by ID, table type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="col-6 col-sm-3 col-lg-2">
            <input type="date" className="form-control" />
          </div>

          {/* End Date */}
          <div className="col-6 col-sm-3 col-lg-2">
            <input type="date" className="form-control" />
          </div>

          {/* Table Type Dropdown */}
          <div className="col-12 col-sm-6 col-lg-2 position-relative">
            <button
              className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedTableType}
              <RiArrowDownSLine
                className={`${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="position-absolute top-100 start-0 end-0 mt-1 bg-white border rounded shadow-sm z-3">
                {[
                  "All Table Types",
                  "Snooker Table",
                  "Pool Table",
                  "PlayStation",
                  "Dining Table",
                ].map((type) => (
                  <button
                    key={type}
                    className="dropdown-item text-start"
                    onClick={() => handleTableTypeSelect(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <div className="col-12 col-sm-6 col-lg-2">
            <button className="btn btn-light w-100" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filteredSessions.length > 0 ? (
        <>
          {filteredSessions.map((session, index) => (
            <div
              key={index}
              className="card mb-2 p-3 shadow-sm border-0 rounded-3"
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-warning bg-opacity-10 rounded-3 p-3 d-flex align-items-center justify-content-center">
                    {session.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{session.type}</h6>
                    <div className="small text-muted mb-1">
                      Session ID: {session.id}
                    </div>
                    <span
                      className={`badge text-capitalize ${getStatusClass(
                        session.status
                      )} text-white`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-4 text-muted small">
                  <div>
                    <div className="fw-semibold text-dark">{session.date}</div>
                    <div>Date & Time</div>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">
                      {session.duration}
                    </div>
                    <div>Duration</div>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">{session.cost}</div>
                    <div>Total Cost</div>
                  </div>
                  {/* <button className="btn btn-link text-warning p-0 fw-semibold">
                    View Details
                  </button> */}
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="small text-muted">
              Showing 1-{filteredSessions.length} of {sessions.length} sessions
            </div>
            <div className="d-flex gap-1">
              <button className="btn btn-outline-secondary btn-sm disabled">
                <RiArrowLeftLine />
              </button>
              <button className="btn btn-warning btn-sm">1</button>
              <button className="btn btn-outline-secondary btn-sm">2</button>
              <button className="btn btn-outline-secondary btn-sm">3</button>
              <span className="d-flex align-items-center px-2">...</span>
              <button className="btn btn-outline-secondary btn-sm">4</button>
              <button className="btn btn-outline-secondary btn-sm">
                <RiArrowRightLine />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-5 bg-white rounded-3 shadow-sm">
          <div
            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "96px", height: "96px" }}
          >
            <RiHistoryLine className="fs-1 text-muted" />
          </div>
          <h5 className="fw-bold">No sessions found</h5>
          <p className="text-muted small mb-3">
            Try adjusting your filters or search terms
          </p>
          <button className="btn btn-warning" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      <style>{`
         .rotate-180 { transform: rotate(180deg); }
  .dropdown-item { width: 100%; text-align: left; padding: 0.5rem 1rem; border-bottom: 1px solid #f1f1f1; }
  .dropdown-item:last-child { border-bottom: none; }



        .position-absolute {
    z-index: 10;                
  }
      `}</style>
    </div>      
  );
};

export default SessionHistory;
