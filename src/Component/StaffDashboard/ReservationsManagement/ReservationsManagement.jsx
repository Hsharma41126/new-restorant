import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Dropdown, Badge } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Calendar,
  Person,
  Telephone,
  Table as TableIcon,
  Clock,
  Gear,
  GraphUp,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';

const ReservationsManagement = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    tableType: 'Select table type',
    date: '',
    time: ''
  });

  // State for table type dropdown
  const [showTableTypeDropdown, setShowTableTypeDropdown] = useState(false);

  // State for active filter
  const [activeFilter, setActiveFilter] = useState('all');

  // State for reservations data
  const [reservations, setReservations] = useState([
    {
      id: 1,
      customer: 'Michael Johnson',
      phone: '+1 (555) 123-4567',
      tableType: 'Snooker Table',
      time: '2:00 PM',
      status: 'confirmed'
    },
    {
      id: 2,
      customer: 'Sarah Williams',
      phone: '+1 (555) 987-6543',
      tableType: 'PlayStation Station',
      time: '3:30 PM',
      status: 'arrived'
    },
    {
      id: 3,
      customer: 'David Chen',
      phone: '+1 (555) 456-7890',
      tableType: 'Pool Table',
      time: '5:00 PM',
      status: 'confirmed'
    },
    {
      id: 4,
      customer: 'Emma Rodriguez',
      phone: '+1 (555) 321-0987',
      tableType: 'Restaurant Table',
      time: '6:30 PM',
      status: 'cancelled'
    },
    {
      id: 5,
      customer: 'James Wilson',
      phone: '+1 (555) 654-3210',
      tableType: 'Snooker Table',
      time: '8:00 PM',
      status: 'confirmed'
    }
  ]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle table type selection
  const handleTableTypeSelect = (type, text) => {
    setFormData(prev => ({
      ...prev,
      tableType: text
    }));
    setShowTableTypeDropdown(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation here
    const newReservation = {
      id: reservations.length + 1,
      customer: formData.customerName,
      phone: formData.phoneNumber,
      tableType: formData.tableType,
      time: formData.time,
      status: 'confirmed'
    };
    setReservations([...reservations, newReservation]);
    // Reset form
    setFormData({
      customerName: '',
      phoneNumber: '',
      tableType: 'Select table type',
      date: '',
      time: ''
    });
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, status: newStatus } : res
    ));
  };

  // Filter reservations based on active filter
  const filteredReservations = activeFilter === 'all'
    ? reservations
    : reservations.filter(res => res.status === activeFilter);

  // Get today's date in readable format
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayFormatted = today.toLocaleDateString('en-US', options);

  // Stats for today's summary
  const todayStats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    arrived: reservations.filter(r => r.status === 'arrived').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

  return (
    <div className="p-3">
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-grow-1">
        <div className="mb-4">
          <h1 className="fs-3 fw-bold text-dark">Reservations Management</h1>
          <p className="text-muted">Manage customer reservations and bookings</p>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <span className="me-3 text-warning"><Plus size={20} /></span>
                  <h2 className="h5 mb-0">Add New Reservation</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text"><Person /></span>
                          <Form.Control
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="Enter customer name"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text"><Telephone /></span>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Table Type</Form.Label>
                        <Dropdown
                          show={showTableTypeDropdown}
                          onToggle={(isOpen) => setShowTableTypeDropdown(isOpen)}
                        >
                          <Dropdown.Toggle
                            className="w-100 text-dark text-start d-flex justify-content-between align-items-center"
                            style={{ fontSize: "1rem", height: "38px", borderRadius: "6px", border: "1px solid #dee2e6", backgroundColor: "white" }}
                          >
                            {formData.tableType || "Select table type"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="w-100">
                            <Dropdown.Item onClick={() => handleTableTypeSelect('snooker', 'Snooker Table')}>
                              Snooker Table
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTableTypeSelect('pool', 'Pool Table')}>
                              Pool Table
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTableTypeSelect('playstation', 'PlayStation Station')}>
                              PlayStation Station
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTableTypeSelect('restaurant', 'Restaurant Table')}>
                              Restaurant Table
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text"><Calendar /></span>
                          <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Time</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text"><Clock /></span>
                          <Form.Control
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" variant="warning" className="w-100 mt-4 text-white">
                    Add Reservation
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">

            </Card>

            <Card>
              <Card.Body>
                <h3 className="h5 mb-3">Today's Summary</h3>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Total Reservations</span>
                    <span className="fw-bold">{todayStats.total}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Confirmed</span>
                    <span className="fw-bold text-primary">{todayStats.confirmed}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Arrived</span>
                    <span className="fw-bold text-success">{todayStats.arrived}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Cancelled</span>
                    <span className="fw-bold text-danger">{todayStats.cancelled}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mt-4">
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <h2 className="h5 mb-2 mb-md-0">Today's Reservations</h2>
              <div className="text-muted small">{todayFormatted}</div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4 ">
              <Button
                className='bg-warning'
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'confirmed' ? 'warning' : 'outline-secondary'}
                size="sm"
                className="text-dark"
                onClick={() => setActiveFilter('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={activeFilter === 'arrived' ? 'warning' : 'outline-secondary'}
                size="sm"
                className="text-dark"
                onClick={() => setActiveFilter('arrived')}
              >
                Arrived
              </Button>
              <Button
                variant={activeFilter === 'cancelled' ? 'warning' : 'outline-secondary'}
                size="sm"
                className="text-dark"
                onClick={() => setActiveFilter('cancelled')}
              >
                Cancelled
              </Button>
            </div>

            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Table Type</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map(reservation => (
                    <tr key={reservation.id}>
                      <td className="fw-bold">{reservation.customer}</td>
                      <td>{reservation.phone}</td>
                      <td>{reservation.tableType}</td>
                      <td>{reservation.time}</td>
                      <td>
                        {reservation.status === 'confirmed' && (
                          <Badge bg="primary">Confirmed</Badge>
                        )}
                        {reservation.status === 'arrived' && (
                          <Badge bg="success">Arrived</Badge>
                        )}
                        {reservation.status === 'cancelled' && (
                          <Badge bg="danger">Cancelled</Badge>
                        )}
                      </td>
                      <td>
                        {reservation.status === 'confirmed' ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2 mb-2"
                              onClick={() => handleStatusChange(reservation.id, 'arrived')}
                            >
                              Mark Arrived
                            </Button>
                            <Button
                              className='mb-2'
                              variant="danger"
                              size="sm"
                              onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <span className="text-muted small">
                            {reservation.status === 'arrived'
                              ? 'No actions available'
                              : reservation.status === 'cancelled' && 'Cancelled by customer'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ReservationsManagement;