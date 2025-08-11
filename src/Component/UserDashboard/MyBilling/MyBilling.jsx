import React, { useState } from 'react';
import { RiBillLine, RiArrowDownSLine, RiArrowUpSLine, RiMoneyDollarCircleLine, RiQrCodeLine, RiTimeLine , RiCloseLine } from 'react-icons/ri';

const MyBilling = () => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    text: 'Unpaid',
    className: 'bg-danger text-white'
  });

  const toggleOrderDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  const handleCashPayment = () => {
    setShowQRCode(false);
    setTimeout(() => {
      setPaymentSuccess(true);
      setPaymentStatus({
        text: 'Paid',
        className: 'bg-success text-white'
      });
    }, 1000);
  };

  const handleQRPayment = () => {
    setPaymentSuccess(false);
    setShowQRCode(true);
  };

  const handlePaymentComplete = () => {
    setShowQRCode(false);
    setPaymentSuccess(true);
    setPaymentStatus({
      text: 'Paid',
      className: 'bg-success text-white'
    });
  };

  const closeQRCode = () => {
    setShowQRCode(false);
  };

  return (
    <div className="p-3">
      {/* Header */}
      <header className="">
        <div className="">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 gap-md-3 mb-2 mb-sm-0">
              <h1 className="fs-3 fw-bold text-dark">My Bill</h1>
            </div>
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <div className="text-muted small text-center text-sm-end">
                <div>January 19, 2025</div>
                <div>2:45 PM</div>
              </div>
              <div className={`badge rounded-pill px-2 px-md-3 py-1 ${paymentStatus.className}`}>
                {paymentStatus.text}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-3">
        <div className="card shadow-lg">
          <div className="card-body">
            {/* Session Charges */}
            <section className="border-bottom pb-3 pb-md-4 mb-3 mb-md-4">
              <h2 className="fs-5 fs-md-4 fw-bold text-dark mb-2 mb-md-3">Session Charges</h2>
              <div className="row g-2">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Start Time</span>
                    <span className="fw-medium">12:30 PM</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">End Time</span>
                    <span className="fw-medium">2:45 PM</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Duration</span>
                    <span className="fw-medium">2 hours 15 minutes</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Hourly Rate</span>
                    <span className="fw-medium">$15.00/hour</span>
                  </div>
                </div>
                <div className="col-12 pt-2 border-top">
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold text-dark">Session Subtotal</span>
                    <span className="fw-bold text-dark">$33.75</span>
                  </div>
                </div>
              </div>
            </section>

            {/* My Orders */}
            <section className="mb-3 mb-md-4">
              <div className="d-flex justify-content-between align-items-center mb-2 mb-md-3">
                <h2 className="fs-5 fs-md-4 fw-bold text-dark m-0">My Orders</h2>
                <button 
                  className="btn btn-link text-warning p-0 d-flex align-items-center gap-1 gap-md-2"
                  onClick={toggleOrderDetails}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="small fw-medium">
                    {showOrderDetails ? 'Hide Details' : 'View Details'}
                  </span>
                  {showOrderDetails ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </button>
              </div>
              
              {showOrderDetails && (
                <div className="mb-3">
                  <div className="row g-2 mb-3">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center p-2 p-md-3 bg-light rounded mb-2">
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                          <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🍔</div>
                          <div>
                            <div className="fw-medium">Deluxe Burger</div>
                            <div className="text-muted small">Qty: 2</div>
                          </div>
                        </div>
                        <span className="fw-semibold">$24.00</span>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center p-2 p-md-3 bg-light rounded mb-2">
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                          <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🍹</div>
                          <div>
                            <div className="fw-medium">Energy Drink</div>
                            <div className="text-muted small">Qty: 3</div>
                          </div>
                        </div>
                        <span className="fw-semibold">$9.00</span>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center p-2 p-md-3 bg-light rounded">
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                          <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎮</div>
                          <div>
                            <div className="fw-medium">Extra Game Credits</div>
                            <div className="text-muted small">Qty: 1</div>
                          </div>
                        </div>
                        <span className="fw-semibold">$5.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-top pt-2 pt-md-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold text-dark">Orders Subtotal</span>
                      <span className="fw-bold text-dark">$38.00</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-between">
                <span className="fw-semibold text-dark">Orders Subtotal</span>
                <span className="fw-bold text-dark">$38.00</span>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-warning bg-opacity-10 rounded-2 rounded-md-3 p-3 p-md-4 mb-3 mb-md-4">
              <div className="row g-2">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-dark">Subtotal</span>
                    <span className="fw-medium">$71.75</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-dark">Tax (8.5%)</span>
                    <span className="fw-medium">$6.10</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-dark">Service Fee</span>
                    <span className="fw-medium">$2.50</span>
                  </div>
                </div>
                <div className="col-12 border-top border-warning border-opacity-30 pt-2 pt-md-3">
                  <div className="d-flex justify-content-between">
                    <span className="fs-5 fw-bold text-dark">Total Amount</span>
                    <span className="fs-4 fw-bold text-dark">$80.35</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Options */}
            <section>
              <h3 className="fs-5 fw-bold text-dark mb-2 mb-md-3">Payment Options</h3>
              
              <div className="row g-2 g-md-3 mb-3">
                <div className="col-12 col-md-6">
                  <button 
                    className="btn btn-warning text-dark fw-bold w-100 py-2 py-md-3 d-flex align-items-center justify-content-center gap-1 gap-md-2"
                    onClick={handleCashPayment}
                    style={{ borderRadius: '8px' }}
                  >
                    <RiMoneyDollarCircleLine style={{ fontSize: '1rem' }} />
                    <span>Pay with Cash</span>
                  </button>
                </div>
                <div className="col-12 col-md-6">
                  <button 
                    className="btn btn-dark text-white fw-bold w-100 py-2 py-md-3 d-flex align-items-center justify-content-center gap-1 gap-md-2"
                    onClick={handleQRPayment}
                    style={{ borderRadius: '8px' }}
                  >
                    <RiQrCodeLine style={{ fontSize: '1rem' }} />
                    <span>Scan QR Code</span>
                  </button>
                </div>
              </div>
              
              {showQRCode && (
                <div className="bg-light rounded-2 rounded-md-3 p-3 p-md-4 text-center mb-3 position-relative">
                  <button 
                    className="position-absolute top-0 end-0 m-2 m-md-3 btn btn-sm btn-outline-secondary"
                    onClick={closeQRCode}
                  >
                    <RiCloseLine />
                  </button>
                  <h4 className="fs-5 fw-semibold text-dark mb-2 mb-md-3">Scan & Pay</h4>
                  <div className="bg-white p-2 p-md-3 rounded-2 rounded-md-3 d-inline-block shadow-sm">
                    <div className="rounded d-flex align-items-center justify-content-center mx-auto" 
                      style={{ 
                        width: '150px', 
                        height: '150px',
                        maxWidth: '100%',
                        backgroundColor: '#f8f9fa' 
                      }}>
                      <div className="text-center">
                        <div className="mx-auto mb-1 mb-md-2" style={{ 
                          width: '50px', 
                          height: '50px',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <RiQrCodeLine style={{ fontSize: '2rem', color: '#adb5bd' }} />
                        </div>
                        <div className="text-muted small">QR Code</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>$80.35</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted small mt-2 mt-md-3">Use your mobile banking app to scan and pay</p>
                  <div className="mt-2 mt-md-3">
                    <div className="d-inline-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 bg-warning bg-opacity-25 text-warning-emphasis rounded-pill small">
                      <RiTimeLine style={{ fontSize: '0.8rem' }} />
                      <span>Waiting for payment...</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-success mt-3 mt-md-4"
                    onClick={handlePaymentComplete}
                  >
                    I've Completed Payment
                  </button>
                </div>
              )}
              
              {paymentSuccess && (
                <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2 rounded-md-3 p-3 p-md-4 text-center">
                  <div className="mx-auto mb-2 mb-md-3" style={{ 
                    width: '40px', 
                    height: '40px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    
                  </div>
                  <h4 className="fs-5 fw-semibold text-success mb-1 mb-md-2">Payment Successful!</h4>
                  <p className="text-success small">Your payment of $80.35 has been processed.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBilling;