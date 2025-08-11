import React, { useState } from 'react';
import {
  RiGamepadLine,
  RiBilliardsLine,
  RiRestaurantLine,
  RiTvLine,
  RiLightbulbLine,
  RiMusicLine,
  RiRefreshLine,
  RiSearchLine,
  RiFilterLine,
  RiArrowDownSLine,
  RiAlertLine,
  RiCheckLine
} from 'react-icons/ri';

const DeviceMonitor = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'PlayStation 5',
      location: 'Table PS-01',
      icon: <RiGamepadLine className="text-blue-600" />,
      status: 'online',
      powerState: 'on',
      powerConsumption: 180,
      lastUpdated: '2 min ago',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      name: 'Snooker Table',
      location: 'Table SN-03',
      icon: <RiBilliardsLine className="text-green-600" />,
      status: 'online',
      powerState: 'off',
      powerConsumption: 0,
      lastUpdated: '1 min ago',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      name: 'Coffee Machine',
      location: 'Restaurant Area',
      icon: <RiRestaurantLine className="text-purple-600" />,
      status: 'offline',
      powerState: 'off',
      powerConsumption: null,
      lastUpdated: '15 min ago',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      name: 'Xbox Series X',
      location: 'Table XB-02',
      icon: <RiGamepadLine className="text-orange-600" />,
      status: 'online',
      powerState: 'on',
      powerConsumption: 165,
      lastUpdated: '30 sec ago',
      bgColor: 'bg-orange-50'
    },
    {
      id: 5,
      name: 'Pool Table',
      location: 'Table PL-05',
      icon: <RiBilliardsLine className="text-teal-600" />,
      status: 'online',
      powerState: 'on',
      powerConsumption: 45,
      lastUpdated: '1 min ago',
      bgColor: 'bg-teal-50'
    },
    {
      id: 6,
      name: 'Smart TV',
      location: 'Lounge Area',
      icon: <RiTvLine className="text-red-600" />,
      status: 'online',
      powerState: 'off',
      powerConsumption: 2,
      lastUpdated: '45 sec ago',
      bgColor: 'bg-red-50'
    },
    {
      id: 7,
      name: 'LED Lighting',
      location: 'Main Hall',
      icon: <RiLightbulbLine className="text-indigo-600" />,
      status: 'online',
      powerState: 'on',
      powerConsumption: 120,
      lastUpdated: '3 min ago',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 8,
      name: 'Sound System',
      location: 'Entertainment Zone',
      icon: <RiMusicLine className="text-pink-600" />,
      status: 'offline',
      powerState: 'off',
      powerConsumption: null,
      lastUpdated: '8 min ago',
      bgColor: 'bg-pink-50'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleDevice = (deviceId) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        const newPowerState = device.powerState === 'on' ? 'off' : 'on';
        const message = `${device.name} has been turned ${newPowerState.toUpperCase()}`;

        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        return {
          ...device,
          powerState: newPowerState
        };
      }
      return device;
    }));
  };

  const showOverrideModal = (device) => {
    setCurrentDevice(device);
    setShowModal(true);
  };

  const confirmOverride = () => {
    setToastMessage(`Manual override applied to ${currentDevice.name}`);
    setShowToast(true);
    setShowModal(false);
    setTimeout(() => setShowToast(false), 3000);
  };


  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;

  return (
    <div className="p-3">
      {/* Header */}
      <header className="">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="mb-3">
            <h1 className="fs-3 fw-bold text-dark">Device Monitor</h1>
            <p className="text-muted mb-0">Monitor and control smart plugs across all gaming areas</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center px-3 py-2 bg-success bg-opacity-10 rounded-3">
              <span className="device-status-dot bg-success me-2"></span>
              <span className="text-success small fw-medium">Live Updates Active</span>
            </div>
            <button className="btn btn-warning d-flex align-items-center">
              <RiRefreshLine className="me-2" />
              Refresh All
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white px-4 py-3 border-bottom">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="d-flex flex-wrap gap-3 mb-3 mb-md-0">
            <div className="position-relative">
              <RiSearchLine className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                placeholder="Search devices..."
                className="form-control ps-5"
              />
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <RiFilterLine className="me-2" />
                Filter by Status
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item">All Status</button></li>
                <li><button className="dropdown-item">Online</button></li>
                <li><button className="dropdown-item">Offline</button></li>
              </ul>
            </div>
          </div>
          <div className="d-flex gap-3 text-muted small">
            <span>Total Devices: <strong className="text-dark">{devices.length}</strong></span>
            <span className="text-success">Online: <strong>{onlineCount}</strong></span>
            <span className="text-danger">Offline: <strong>{offlineCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">PlayStation 5</h6>
                <div className="text-muted small">Table PS-01</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-primary">ON</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">180W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-warning" style={{ width: "70%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 2 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Snooker Table</h6>
                <div className="text-muted small">Table SN-03</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-danger">OFF</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">0W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-secondary" style={{ width: "0%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 1 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Coffee Machine</h6>
                <div className="text-muted small">Restaurant Area</div>
              </div>
              <div>
                <span className="badge bg-secondary me-1">Offline</span>
                <span className="badge bg-danger">OFF</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">--W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-secondary" style={{ width: "0%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-danger">Last seen: 15 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" disabled />
                </div>
                <button className="btn btn-outline-secondary btn-sm" disabled>Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Xbox Series X</h6>
                <div className="text-muted small">Table XB-02</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-primary">ON</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">165W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-warning" style={{ width: "60%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 30 sec ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Pool Table</h6>
                <div className="text-muted small">Table PL-05</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-primary">ON</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">45W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-warning" style={{ width: "20%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 1 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Smart TV</h6>
                <div className="text-muted small">Lounge Area</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-danger">OFF</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">2W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-secondary" style={{ width: "2%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 45 sec ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">LED Lighting</h6>
                <div className="text-muted small">Main Hall</div>
              </div>
              <div>
                <span className="badge bg-success me-1">Online</span>
                <span className="badge bg-primary">ON</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">120W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-warning" style={{ width: "60%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">Updated: 3 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                </div>
                <button className="btn btn-outline-dark btn-sm">Override</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="fw-bold">Sound System</h6>
                <div className="text-muted small">Entertainment Zone</div>
              </div>
              <div>
                <span className="badge bg-secondary me-1">Offline</span>
                <span className="badge bg-danger">OFF</span>
              </div>
            </div>
            <div className="mt-3 mb-2">Power Consumption</div>
            <div className="fw-bold">--W</div>
            <div className="progress my-2" style={{ height: "6px" }}>
              <div className="progress-bar bg-secondary" style={{ width: "0%" }}></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-danger">Last seen: 8 min ago</small>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" role="switch" disabled />
                </div>
                <button className="btn btn-outline-secondary btn-sm" disabled>Override</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Override Modal */}
      {showModal && (
        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-3 p-4" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-warning bg-opacity-25 rounded-circle p-3 me-3">
                <RiAlertLine className="text-warning fs-4" />
              </div>
              <h3 className="fs-5 fw-bold mb-0">Manual Override Confirmation</h3>
            </div>
            <p className="text-muted mb-4">
              Are you sure you want to manually override the power state for <strong>{currentDevice?.name}</strong>? This action will bypass automated controls.
            </p>
            <div className="d-flex justify-content-end gap-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmOverride}
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div
          className="bg-success text-white px-4 py-3 rounded-3 shadow d-flex align-items-center"

        >
          <RiCheckLine className="me-2" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default DeviceMonitor;