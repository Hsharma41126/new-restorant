// import React, { useState } from 'react';
// import {
//     FaGamepad, FaTable, FaUsers, FaEdit,
//     FaTrashAlt, FaPlay, FaStop, FaTimes,
//     FaTableTennis, FaClock, FaPlug, FaPlus, FaAngleDown, FaUtensils, FaFilter
// } from 'react-icons/fa';
// import { Button } from 'react-bootstrap';

// function TablePlugSetup() {
//     // State for table management
//     const [tables, setTables] = useState([
//         { id: 1, name: 'Snooker Table 1', type: 'Snooker', status: 'active', plugId: 'PLUG_001' },
//         { id: 2, name: 'Pool Table A', type: 'Pool', status: 'active', plugId: 'PLUG_002' },
//         { id: 3, name: 'PlayStation Zone 1', type: 'PlayStation', status: 'active', plugId: 'PLUG_003' },
//         { id: 4, name: 'Snooker Table 2', type: 'Snooker', status: 'active', plugId: 'PLUG_004' },
//         { id: 5, name: 'Pool Table B', type: 'Pool', status: 'active', plugId: 'PLUG_005' }
//     ]);
    
//     // State for table groups
//     const [groups, setGroups] = useState([
//         { id: 1, name: 'Premium Snooker Group', tableIds: [1], hourlyRate: 15, fixedRate: 50, discount: 10 },
//         { id: 2, name: 'Standard Pool Group', tableIds: [2], hourlyRate: 12, fixedRate: 40, discount: 5 }
//     ]);
    
//     // Form states
//     const [tableForm, setTableForm] = useState({
//         name: '',
//         type: 'Select table type',
//         status: 'active',
//         plugId: ''
//     });
    
//     const [groupForm, setGroupForm] = useState({
//         name: '',
//         selectedTables: [],
//         hourlyRate: '',
//         fixedRate: '',
//         discount: ''
//     });
    
//     const [rateForm, setRateForm] = useState({
//         selectedTableOrGroup: 'Select table or group',
//         hourlyRate: '',
//         fixedRate: '',
//         discount: ''
//     });
    
//     // UI states
//     const [tableTypeDropdownOpen, setTableTypeDropdownOpen] = useState(false);
//     const [rateTableDropdownOpen, setRateTableDropdownOpen] = useState(false);
//     const [plugTableDropdownOpen, setPlugTableDropdownOpen] = useState(false);
//     const [groupModalOpen, setGroupModalOpen] = useState(false);
//     const [tableModalOpen, setTableModalOpen] = useState(false);
//     const [editingTable, setEditingTable] = useState(null);
//     const [editingGroup, setEditingGroup] = useState(null);
//     const [plugStatus, setPlugStatus] = useState({
//         PLUG_001: 'online',
//         PLUG_002: 'offline',
//         PLUG_003: 'online',
//         PLUG_004: 'offline',
//         PLUG_005: 'offline'
//     });

//     // Filter states for plug control
//     const [plugFilters, setPlugFilters] = useState({
//         Snooker: true,
//         Pool: true,
//         PlayStation: true,
//         Food: false
//     });

//     // Group tables by type for the group form
//     const groupTablesByType = () => {
//         const tablesByType = {};
        
//         tables.forEach(table => {
//             if (!tablesByType[table.type]) {
//                 tablesByType[table.type] = [];
//             }
//             tablesByType[table.type].push(table);
//         });
        
//         return tablesByType;
//     };

//     // Toggle dropdown menus
//     const toggleDropdown = (dropdownType) => {
//         switch (dropdownType) {
//             case 'tableType':
//                 setTableTypeDropdownOpen(!tableTypeDropdownOpen);
//                 setRateTableDropdownOpen(false);
//                 setPlugTableDropdownOpen(false);
//                 break;
//             case 'rateTable':
//                 setRateTableDropdownOpen(!rateTableDropdownOpen);
//                 setTableTypeDropdownOpen(false);
//                 setPlugTableDropdownOpen(false);
//                 break;
//             case 'plugTable':
//                 setPlugTableDropdownOpen(!plugTableDropdownOpen);
//                 setTableTypeDropdownOpen(false);
//                 setRateTableDropdownOpen(false);
//                 break;
//             default:
//                 break;
//         }
//     };

//     // Handle table form changes
//     const handleTableFormChange = (e) => {
//         const { name, value } = e.target;
//         setTableForm(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle group form changes
//     const handleGroupFormChange = (e) => {
//         const { name, value } = e.target;
//         setGroupForm(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle table selection for groups
//     const handleTableSelection = (tableId) => {
//         setGroupForm(prev => {
//             const newSelectedTables = prev.selectedTables.includes(tableId)
//                 ? prev.selectedTables.filter(id => id !== tableId)
//                 : [...prev.selectedTables, tableId];
//             return { ...prev, selectedTables: newSelectedTables };
//         });
//     };

//     // Toggle plug filters
//     const togglePlugFilter = (type) => {
//         setPlugFilters(prev => ({
//             ...prev,
//             [type]: !prev[type]
//         }));
//     };

//     // Get filtered tables for plug control
//     const getFilteredTables = () => {
//         return tables.filter(table => 
//             table.plugId && 
//             table.type !== 'Food' && 
//             plugFilters[table.type]
//         );
//     };

//     // Submit table form (add or edit)
//     const handleTableSubmit = (e) => {
//         e.preventDefault();
//         if (editingTable) {
//             // Update existing table
//             setTables(tables.map(table => 
//                 table.id === editingTable.id ? { ...tableForm, id: editingTable.id } : table
//             ));
//             setEditingTable(null);
//         } else {
//             // Add new table
//             const newTable = {
//                 id: Math.max(...tables.map(t => t.id), 0) + 1,
//                 ...tableForm,
//                 // Clear plugId if it's a food table
//                 plugId: tableForm.type === 'Food' ? '' : tableForm.plugId
//             };
//             setTables([...tables, newTable]);
//             if (newTable.plugId) {
//                 setPlugStatus(prev => ({ ...prev, [newTable.plugId]: 'offline' }));
//             }
//         }
//         // Reset form and close modal
//         setTableForm({
//             name: '',
//             type: 'Select table type',
//             status: 'active',
//             plugId: ''
//         });
//         setTableModalOpen(false);
//     };

//     // Submit group form
//     const handleGroupSubmit = (e) => {
//         e.preventDefault();
//         const groupData = {
//             name: groupForm.name,
//             tableIds: groupForm.selectedTables,
//             hourlyRate: parseFloat(groupForm.hourlyRate),
//             fixedRate: parseFloat(groupForm.fixedRate),
//             discount: parseFloat(groupForm.discount) || 0
//         };

//         if (editingGroup) {
//             // Update existing group
//             setGroups(groups.map(group => 
//                 group.id === editingGroup.id ? { ...groupData, id: editingGroup.id } : group
//             ));
//         } else {
//             // Add new group
//             const newGroup = {
//                 id: Math.max(...groups.map(g => g.id), 0) + 1,
//                 ...groupData
//             };
//             setGroups([...groups, newGroup]);
//         }
        
//         setGroupModalOpen(false);
//         // Reset form
//         setGroupForm({
//             name: '',
//             selectedTables: [],
//             hourlyRate: '',
//             fixedRate: '',
//             discount: ''
//         });
//         setEditingGroup(null);
//     };

//     // Open modal to add new table
//     const openAddTableModal = () => {
//         setEditingTable(null);
//         setTableForm({
//             name: '',
//             type: 'Select table type',
//             status: 'active',
//             plugId: ''
//         });
//         setTableModalOpen(true);
//     };

//     // Open modal to edit existing table
//     const openEditTableModal = (table) => {
//         setEditingTable(table);
//         setTableForm({
//             name: table.name,
//             type: table.type,
//             status: table.status,
//             plugId: table.plugId || ''
//         });
//         setTableModalOpen(true);
//     };

//     // Open modal to edit existing group
//     const openEditGroupModal = (group) => {
//         setEditingGroup(group);
//         setGroupForm({
//             name: group.name,
//             selectedTables: group.tableIds,
//             hourlyRate: group.hourlyRate,
//             fixedRate: group.fixedRate,
//             discount: group.discount
//         });
//         setGroupModalOpen(true);
//     };

//     // Open modal to add new group
//     const openAddGroupModal = () => {
//         setEditingGroup(null);
//         setGroupForm({
//             name: '',
//             selectedTables: [],
//             hourlyRate: '',
//             fixedRate: '',
//             discount: ''
//         });
//         setGroupModalOpen(true);
//     };

//     // Delete table
//     const deleteTable = (tableId) => {
//         setTables(tables.filter(table => table.id !== tableId));
        
//         // Also remove from any groups
//         setGroups(
//             groups
//                 .map(group => ({
//                     ...group,
//                     tableIds: group.tableIds.filter(id => id !== tableId)
//                 }))
//                 .filter(group => group.tableIds.length > 0)
//         );
//     };

//     // Delete group
//     const deleteGroup = (groupId) => {
//         setGroups(groups.filter(group => group.id !== groupId));
//     };

//     // Toggle plug status
//     const togglePlug = (plugId, action) => {
//         setPlugStatus(prev => ({
//             ...prev,
//             [plugId]: action === 'on' ? 'online' : 'offline'
//         }));
//     };

//     // Get table name by ID
//     const getTableNameById = (id) => {
//         const table = tables.find(t => t.id === id);
//         return table ? table.name : 'Unknown Table';
//     };

//     // Get selected tables grouped by type
//     const getSelectedTablesByType = () => {
//         const selectedTables = tables.filter(table => 
//             groupForm.selectedTables.includes(table.id)
//         );
        
//         const grouped = {};
        
//         selectedTables.forEach(table => {
//             if (!grouped[table.type]) {
//                 grouped[table.type] = [];
//             }
//             grouped[table.type].push(table);
//         });
        
//         return grouped;
//     };

//     return (
//         <div className="p-3">
//             {/* Main Content */}
//             <div className="">
//                 <div className="mb-4">
//                     <h1 className="fs-3 fw-bold text-dark">Table & Plug Setup</h1>
//                     <p className="text-muted">Manage table types, configure rates, and control smart plugs</p>
//                 </div>

//                 <div className="row g-4">
//                     {/* Table Management Section */}
//                     <div className="col-12 col-xl-6">
//                         <div className="bg-white rounded shadow-sm p-3 p-md-4 h-100">
//                             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//                                 <div className="d-flex align-items-center gap-3">
//                                     <div className="bg-warning rounded p-2">
//                                         <FaTable className="text-dark" />
//                                     </div>
//                                     <h5 className="fw-light text-dark mb-0">Existing Tables</h5>
//                                 </div>
//                                 <div className='d-flex justify-content-end'>
//                                     <button 
//                                         className='btn btn-warning'
//                                         onClick={openAddTableModal}
//                                     >
//                                         Add Table
//                                     </button>
//                                 </div>
//                             </div>
                            
//                             {/* Table List */}
//                             <div className="border rounded overflow-hidden">
//                                 <div className="divide-y">
//                                     {tables.map(table => (
//                                         <div key={table.id} className="px-3 py-2 d-flex justify-content-between align-items-center hover-bg-warning-subtle">
//                                             <div className="d-flex align-items-center gap-3">
//                                                 {table.type === 'Snooker' && <FaTableTennis className="text-success fs-5" />}
//                                                 {table.type === 'Pool' && <FaTableTennis className="text-primary fs-5" />}
//                                                 {table.type === 'PlayStation' && <FaGamepad className="text-purple fs-5" />}
//                                                 {table.type === 'Food' && <FaUtensils className="text-danger fs-5" />}
//                                                 <div>
//                                                     <div className="fw-medium text-dark">{table.name}</div>
//                                                     <div className="text-muted small">
//                                                         {table.type} • {table.status} {table.plugId && table.type !== 'Food' && `• Plug: ${table.plugId}`}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="d-flex gap-2">
//                                                 <button
//                                                     className="btn btn-sm btn-outline-warning"
//                                                     onClick={() => openEditTableModal(table)}
//                                                 >
//                                                     <FaEdit />
//                                                 </button>
//                                                 <button
//                                                     className="btn btn-sm btn-outline-danger"
//                                                     onClick={() => deleteTable(table.id)}
//                                                 >
//                                                     <FaTrashAlt />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {tables.length === 0 && (
//                                         <div className="px-3 py-4 text-center text-muted">
//                                             No tables added yet
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Group Management Section */}
//                     <div className="col-12 col-xl-6">
//                         <div className="bg-white rounded shadow-sm p-3 p-md-4 h-100">
//                             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//                                 <div className="d-flex align-items-center gap-3">
//                                     <div className="bg-warning rounded p-2">
//                                         <FaClock className="text-dark" />
//                                     </div>
//                                     <h5 className="fw-light text-dark mb-0">Existing Groups</h5>
//                                 </div>
//                                 <button
//                                     type="button"
//                                     className="btn btn-warning text-dark d-flex align-items-center gap-2"
//                                     onClick={openAddGroupModal}
//                                 >
//                                     <FaPlus />
//                                     <span>Create Group</span>
//                                 </button>
//                             </div>

//                             {/* Groups List */}
//                             <div className="border rounded overflow-hidden mb-4">
//                                 <div className="divide-y">
//                                     {groups.map(group => (
//                                         <div key={group.id} className="px-3 py-2 d-flex justify-content-between align-items-center hover-bg-warning-subtle">
//                                             <div>
//                                                 <div className="fw-medium text-dark">{group.name}</div>
//                                                 <div className="text-muted small">
//                                                     Tables: {group.tableIds.map(id => getTableNameById(id)).join(', ')}
//                                                 </div>
//                                                 <div className="text-muted small">
//                                                     Rates: ${group.hourlyRate}/hr, ${group.fixedRate} fixed {group.discount > 0 && `(${group.discount}% discount)`}
//                                                 </div>
//                                             </div>
//                                             <div className="d-flex gap-2">
//                                                 <button
//                                                     className="btn btn-sm btn-outline-warning"
//                                                     onClick={() => openEditGroupModal(group)}
//                                                 >
//                                                     <FaEdit />
//                                                 </button>
//                                                 <button
//                                                     className="btn btn-sm btn-outline-danger"
//                                                     onClick={() => deleteGroup(group.id)}
//                                                 >
//                                                     <FaTrashAlt />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {groups.length === 0 && (
//                                         <div className="px-3 py-4 text-center text-muted">
//                                             No groups created yet
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Rate Preview */}
//                             {rateForm.selectedTableOrGroup !== 'Select table or group' && (
//                                 <div className="bg-dark text-white rounded p-3">
//                                     <h4 className="fw-medium mb-3">Rate Preview</h4>
//                                     <div className="small">
//                                         <div className="d-flex justify-content-between mb-2">
//                                             <span>Hourly Rate:</span>
//                                             <span>${rateForm.hourlyRate || '0.00'}/hour</span>
//                                         </div>
//                                         <div className="d-flex justify-content-between mb-2">
//                                             <span>Fixed Rate:</span>
//                                             <span>${rateForm.fixedRate || '0.00'}/session</span>
//                                         </div>
//                                         {rateForm.discount > 0 && (
//                                             <div className="d-flex justify-content-between">
//                                                 <span>With {rateForm.discount}% Discount:</span>
//                                                 <span>${(rateForm.hourlyRate * (1 - rateForm.discount/100)).toFixed(2) || '0.00'}/hour</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Smart Plug Mapping Section */}
//                     <div className="col-12">
//                         <div className="bg-white rounded shadow-sm p-3 p-md-4">
//                             <div className="d-flex align-items-center gap-3 mb-4">
//                                 <div className="bg-warning rounded p-2">
//                                     <FaPlug className="text-dark" />
//                                 </div>
//                                 <h5 className="fw-light text-dark mb-0">Map Smart Plug (ON/OFF Control)</h5>
//                             </div>

//                             <div className="row g-4">
//                                 {/* Plug Assignment Form */}
//                                 <div className="col-12 col-lg-6">
//                                     <h4 className="fw-medium text-dark mb-3">Assign Smart Plug</h4>
//                                     <form>
//                                         <div className="mb-3">
//                                             <label className="form-label">Select Table</label>
//                                             <div className="position-relative">
//                                                 <button
//                                                     type="button"
//                                                     className="form-control text-start d-flex justify-content-between align-items-center"
//                                                     onClick={() => toggleDropdown('plugTable')}
//                                                 >
//                                                     <span>{tableForm.name || 'Select table'}</span>
//                                                     <FaAngleDown />
//                                                 </button>
//                                                 {plugTableDropdownOpen && (
//                                                     <div className="position-absolute top-100 start-0 end-0 bg-white border rounded mt-1 shadow-lg z-3">
//                                                         <div className="py-1">
//                                                             {tables.filter(table => table.type !== 'Food').map(table => (
//                                                                 <button
//                                                                     key={table.id}
//                                                                     type="button"
//                                                                     className="w-100 text-start btn btn-light"
//                                                                     onClick={() => {
//                                                                         setTableForm(prev => ({ ...prev, name: table.name }));
//                                                                         setPlugTableDropdownOpen(false);
//                                                                     }}
//                                                                 >
//                                                                     {table.name}
//                                                                 </button>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="mb-4">
//                                             <label className="form-label">Smart Plug ID</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Enter plug ID (e.g., PLUG_001)"
//                                                 value={tableForm.plugId}
//                                                 onChange={(e) => setTableForm(prev => ({ ...prev, plugId: e.target.value }))}
//                                             />
//                                         </div>

//                                         <button
//                                             type="button"
//                                             className="w-100 btn btn-warning text-dark fw-medium"
//                                             onClick={() => {
//                                                 if (tableForm.name && tableForm.plugId) {
//                                                     const updatedTables = tables.map(table =>
//                                                         table.name === tableForm.name
//                                                             ? { ...table, plugId: tableForm.plugId }
//                                                             : table
//                                                     );
//                                                     setTables(updatedTables);
//                                                     setPlugStatus(prev => ({ ...prev, [tableForm.plugId]: 'offline' }));
//                                                     setTableForm(prev => ({ ...prev, plugId: '' }));
//                                                 }
//                                             }}
//                                         >
//                                             Map Smart Plug
//                                         </button>
//                                     </form>
//                                 </div>

//                                 {/* Plug Control Panel */}
//                                 <div className="col-12 col-lg-6">
//                                     <div className="d-flex justify-content-between align-items-center mb-3">
//                                         <h4 className="fw-medium text-dark mb-0">Smart Plug Control</h4>
//                                         <div className="dropdown">
//                                             <Button
//                                                size="sm"
//                                                variant="outline-secondary"
//                                                 type="button"
//                                                 id="plugFilterDropdown"
//                                                 data-bs-toggle="dropdown"
//                                                 aria-expanded="false"
//                                             >
//                                                 <FaFilter />
//                                                 <span>Filter</span>
//                                             </Button>
//                                             <ul className="dropdown-menu" aria-labelledby="plugFilterDropdown">
//                                                 <li>
//                                                     <div className="dropdown-item">
//                                                         <div className="form-check">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="checkbox"
//                                                                 id="filterSnooker"
//                                                                 checked={plugFilters.Snooker}
//                                                                 onChange={() => togglePlugFilter('Snooker')}
//                                                             />
//                                                             <label className="form-check-label" htmlFor="filterSnooker">
//                                                                 Snooker Tables
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                                 <li>
//                                                     <div className="dropdown-item">
//                                                         <div className="form-check">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="checkbox"
//                                                                 id="filterPool"
//                                                                 checked={plugFilters.Pool}
//                                                                 onChange={() => togglePlugFilter('Pool')}
//                                                             />
//                                                             <label className="form-check-label" htmlFor="filterPool">
//                                                                 Pool Tables
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                                 <li>
//                                                     <div className="dropdown-item">
//                                                         <div className="form-check">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="checkbox"
//                                                                 id="filterPlayStation"
//                                                                 checked={plugFilters.PlayStation}
//                                                                 onChange={() => togglePlugFilter('PlayStation')}
//                                                             />
//                                                             <label className="form-check-label" htmlFor="filterPlayStation">
//                                                                 PlayStation
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="d-flex flex-column gap-3">
//                                         {getFilteredTables().map(table => (
//                                             <div key={table.id} className="border rounded p-3">
//                                                 <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
//                                                     <div className="d-flex align-items-center gap-3">
//                                                         {table.type === 'Snooker' && <FaTableTennis className="text-success fs-5" />}
//                                                         {table.type === 'Pool' && <FaTableTennis className="text-primary fs-5" />}
//                                                         {table.type === 'PlayStation' && <FaGamepad className="text-purple fs-5" />}
//                                                         <div>
//                                                             <div className="fw-medium text-dark">{table.name}</div>
//                                                             <div className="text-muted small">Plug ID: {table.plugId}</div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="d-flex align-items-center gap-2">
//                                                         <div className={`rounded-circle ${plugStatus[table.plugId] === 'online' ? 'bg-success' : 'bg-danger'}`} style={{ width: '12px', height: '12px' }}></div>
//                                                         <span className={`small fw-medium ${plugStatus[table.plugId] === 'online' ? 'text-success' : 'text-danger'}`}>
//                                                             {plugStatus[table.plugId] === 'online' ? 'ONLINE' : 'OFFLINE'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="d-flex gap-3">
//                                                     <button
//                                                         className={`btn flex-grow-1 ${plugStatus[table.plugId] === 'online' ? 'btn-success' : 'btn-secondary'}`}
//                                                         onClick={() => togglePlug(table.plugId, 'on')}
//                                                         disabled={plugStatus[table.plugId] === 'online'}
//                                                     >
//                                                         <div className="d-flex align-items-center justify-content-center gap-2">
//                                                             <FaPlay />
//                                                             <span>Turn ON</span>
//                                                         </div>
//                                                     </button>
//                                                     <button
//                                                         className={`btn flex-grow-1 ${plugStatus[table.plugId] === 'offline' ? 'btn-danger' : 'btn-secondary'}`}
//                                                         onClick={() => togglePlug(table.plugId, 'off')}
//                                                         disabled={plugStatus[table.plugId] === 'offline'}
//                                                     >
//                                                         <div className="d-flex align-items-center justify-content-center gap-2">
//                                                             <FaStop />
//                                                             <span>Turn OFF</span>
//                                                         </div>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {getFilteredTables().length === 0 && (
//                                             <div className="border rounded p-4 text-center text-muted">
//                                                 No tables with smart plugs configured for selected filters
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Table Management Modal */}
//             {tableModalOpen && (
//                 <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1050 }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">
//                                     {editingTable ? 'Edit Table' : 'Add Table'}
//                                 </h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setTableModalOpen(false)}
//                                 ></button>
//                             </div>
//                             <form onSubmit={handleTableSubmit}>
//                                 <div className="modal-body">
//                                     <div className="mb-3">
//                                         <label className="form-label">Table Name</label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             className="form-control"
//                                             placeholder="Enter table name"
//                                             value={tableForm.name}
//                                             onChange={handleTableFormChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="form-label">Table Type</label>
//                                         <div className="position-relative">
//                                             <button
//                                                 type="button"
//                                                 className="form-control text-start d-flex justify-content-between align-items-center"
//                                                 onClick={() => toggleDropdown('tableType')}
//                                             >
//                                                 <span>{tableForm.type}</span>
//                                                 <FaAngleDown />
//                                             </button>
//                                             {tableTypeDropdownOpen && (
//                                                 <div className="position-absolute top-100 start-0 end-0 bg-white border rounded mt-1 shadow-lg z-3">
//                                                     <div className="py-1">
//                                                         <button
//                                                             type="button"
//                                                             className="w-100 text-start btn btn-light d-flex align-items-center gap-2"
//                                                             onClick={() => {
//                                                                 setTableForm(prev => ({ ...prev, type: 'Snooker' }));
//                                                                 setTableTypeDropdownOpen(false);
//                                                             }}
//                                                         >
//                                                             <FaTableTennis className="text-success" />
//                                                             <span>Snooker</span>
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="w-100 text-start btn btn-light d-flex align-items-center gap-2"
//                                                             onClick={() => {
//                                                                 setTableForm(prev => ({ ...prev, type: 'Pool' }));
//                                                                 setTableTypeDropdownOpen(false);
//                                                             }}
//                                                         >
//                                                             <FaTableTennis className="text-primary" />
//                                                             <span>Pool</span>
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="w-100 text-start btn btn-light d-flex align-items-center gap-2"
//                                                             onClick={() => {
//                                                                 setTableForm(prev => ({ ...prev, type: 'PlayStation' }));
//                                                                 setTableTypeDropdownOpen(false);
//                                                             }}
//                                                         >
//                                                             <FaGamepad className="text-purple" />
//                                                             <span>PlayStation</span>
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="w-100 text-start btn btn-light d-flex align-items-center gap-2"
//                                                             onClick={() => {
//                                                                 setTableForm(prev => ({ ...prev, type: 'Food' }));
//                                                                 setTableTypeDropdownOpen(false);
//                                                             }}
//                                                         >
//                                                             <FaUtensils className="text-danger" />
//                                                             <span>Food</span>
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {tableForm.type !== 'Food' && (
//                                         <div className="mb-3">
//                                             <label className="form-label">Smart Plug ID</label>
//                                             <input
//                                                 type="text"
//                                                 name="plugId"
//                                                 className="form-control"
//                                                 placeholder="Enter plug ID (e.g., PLUG_001)"
//                                                 value={tableForm.plugId}
//                                                 onChange={handleTableFormChange}
//                                             />
//                                         </div>
//                                     )}

//                                     <div className="mb-4">
//                                         <label className="form-label">Status</label>
//                                         <div className="d-flex gap-4">
//                                             <label className="d-flex align-items-center gap-2 cursor-pointer">
//                                                 <input
//                                                     type="radio"
//                                                     name="status"
//                                                     value="active"
//                                                     className="form-check-input"
//                                                     checked={tableForm.status === 'active'}
//                                                     onChange={handleTableFormChange}
//                                                 />
//                                                 <span className="text-dark">Active</span>
//                                             </label>
//                                             <label className="d-flex align-items-center gap-2 cursor-pointer">
//                                                 <input
//                                                     type="radio"
//                                                     name="status"
//                                                     value="inactive"
//                                                     className="form-check-input"
//                                                     checked={tableForm.status === 'inactive'}
//                                                     onChange={handleTableFormChange}
//                                                 />
//                                                 <span className="text-dark">Inactive</span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary"
//                                         onClick={() => setTableModalOpen(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button 
//                                         type="submit" 
//                                         className="btn btn-warning text-dark"
//                                     >
//                                         {editingTable ? 'Update Table' : 'Add Table'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Group Management Modal */}
//             {groupModalOpen && (
//                 <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1050 }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">
//                                     {editingGroup ? 'Edit Group' : 'Create Group'}
//                                 </h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setGroupModalOpen(false)}
//                                 ></button>
//                             </div>
//                             <form onSubmit={handleGroupSubmit}>
//                                 <div className="modal-body">
//                                     <div className="mb-3">
//                                         <label className="form-label">Group Name</label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             className="form-control"
//                                             placeholder="Enter group name"
//                                             value={groupForm.name}
//                                             onChange={handleGroupFormChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Select Tables</label>
//                                         <div className="border rounded overflow-auto" style={{ maxHeight: '200px' }}>
//                                             {Object.entries(groupTablesByType()).map(([type, tables]) => (
//                                                 <div key={type} className="mb-2">
//                                                     <div className="bg-light p-2 fw-medium">
//                                                         {type} Tables
//                                                     </div>
//                                                     <div className="p-2 d-flex flex-column gap-2">
//                                                         {tables.map(table => (
//                                                             <div key={table.id} className="form-check">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="form-check-input"
//                                                                     id={`table-${table.id}`}
//                                                                     checked={groupForm.selectedTables.includes(table.id)}
//                                                                     onChange={() => handleTableSelection(table.id)}
//                                                                 />
//                                                                 <label className="form-check-label" htmlFor={`table-${table.id}`}>
//                                                                     {table.name}
//                                                                 </label>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Selected Tables</label>
//                                         {groupForm.selectedTables.length > 0 ? (
//                                             <div className="border rounded p-2">
//                                                 {Object.entries(getSelectedTablesByType()).map(([type, tables]) => (
//                                                     <div key={type} className="mb-2">
//                                                         <div className="fw-medium">{type} Tables:</div>
//                                                         <div className="d-flex flex-wrap gap-2">
//                                                             {tables.map(table => (
//                                                                 <span key={table.id} className="badge bg-warning text-dark">
//                                                                     {table.name}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         ) : (
//                                             <div className="border rounded p-2 text-muted">
//                                                 No tables selected
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="row g-3 mb-3">
//                                         <div className="col-md-6">
//                                             <label className="form-label">Hourly Rate ($)</label>
//                                             <input
//                                                 type="number"
//                                                 name="hourlyRate"
//                                                 className="form-control"
//                                                 placeholder="0.00"
//                                                 value={groupForm.hourlyRate}
//                                                 onChange={handleGroupFormChange}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="col-md-6">
//                                             <label className="form-label">Fixed Rate ($)</label>
//                                             <input
//                                                 type="number"
//                                                 name="fixedRate"
//                                                 className="form-control"
//                                                 placeholder="0.00"
//                                                 value={groupForm.fixedRate}
//                                                 onChange={handleGroupFormChange}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Discounted Rate (%) <span className="text-muted">Optional</span></label>
//                                         <input
//                                             type="number"
//                                             name="discount"
//                                             className="form-control"
//                                             placeholder="0"
//                                             value={groupForm.discount}
//                                             onChange={handleGroupFormChange}
//                                             min="0"
//                                             max="100"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary"
//                                         onClick={() => setGroupModalOpen(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="btn btn-warning text-dark"
//                                         disabled={groupForm.selectedTables.length === 0}
//                                     >
//                                         {editingGroup ? 'Update Group' : 'Create Group'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default TablePlugSetup;






















import React, { useState } from 'react';
import Tables from './Tables';
import MapSmartPlug from './MapSmartPlug';

function TablePlugSetup() {
    return (
        <div className="p-3">
            {/* Main Content */}
            <div className="">
                <div className="mb-4">
                    <h1 className="fs-3 fw-bold text-dark">Table & Plug Setup</h1>
                    <p className="text-muted">Manage table types, configure rates, and control smart plugs</p>
                </div>

                <div className="row g-4">
                    <div>
                        <Tables/>
                    </div>

                    <div>
                        <MapSmartPlug/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TablePlugSetup;
