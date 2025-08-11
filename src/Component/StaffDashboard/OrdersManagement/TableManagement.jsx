import React, { useState, useEffect } from 'react';
import './TableManagement.css';

const TableManagement = ({  onJumpToOrders, onSelectTable }) => {
  // State management
  const [activeTab, setActiveTab] = useState('tables');
  const [quickJumpInput, setQuickJumpInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPanel, setShowPanel] = useState(!isMobile);

  const tables = [
    { id: 1, status: 'occupied', guests: 4, order: 'Order #1234' },
    { id: 2, status: 'available', guests: 0, order: null },
    { id: 3, status: 'occupied', guests: 2, order: 'Order #1235' },
    { id: 4, status: 'available', guests: 0, order: null },
    { id: 5, status: 'reserved', guests: 6, order: null },
    { id: 6, status: 'occupied', guests: 3, order: 'Order #1236' },
    { id: 7, status: 'available', guests: 0, order: null },
    { id: 8, status: 'available', guests: 0, order: null },
    { id: 9, status: 'occupied', guests: 2, order: 'Order #1237' },
    { id: 10, status: 'available', guests: 0, order: null },
    { id: 11, status: 'available', guests: 0, order: null },
    { id: 12, status: 'occupied', guests: 5, order: 'Order #1238' },
    // Pool tables
    { id: 101, type: 'pool', status: 'occupied', guests: 2, order: 'Order #P101' },
    { id: 102, type: 'pool', status: 'available', guests: 0, order: null },
    { id: 103, type: 'pool', status: 'reserved', guests: 4, order: null },
    { id: 104, type: 'pool', status: 'reserved', guests: 4, order: null },
    { id: 105, type: 'pool', status: 'reserved', guests: 4, order: null },
    { id: 106, type: 'pool', status: 'reserved', guests: 4, order: null },




  ];


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowPanel(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleJump = () => {
    const num = parseInt(quickJumpInput, 10);
    if (isNaN(num)) return;

    const tableElement = document.getElementById(`table-${num}`);
    if (tableElement) {
      document.querySelectorAll('.table-highlight').forEach((el) => {
        el.classList.remove('table-highlight', 'animate-pulse');
      });
      tableElement.classList.add('table-highlight', 'animate-pulse');
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        tableElement.classList.remove('table-highlight', 'animate-pulse');
      }, 2000);
    }
  };

  const renderTable = (table) => {
    const statusColor = table.status === 'occupied' ? '#4CAF50' :
      table.status === 'reserved' ? '#FFC107' : '#9E9E9E';

    if (table.type === 'pool') {
      return (
        <div
          key={table.id}
          id={`table-${table.id}`}
          className="pool-table "
          style={{ borderColor: statusColor }}
        >
          <div className="pool-table-inner">
            <span>{table.id}</span>
            <div className="pool-table-holes">
              <div className="pool-hole"></div>
              <div className="pool-hole"></div>
              <div className="pool-hole"></div>
              <div className="pool-hole"></div>
              <div className="pool-hole"></div>
              <div className="pool-hole"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={table.id}
        id={`table-${table.id}`}
        className="restaurant-table"
        style={{ borderColor: statusColor }}
      >
        <div className="table-number">{table.id}</div>
        <div className="table-status" style={{ backgroundColor: statusColor }}></div>
        <div className="table-chairs">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="table-chair"></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="table-management-container">
      {/* Header */}


      {/* Main Content */}
      <div className="main-content">
        {/* Floor Plan */}
        <div className="floor-plan">
          {/* Kitchen Area */}
          <div className="kitchen-area">
            <div className="kitchen-equipment fw-bold text-dark ">KITCHEN</div>
            <div className="kitchen-storage fw-bold text-dark">KITCHEN STORAGE</div>
          </div>

          {/* Dining Area */}
          <div className="dining-area">



            <div className='d-flex flex-wrap justify-content-center align-items-center gap-5 mb-3'>

              {/* Large Oval Table */}
              <div className="large-table ">
                13
                <div className="large-table-chairs">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="large-table-chair"></div>
                  ))}
                </div>
              </div>

              {/* Large Oval Table */}
              <div className="large-table">
                14
                <div className="large-table-chairs">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="large-table-chair"></div>
                  ))}
                </div>
              </div>

              {/* Large Oval Table */}
              <div className="large-table ">
                15
                <div className="large-table-chairs">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="large-table-chair"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regular Tables */}
            <div className="tables-grid">
              {tables.filter(t => !t.type).map(renderTable)}
            </div>

            {/* Pool Tables */}
            <div className="pool-tables-area ">
              <div className="pool-tables-label">POOL ZONE</div>
              <div className="pool-tables-grid ">
                {tables.filter(t => t.type === 'pool').map(renderTable)}
              </div>
            </div>

            {/* Bar Area */}
            <div className="bar-area">
              <div className="bar-counter">DRINKING ZONE</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        {showPanel && (
          <div className="control-panel">
            <h2>Table Management</h2>
            <div className="panel-content">
              <input
                type="number"
                placeholder="Enter table number"
                value={quickJumpInput}
                onChange={(e) => setQuickJumpInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJump()}
              />
              <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                  <button
                    key={num}
                    onClick={() => setQuickJumpInput(prev => prev + num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="action-buttons">
                <button
                  className="back-btn"
                  onClick={() => setQuickJumpInput(prev => prev.slice(0, -1))}
                >
                  ← Back
                </button>



                <button
                  className="jump-btn"
                  onClick={() => {
                    handleJump();
                    if (onSelectTable) {
                      onSelectTable(quickJumpInput); // number parent ko bhej do
                    }
                    if (onJumpToOrders) {
                      onJumpToOrders(); // register tab me le jao
                    }
                  }}

                >
                  Jump
                </button>


              </div>
              <div className="status-legend">
                <h3>Table Status</h3>
                <div className="legend-item">
                  <div className="status-indicator occupied"></div>
                  <span>Occupied</span>
                </div>
                <div className="legend-item">
                  <div className="status-indicator available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="status-indicator reserved"></div>
                  <span>Reserved</span>
                </div>
              </div>
            </div>
            {isMobile && (
              <button
                className="close-panel-btn"
                onClick={() => setShowPanel(false)}
              >
                Close Panel
              </button>
            )}
          </div>
        )}

        {/* Mobile Toggle Button */}
        {!showPanel && isMobile && (
          <button
            className="show-panel-btn"
            onClick={() => setShowPanel(true)}
          >
            Show Panel
          </button>
        )}
      </div>
    </div>
  );
};

export default TableManagement;