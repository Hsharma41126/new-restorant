import React, { useState, useEffect } from 'react';
import {
    RiNotification3Line,
    RiNotification3Fill,
    RiInformationLine,
    RiSettings3Line,
    RiMoneyDollarCircleLine,
    RiPauseLine,
    RiStopLine,
    RiHistoryLine,
    RiTimeLine,
    RiCheckLine,
    RiCloseLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
const SessionTracker = () => {
    // Timer state
    const [elapsedSeconds, setElapsedSeconds] = useState(5136); // 1:25:36
    const [totalSeconds, setTotalSeconds] = useState(7200); // 2 hours
    const [isWarningState, setIsWarningState] = useState(false);
    const [isExtended, setIsExtended] = useState(false);

    // Notifications
    const [notifications, setNotifications] = useState([]);
    const [showNotificationDot, setShowNotificationDot] = useState(true);

    // Format time helper
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress
    const progressPercent = (elapsedSeconds / totalSeconds) * 100;
    const remainingSeconds = totalSeconds - elapsedSeconds;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progressPercent / 100) * circumference;

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSeconds(prev => {
                if (prev >= totalSeconds) {
                    showNotification('🔔 Session has ended!', 'error');
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [totalSeconds]);

    // Warning state effect
    useEffect(() => {
        if (remainingSeconds <= 300 && remainingSeconds > 0 && !isWarningState) {
            setIsWarningState(true);
            showNotification('⚠️ Warning: Only 5 minutes remaining!', 'warning');
        }
    }, [remainingSeconds, isWarningState]);

    // Notification system
    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        const newNotification = {
            id,
            message,
            type,
            time: new Date().toLocaleTimeString()
        };

        setNotifications(prev => [...prev, newNotification]);
        setShowNotificationDot(true);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Extend session
    const extendSession = () => {
        setTotalSeconds(prev => prev + 1800);
        setIsExtended(true);
        showNotification('✅ Session extended by 30 minutes!', 'info');

        setTimeout(() => {
            setIsExtended(false);
        }, 3000);
    };

    // Initial notification
    useEffect(() => {
        setTimeout(() => {
            showNotification('🎮 Session started successfully!', 'info');
        }, 1000);
    }, []);

    return (
        <div className="p-3">
            {/* Navbar */}
            <nav className="">
                <div className="">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                           
                            <h1 className="fs-3 fw-bold text-dark">Session Tracker</h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="mt-2">
                {/* Session Info Card */}
                <div className="mb-4">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="text-muted small mb-1">Table Type</div>
                                <div className="fs-5 fw-semibold text-warning">Premium Poker Table</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small mb-1">Session ID</div>
                                <div className="fs-5 fw-semibold font-monospace">PKR-2025-0719-8847</div>
                            </div>
                            <div className="col-md-4">
                                <div className="text-muted small mb-1">Status</div>
                                <span className="badge bg-success rounded-pill" style={{ width: '8px', height: '8px' }}></span>
                                <span className="text-success fw-medium ">Active Session</span>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Timer Card */}
                    <div className="col-lg-8">
                        <div className={`bg-white rounded-4 shadow-sm p-4 p-md-5 position-relative ${isWarningState ? 'warning-glow' : ''}`}>
                            <div className="text-center">
                                <div className="position-relative d-inline-block mb-4 mb-md-5">
                                    <svg className="w-100 h-auto" style={{ maxWidth: '300px' }} viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" stroke="#e9ecef" strokeWidth="2" fill="none" />
                                        <circle
                                            cx="50" cy="50" r="45"
                                            stroke={isWarningState ? "#dc3545" : "#ffc107"}
                                            strokeWidth="3"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={offset}
                                            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                                        />
                                    </svg>
                                    <div className="position-absolute top-50 start-50 translate-middle w-100 text-center">
                                        <div className="text-muted small mb-1">ELAPSED TIME</div>
                                        <div className="fs-4 fw-bold text-warning mb-3">{formatTime(elapsedSeconds)}</div>
                                        <div className="text-muted small mb-1">REMAINING TIME</div>
                                        <div className="fs-4 fw-bold">{formatTime(Math.max(0, remainingSeconds))}</div>
                                    </div>
                                </div>

                                <div className="bg-light rounded-3 p-3 mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted small">Session Progress</span>
                                        <span className={`small fw-medium ${isWarningState ? 'text-danger' : 'text-warning'}`}>
                                            {Math.round(progressPercent)}%
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div
                                            className={`progress-bar ${isWarningState ? 'bg-danger' : 'bg-warning'}`}
                                            role="progressbar"
                                            style={{ width: `${progressPercent}%` }}
                                            aria-valuenow={progressPercent}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    className={`btn ${isExtended ? 'btn-success' : 'btn-warning'} px-4 py-2 px-md-5 py-md-3 fw-semibold d-flex align-items-center mx-auto`}
                                    onClick={extendSession}
                                    disabled={isExtended}
                                >
                                    <RiTimeLine className="me-2" />
                                    {isExtended ? 'Session Extended!' : 'Extend Session (+30 min)'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Side Cards */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4">
                            {/* Session Details */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h3 className="fs-5 fw-semibold mb-3 d-flex align-items-center">
                                    <RiInformationLine className="text-warning me-2" />
                                    Session Details
                                </h3>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Start Time</span>
                                        <span className="fw-medium font-monospace">14:34:24</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">End Time</span>
                                        <span className="fw-medium font-monospace">16:00:00</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Total Duration</span>
                                        <span className="fw-medium font-monospace">2:00:00</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Rate</span>
                                        <span className="fw-semibold text-warning">$25/hour</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h3 className="fs-5 fw-semibold mb-3 d-flex align-items-center">
                                    <RiSettings3Line className="text-warning me-2" />
                                    Quick Actions
                                </h3>
                                <div className="d-flex flex-column gap-2">
                                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-start py-2">
                                        <RiPauseLine className="me-2" />
                                        Pause Session
                                    </button>
                                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-start py-2">
                                        <RiStopLine className="me-2" />
                                        End Session
                                    </button>
                                  <Link to='/user/sessionhistory' className="text-decoration-none w-100 ">
                                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-start py-2 w-100">
                                        <RiHistoryLine className="me-2" />
                                        Session History
                                    </button>
                                  </Link>
                                </div>
                            </div>

                            {/* Current Charges */}
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h3 className="fs-5 fw-semibold mb-3 d-flex align-items-center">
                                    <RiMoneyDollarCircleLine className="text-warning me-2" />
                                    Current Charges
                                </h3>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Time Elapsed</span>
                                        <span className="fw-medium">1h 25m</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Hourly Rate</span>
                                        <span className="fw-medium">$25.00</span>
                                    </div>
                                    <div className="pt-2 border-top d-flex justify-content-between">
                                        <span className="fw-semibold text-warning">Total Cost</span>
                                        <span className="fw-bold text-warning fs-5">$35.42</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="position-fixed top-4 end-4 d-flex flex-column gap-3" style={{ zIndex: 1050 }}>
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`bg-white shadow-lg rounded-3 p-3 border-start border-4 ${notification.type === 'warning' ? 'border-warning' :
                            notification.type === 'error' ? 'border-danger' : 'border-warning'
                            }`}
                        style={{ maxWidth: '320px' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center">
                                <RiNotification3Fill className={
                                    notification.type === 'warning' ? 'text-warning' :
                                        notification.type === 'error' ? 'text-danger' : 'text-warning'
                                } />
                            </div>
                            <div className="flex-grow-1">
                                <p className="fw-medium mb-1">{notification.message}</p>
                                <p className="text-muted small mb-0">{notification.time}</p>
                            </div>
                            <button
                                className="btn btn-sm btn-link text-muted p-0"
                                onClick={() => removeNotification(notification.id)}
                            >
                                <RiCloseLine />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS */}
            <style>
                {`
          .pulse-bell {
            animation: bellPulse 2s infinite;
          }
          
          @keyframes bellPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          .warning-glow {
            animation: warningGlow 1s ease-in-out infinite alternate;
          }
          
          @keyframes warningGlow {
            from { box-shadow: 0 0 10px rgba(220, 53, 69, 0.3); }
            to { box-shadow: 0 0 15px rgba(220, 53, 69, 0.5); }
          }

          .font-monospace {
            font-family: 'Courier New', Courier, monospace;
          }
        `}
            </style>
        </div>
    );
};

export default SessionTracker;