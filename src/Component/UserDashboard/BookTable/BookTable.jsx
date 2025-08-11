import React, { useState } from "react";
import Calendar from './Calendar'; // ✅ Adjust the path if needed

import {
  RiUserLine,
  RiDashboardLine,
  RiCalendarLine,
  RiHistoryLine,
  RiUserSettingsLine,
  RiSettingsLine,
  RiLogoutBoxLine,
  RiNotificationLine,
  RiQuestionLine,
  RiBilliardsLine,
  RiBasketballLine,
  RiGamepadLine,
  RiRestaurantLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "react-icons/ri";

const BookTable = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("January 19, 2025");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsNotification, setSmsNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const tableTypes = [
    {
      id: "snooker",
      name: "Snooker",
      description: "Professional snooker tables with premium felt and lighting",
      price: "$15/hour",
      icon: <RiBilliardsLine />,
      color: "success",
    },
    {
      id: "pool",
      name: "Pool",
      description: "Classic 8-ball and 9-ball pool tables for casual gaming",
      price: "$12/hour",
      icon: <RiBasketballLine />,
      color: "primary",
    },
    {
      id: "playstation",
      name: "PlayStation",
      description: "Latest PS5 consoles with premium gaming setup",
      price: "$20/hour",
      icon: <RiGamepadLine />,
      color: "info",
    },
    {
      id: "dining",
      name: "Dining",
      description: "Comfortable dining tables with full menu service",
      price: "$8/hour",
      icon: <RiRestaurantLine />,
      color: "warning",
    },
  ];

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];
  const bookedSlots = ["2:00 PM", "7:00 PM"];

  const daysInMonth = [
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 31, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 31, currentMonth: true },
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    const nameValid = fullName.trim() !== "";
    const phoneValid = /^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.trim());

    setNameError(!nameValid);
    setPhoneError(!phoneValid);

    return nameValid && phoneValid;
  };

  const handleConfirm = () => {
    alert(
      "Booking confirmed! You will receive a confirmation message shortly."
    );
  };

  const getTypeInfo = (type) => {
    return tableTypes.find((t) => t.id === type) || tableTypes[0];
  };

  return (
    <div className="p-3">
      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header */}
        <header className="">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h1 className="h2 fw-bold text-dark">Book a Table</h1>
              <p className="text-muted mb-0">
                Reserve your preferred gaming table or dining spot
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-4">
            <div
              className="d-flex flex-wrap gap-3 justify-content-start justify-content-md-between"
              style={{ maxWidth: "100%" }}
            >
              {/* Step Component */}
              {[
                { step: 1, label: "Choose Type" },
                { step: 2, label: "Select Time" },
                { step: 3, label: "Enter Details" },
                { step: 4, label: "Confirm" },
              ].map((item, index, arr) => (
                <div
                  key={item.step}
                  className={`d-flex flex-column flex-lg-row align-items-center ${currentStep > item.step ? "text-dark" : "text-muted"
                    }`}
                >
                  {/* Step Circle + Label */}
                  <div className="d-flex flex-column flex-lg-row align-items-center text-center text-lg-start">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mx-lg-0 ${currentStep >= item.step ? "bg-warning text-dark" : "bg-light text-muted"
                        }`}
                      style={{ width: "32px", height: "32px" }}
                    >
                      {item.step}
                    </div>
                    <span className="mt-1 mt-lg-0 ms-lg-2 small fw-medium">{item.label}</span>
                  </div>

                  {/* Line (only visible on large screens and up) */}
                  {index !== arr.length - 1 && (
                    <div
                      className={`d-none d-lg-block mx-lg-2 ${currentStep > item.step ? "bg-warning" : "bg-dark"
                        }`}
                      style={{ height: "2px", width: "245px" }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </header>

        {/* Content Area */}
        <div className="flex-grow-1 overflow-auto p-4">
          {/* Step 1: Choose Type */}
          <div className={currentStep === 1 ? "" : "d-none"}>
            <div className="mb-4">
              <h2 className="h5 fw-semibold text-dark">Choose Table Type</h2>
              <p className="text-muted">
                Select the type of table you'd like to book
              </p>
            </div>

            <div className="row g-4">
              {tableTypes.map((type) => (
                <div key={type.id} className="col-md-6 col-lg-3">
                  <div
                    className={`card h-100 cursor-pointer ${selectedType === type.id
                      ? "border-warning bg-warning bg-opacity-10"
                      : ""
                      }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div
                      className={`card-body text-center bg-${type.color}-100 rounded-3 p-4 mx-auto my-3`}
                      style={{ width: "64px", height: "64px" }}
                    >
                      {React.cloneElement(type.icon, {
                        className: `text-${type.color} fs-4`,
                      })}
                    </div>
                    <div className="card-body text-center">
                      <h5 className="card-title">{type.name}</h5>
                      <p className="card-text text-muted small">
                        {type.description}
                      </p>
                      <p className="text-warning fw-semibold">{type.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 d-flex justify-content-end">
              <button
                className="btn btn-warning text-dark px-4 py-2 fw-semibold"
                onClick={handleNextStep}
                disabled={!selectedType}
              >
                Continue to Time Selection
              </button>
            </div>
          </div>

          {/* Step 2: Select Time */}
          <div className={currentStep === 2 ? "" : "d-none"}>
            <div className="mb-4">
              <h2 className="h5 fw-semibold text-dark">Select Date & Time</h2>
              <p className="text-muted">
                Choose your preferred date and time slot
              </p>
            </div>

            <div className="row g-4">
              {/* Calendar */}
              <div className="col-lg-6">
                <div className="card">
                  <Calendar />
                </div>
              </div>

              {/* Time Slots */}
              <div className="col-lg-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h6 fw-semibold text-dark mb-3">
                      Available Time Slots
                    </h3>
                    <div className="row row-cols-3 g-2">
                      {timeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedTime === slot;
                        return (
                          <div key={slot} className="col">
                            <button
                              className={`btn w-100 btn-sm ${isSelected
                                ? "btn-warning"
                                : isBooked
                                  ? "btn-light text-muted disabled"
                                  : "btn-outline-secondary"
                                }`}
                              disabled={isBooked}
                              onClick={() => setSelectedTime(slot)}
                            >
                              {slot}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 d-flex gap-3 small">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="border rounded"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="text-muted">Available</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-light rounded"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="text-muted">Booked</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-warning rounded"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="text-muted">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                className="btn btn-light text-dark px-4 py-2 fw-semibold"
                onClick={handleBackStep}
              >
                Back to Table Selection
              </button>
              <button
                className="btn btn-warning text-dark px-4 py-2 fw-semibold"
                onClick={handleNextStep}
                disabled={!selectedTime}
              >
                Continue to Details
              </button>
            </div>
          </div>

          {/* Step 3: Enter Details */}
          <div className={currentStep === 3 ? "" : "d-none"}>
            <div className="mb-4">
              <h2 className="h5 fw-semibold text-dark">Personal Details</h2>
              <p className="text-muted">
                Please provide your contact information
              </p>
            </div>

            <div className="card" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${nameError ? "is-invalid" : ""}`}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {nameError && (
                    <div className="invalid-feedback">
                      Please enter your full name
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${phoneError ? "is-invalid" : ""}`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {phoneError && (
                    <div className="invalid-feedback">
                      Please enter a valid phone number
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                className="btn btn-light text-dark px-4 py-2 fw-semibold"
                onClick={handleBackStep}
              >
                Back to Time Selection
              </button>
              <button
                className="btn btn-warning text-dark px-4 py-2 fw-semibold"
                onClick={() => {
                  if (validateForm()) {
                    handleNextStep();
                  }
                }}
              >
                Review Booking
              </button>
            </div>
          </div>

          {/* Step 4: Confirm Booking */}
          <div className={currentStep === 4 ? "" : "d-none"}>
            <div className="mb-4">
              <h2 className="h5 fw-semibold text-dark">Confirm Your Booking</h2>
              <p className="text-muted">
                Please review your booking details before confirming
              </p>
            </div>

            <div className="card" style={{ maxWidth: "600px" }}>
              <div className="card-body">
                <h3 className="h6 fw-semibold text-dark mb-3">
                  Booking Summary
                </h3>

                <div className="mb-4">
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <div
                      className={`bg-${getTypeInfo(selectedType).color
                        }-100 rounded p-3 me-3`}
                    >
                      {React.cloneElement(getTypeInfo(selectedType).icon, {
                        className: `text-${getTypeInfo(selectedType).color
                          } fs-4`,
                      })}
                    </div>
                    <div>
                      <h5 className="fw-semibold mb-1">
                        {getTypeInfo(selectedType).name}
                      </h5>
                      <p className="text-muted small mb-0">
                        {getTypeInfo(selectedType).price}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Date:</span>
                    <span className="fw-medium">{selectedDate}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Time:</span>
                    <span className="fw-medium">{selectedTime}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Name:</span>
                    <span className="fw-medium">{fullName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Phone:</span>
                    <span className="fw-medium">{phoneNumber}</span>
                  </div>
                </div>

                <div className="pt-3 border-top">
                  <h4 className="h6 fw-semibold text-dark mb-3">
                    Notification Preferences
                  </h4>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="smsNotification"
                      checked={smsNotification}
                      onChange={() => setSmsNotification(!smsNotification)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="smsNotification"
                    >
                      Send SMS confirmation
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotification"
                      checked={emailNotification}
                      onChange={() => setEmailNotification(!emailNotification)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="emailNotification"
                    >
                      Send email confirmation
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                className="btn btn-light text-dark px-4 py-2 fw-semibold"
                onClick={handleBackStep}
              >
                Back to Details
              </button>
              <button
                className="btn btn-success text-white px-4 py-2 fw-semibold"
                onClick={handleConfirm}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
