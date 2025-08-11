import React, { useState } from 'react';
import {
    RiTimeLine, RiBilliardsLine, RiGamepadLine,
    RiRestaurantLine, RiErrorWarningLine,
    RiCalendarScheduleLine, RiCalendarLine, RiMapPinLine
} from 'react-icons/ri';
// import 'bootstrap/dist/css/bootstrap.min.css';

const MyReservations = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState('');
    const [selectedDate, setSelectedDate] = useState('20');
    const [selectedTime, setSelectedTime] = useState('2:00 PM');

    const reservations = [
        {
            id: 'SN2024001',
            title: 'Snooker Table',
            status: 'Confirmed',
            statusClass: 'bg-success text-white',
            date: 'Today, January 20, 2025',
            time: '2:00 PM - 4:00 PM',
            location: 'Table 3, Floor 2',
            icon: <RiBilliardsLine className="text-green-600 fs-4" />,
            iconBg: 'bg-green-100',
            borderClass: 'border-primary border-2',
            highlight: true
        },
        {
            id: 'PS2024002',
            title: 'PlayStation Station',
            status: 'Pending',
            statusClass: 'bg-secondary text-white',
            date: 'January 22, 2025',
            time: '6:00 PM - 8:00 PM',
            location: 'Station 5, Gaming Area',
            icon: <RiGamepadLine className="text-blue-600 fs-4" />,
            iconBg: 'bg-blue-100',
            borderClass: 'border',
            highlight: false
        },
        {
            id: 'DT2024003',
            title: 'Dining Table',
            status: 'Arrived',
            statusClass: 'bg-primary text-white',
            date: 'January 25, 2025',
            time: '7:30 PM - 9:30 PM',
            location: 'Table 12, Restaurant',
            icon: <RiRestaurantLine className="text-purple-600 fs-4" />,
            iconBg: 'bg-purple-100',
            borderClass: 'border',
            highlight: false
        },
        {
            id: 'PL2024004',
            title: 'Pool Table',
            status: 'Confirmed',
            statusClass: 'bg-success text-white',
            date: 'January 28, 2025',
            time: '4:00 PM - 6:00 PM',
            location: 'Table 7, Pool Area',
            icon: <RiBilliardsLine className="text-orange-600 fs-4" />,
            iconBg: 'bg-orange-100',
            borderClass: 'border',
            highlight: false
        }
    ];

    const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = [
        { day: '29', disabled: true }, { day: '30', disabled: true }, { day: '31', disabled: true },
        ...Array.from({ length: 28 }, (_, i) => ({ day: (i + 1).toString(), disabled: false }))
    ];

    const handleCancelClick = (bookingId) => {
        setCurrentBookingId(bookingId);
        setShowCancelModal(true);
    };

    const handleRescheduleClick = (bookingId) => {
        setCurrentBookingId(bookingId);
        setShowRescheduleModal(true);
    };

    const handleDateSelect = (day) => {
        if (!day.disabled) {
            setSelectedDate(day.day);
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    return (
        <div className="p-3">
            {/* Header */}
            <div className="mb-2">
                <div className="d-flex align-items-center gap-3">
                    <h1 className="text-dark fs-3 fw-bold">My Reservations</h1>
                </div>
            </div>

            {/* Reservations Grid */}
            <div className="row g-3">
                {reservations.map((reservation) => (
                    <div key={reservation.id} className={`col-12 col-lg-6 ${reservation.highlight ? 'reservation-highlight' : ''}`}>
                        <div className={`card shadow-sm h-100 position-relative overflow-hidden`}>
                            {reservation.highlight && (
                                <div className="position-absolute top-0 end-0 bg-warning bg-opacity-10 rounded-circle"
                                    style={{ width: '80px', height: '80px', transform: 'translate(40px, -40px)' }}></div>
                            )}

                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`${reservation.iconBg} rounded p-2 d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                                            {reservation.icon}
                                        </div>
                                        <div>
                                            <h3 className="card-title fs-5 fw-semibold text-dark mb-0">{reservation.title}</h3>
                                            <p className="text-muted small mb-0">Booking ID: #{reservation.id}</p>
                                        </div>
                                    </div>
                                    <span className={`badge rounded-pill ${reservation.statusClass} px-3 py-1`}>
                                        {reservation.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <RiCalendarLine className="text-muted" />
                                        <span className="text-dark small">{reservation.date}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <RiTimeLine className="text-muted" />
                                        <span className="text-dark small">{reservation.time}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <RiMapPinLine className="text-muted" />
                                        <span className="text-dark small">{reservation.location}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-danger btn-sm flex-grow-1 rounded-pill"
                                        onClick={() => handleCancelClick(reservation.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm flex-grow-1 rounded-pill"
                                        onClick={() => handleRescheduleClick(reservation.id)}
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body p-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="bg-danger bg-opacity-10 rounded-circle p-2">
                                        <RiErrorWarningLine className="text-danger fs-4" />
                                    </div>
                                    <h3 className="modal-title fs-5 fw-semibold text-dark">Cancel Booking</h3>
                                </div>
                                <p className="text-muted mb-4">
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                </p>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-grow-1 rounded-pill"
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        Keep Booking
                                    </button>
                                    <button
                                        className="btn btn-danger flex-grow-1 rounded-pill"
                                        onClick={() => {
                                            console.log('Cancelling booking:', currentBookingId);
                                            setShowCancelModal(false);
                                        }}
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-body p-4">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                                        <RiCalendarScheduleLine className="text-primary fs-4" />
                                    </div>
                                    <h3 className="modal-title fs-5 fw-semibold text-dark">Reschedule Booking</h3>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Select New Date</label>
                                    <div className="d-flex flex-wrap mb-2">
                                        {weekdays.map((day) => (
                                            <div key={day} className="text-center text-muted small" style={{ width: '14.28%' }}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex flex-wrap">
                                        {calendarDays.map((dayObj, index) => (
                                            <div
                                                key={index}
                                                className={`text-center small py-2 ${dayObj.disabled ? 'text-muted' : 'text-dark'} ${dayObj.day === selectedDate ? 'bg-warning text-dark rounded fw-medium' : ''}`}
                                                style={{ width: '14.28%', cursor: dayObj.disabled ? 'default' : 'pointer' }}
                                                onClick={() => !dayObj.disabled && handleDateSelect(dayObj)}
                                            >
                                                {dayObj.day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Available Time Slots</label>
                                    <div className="row g-2">
                                        {timeSlots.map((time) => (
                                            <div key={time} className="col-4 col-md-3">
                                                <button
                                                    className={`btn btn-sm w-100 ${time === selectedTime ? 'btn-warning' : 'btn-outline-secondary'}`}
                                                    onClick={() => handleTimeSelect(time)}
                                                >
                                                    {time}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-grow-1 rounded-pill"
                                        onClick={() => setShowRescheduleModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-warning flex-grow-1 rounded-pill"
                                        onClick={() => {
                                            console.log('Rescheduling booking:', currentBookingId, 'to', selectedDate, selectedTime);
                                            setShowRescheduleModal(false);
                                        }}
                                    >
                                        Confirm Reschedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS */}

        </div>
    );
};

export default MyReservations;