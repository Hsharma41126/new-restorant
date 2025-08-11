// import React, { useEffect, useState, useRef } from 'react';
// import * as echarts from 'echarts';
// import { Form, Row, Col, Button, Tab, Tabs } from "react-bootstrap";
// import { FaDollarSign, FaUtensils, FaTable, FaTags, FaFileExport } from "react-icons/fa";
// import { FaUsers, FaClock, FaFire } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const Dashboard = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [reportBy, setReportBy] = useState("last_7_days");
//   const [reportType, setReportType] = useState("x_report");
//   const [activeTab, setActiveTab] = useState("summary");

//   // Refs for chart containers
//   const categoryChartRef = useRef(null);
//   const shareChartRef = useRef(null);
//   const timelineChartRef = useRef(null);

//   // Sample data for different report types
//   const reportData = {
//     x_report: {
//       title: "X Report (Summary)",
//       columns: ["Period", "Total Sales", "Total Discounts", "Net Revenue", "Total Orders"],
//       data: [
//         { label: "Today", sales: "$2,847", discounts: "$120", revenue: "$2,727", orders: "142" },
//         { label: "Yesterday", sales: "$3,120", discounts: "$150", revenue: "$2,970", orders: "156" },
//         { label: "This Week", sales: "$12,847", discounts: "$300", revenue: "$12,547", orders: "642" }
//       ]
//     },
//     report_items: {
//       title: "Item Sales Report",
//       columns: ["Item Name", "Quantity Sold", "Total Revenue"],
//       data: [
//         { name: "Burger", quantity: 120, revenue: "$1,200" },
//         { name: "Pizza", quantity: 85, revenue: "$1,700" },
//         { name: "Coke", quantity: 210, revenue: "$630" },
//         { name: "French Fries", quantity: 95, revenue: "$475" }
//       ]
//     },
//     report_table: {
//       title: "Table Revenue Report",
//       columns: ["Table Number", "Total Revenue", "Average Time", "Occupancy Rate"],
//       data: [
//         { table: "T01", revenue: "$1,200", time: "2h 15m", occupancy: "78%" },
//         { table: "T02", revenue: "$980", time: "1h 45m", occupancy: "65%" },
//         { table: "T03", revenue: "$1,450", time: "2h 30m", occupancy: "82%" }
//       ]
//     },
//     report_category: {
//       title: "Category Sales Report",
//       columns: ["Category", "Total Sales", "Percentage"],
//       data: [
//         { category: "Food", sales: "$8,420", percentage: "65%" },
//         { category: "Drinks", sales: "$3,200", percentage: "25%" },
//         { category: "Games", sales: "$1,227", percentage: "10%" }
//       ]
//     },
//     report_details: {
//       title: "Detailed Transactions",
//       columns: ["Order ID", "Time", "Items", "Amount", "Discount", "Total"],
//       data: [
//         { id: "ROBO01", time: "08:15 PM", items: "2 Burgers, 1 Coke", amount: "$24.50", discount: "$2.50", total: "$22.00" },
//         { id: "ROBO02", time: "07:30 PM", items: "1 Pizza, 2 Fries", amount: "$18.00", discount: "$0.00", total: "$18.00" },
//         { id: "ROBO03", time: "09:45 PM", items: "3 Cokes", amount: "$9.00", discount: "$1.00", total: "$8.00" }
//       ]
//     },
//     report_summary: {
//       title: "Summary by Staff",
//       columns: ["Staff Name", "Orders Handled", "Total Sales"],
//       data: [
//         { staff: "John Doe", orders: 42, sales: "$1,240" },
//         { staff: "Jane Smith", orders: 38, sales: "$1,120" },
//         { staff: "Mike Johnson", orders: 29, sales: "$980" }
//       ]
//     },
//     report_amount: {
//       title: "Financial Summary",
//       columns: ["Total Revenue", "Total Discounts", "Net Amount"],
//       data: [
//         { revenue: "$12,847", discounts: "$300", net: "$12,547" }
//       ]
//     }
//   };

//   // KPI and Card data
//   const kpis = [
//     {
//       title: "Total Sessions",
//       value: "1,247",
//       trend: "↑ 12.5% vs yesterday",
//       trendColor: "text-success",
//       icon: <FaUsers />,
//       bg: "bg-primary-subtle",
//       iconColor: "text-primary",
//     },
//     {
//       title: "Average Duration",
//       value: "2.4h",
//       trend: "↑ 8.2% increase",
//       trendColor: "text-success",
//       icon: <FaClock />,
//       bg: "bg-success-subtle",
//       iconColor: "text-success",
//     },
//     {
//       title: "Peak Usage",
//       value: "8:00 PM",
//       trend: "↓ 30min earlier",
//       trendColor: "text-danger",
//       icon: <FaFire />,
//       bg: "bg-warning-subtle",
//       iconColor: "text-warning",
//     },
//   ];

//   const cards = [
//     {
//       title: "Total Revenue",
//       value: "$12,847",
//       icon: <FaDollarSign />,
//       bg: "bg-success-subtle",
//       iconColor: "text-success",
//     },
//     {
//       title: "Table Revenue",
//       value: "$8,420",
//       icon: <FaTable />,
//       bg: "bg-primary-subtle",
//       iconColor: "text-primary",
//     },
//     {
//       title: "Order Revenue",
//       value: "$4,127",
//       icon: <FaUtensils />,
//       bg: "bg-warning-subtle",
//       iconColor: "text-warning",
//     },
//     {
//       title: "Discounts Applied",
//       value: "$300",
//       icon: <FaTags />,
//       bg: "bg-danger-subtle",
//       iconColor: "text-danger",
//     },
//   ];

//   // Initialize charts
//   useEffect(() => {
//     const initCharts = () => {
//       // Initialize Category Chart
//       const categoryChart = echarts.init(categoryChartRef.current);
//       categoryChart.setOption({
//         animation: false,
//         grid: { top: 20, right: 20, bottom: 40, left: 60 },
//         xAxis: {
//           type: 'category',
//           data: ['Food', 'Drinks', 'Games', 'Others'],
//           axisLine: { lineStyle: { color: '#e5e7eb' } },
//           axisTick: { show: false }
//         },
//         yAxis: {
//           type: 'value',
//           axisLine: { show: false },
//           axisTick: { show: false },
//           splitLine: { lineStyle: { color: '#f3f4f6' } }
//         },
//         series: [{
//           data: [8420, 3200, 1227, 1000],
//           type: 'bar',
//           itemStyle: {
//             color: 'rgba(87, 181, 231, 1)',
//             borderRadius: [4, 4, 0, 0]
//           },
//           barWidth: '60%'
//         }],
//         tooltip: {
//           trigger: 'axis',
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           borderColor: '#e5e7eb',
//           textStyle: { color: '#1f2937' }
//         }
//       });

//       // Initialize Share Chart
//       const shareChart = echarts.init(shareChartRef.current);
//       shareChart.setOption({
//         animation: false,
//         series: [{
//           type: 'pie',
//           radius: ['40%', '70%'],
//           center: ['50%', '50%'],
//           data: [
//             { value: 8420, name: 'Table Revenue', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
//             { value: 4127, name: 'Order Revenue', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
//             { value: 300, name: 'Discounts', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
//           ],
//           itemStyle: { borderRadius: 8 },
//           label: { show: false },
//           emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
//         }],
//         tooltip: {
//           trigger: 'item',
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           borderColor: '#e5e7eb',
//           textStyle: { color: '#1f2937' }
//         }
//       });

//       // Initialize Timeline Chart
//       const timelineChart = echarts.init(timelineChartRef.current);
//       timelineChart.setOption({
//         animation: false,
//         grid: { top: 20, right: 20, bottom: 40, left: 60 },
//         xAxis: {
//           type: 'category',
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//           axisLine: { lineStyle: { color: '#e5e7eb' } },
//           axisTick: { show: false }
//         },
//         yAxis: {
//           type: 'value',
//           axisLine: { show: false },
//           axisTick: { show: false },
//           splitLine: { lineStyle: { color: '#f3f4f6' } }
//         },
//         series: [{
//           data: [2000, 3000, 2500, 4000, 3500, 4500, 3847],
//           type: 'line',
//           smooth: true,
//           lineStyle: { color: 'rgba(251, 191, 114, 1)', width: 3 },
//           itemStyle: { color: 'rgba(251, 191, 114, 1)' },
//           areaStyle: {
//             color: {
//               type: 'linear',
//               x: 0, y: 0, x2: 0, y2: 1,
//               colorStops: [
//                 { offset: 0, color: 'rgba(251, 191, 114, 0.1)' },
//                 { offset: 1, color: 'rgba(251, 191, 114, 0.01)' }
//               ]
//             }
//           },
//           showSymbol: false
//         }],
//         tooltip: {
//           trigger: 'axis',
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           borderColor: '#e5e7eb',
//           textStyle: { color: '#1f2937' }
//         }
//       });

//       // Resize charts when window resizes
//       const handleResize = () => {
//         categoryChart.resize();
//         shareChart.resize();
//         timelineChart.resize();
//       };

//       window.addEventListener('resize', handleResize);

//       return () => {
//         window.removeEventListener('resize', handleResize);
//         categoryChart.dispose();
//         shareChart.dispose();
//         timelineChart.dispose();
//       };
//     };

//     // Wait for the DOM to be fully loaded before initializing charts
//     const timer = setTimeout(initCharts, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleExport = (format) => {
//     console.log(`Exporting as ${format} for ${reportBy} and ${reportType}`);
//     alert(`Report exported as ${format.toUpperCase()}`);
//   };

//   const renderReportContent = () => {
//     const currentReport = reportData[reportType];

//     return (
//       <div className="bg-white rounded shadow-sm border mt-3">
//         <div className="p-3 border-bottom">
//           <h3 className="h5 font-weight-semibold mb-0">{currentReport.title}</h3>
//         </div>

//         <div className="table-responsive">
//           <table className="table mb-0">
//             <thead className="bg-light">
//               <tr>
//                 {currentReport.columns.map((column, index) => (
//                   <th key={index} className="small text-uppercase text-muted">{column}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {currentReport.data.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Object.values(row).map((value, colIndex) => (
//                     <td key={colIndex}>{value}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-3">
//       <div className="">
//         <div className="">
//           <h2 className="fw-bold text-dark d-flex align-items-center">Reports & Analytics</h2>

//           {/* KPI Cards */}
//           <div className="row g-4 mb-3 mt-2">
//             {kpis.map((item, idx) => (
//               <div key={idx} className="col-md-4">
//                 <div className="card p-4 rounded shadow-sm bg-white h-100 border-0">
//                   <div className="d-flex justify-content-between align-items-start">
//                     <div>
//                       <p className="small text-muted mb-1">{item.title}</p>
//                       <h4 className="fw-bold mb-1">{item.value}</h4>
//                       <div className={`small fw-medium ${item.trendColor}`}>
//                         {item.trend}
//                       </div>
//                     </div>
//                     <div
//                       className={`rounded-circle d-flex align-items-center justify-content-center ${item.bg}`}
//                       style={{ width: "36px", height: "36px" }}
//                     >
//                       <span className={`${item.iconColor} fs-5`}>{item.icon}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Revenue Summary Cards */}
//           <div className="row g-4 mb-3">
//             {cards.map((card, index) => (
//               <div key={index} className="col-md-3">
//                 <div className="card shadow-sm border-0 rounded-4 h-100">
//                   <div className="card-body d-flex justify-content-between align-items-center">
//                     <div>
//                       <p className="mb-1 text-muted small">{card.title}</p>
//                       <h5 className="fw-bold mb-0">{card.value}</h5>
//                     </div>
//                     <div
//                       className={`rounded-circle d-flex align-items-center justify-content-center ${card.bg}`}
//                       style={{ width: "36px", height: "36px" }}
//                     >
//                       <span className={`${card.iconColor} fs-5`}>{card.icon}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Report Controls Section */}
//           <div className="bg-white rounded shadow-sm p-3 mb-3">
//             <Row className="gy-2 gx-3 align-items-end">
//               <Col lg={2} md={3} sm={6} xs={12}>
//                 <Form.Group>
//                   <Form.Label className="fw-semibold">Report By:</Form.Label>
//                   <Form.Select
//                     value={reportBy}
//                     onChange={(e) => setReportBy(e.target.value)}
//                   >
//                     <option value="daily">Daily</option>
//                     <option value="last_7_days">Last 7 days</option>
//                     <option value="last_30_days">Last 30 days</option>
//                     <option value="last_year">Last year</option>
//                     <option value="year_to_date">Year until end</option>
//                     <option value="custom_range">Custom range</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               {reportBy === "custom_range" && (
//                 <>
//                   <Col lg={2} md={3} sm={6} xs={12}>
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">From:</Form.Label>
//                       <DatePicker
//                         selected={startDate}
//                         onChange={(date) => setStartDate(date)}
//                         selectsStart
//                         startDate={startDate}
//                         endDate={endDate}
//                         className="form-control"
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col lg={2} md={3} sm={6} xs={12}>
//                     <Form.Group>
//                       <Form.Label className="fw-semibold">To:</Form.Label>
//                       <DatePicker
//                         selected={endDate}
//                         onChange={(date) => setEndDate(date)}
//                         selectsEnd
//                         startDate={startDate}
//                         endDate={endDate}
//                         minDate={startDate}
//                         className="form-control"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </>
//               )}

//               <Col lg={3} md={4} sm={6} xs={12}>
//                 <Form.Group>
//                   <Form.Label className="fw-semibold">Report Type:</Form.Label>
//                   <Form.Select
//                     value={reportType}
//                     onChange={(e) => setReportType(e.target.value)}
//                   >
//                     <option value="x_report">X Report (Summary)</option>
//                     <option value="report_items">Item Sales Report</option>
//                     <option value="report_table">Table Revenue Report</option>
//                     <option value="report_category">Category Sales Report</option>
//                     <option value="report_details">Detailed Transactions</option>
//                     <option value="report_summary">Staff Summary Report</option>
//                     <option value="report_amount">Financial Summary</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col lg={2} md={3} sm={6} xs={12}>
//                 <Button
//                   variant="primary"
//                   className="w-100"
//                   onClick={() => handleExport("pdf")}
//                 >
//                   <FaFileExport className="me-2" />
//                   Export
//                 </Button>
//               </Col>
//             </Row>
//           </div>

//           {/* Report Display Area */}
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mb-3"
//           >
//             <Tab eventKey="summary" title="Summary">
//               <div className="row mb-4">
//                 <div className="col-md-6 mb-3">
//                   <div className="bg-white p-4 rounded shadow-sm border h-100">
//                     <h3 className="h5 font-weight-semibold mb-3">Revenue by Category</h3>
//                     <div ref={categoryChartRef} style={{ height: '300px', width: '100%' }}></div>
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <div className="bg-white p-4 rounded shadow-sm border h-100">
//                     <h3 className="h5 font-weight-semibold mb-3">Revenue Share</h3>
//                     <div ref={shareChartRef} style={{ height: '300px', width: '100%' }}></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-12">
//                   <div className="bg-white p-4 rounded shadow-sm border h-100">
//                     <h3 className="h5 font-weight-semibold mb-3">Revenue Timeline</h3>
//                     <div ref={timelineChartRef} style={{ height: '300px', width: '100%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </Tab>

//             <Tab eventKey="report" title="Detailed Report">
//               {renderReportContent()}
//             </Tab>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaFileExport } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReportsAnalytics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportBy, setReportBy] = useState("last_7_days");
  const [reportType, setReportType] = useState("x_report");

  const reportData = {
    x_report: {
      title: "X Report (Summary)",
      columns: ["Period", "Total Sales", "Total Discounts", "Net Revenue", "Total Orders"],
      data: [
        { label: "Today", sales: "$2,847", discounts: "$120", revenue: "$2,727", orders: "142" },
        { label: "Yesterday", sales: "$3,120", discounts: "$150", revenue: "$2,970", orders: "156" },
        { label: "This Week", sales: "$12,847", discounts: "$300", revenue: "$12,547", orders: "642" }
      ]
    },
    report_items: {
      title: "Item Sales Report",
      columns: ["Item Name", "Quantity Sold", "Total Revenue"],
      data: [
        { name: "Burger", quantity: 120, revenue: "$1,200" },
        { name: "Pizza", quantity: 85, revenue: "$1,700" },
        { name: "Coke", quantity: 210, revenue: "$630" },
        { name: "French Fries", quantity: 95, revenue: "$475" }
      ]
    },
    report_table: {
      title: "Table Revenue Report",
      columns: ["Table Number", "Total Revenue", "Average Time", "Occupancy Rate"],
      data: [
        { table: "T01", revenue: "$1,200", time: "2h 15m", occupancy: "78%" },
        { table: "T02", revenue: "$980", time: "1h 45m", occupancy: "65%" },
        { table: "T03", revenue: "$1,450", time: "2h 30m", occupancy: "82%" }
      ]
    },
    report_category: {
      title: "Category Sales Report",
      columns: ["Category", "Total Sales", "Percentage"],
      data: [
        { category: "Food", sales: "$8,420", percentage: "65%" },
        { category: "Drinks", sales: "$3,200", percentage: "25%" },
        { category: "Games", sales: "$1,227", percentage: "10%" }
      ]
    },
    report_details: {
      title: "Detailed Transactions",
      columns: ["Order ID", "Time", "Items", "Amount", "Discount", "Total"],
      data: [
        { id: "ROBO01", time: "08:15 PM", items: "2 Burgers, 1 Coke", amount: "$24.50", discount: "$2.50", total: "$22.00" },
        { id: "ROBO02", time: "07:30 PM", items: "1 Pizza, 2 Fries", amount: "$18.00", discount: "$0.00", total: "$18.00" },
        { id: "ROBO03", time: "09:45 PM", items: "3 Cokes", amount: "$9.00", discount: "$1.00", total: "$8.00" }
      ]
    },
    report_summary: {
      title: "Summary by Staff",
      columns: ["Staff Name", "Orders Handled", "Total Sales"],
      data: [
        { staff: "John Doe", orders: 42, sales: "$1,240" },
        { staff: "Jane Smith", orders: 38, sales: "$1,120" },
        { staff: "Mike Johnson", orders: 29, sales: "$980" }
      ]
    },
    report_amount: {
      title: "Financial Summary",
      columns: ["Total Revenue", "Total Discounts", "Net Amount"],
      data: [
        { revenue: "$12,847", discounts: "$300", net: "$12,547" }
      ]
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format} for ${reportBy} and ${reportType}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  const renderReportContent = () => {
    const currentReport = reportData[reportType];

    return (
      <div className="bg-white rounded shadow-sm border mt-3">
        <div className="p-3 border-bottom">
          <h3 className="h5 font-weight-semibold mb-0">{currentReport.title}</h3>
        </div>

        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                {currentReport.columns.map((column, index) => (
                  <th key={index} className="small text-uppercase text-muted">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentReport.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="">
        <div className="">
          <h1 className="fs-3 fw-bold text-dark">Reports & Analytics</h1>

          {/* Report Controls Section */}
          <div className="bg-white rounded shadow-sm p-3 mb-3 mt-3">
            <Row className="gy-2 gx-3 align-items-end">
              <Col lg={2} md={3} sm={6} xs={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Report By:</Form.Label>
                  <Form.Select
                    value={reportBy}
                    onChange={(e) => setReportBy(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="last_7_days">Last 7 days</option>
                    <option value="last_30_days">Last 30 days</option>
                    <option value="last_year">Last year</option>
                    <option value="year_to_date">Year until end</option>
                    <option value="custom_range">Custom range</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {reportBy === "custom_range" && (
                <>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">From:</Form.Label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={2} md={3} sm={6} xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">To:</Form.Label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col lg={3} md={4} sm={6} xs={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Report Type:</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="x_report">X Report (Summary)</option>
                    <option value="report_items">Item Sales Report</option>
                    <option value="report_table">Table Revenue Report</option>
                    <option value="report_category">Category Sales Report</option>
                    <option value="report_details">Detailed Transactions</option>
                    <option value="report_summary">Staff Summary Report</option>
                    <option value="report_amount">Financial Summary</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={2} md={3} sm={6} xs={12}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => handleExport("pdf")}
                >
                  <FaFileExport className="me-2" />
                  Export
                </Button>
              </Col>
            </Row>
          </div>

          {/* Report Display Area */}
          <div eventKey="report" title="Detailed Report">
            {renderReportContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;