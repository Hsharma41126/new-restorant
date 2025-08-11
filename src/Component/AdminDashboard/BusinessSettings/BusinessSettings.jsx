import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import {
  RiDashboardLine,
  RiSettingsLine,
  RiPrinterLine,
  RiAlertLine,
  RiToggleLine,
  RiInformationLine,
  RiImageLine,
  RiWifiLine,
  RiTimeLine,
} from 'react-icons/ri';

const BusinessSettings = () => {
  const [modes, setModes] = useState({
    restaurant: true,
    gamezone: true,
    lounge: false
  });

  const [systemOnline, setSystemOnline] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  const [footerMessage, setFooterMessage] = useState(
    "Thank you for visiting GameZone Central! Follow us @gamezonecenter for latest updates and events."
  );
  const [lastUpdated, setLastUpdated] = useState("January 15, 2025 at 14:30 PM");
  const [lastModeChange, setLastModeChange] = useState("January 15, 2025 at 9:15 AM");

  const toggleMode = (mode) => {
    setModes(prev => ({
      ...prev,
      [mode]: !prev[mode]
    }));
    updateLastUpdated();
  };

  const toggleSystemMode = () => {
    setSystemOnline(!systemOnline);
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
    setLastModeChange(now);
  };

  const updateLastUpdated = () => {
    const now = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    setLastUpdated(now);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  const handleFooterChange = (e) => {
    setFooterMessage(e.target.value);
  };

  const saveChanges = () => {
    updateLastUpdated();
    // Here you would typically send the changes to your backend
    alert("Changes saved successfully!");
  };

  const resetChanges = () => {
    setModes({
      restaurant: true,
      gamezone: true,
      lounge: false
    });
    setSystemOnline(true);
    setLogoPreview(null);
    setFooterMessage(
      "Thank you for visiting GameZone Central! Follow us @gamezonecenter for latest updates and events."
    );
    updateLastUpdated();
  };

  return (
    <div className="p-3">
      {/* Main Content */}
      <div className="">
        {/* Header */}
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fs-3 fw-bold text-dark">
                Business Settings
              </h1>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className={`rounded-circle ${systemOnline ? 'bg-success' : 'bg-secondary'}`}></div>
              <span className="small text-muted">System {systemOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Offline Mode Banner */}
        {!systemOnline && (
          <div className="bg-warning rounded p-3 mb-4">
            <div className="d-flex align-items-center">
              <RiAlertLine className="text-white fs-5 me-3" />
              <div className="text-white">
                <div className="fw-medium">System is currently operating in offline mode</div>
                <div className="small opacity-90">Last switched: {lastModeChange}</div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* Operation Modes Card */}
          <div className="col-lg-6">
            <div className="bg-white rounded shadow-sm border p-4">
              {/* Operation Modes Section */}
              <div className="d-flex align-items-center mb-4">
                <RiToggleLine className="text-dark fs-5 me-3" />
                <h2 className="fs-5 fw-semibold text-dark">Operation Modes</h2>
              </div>

              <div className="d-flex flex-column gap-4">
                {/* Restaurant Mode */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${modes.restaurant ? 'bg-success' : 'bg-secondary'} me-3`} style={{ width: '8px', height: '8px' }}></div>
                    <div>
                      <div className="fw-medium text-dark">Restaurant Mode</div>
                      <div className="small text-muted">Enable food ordering and dining services</div>
                    </div>
                    <div className="position-relative ms-2">
                      <RiInformationLine className="text-muted" />
                    </div>
                  </div>
                  <div
                    className={`rounded-pill position-relative ${modes.restaurant ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                    onClick={() => toggleMode('restaurant')}
                  >
                    <div
                      className="bg-white rounded-circle position-absolute top-1"
                      style={{
                        width: '20px',
                        height: '20px',
                        left: modes.restaurant ? 'calc(100% - 22px)' : '2px',
                        transition: 'left 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Game Zone Mode */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${modes.gamezone ? 'bg-success' : 'bg-secondary'} me-3`} style={{ width: '8px', height: '8px' }}></div>
                    <div>
                      <div className="fw-medium text-dark">Game Zone Mode</div>
                      <div className="small text-muted">Activate gaming area and arcade management</div>
                    </div>
                    <div className="position-relative ms-2">
                      <RiInformationLine className="text-muted" />
                    </div>
                  </div>
                  <div
                    className={`rounded-pill position-relative ${modes.gamezone ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                    onClick={() => toggleMode('gamezone')}
                  >
                    <div
                      className="bg-white rounded-circle position-absolute top-1"
                      style={{
                        width: '20px',
                        height: '20px',
                        left: modes.gamezone ? 'calc(100% - 22px)' : '2px',
                        transition: 'left 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Lounge Mode */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle ${modes.lounge ? 'bg-success' : 'bg-secondary'} me-3`} style={{ width: '8px', height: '8px' }}></div>
                    <div>
                      <div className="fw-medium text-dark">Lounge Mode</div>
                      <div className="small text-muted">Enable relaxation area and social services</div>
                    </div>
                    <div className="position-relative ms-2">
                      <RiInformationLine className="text-muted" />
                    </div>
                  </div>
                  <div
                    className={`rounded-pill position-relative ${modes.lounge ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                    onClick={() => toggleMode('lounge')}
                  >
                    <div
                      className="bg-white rounded-circle position-absolute top-1"
                      style={{
                        width: '20px',
                        height: '20px',
                        left: modes.lounge ? 'calc(100% - 22px)' : '2px',
                        transition: 'left 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Business Hours Section */}
              <div className="mt-5 pt-4 border-top">
                <div className="d-flex align-items-center mb-3">
                  <RiTimeLine className="text-dark fs-5 me-3" />
                  <h2 className="fs-5 fw-semibold text-dark">Business Hours</h2>
                </div>

                <div className="d-flex flex-column gap-3">
                  {/* Monday - Friday */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="fw-medium text-dark me-3">Weekdays</div>
                      <div className="small text-muted">Mon - Fri</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="09:00">
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                      </Form.Select>
                      <span>to</span>
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="18:00">
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                        <option>00:00</option>
                      </Form.Select>
                    </div>
                  </div>

                  {/* Saturday */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="fw-medium text-dark me-3">Saturday</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="10:00">
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                      </Form.Select>
                      <span>to</span>
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="20:00">
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                        <option>00:00</option>
                      </Form.Select>
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="fw-medium text-dark me-3">Sunday</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="11:00">
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                      </Form.Select>
                      <span>to</span>
                      <Form.Select size="sm" style={{ width: '100px' }} defaultValue="17:00">
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                        <option>00:00</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top small text-muted">
                Last updated: {lastUpdated}
              </div>
            </div>
          </div>

          {/* Receipt Branding Card */}
          <div className="col-lg-6">
            <div className="bg-white rounded shadow-sm border p-4">
              <div className="d-flex align-items-center mb-4">
                <RiImageLine className="text-dark fs-5 me-3" />
                <h2 className="fs-5 fw-semibold text-dark">Receipt Customization</h2>
              </div>

              {/* Logo Section */}
              <div className="mb-4">
                <label className="d-block small fw-medium text-dark mb-2">Business Logo</label>
                <div className="d-flex align-items-start gap-3">
                  <div className="border border-2 border-dashed rounded d-flex align-items-center justify-content-center" style={{ width: '120px', height: '80px' }}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-100 h-100 object-fit-contain rounded" />
                    ) : (
                      <div className="text-center">
                        <RiImageLine className="text-muted fs-4 mx-auto mb-1" />
                        <div className="small text-muted">No logo</div>
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="logoUpload" className="btn btn-warning text-dark fw-medium cursor-pointer">
                      Upload Logo
                    </label>
                    <input
                      type="file"
                      id="logoUpload"
                      className="d-none"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <button className="text-danger small text-start border-0 bg-transparent p-0" onClick={removeLogo}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="small text-muted mt-2">Recommended size: 300x200px, PNG or JPG format</div>
              </div>

              {/* Footer Text Section */}
              <div className="mb-4">
                <label className="d-block small fw-medium text-dark mb-2">Footer Message</label>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Enter custom footer message for receipts"
                  maxLength="200"
                  value={footerMessage}
                  onChange={handleFooterChange}
                ></textarea>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">This message will appear at the bottom of all receipts</div>
                  <div className={`small ${footerMessage.length > 180 ? 'text-danger' : 'text-muted'}`}>
                    {footerMessage.length}/200
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <button className="btn btn-warning text-dark fw-medium" onClick={saveChanges}>
                  Save Changes
                </button>
                <button className="btn btn-outline-secondary fw-medium" onClick={resetChanges}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Offline Mode Card */}
          <div className="col-12">
            <div className="bg-white rounded shadow-sm border p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <RiWifiLine className="text-dark fs-5 me-3" />
                  <div>
                    <h2 className="fs-5 fw-semibold text-dark">System Mode</h2>
                    <div className="small text-muted">Switch between online and offline operation</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted">Offline</span>
                  <div
                    className={`rounded-pill position-relative ${systemOnline ? 'bg-success' : 'bg-secondary'}`}
                    style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                    onClick={toggleSystemMode}
                  >
                    <div
                      className="bg-white rounded-circle position-absolute top-1"
                      style={{
                        width: '20px',
                        height: '20px',
                        left: systemOnline ? 'calc(100% - 22px)' : '2px',
                        transition: 'left 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <span className="small text-muted">Online</span>
                </div>
              </div>

              <div className="bg-light rounded p-3">
                <div className="d-flex gap-3">
                  <RiInformationLine className="text-primary mt-1" />
                  <div className="small text-muted">
                    <div className="fw-medium mb-1">About System Modes:</div>
                    <div className="d-flex flex-column gap-1">
                      <div><strong>Online Mode:</strong> Full connectivity with cloud services, real-time updates, and remote monitoring.</div>
                      <div><strong>Offline Mode:</strong> Local operation only, data syncs when connection is restored.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 small text-muted">
                Last mode change: {lastModeChange}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;