import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {
    RiDashboardLine,
    RiTableLine,
    RiRestaurantLine,
    RiBillLine,
    RiSettingsLine,
    RiArrowDownSLine,
    RiCheckLine,
    RiMoneyDollarCircleLine,
    RiBankCardLine,
    RiSmartphoneLine,
    RiPrinterLine,
    RiMailLine
} from 'react-icons/ri';

const BillingPayment = () => {
    const [selectedDiscount, setSelectedDiscount] = useState('Select Discount');
    const [customDiscount, setCustomDiscount] = useState('');
    const [discountMenuOpen, setDiscountMenuOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [sessionTime, setSessionTime] = useState('02:45:32');
    const [isProcessing, setIsProcessing] = useState(false);

    // Timer functionality
    useEffect(() => {
        let startTime = new Date();
        startTime.setHours(startTime.getHours() - 2);
        startTime.setMinutes(startTime.getMinutes() - 45);
        startTime.setSeconds(startTime.getSeconds() - 32);

        const updateTimer = () => {
            const now = new Date();
            const diff = now - startTime;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setSessionTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Discount functionality
    const applyDiscount = () => {
        // In a real app, you would update the total here
        console.log('Discount applied:', selectedDiscount, customDiscount);
        setDiscountMenuOpen(false);
    };

    const clearDiscount = () => {
        setSelectedDiscount('Select Discount');
        setCustomDiscount('');
    };

    const selectDiscountOption = (option) => {
        setSelectedDiscount(option);
        setDiscountMenuOpen(false);
    };

    // Payment functionality
    const handlePayment = () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            alert('Payment successful! Session closed and table is now available.');
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="p-3">
            {/* Main Content */}
            <div className="">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
                        <div className="">
                            <h1 className="fs-3 fw-bold text-dark">Billing & Payment</h1>
                            <p className="text-muted mb-0">Manage session billing and process payments</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill small fw-medium">
                                Table 12 - Active
                            </span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="row g-4">
                        {/* Left Column */}
                        <div className="col-lg-8">
                            {/* Bill Summary Card */}
                            <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
                                    <div>
                                        <h2 className="fs-5 fw-semibold text-dark">Bill Summary</h2>
                                        <p className="text-muted small">Table 12 • Started: 2:30 PM</p>
                                    </div>
                                    <div className="text-md-end mt-3 mt-md-0">
                                        <div className="bg-warning text-dark px-4 py-2 rounded-3 font-monospace fw-bold fs-5">
                                            {sessionTime}
                                        </div>
                                        <p className="text-muted x-small mt-1">Session Time</p>
                                    </div>
                                </div>

                                <div className="bill-summary-content">
                                    {/* Session Charges */}
                                    <div className="border-bottom pb-3 mb-3">
                                        <h3 className="fs-5 fw-semibold text-dark ">Session Charges</h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="text-dark">Gaming Session (2h 45m)</span>
                                                <p className="text-muted small mb-0">$15.00/hour</p>
                                            </div>
                                            <span className="fw-semibold">$41.25</span>
                                        </div>
                                    </div>

                                    {/* Food & Beverages */}
                                    <div className="border-bottom pb-3 mb-3">
                                        <h3 className="fs-5 fw-semibold text-dark">Food & Beverages</h3>
                                        <div className="food-items-list">
                                            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-2">
                                                <div>
                                                    <span className="text-dark">Chicken Wings</span>
                                                    <span className="text-muted small ms-2">× 2</span>
                                                </div>
                                                <span className="fw-semibold">$24.00</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center p-3 rounded mb-2">
                                                <div>
                                                    <span className="text-dark">Coca Cola</span>
                                                    <span className="text-muted small ms-2">× 3</span>
                                                </div>
                                                <span className="fw-semibold">$9.00</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-2">
                                                <div>
                                                    <span className="text-dark">Nachos Supreme</span>
                                                    <span className="text-muted small ms-2">× 1</span>
                                                </div>
                                                <span className="fw-semibold">$18.50</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center p-3 rounded">
                                                <div>
                                                    <span className="text-dark">Energy Drink</span>
                                                    <span className="text-muted small ms-2">× 2</span>
                                                </div>
                                                <span className="fw-semibold">$8.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="totals-section">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Subtotal</span>
                                            <span>$100.75</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Tax (8.5%)</span>
                                            <span>$8.56</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1 discount-row d-none">
                                            <span className="text-success">Discount (<span id="discount-percent">0</span>%)</span>
                                            <span className="text-success">-$<span id="discount-amount">0.00</span></span>
                                        </div>
                                        <div className="border-top pt-2 mt-2">
                                            <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                                                <span>Total</span>
                                                <span id="final-total">$109.31</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Card */}
                            <div className="bg-white rounded-3 shadow-sm border p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h3 className="fs-5 fw-semibold text-dark">Apply Discount</h3>
                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded small fw-medium">
                                        Admin Only
                                    </span>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-medium text-muted">Preset Discounts</label>
                                        <div className="position-relative">
                                            <button
                                                className="form-select text-start d-flex align-items-center justify-content-between"
                                                onClick={() => setDiscountMenuOpen(!discountMenuOpen)}
                                            >
                                                <span>{selectedDiscount}</span>
                                                {/* <RiArrowDownSLine /> */}
                                            </button>
                                            {discountMenuOpen && (
                                                <div className="position-absolute top-100 start-0 end-0 bg-white border rounded mt-1 shadow-lg z-10">
                                                    <button
                                                        className="w-100 text-start px-3 py-2 bg-hover-light discount-option"
                                                        onClick={() => selectDiscountOption('5% - Student Discount')}
                                                    >
                                                        5% - Student Discount
                                                    </button>
                                                    <button
                                                        className="w-100 text-start px-3 py-2 bg-hover-light discount-option"
                                                        onClick={() => selectDiscountOption('10% - Member Discount')}
                                                    >
                                                        10% - Member Discount
                                                    </button>
                                                    <button
                                                        className="w-100 text-start px-3 py-2 bg-hover-light discount-option"
                                                        onClick={() => selectDiscountOption('15% - VIP Discount')}
                                                    >
                                                        15% - VIP Discount
                                                    </button>
                                                    <button
                                                        className="w-100 text-start px-3 py-2 bg-hover-light discount-option"
                                                        onClick={() => selectDiscountOption('20% - Special Promotion')}
                                                    >
                                                        20% - Special Promotion
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-medium text-muted">Custom Amount ($)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter amount"
                                            value={customDiscount}
                                            onChange={(e) => setCustomDiscount(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        className="btn btn-warning flex-grow-1"
                                        onClick={applyDiscount}
                                    >
                                        Apply Discount
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={clearDiscount}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-lg-4">
                            <div className="bg-white rounded-3 shadow-sm border p-4" style={{ top: '1rem' }}>
                                <h3 className="fs-5 fw-semibold text-dark mb-4">Payment & Close Session</h3>

                                <div className="mb-4">
                                    {/* Payment Methods */}
                                    <div className="bg-light p-3 rounded-3 mb-3">
                                        <h4 className="fw-medium text-dark mb-2">Payment Methods</h4>
                                        <div className="payment-methods">
                                            <label className="d-flex align-items-center gap-3 mb-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cash"
                                                    className="form-check-input"
                                                    checked={paymentMethod === 'cash'}
                                                    onChange={() => setPaymentMethod('cash')}
                                                />
                                                <div className="d-flex align-items-center gap-2">
                                                    <RiMoneyDollarCircleLine className="text-success fs-5" />
                                                    <span>Cash Payment</span>
                                                </div>
                                            </label>
                                            <label className="d-flex align-items-center gap-3 mb-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    className="form-check-input"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={() => setPaymentMethod('card')}
                                                />
                                                <div className="d-flex align-items-center gap-2">
                                                    <RiBankCardLine className="text-primary fs-5" />
                                                    <span>Card Payment</span>
                                                </div>
                                            </label>
                                            <label className="d-flex align-items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="upi"
                                                    className="form-check-input"
                                                    checked={paymentMethod === 'upi'}
                                                    onChange={() => setPaymentMethod('upi')}
                                                />
                                                <div className="d-flex align-items-center gap-2">
                                                    <RiSmartphoneLine className="text-purple fs-5" />
                                                    <span>UPI Payment</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Session Actions */}
                                    <div className="bg-light p-3 rounded-3">
                                        <h4 className="fw-medium text-dark mb-2">Session Actions</h4>
                                        <div className="session-actions small">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Stop Timer</span>
                                                <RiCheckLine className="text-success" />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Turn OFF Lights</span>
                                                <RiCheckLine className="text-success" />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="text-muted">Mark Table Free</span>
                                                <RiCheckLine className="text-success" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className={`btn btn-success w-100 py-3 mb-3 ${isProcessing ? 'disabled' : ''}`}
                                    onClick={handlePayment}
                                >
                                    {isProcessing ? 'Processing...' : `Pay Now - $109.31`}
                                </button>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <button className="btn btn-outline-secondary w-100 small d-flex align-items-center justify-content-center gap-1">
                                            <RiPrinterLine />
                                            Print Receipt
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-outline-secondary w-100 small d-flex align-items-center justify-content-center gap-1">
                                            <RiMailLine />
                                            Email Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPayment;