import React, { useState, useEffect } from 'react';

const Tables = () => {
    // State management
    const [activeTab, setActiveTab] = useState('tables');
    const [quickJumpInput, setQuickJumpInput] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showPanel, setShowPanel] = useState(!isMobile);

    // Modal states
    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [tableTypeDropdownOpen, setTableTypeDropdownOpen] = useState(false);

    // Form states
    const [tableForm, setTableForm] = useState({
        name: '',
        type: 'Snooker',
        plugId: '',
        status: 'active',
        seats: 8 // For large tables
    });

    const [groupForm, setGroupForm] = useState({
        name: '',
        selectedTables: [],
        hourlyRate: '',
        fixedRate: '',
        discount: ''
    });

    const [tables, setTables] = useState([
        { id: 1, name: 'Table 1', type: 'Food', status: 'occupied', guests: 4, order: 'Order #1234', plugId: null },
        { id: 2, name: 'Table 2', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 3, name: 'Table 3', type: 'Food', status: 'occupied', guests: 2, order: 'Order #1235', plugId: null },
        { id: 4, name: 'Table 4', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 5, name: 'Table 5', type: 'Food', status: 'reserved', guests: 6, order: null, plugId: null },
        { id: 6, name: 'Table 6', type: 'Food', status: 'occupied', guests: 3, order: 'Order #1236', plugId: null },
        { id: 7, name: 'Table 7', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 8, name: 'Table 8', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 9, name: 'Table 9', type: 'Food', status: 'occupied', guests: 2, order: 'Order #1237', plugId: null },
        { id: 10, name: 'Table 10', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 11, name: 'Table 11', type: 'Food', status: 'available', guests: 0, order: null, plugId: null },
        { id: 12, name: 'Table 12', type: 'Food', status: 'occupied', guests: 5, order: 'Order #1238', plugId: null },
        // Pool tables
        { id: 101, name: 'Pool 1', type: 'Pool', status: 'occupied', guests: 2, order: 'Order #P101', plugId: 'PLUG_101' },
        { id: 102, name: 'Pool 2', type: 'Pool', status: 'available', guests: 0, order: null, plugId: 'PLUG_102' },
        { id: 103, name: 'Pool 3', type: 'Pool', status: 'reserved', guests: 4, order: null, plugId: 'PLUG_103' },
        { id: 104, name: 'Pool 4', type: 'Pool', status: 'reserved', guests: 4, order: null, plugId: 'PLUG_104' },
        { id: 105, name: 'Pool 5', type: 'Pool', status: 'reserved', guests: 4, order: null, plugId: 'PLUG_105' },
        { id: 106, name: 'Pool 6', type: 'Pool', status: 'reserved', guests: 4, order: null, plugId: 'PLUG_106' },
    ]);

    const [groupTables, setGroupTables] = useState([
        { id: 13, name: 'Large Table 1', type: 'Large Table', seats: 8, status: 'available', guests: 0, order: null },
        { id: 14, name: 'Large Table 2', type: 'Large Table', seats: 8, status: 'available', guests: 0, order: null },
        { id: 15, name: 'Large Table 3', type: 'Large Table', seats: 8, status: 'available', guests: 0, order: null }
    ]);

    const [groups, setGroups] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showTableActions, setShowTableActions] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setShowPanel(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Form handlers
    const handleTableFormChange = (e) => {
        const { name, value } = e.target;

        // If changing table type, reset seats to default
        if (name === 'type') {
            setTableForm(prev => ({
                ...prev,
                [name]: value,
                seats: value === 'Large Table' ? 8 : prev.seats
            }));
        } else {
            setTableForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGroupFormChange = (e) => {
        const { name, value } = e.target;
        setGroupForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTableSelection = (tableId) => {
        setGroupForm(prev => ({
            ...prev,
            selectedTables: prev.selectedTables.includes(tableId)
                ? prev.selectedTables.filter(id => id !== tableId)
                : [...prev.selectedTables, tableId]
        }));
    };

    const toggleDropdown = (dropdown) => {
        if (dropdown === 'tableType') {
            setTableTypeDropdownOpen(!tableTypeDropdownOpen);
        }
    };

    const handleTableSubmit = (e) => {
        e.preventDefault();

        if (editingTable) {
            // Update existing table
            if (tableForm.type === 'Large Table') {
                // Update in groupTables if it's a large table
                setGroupTables(prev => prev.map(table =>
                    table.id === editingTable.id
                        ? {
                            ...table,
                            name: tableForm.name,
                            type: tableForm.type,
                            status: tableForm.status === 'active' ? 'available' : 'inactive',
                            seats: parseInt(tableForm.seats)
                        }
                        : table
                ));
                // Remove from regular tables if it was moved from there
                setTables(prev => prev.filter(table => table.id !== editingTable.id));
            } else {
                // Update in regular tables
                setTables(prev => prev.map(table =>
                    table.id === editingTable.id
                        ? {
                            ...table,
                            name: tableForm.name,
                            type: tableForm.type,
                            status: tableForm.status === 'active' ? 'available' : 'inactive',
                            plugId: tableForm.plugId || null
                        }
                        : table
                ));
                // Remove from groupTables if it was moved from there
                setGroupTables(prev => prev.filter(table => table.id !== editingTable.id));
            }
        } else {
            // Add new table
            const newId = Math.max(...tables.map(t => t.id), ...groupTables.map(t => t.id), 0) + 1;

            const newTable = {
                id: newId,
                name: tableForm.name,
                type: tableForm.type,
                status: tableForm.status === 'active' ? 'available' : 'inactive',
                guests: 0,
                order: null,
                plugId: tableForm.plugId || null
            };

            if (tableForm.type === 'Large Table') {
                newTable.seats = parseInt(tableForm.seats);
                setGroupTables(prev => [...prev, newTable]);
            } else {
                setTables(prev => [...prev, newTable]);
            }
        }

        setTableForm({ name: '', type: 'Snooker', plugId: '', status: 'active', seats: 8 });
        setTableModalOpen(false);
        setEditingTable(null);
    };

    const handleEditTable = (table) => {
        setEditingTable(table);
        setTableForm({
            name: table.name,
            type: table.type || 'Food',
            plugId: table.plugId || '',
            status: table.status === 'inactive' ? 'inactive' : 'active',
            seats: table.seats || 8
        });
        setTableModalOpen(true);
        setShowTableActions(false);
    };

    const handleDeleteTable = (tableId) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            setTables(prev => prev.filter(table => table.id !== tableId));
            setGroupTables(prev => prev.filter(table => table.id !== tableId));

            // Remove from groups if selected
            setGroups(prev => prev.map(group => ({
                ...group,
                selectedTables: group.selectedTables.filter(id => id !== tableId)
            })));

            setShowTableActions(false);
        }
    };

    const handleDeleteGroup = (groupId) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            setGroups(prev => prev.filter(group => group.id !== groupId));
        }
    };

    const handleTableClick = (table, event) => {
        event.stopPropagation();
        setSelectedTable(table);
        setShowTableActions(true);
    };

    // Close table actions when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowTableActions(false);
        };

        if (showTableActions) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showTableActions]);

    const handleGroupSubmit = (e) => {
        e.preventDefault();
        const newId = Math.max(...groups.map(g => g.id), 0) + 1;

        const newGroup = {
            id: newId,
            name: groupForm.name,
            selectedTables: [...groupForm.selectedTables],
            hourlyRate: parseFloat(groupForm.hourlyRate),
            fixedRate: parseFloat(groupForm.fixedRate),
            discount: parseFloat(groupForm.discount) || 0
        };

        setGroups(prev => [...prev, newGroup]);
        setGroupForm({ name: '', selectedTables: [], hourlyRate: '', fixedRate: '', discount: '' });
        setGroupModalOpen(false);
        setEditingGroup(null);
    };

    const groupTablesByType = () => {
        const allTables = [...tables, ...groupTables];
        return allTables.reduce((acc, table) => {
            const type = table.type || 'Food';
            if (!acc[type]) acc[type] = [];
            acc[type].push(table);
            return acc;
        }, {});
    };

    const getSelectedTablesByType = () => {
        const allTables = [...tables, ...groupTables];
        const selectedTables = allTables.filter(table => groupForm.selectedTables.includes(table.id));
        return selectedTables.reduce((acc, table) => {
            const type = table.type || 'Food';
            if (!acc[type]) acc[type] = [];
            acc[type].push(table);
            return acc;
        }, {});
    };

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
            table.status === 'reserved' ? '#FFC107' :
                table.status === 'inactive' ? '#f44336' : '#9E9E9E';

        const baseStyle = {
            border: '3px solid',
            borderColor: statusColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedTable?.id === table.id ? '0 0 15px rgba(255,193,7,0.8)' : 'none'
        };

        const handleClick = (e) => handleTableClick(table, e);

        if (table.type === 'Pool') {
            return (
                <div
                    key={table.id}
                    id={`table-${table.id}`}
                    onClick={handleClick}
                    style={{
                        ...baseStyle,
                        width: '120px',
                        height: '60px',
                        borderRadius: '8px',
                        backgroundColor: '#2d5016'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {table.name}
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '2px',
                        marginTop: '15px'
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{
                                width: '4px',
                                height: '4px',
                                backgroundColor: '#000',
                                borderRadius: '50%'
                            }}></div>
                        ))}
                    </div>
                </div>
            );
        }

        if (table.type === 'Snooker') {
            return (
                <div
                    key={table.id}
                    id={`table-${table.id}`}
                    onClick={handleClick}
                    style={{
                        ...baseStyle,
                        width: '140px',
                        height: '80px',
                        borderRadius: '8px',
                        backgroundColor: '#2d5016'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {table.name}
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '3px',
                        marginTop: '20px'
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{
                                width: '5px',
                                height: '5px',
                                backgroundColor: '#000',
                                borderRadius: '50%'
                            }}></div>
                        ))}
                    </div>
                </div>
            );
        }

        if (table.type === 'PlayStation') {
            return (
                <div
                    key={table.id}
                    id={`table-${table.id}`}
                    onClick={handleClick}
                    style={{
                        ...baseStyle,
                        width: '100px',
                        height: '60px',
                        borderRadius: '8px',
                        backgroundColor: '#1a1a2e'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {table.name}
                    </div>
                    <div style={{
                        fontSize: '20px',
                        color: '#4dabf7',
                        marginTop: '10px'
                    }}>
                        🎮
                    </div>
                </div>
            );
        }

        // Food table (default)
        return (
            <div
                key={table.id}
                id={`table-${table.id}`}
                onClick={handleClick}
                style={{
                    ...baseStyle,
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#8b4513'
                }}
            >
                <div style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>{table.name}</div>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%'
                }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: '15px',
                            height: '15px',
                            backgroundColor: '#654321',
                            borderRadius: '50%',
                            ...(i === 0 && { top: '-7px', left: '50%', transform: 'translateX(-50%)' }),
                            ...(i === 1 && { right: '-7px', top: '50%', transform: 'translateY(-50%)' }),
                            ...(i === 2 && { bottom: '-7px', left: '50%', transform: 'translateX(-50%)' }),
                            ...(i === 3 && { left: '-7px', top: '50%', transform: 'translateY(-50%)' })
                        }}></div>
                    ))}
                </div>
            </div>
        );
    };

    const renderGroupTable = (table) => {
        const statusColor = table.status === 'occupied' ? '#4CAF50' :
            table.status === 'reserved' ? '#FFC107' : '#9E9E9E';

        const handleClick = (e) => handleTableClick(table, e);

        return (
            <div
                key={table.id}
                id={`table-${table.id}`}
                onClick={handleClick}
                style={{
                    borderColor: statusColor,
                    width: '160px',
                    height: '100px',
                    border: '3px solid',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#8b4513',
                    position: 'relative',
                    margin: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedTable?.id === table.id ? '0 0 15px rgba(255,193,7,0.8)' : 'none'
                }}
            >
                <div style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                }}>{table.name}</div>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%'
                }}>
                    {[...Array(table.seats || 8)].map((_, i) => {
                        const angle = (i / (table.seats || 8)) * 2 * Math.PI;
                        const radius = 60;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#654321',
                                borderRadius: '50%',
                                left: '50%',
                                top: '50%',
                                transform: `translate(${x - 6}px, ${y - 6}px)`
                            }}></div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Quick Jump */}
            <div
                style={{
                    marginBottom: "20px",
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap", // allows wrapping on small screens
                        gap: "10px", // space between rows when wrapped
                    }}
                >
                    {/* Left Section */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            flexWrap: "wrap",
                            flex: "1 1 300px", // shrink and grow responsively
                        }}
                    >
                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                            Quick Jump to Table:
                        </label>
                        <input
                            type="number"
                            value={quickJumpInput}
                            onChange={(e) => setQuickJumpInput(e.target.value)}
                            placeholder="Enter table ID"
                            style={{
                                padding: "5px 10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                width: "150px",
                                maxWidth: "100%",
                            }}
                        />
                        <button
                            onClick={handleJump}
                            style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                padding: "5px 15px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                        >
                            Jump
                        </button>
                    </div>

                    {/* Right Section */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                            flex: "1 1 200px",
                        }}
                    >
                        <button
                            onClick={() => setTableModalOpen(true)}
                            style={{
                                backgroundColor: "#ffc107",
                                color: "black",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                flex: "1 1 auto", // allow scaling
                            }}
                        >
                            + Add Table
                        </button>
                        <button
                            onClick={() => setGroupModalOpen(true)}
                            style={{
                                backgroundColor: "#17a2b8",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                flex: "1 1 auto",
                            }}
                        >
                            + Add Group
                        </button>
                    </div>
                </div>

                {/* Extra CSS for small devices */}
                <style>
                    {`
      @media (max-width: 576px) {
        input[type="number"] {
          width: 100% !important;
        }
        button {
          width: 100% !important;
        }
      }
    `}
                </style>
            </div>



            {/* Floor Plan */}
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minHeight: '600px'
            }}>
                {/* Kitchen Area */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '30px',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#e9ecef',
                        padding: '20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        color: '#495057',
                        minWidth: '150px',
                        textAlign: 'center'
                    }}>
                        KITCHEN
                    </div>
                    <div style={{
                        backgroundColor: '#e9ecef',
                        padding: '20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        color: '#495057',
                        minWidth: '150px',
                        textAlign: 'center'
                    }}>
                        KITCHEN STORAGE
                    </div>
                </div>

                {/* Dining Area */}
                <div style={{ padding: '30px 0' }}>
                    {/* Group Tables */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        {groupTables.map(renderGroupTable)}
                    </div>

                    {/* Regular Food Tables */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        gap: '20px',
                        marginBottom: '40px',
                        justifyItems: 'center'
                    }}>
                        {tables.filter(t => t.type === 'Food').map(renderTable)}
                    </div>

                    {/* Pool/Snooker Tables */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '20px',
                            display: 'inline-block'
                        }}>
                            GAME ZONE
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '20px',
                            justifyItems: 'center'
                        }}>
                            {tables.filter(t => ['Pool', 'Snooker', 'PlayStation'].includes(t.type)).map(renderTable)}
                        </div>
                    </div>

                    {/* Bar Area */}
                    <div style={{
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: '40px'
                    }}>
                        DRINKING ZONE
                    </div>
                </div>
            </div>

            {/* Groups Display */}
            {/* {groups.length > 0 && (
                <div style={{
                    marginTop: '30px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>Created Groups</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {groups.map(group => (
                            <div key={group.id} style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>{group.name}</h3>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>Tables:</strong> {group.selectedTables.length} selected
                                </p>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>Hourly Rate:</strong> ${group.hourlyRate}
                                </p>
                                <p style={{ margin: '0 0 5px 0' }}>
                                    <strong>Fixed Rate:</strong> ${group.fixedRate}
                                </p>
                                {group.discount > 0 && (
                                    <p style={{ margin: 0 }}>
                                        <strong>Discount:</strong> {group.discount}%
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Table Management Modal */}
            {tableModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h5 style={{ margin: 0 }}>
                                {editingTable ? 'Edit Table' : 'Add Table'}
                            </h5>
                            <button
                                onClick={() => setTableModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleTableSubmit}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Table Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={tableForm.name}
                                        onChange={handleTableFormChange}
                                        placeholder="Enter table name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Table Type</label>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            type="button"
                                            onClick={() => toggleDropdown('tableType')}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: 'white',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span>{tableForm.type}</span>
                                            <span>▼</span>
                                        </button>
                                        {tableTypeDropdownOpen && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                backgroundColor: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                marginTop: '4px',
                                                zIndex: 10,
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}>
                                                {['Snooker', 'Pool', 'PlayStation', 'Food', 'Large Table'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setTableForm(prev => ({ ...prev, type }));
                                                            setTableTypeDropdownOpen(false);
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            border: 'none',
                                                            backgroundColor: 'white',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #eee'
                                                        }}
                                                    >
                                                        {type === 'Large Table' ? '🪑' : '🎯'} {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {tableForm.type === 'Large Table' && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of Seats</label>
                                        <input
                                            type="number"
                                            name="seats"
                                            value={tableForm.seats}
                                            onChange={handleTableFormChange}
                                            placeholder="Enter number of seats"
                                            min="4"
                                            max="20"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                )}

                                {tableForm.type !== 'Food' && tableForm.type !== 'Large Table' && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Smart Plug ID</label>
                                        <input
                                            type="text"
                                            name="plugId"
                                            value={tableForm.plugId}
                                            onChange={handleTableFormChange}
                                            placeholder="Enter plug ID (e.g., PLUG_001)"
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                )}

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Status</label>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="active"
                                                checked={tableForm.status === 'active'}
                                                onChange={handleTableFormChange}
                                            />
                                            <span>Active</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="inactive"
                                                checked={tableForm.status === 'inactive'}
                                                onChange={handleTableFormChange}
                                            />
                                            <span>Inactive</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                padding: '20px',
                                borderTop: '1px solid #ddd',
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setTableModalOpen(false)}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: '#ffc107',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingTable ? 'Update Table' : 'Add Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Table Action Popup */}
            {showTableActions && selectedTable && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    border: '3px solid #ffc107',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    minWidth: '280px',
                    animation: 'fadeInScale 0.2s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        borderBottom: '2px solid #ffc107',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        backgroundColor: '#ffc107',
                        color: '#333',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '16px'
                    }}>
                        🏷️ {selectedTable.name}
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 'normal',
                            marginTop: '4px',
                            color: '#666'
                        }}>
                            {selectedTable.type || 'Food'} • {selectedTable.status}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ padding: '20px' }}>
                        <button
                            onClick={() => handleEditTable(selectedTable)}
                            style={{
                                width: '100%',
                                padding: '15px',
                                marginBottom: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#138496';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#17a2b8';
                                e.target.style.transform = 'translateY(0px)';
                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>✏️</span>
                            Edit Table
                        </button>

                        <button
                            onClick={() => handleDeleteTable(selectedTable.id)}
                            style={{
                                width: '100%',
                                padding: '15px',
                                marginBottom: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#c82333';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#dc3545';
                                e.target.style.transform = 'translateY(0px)';
                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>🗑️</span>
                            Delete Table
                        </button>

                        <button
                            onClick={() => {
                                setShowTableActions(false);
                                setSelectedTable(null);
                            }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #6c757d',
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                color: '#6c757d',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#6c757d';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#6c757d';
                            }}
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => {
                            setShowTableActions(false);
                            setSelectedTable(null);
                        }}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#666',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
                            e.target.style.color = '#333';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#666';
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Backdrop */}
            {showTableActions && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        zIndex: 999
                    }}
                    onClick={() => {
                        setShowTableActions(false);
                        setSelectedTable(null);
                    }}
                />
            )}

            {/* Groups Display - Graphical View */}
            {groups.length > 0 && (
                <div style={{
                    marginTop: '30px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Created Groups - Visual Overview</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '30px'
                    }}>
                        {groups.map(group => {
                            const allTables = [...tables, ...groupTables];
                            const selectedTables = allTables.filter(table => group.selectedTables.includes(table.id));

                            return (
                                <div key={group.id} style={{
                                    border: '2px solid #ffc107',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    backgroundColor: '#fff8e1',
                                    position: 'relative',
                                    minHeight: '300px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <h3 style={{ margin: 0, color: '#f57f17', fontWeight: 'bold' }}>{group.name}</h3>
                                        <button
                                            onClick={() => handleDeleteGroup(group.id)}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Group Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '10px',
                                        marginBottom: '20px',
                                        fontSize: '14px'
                                    }}>
                                        <div style={{
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            💰 ${group.hourlyRate}/hr
                                        </div>
                                        <div style={{
                                            backgroundColor: '#2196f3',
                                            color: 'white',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            🎯 ${group.fixedRate} fixed
                                        </div>
                                        <div style={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            📊 {selectedTables.length} tables
                                        </div>
                                        {group.discount > 0 && (
                                            <div style={{
                                                backgroundColor: '#e91e63',
                                                color: 'white',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                textAlign: 'center',
                                                fontWeight: 'bold'
                                            }}>
                                                🎁 {group.discount}% off
                                            </div>
                                        )}
                                    </div>

                                    {/* Visual representation of tables in group */}
                                    <div style={{
                                        border: '1px dashed #ffc107',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        minHeight: '150px',
                                        backgroundColor: '#ffffff',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#f57f17',
                                            marginBottom: '10px',
                                            textAlign: 'center'
                                        }}>
                                            GROUP LAYOUT
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {selectedTables.map((table, index) => {
                                                const getTableIcon = (type) => {
                                                    switch (type) {
                                                        case 'Pool': return '🎱';
                                                        case 'Snooker': return '🎯';
                                                        case 'PlayStation': return '🎮';
                                                        case 'Large Table': return '🪑';
                                                        default: return '🍽️';
                                                    }
                                                };

                                                const getTableColor = (type) => {
                                                    switch (type) {
                                                        case 'Pool': return '#4caf50';
                                                        case 'Snooker': return '#2196f3';
                                                        case 'PlayStation': return '#9c27b0';
                                                        case 'Large Table': return '#795548';
                                                        default: return '#ff9800';
                                                    }
                                                };

                                                return (
                                                    <div
                                                        key={table.id}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            margin: '5px',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: table.type === 'Food' ? '50%' : '8px',
                                                                backgroundColor: getTableColor(table.type || 'Food'),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '18px',
                                                                border: '2px solid white',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                position: 'relative'
                                                            }}
                                                        >
                                                            {getTableIcon(table.type || 'Food')}
                                                            {table.status === 'occupied' && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '-3px',
                                                                    right: '-3px',
                                                                    width: '12px',
                                                                    height: '12px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#f44336',
                                                                    border: '2px solid white'
                                                                }}></div>
                                                            )}
                                                            {table.status === 'reserved' && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '-3px',
                                                                    right: '-3px',
                                                                    width: '12px',
                                                                    height: '12px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#ff9800',
                                                                    border: '2px solid white'
                                                                }}></div>
                                                            )}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '10px',
                                                            fontWeight: 'bold',
                                                            color: '#666',
                                                            marginTop: '4px',
                                                            textAlign: 'center',
                                                            lineHeight: '1'
                                                        }}>
                                                            {table.name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Connection lines between tables */}
                                        <svg style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }}>
                                            {selectedTables.map((_, index) => {
                                                if (index === selectedTables.length - 1) return null;
                                                const startX = 50 + (index * 60);
                                                const startY = 80;
                                                const endX = 50 + ((index + 1) * 60);
                                                const endY = 80;

                                                return (
                                                    <line
                                                        key={index}
                                                        x1={`${startX}px`}
                                                        y1={`${startY}px`}
                                                        x2={`${endX}px`}
                                                        y2={`${endY}px`}
                                                        stroke="#ffc107"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                        opacity="0.6"
                                                    />
                                                );
                                            })}
                                        </svg>
                                    </div>

                                    {/* Group summary stats at bottom */}
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '10px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span><strong>Total Revenue Potential:</strong></span>
                                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                                                ${(group.hourlyRate * selectedTables.length).toFixed(2)}/hr
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span><strong>Fixed Revenue:</strong></span>
                                            <span style={{ fontWeight: 'bold', color: '#2196f3' }}>
                                                ${(group.fixedRate * selectedTables.length).toFixed(2)}
                                            </span>
                                        </div>
                                        {group.discount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e91e63' }}>
                                                <span><strong>After Discount:</strong></span>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    ${((group.hourlyRate * selectedTables.length) * (1 - group.discount / 100)).toFixed(2)}/hr
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* Group Management Modal */}
            {groupModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h5 style={{ margin: 0 }}>
                                {editingGroup ? 'Edit Group' : 'Create Group'}
                            </h5>
                            <button
                                onClick={() => setGroupModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleGroupSubmit}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Group Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={groupForm.name}
                                        onChange={handleGroupFormChange}
                                        placeholder="Enter group name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Tables</label>
                                    <div style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        maxHeight: '200px',
                                        overflow: 'auto'
                                    }}>
                                        {Object.entries(groupTablesByType()).map(([type, tables]) => (
                                            <div key={type} style={{ marginBottom: '10px' }}>
                                                <div style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '8px 15px',
                                                    fontWeight: 'bold',
                                                    borderBottom: '1px solid #dee2e6'
                                                }}>
                                                    {type} Tables
                                                </div>
                                                <div style={{ padding: '10px 15px' }}>
                                                    {tables.map(table => (
                                                        <div key={table.id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <input
                                                                type="checkbox"
                                                                id={`table-${table.id}`}
                                                                checked={groupForm.selectedTables.includes(table.id)}
                                                                onChange={() => handleTableSelection(table.id)}
                                                            />
                                                            <label htmlFor={`table-${table.id}`} style={{ cursor: 'pointer' }}>
                                                                {table.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Selected Tables</label>
                                    {groupForm.selectedTables.length > 0 ? (
                                        <div style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '10px'
                                        }}>
                                            {Object.entries(getSelectedTablesByType()).map(([type, tables]) => (
                                                <div key={type} style={{ marginBottom: '10px' }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{type} Tables:</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {tables.map(table => (
                                                            <span key={table.id} style={{
                                                                backgroundColor: '#ffc107',
                                                                color: 'black',
                                                                padding: '4px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {table.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '10px',
                                            color: '#6c757d',
                                            fontStyle: 'italic'
                                        }}>
                                            No tables selected
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hourly Rate ($)</label>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            value={groupForm.hourlyRate}
                                            onChange={handleGroupFormChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fixed Rate ($)</label>
                                        <input
                                            type="number"
                                            name="fixedRate"
                                            value={groupForm.fixedRate}
                                            onChange={handleGroupFormChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Discounted Rate (%) <span style={{ color: '#6c757d', fontWeight: 'normal' }}>Optional</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={groupForm.discount}
                                        onChange={handleGroupFormChange}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{
                                padding: '20px',
                                borderTop: '1px solid #ddd',
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setGroupModalOpen(false)}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={groupForm.selectedTables.length === 0}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: groupForm.selectedTables.length === 0 ? '#ccc' : '#ffc107',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        cursor: groupForm.selectedTables.length === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {editingGroup ? 'Update Group' : 'Create Group'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .table-highlight {
          box-shadow: 0 0 20px #ff6b6b !important;
          transform: scale(1.1) !important;
          transition: all 0.3s ease !important;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
        </div>
    );
};

export default Tables;