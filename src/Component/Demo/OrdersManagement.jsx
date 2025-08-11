import React, { useState, useEffect } from 'react';
import { RiDashboardLine, RiRestaurantLine, RiTableLine, RiGamepadLine, RiPrinterLine, RiBarChartLine, RiSettingsLine, RiRefreshLine, RiAddLine, RiSubtractLine, RiCloseLine, RiCupLine, RiSearchLine, RiShoppingCartLine, RiFilterLine, RiCheckLine } from 'react-icons/ri';
import { Dropdown } from 'react-bootstrap';

const OrdersManagement = () => {
  // State for category tabs
  const [activeCategory, setActiveCategory] = useState('food');
  const [expandedCategory, setExpandedCategory] = useState(null);


  // State for cart
  const [cart, setCart] = useState(new Map());
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState('');

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState('dine-in');
  const [orderType, setOrderType] = useState('food');
  const [selectedLocation, setSelectedLocation] = useState('restaurant');
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // State for mobile view
  const [showCart, setShowCart] = useState(false);

  // State for table filtering
  const [tableFilter, setTableFilter] = useState('all');
  const [showTableFilter, setShowTableFilter] = useState(false);


  // State for mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [sendOrder, setSendOrder] = useState();

  // Generate more tables for demonstration
  const generateTables = () => {
    const baseTables = [
      { id: 'pool-1', name: 'Pool Table 1', status: 'available', details: 'Last cleaned: 10:30 AM', color: 'primary', type: 'game' },
      { id: 'pool-2', name: 'Pool Table 2', status: 'occupied', details: 'Started: 2:15 PM', color: 'warning', type: 'game' },
      { id: 'snooker-1', name: 'Snooker 1', status: 'available', details: 'Last cleaned: 11:45 AM', color: 'secondary', type: 'game' },
      { id: 'ps-1', name: 'PlayStation 1', status: 'reserved', details: 'Reserved for 3:00 PM', color: 'danger', type: 'game' },
      { id: 'ps-2', name: 'PlayStation 2', status: 'occupied', details: 'Started: 1:30 PM', color: 'warning', type: 'game' },
      { id: 'restaurant-1', name: 'Restaurant T1', status: 'available', details: 'Seats: 4', color: 'secondary', type: 'dining' },
      { id: 'restaurant-2', name: 'Restaurant T2', status: 'available', details: 'Seats: 2', color: 'secondary', type: 'dining' },
      { id: 'restaurant-3', name: 'Restaurant T3', status: 'occupied', details: 'Started: 1:45 PM', color: 'warning', type: 'dining' },
      { id: 'restaurant-4', name: 'Restaurant T4', status: 'available', details: 'Seats: 6', color: 'secondary', type: 'dining' },
      { id: 'restaurant-5', name: 'Restaurant T5', status: 'reserved', details: 'Reserved for 3:30 PM', color: 'danger', type: 'dining' },
      { id: 'restaurant-6', name: 'Restaurant T6', status: 'available', details: 'Seats: 4', color: 'secondary', type: 'dining' },
      { id: 'restaurant-7', name: 'Restaurant T7', status: 'available', details: 'Seats: 8', color: 'secondary', type: 'dining' },
      { id: 'restaurant-8', name: 'Restaurant T8', status: 'occupied', details: 'Started: 2:00 PM', color: 'warning', type: 'dining' },
      { id: 'pool-3', name: 'Pool Table 3', status: 'available', details: 'Last cleaned: 12:30 PM', color: 'primary', type: 'game' },
      { id: 'pool-4', name: 'Pool Table 4', status: 'available', details: 'Last cleaned: 1:00 PM', color: 'primary', type: 'game' },
      { id: 'snooker-2', name: 'Snooker 2', status: 'occupied', details: 'Started: 12:45 PM', color: 'warning', type: 'game' },
      { id: 'ps-3', name: 'PlayStation 3', status: 'available', details: 'Ready to use', color: 'secondary', type: 'game' },
      { id: 'ps-4', name: 'PlayStation 4', status: 'reserved', details: 'Reserved for 4:00 PM', color: 'danger', type: 'game' },
      { id: 'ps-5', name: 'PlayStation 5', status: 'available', details: 'Ready to use', color: 'secondary', type: 'game' },
      { id: 'ps-6', name: 'PlayStation 6', status: 'occupied', details: 'Started: 1:15 PM', color: 'warning', type: 'game' }
    ];

    return baseTables;
  };

  const tables = generateTables();

  // Filter tables based on selected filter
  const filteredTables = tables.filter(table => {
    if (tableFilter === 'all') return true;
    if (tableFilter === 'available') return table.status === 'available';
    if (tableFilter === 'occupied') return table.status === 'occupied';
    if (tableFilter === 'reserved') return table.status === 'reserved';
    if (tableFilter === 'dining') return table.type === 'dining';
    if (tableFilter === 'game') return table.type === 'game';
    return true;
  });

  // Menu items data organized by categories and subcategories
  const menuCategories = {
    food: {
      name: "Food",
      subcategories: {
        pizza: {
          name: "Pizza",
          items: [
            { id: 1, name: 'Margherita Pizza', description: 'Fresh basil and mozzarella', price: 18.50, image: 'https://readdy.ai/api/search-image?query=margherita%20pizza%20with%20fresh%20basil%20and%20mozzarella%20cheese%20on%20white%20background%2C%20professional%20food%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=pizza1&orientation=squarish' },
            { id: 2, name: 'Pepperoni Pizza', description: 'Classic pepperoni with cheese', price: 19.99, image: 'https://readdy.ai/api/search-image?query=pepperoni%20pizza%20on%20white%20background&width=200&height=200&seq=pizza2&orientation=squarish' }
          ]
        },
        burgers: {
          name: "Burgers",
          items: [
            { id: 3, name: 'Chicken Burger', description: 'Crispy chicken with fresh lettuce', price: 12.99, image: 'https://readdy.ai/api/search-image?query=delicious%20crispy%20chicken%20burger%20with%20lettuce%20tomato%20and%20cheese%20on%20white%20background%2C%20professional%20food%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=burger1&orientation=squarish' },
            { id: 4, name: 'Cheeseburger', description: 'Classic beef with cheese', price: 11.50, image: 'https://readdy.ai/api/search-image?query=cheeseburger%20on%20white%20background&width=200&height=200&seq=burger2&orientation=squarish' }
          ]
        },
        main: {
          name: "Main Courses",
          items: [
            { id: 5, name: 'Grilled Salmon', description: 'Fresh salmon with vegetables', price: 24.99, image: 'https://readdy.ai/api/search-image?query=grilled%20salmon%20steak%20with%20vegetables%20and%20lemon%20on%20white%20background%2C%20professional%20food%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=salmon1&orientation=squarish' },
            { id: 6, name: 'Steak', description: 'Grilled ribeye with mashed potatoes', price: 28.50, image: 'https://readdy.ai/api/search-image?query=grilled%20steak%20on%20white%20background&width=200&height=200&seq=steak1&orientation=squarish' }
          ]
        },
        salads: {
          name: "Salads",
          items: [
            { id: 7, name: 'Caesar Salad', description: 'Crisp romaine with parmesan', price: 9.99, image: 'https://readdy.ai/api/search-image?query=caesar%20salad%20with%20croutons%20parmesan%20cheese%20and%20dressing%20on%20white%20background%2C%20professional%20food%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=salad1&orientation=squarish' },
            { id: 8, name: 'Greek Salad', description: 'Fresh vegetables with feta', price: 10.50, image: 'https://readdy.ai/api/search-image?query=greek%20salad%20on%20white%20background&width=200&height=200&seq=salad2&orientation=squarish' }
          ]
        }
      }
    },
    drinks: {
      name: "Drinks",
      subcategories: {
        hot: {
          name: "Hot Drinks",
          items: [
            { id: 9, name: 'Coffee', description: 'Premium blend coffee', price: 3.50, image: 'https://readdy.ai/api/search-image?query=coffee%20cup%20on%20white%20background&width=200&height=200&seq=coffee1&orientation=squarish' },
            { id: 10, name: 'Tea', description: 'Selection of teas', price: 2.99, image: 'https://readdy.ai/api/search-image?query=tea%20cup%20on%20white%20background&width=200&height=200&seq=tea1&orientation=squarish' }
          ]
        },
        cold: {
          name: "Cold Drinks",
          items: [
            { id: 11, name: 'Fresh Orange Juice', description: '100% fresh squeezed', price: 4.99, image: 'https://readdy.ai/api/search-image?query=fresh%20orange%20juice%20in%20glass%20with%20orange%20slices%20on%20white%20background%2C%20professional%20beverage%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=juice1&orientation=squarish' },
            { id: 12, name: 'Iced Coffee', description: 'Premium blend with milk foam', price: 3.50, image: 'https://readdy.ai/api/search-image?query=iced%20coffee%20with%20milk%20foam%20in%20tall%20glass%20on%20white%20background%2C%20professional%20beverage%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=coffee1&orientation=squarish' }
          ]
        },
        alcoholic: {
          name: "Alcoholic Beverages",
          items: [
            { id: 13, name: 'Beer', description: 'Local craft beer', price: 5.99, image: 'https://readdy.ai/api/search-image?query=beer%20glass%20on%20white%20background&width=200&height=200&seq=beer1&orientation=squarish' },
            { id: 14, name: 'Wine', description: 'House red or white', price: 7.50, image: 'https://readdy.ai/api/search-image?query=wine%20glass%20on%20white%20background&width=200&height=200&seq=wine1&orientation=squarish' }
          ]
        }
      }
    },
    games: {
      name: "Games",
      subcategories: {
        pool: {
          name: "Pool Tables",
          items: [
            { id: 15, name: 'Pool Table', description: 'Per hour gaming session', price: 15.00, image: 'https://readdy.ai/api/search-image?query=pool%20table%20with%20colorful%20billiard%20balls%20and%20cues%20in%20game%20center%20on%20white%20background%2C%20professional%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=pool1&orientation=squarish' },
            { id: 16, name: 'Snooker Table', description: 'Professional snooker table', price: 18.00, image: 'https://readdy.ai/api/search-image?query=snooker%20table%20on%20white%20background&width=200&height=200&seq=snooker1&orientation=squarish' }
          ]
        },
        video: {
          name: "Video Games",
          items: [
            { id: 17, name: 'PlayStation 5', description: 'Latest games available', price: 20.00, image: 'https://readdy.ai/api/search-image?query=playstation%20gaming%20console%20with%20controllers%20and%20games%20in%20entertainment%20center%20on%20white%20background%2C%20professional%20photography%2C%20clean%20minimal%20background&width=200&height=200&seq=ps1&orientation=squarish' },
            { id: 18, name: 'Xbox Series X', description: 'Latest Xbox console', price: 20.00, image: 'https://readdy.ai/api/search-image?query=xbox%20console%20on%20white%20background&width=200&height=200&seq=xbox1&orientation=squarish' }
          ]
        },
        board: {
          name: "Board Games",
          items: [
            { id: 19, name: 'Chess', description: 'Classic chess set', price: 5.00, image: 'https://readdy.ai/api/search-image?query=chess%20board%20on%20white%20background&width=200&height=200&seq=chess1&orientation=squarish' },
            { id: 20, name: 'Monopoly', description: 'Classic board game', price: 7.00, image: 'https://readdy.ai/api/search-image?query=monopoly%20board%20game%20on%20white%20background&width=200&height=200&seq=monopoly1&orientation=squarish' }
          ]
        }
      }
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (item, action) => {
    const newCart = new Map(cart);
    const currentQuantity = newCart.get(item.id)?.quantity || 0;

    if (action === 'increase') {
      newCart.set(item.id, { ...item, quantity: currentQuantity + 1 });
    } else if (action === 'decrease' && currentQuantity > 0) {
      if (currentQuantity === 1) {
        newCart.delete(item.id);
      } else {
        newCart.set(item.id, { ...item, quantity: currentQuantity - 1 });
      }
    }

    setCart(newCart);

    // Auto-show cart when adding items on mobile
    if (isMobile && action === 'increase' && !showCart) {
      setShowCart(true);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart(new Map());
  };

  // Send to kitchen
  const sendToKitchen = () => {
    if (!selectedTable) {
      alert('Please select a table first');
      return;
    }
    alert(`Order sent to Kitchen/Bar for ${selectedTable}`);
    clearCart();
    setSelectedTable(null);
    if (isMobile) setShowCart(false);
  };

  // Calculate order totals
  const calculateTotals = () => {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.quantity * item.price;
    });
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Open/close modal
  const openNewOrderModal = () => setShowModal(true);
  const closeNewOrderModal = () => setShowModal(false);

  // Create new order
  const createNewOrder = () => {
    if (serviceType === 'dine-in' && !tableNumber) {
      alert('Please select a table for dine-in service');
      return;
    }
    if (!orderType) {
      alert('Please select an order type');
      return;
    }
    closeNewOrderModal();
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available': return 'bg-primary bg-opacity-10 text-primary';
      case 'occupied': return 'bg-warning bg-opacity-10 text-warning';
      case 'reserved': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  // Get table type icon
  const getTableTypeIcon = (type) => {
    return type === 'game' ? <RiGamepadLine /> : <RiRestaurantLine />;
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="d-flex flex-column vh-100" style={{ overflowX: 'hidden' }}>
      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        {/* Header */}
        <div className="p-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="">
              <h1 className="fs-3 fw-bold text-dark">Orders Management</h1>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
              <div className="d-none d-md-flex gap-4 small text-muted">
                <span className="d-flex align-items-center">
                  <span className="d-inline-block rounded-circle bg-dark me-2" style={{ width: '8px', height: '8px' }}></span>
                  Active Orders: 12
                </span>
                <span className="d-flex align-items-center">
                  <span className="d-inline-block rounded-circle bg-warning me-2" style={{ width: '8px', height: '8px' }}></span>
                  Pending KOTs: 3
                </span>
              </div>
              <button className="btn btn-light d-flex align-items-center btn-sm">
                <RiRefreshLine className="me-1 me-md-2" />
                <span className="d-none d-md-inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="d-flex flex-column flex-md-row flex-grow-1 overflow-hidden position-relative">
          {/* Menu Section */}
          <div className={`flex-grow-1 p-3 overflow-auto ${showCart ? 'd-none d-md-block' : ''}`} style={{ scrollbarWidth: 'none' }}>
            {/* Table Assignment Section */}
            <div className="">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-semibold mb-0">Assign to Table</h2>
                {isMobile && (
                  <button
                    className="btn btn-dark btn-sm d-flex align-items-center"
                    onClick={() => setShowCart(true)}
                  >
                    <RiShoppingCartLine className="me-1" />
                    {cart.size > 0 && <span className="badge bg-danger ms-1">{Array.from(cart.values()).reduce((acc, item) => acc + item.quantity, 0)}</span>}
                  </button>
                )}
              </div>

              {/* Food Category Tabs */}
              <div className="d-flex gap-2">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 w-100">
                  {/* Left Side Buttons - Scrollable on mobile */}
                  <div className="d-flex flex-nowrap overflow-auto gap-2 pb-2" style={{ scrollbarWidth: 'none' }}>
                    <button className="btn btn-outline-secondary btn-sm flex-shrink-0">All Tables</button>
                    <button className="btn btn-outline-secondary btn-sm flex-shrink-0">Pool</button>
                    <button className="btn btn-outline-secondary btn-sm flex-shrink-0">Snooker</button>
                    <button className="btn btn-outline-secondary btn-sm flex-shrink-0">PlayStation</button>
                    <button className="btn btn-outline-secondary btn-sm flex-shrink-0">Restaurant</button>
                  </div>

                  {/* Right Side Filter Button - relative container */}
                  <div className="position-relative ms-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      onClick={() => setShowTableFilter(!showTableFilter)}
                    >
                      <RiFilterLine className="me-1" />
                      <span className="d-none d-sm-inline">Filter</span>
                    </button>

                    {/* Dropdown aligned below the button */}
                    {showTableFilter && (
                      <div
                        className="position-absolute mt-1 bg-white border rounded shadow p-2"
                        style={{ zIndex: 3000, width: '180px', right: '0px' }}
                      >
                        {[
                          { key: 'all', label: 'All Tables' },
                          { key: 'available', label: 'Available' },
                          { key: 'occupied', label: 'Occupied' },
                          { key: 'reserved', label: 'Reserved' },
                          { key: 'dining', label: 'Dining Tables' },
                          { key: 'game', label: 'Game Tables' },
                        ].map((option) => (
                          <div
                            key={option.key}
                            className={`d-flex align-items-center p-2 rounded ${tableFilter === option.key ? 'bg-light' : ''}`}
                            onClick={() => setTableFilter(option.key)}
                            style={{ cursor: 'pointer' }}
                          >
                            {tableFilter === option.key && <RiCheckLine className="me-2 text-primary" />}
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                {filteredTables.map(table => (
                  <div key={table.id} className="col">
                    <div
                      className={`card h-100 ${selectedTable === table.id ? 'border-primary border-2' : ''}`}
                      onClick={() => table.status !== 'reserved' && setSelectedTable(table.id)}
                      style={{
                        cursor: table.status === 'reserved' ? 'not-allowed' : 'pointer',
                        opacity: table.status === 'reserved' ? 0.7 : 1
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h3 className="h6 fw-semibold mb-0">
                              {table.name.split(' ')[0]} {table.name.split(' ')[1].charAt(0)}{table.name.split(' ')[1].slice(1).match(/\d+/)?.[0] || ''}
                            </h3>
                            <div className="d-flex align-items-center mt-1">
                              <span className={`badge rounded-pill ${getStatusBadgeClass(table.status)}`}>
                                {table.status.charAt(0).toUpperCase() + table.status.slice(1).substring(0, 3)}
                              </span>
                              <span className="ms-2 text-muted">
                                {getTableTypeIcon(table.type)}
                              </span>
                            </div>
                          </div>
                          {selectedTable === table.id && (
                            <span className="badge bg-primary rounded-circle p-1">
                              <RiCheckLine size={12} />
                            </span>
                          )}
                        </div>
                        <p className="small text-muted mb-0">{table.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className='mt-4'>
              <h2 className="h5 fw-semibold mb-0">Order Menu</h2>
            </div>
            <div className="mt-3 mb-md-4 d-flex flex-column flex-md-row gap-2 gap-md-3">
              <div className="position-relative flex-grow-1">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <RiSearchLine />
                </div>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search menu items..."
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm">Popular</button>
                <button className="btn btn-outline-secondary btn-sm">Vegetarian</button>
                <button className="btn btn-outline-secondary btn-sm d-none d-md-inline-block">Spicy</button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-3">
              <div className="btn-group w-100" role="group">
                <button
                  className={`btn btn-sm ${activeCategory === 'food' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory('food')}
                >
                  <RiRestaurantLine className="me-1" />
                  Food
                </button>
                <button
                  className={`btn btn-sm ${activeCategory === 'drinks' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory('drinks')}
                >
                  <RiCupLine className="me-1" />
                  Drinks
                </button>
                <button
                  className={`btn btn-sm ${activeCategory === 'games' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory('games')}
                >
                  <RiGamepadLine className="me-1" />
                  Games
                </button>
              </div>
            </div>

            {/* Menu Subcategories */}
            <div className="mb-4">
              <h5 className="fw-semibold mb-3">{menuCategories[activeCategory].name}</h5>

              {/* Subcategory Navigation - Scrollable on mobile */}
              <div className="d-flex flex-nowrap overflow-auto gap-2 mb-4 pb-2" style={{ scrollbarWidth: 'none' }}>
                {Object.keys(menuCategories[activeCategory].subcategories).map(subKey => (
                  <button
                    key={subKey}
                    className={`btn btn-sm flex-shrink-0 ${expandedCategory === subKey ? 'btn-warning' : 'btn-outline-secondary'}`}
                    // onClick={() => toggleCategory(subKey)}
                  >
                    {menuCategories[activeCategory].subcategories[subKey].name}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 g-md-4">
                {/* Show all items in the active category if no subcategory is expanded */}
                {!expandedCategory && Object.values(menuCategories[activeCategory].subcategories).flatMap(subcategory =>
                  subcategory.items.map(item => (
                    <div key={item.id} className="col">
                      <div className="card h-100">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h3 className="h6 fw-semibold mb-1">{item.name}</h3>
                              <p className="small text-muted mb-2">{item.description}</p>
                            </div>
                            <span className="fw-semibold">${item.price.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-end mt-3">
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '28px', height: '28px' }}
                                onClick={() => handleQuantityChange(item, 'decrease')}
                              >
                                <RiSubtractLine size={14} />
                              </button>
                              <span className="fw-medium" style={{ width: '24px', textAlign: 'center' }}>
                                {cart.get(item.id)?.quantity || 0}
                              </span>
                              <button
                                className="btn btn-sm btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '28px', height: '28px' }}
                                onClick={() => handleQuantityChange(item, 'increase')}
                              >
                                <RiAddLine size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Show items from expanded subcategory */}
                {expandedCategory && menuCategories[activeCategory].subcategories[expandedCategory]?.items?.map(item => (
                  <div key={item.id} className="col">
                    <div className="card h-100">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h3 className="h6 fw-semibold mb-1">{item.name}</h3>
                            <p className="small text-muted mb-2">{item.description}</p>
                          </div>
                          <span className="fw-semibold">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => handleQuantityChange(item, 'decrease')}
                            >
                              <RiSubtractLine size={14} />
                            </button>
                            <span className="fw-medium" style={{ width: '24px', textAlign: 'center' }}>
                              {cart.get(item.id)?.quantity || 0}
                            </span>
                            <button
                              className="btn btn-sm btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => handleQuantityChange(item, 'increase')}
                            >
                              <RiAddLine size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Panel - Mobile (Bottom Sheet) */}
          <div className={`d-md-none position-fixed bottom-0 start-0 end-0 bg-white rounded-top-3 shadow-lg ${showCart ? '' : 'translate-y-100'}`}
            style={{
              zIndex: 1050,
              transition: 'transform 0.3s ease-in-out',
              transform: showCart ? 'translateY(0)' : 'translateY(100%)',
              maxHeight: '80vh'
            }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Order Summary</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowCart(false)}>
                <RiCloseLine />
              </button>
            </div>
            <div className="p-3 overflow-auto" style={{ maxHeight: '60vh' }}>
              {cart.size === 0 ? (
                <div className="text-center text-muted py-4">
                  <RiShoppingCartLine size={32} className="mb-2 text-muted" />
                  <p>No items in cart</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {Array.from(cart.values()).map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="flex-grow-1">
                        <h6 className="fw-medium mb-0">{item.name}</h6>
                        <p className="small text-muted mb-0">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          className="btn btn-sm btn-outline-danger p-0"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <RiCloseLine size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-top">
              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-semibold border-top pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small">Customer Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Special Instructions</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests..."
                ></textarea>
              </div>
              <button
                className={`btn w-100 mb-2 ${cart.size === 0 ? 'btn-secondary disabled' : 'btn-dark'}`}
                disabled={cart.size === 0}
                onClick={sendOrder}
              >
                <RiPrinterLine className="me-2" />
                Send Order
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Panel - Desktop */}
          <div className="d-none d-md-flex flex-column border-start bg-white" style={{ width: '350px', minWidth: '350px' }}>
            <div className="p-4 border-bottom">
              <h2 className="h5 fw-semibold mb-2">Order Summary</h2>
              <div className="small text-muted">
                <p>Table: <span className="fw-medium text-dark">{selectedTable || 'Not Selected'}</span></p>
                <p>Time: <span className="fw-medium text-dark">{new Date().toLocaleTimeString()}</span></p>
              </div>
              <div className="mt-3">
                <label className="form-label small">Customer Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mt-2">
                <label className="form-label small">Special Instructions</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests..."
                ></textarea>
              </div>
            </div>
            <div className="flex-grow-1 p-4 overflow-auto">
              {cart.size === 0 ? (
                <div className="text-center text-muted py-4"  style={{height: '1000px'}}>
                  <RiShoppingCartLine size={48} className="mb-3 text-muted" />
                  <p>No items in cart</p>
                  <p className="small">Add items from menu</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {Array.from(cart.values()).map(item => (
                    <div key={item.id} className="d-flex justify-content-between py-3 border-bottom">
                      <div className="flex-grow-1">
                        <h4 className="fw-medium">{item.name}</h4>
                        <p className="small text-muted">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          className="btn btn-sm btn-outline-danger p-0"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <RiCloseLine size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-top">
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-semibold border-top pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className={`btn w-100 mb-2 d-flex align-items-center justify-content-center ${cart.size === 0 ? 'btn-secondary disabled' : 'btn-dark'}`}
                disabled={cart.size === 0}
                onClick={sendOrder}
              >
                <RiPrinterLine className="me-2" />
                Send Order
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;