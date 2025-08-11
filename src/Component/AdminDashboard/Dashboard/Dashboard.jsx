import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { FaDollarSign, FaUtensils, FaTable, FaTags, FaFileExport } from "react-icons/fa";
import { FaUsers, FaClock, FaFire } from "react-icons/fa";

const Dashboard = () => {

    // Refs for chart containers
    const categoryChartRef = useRef(null);
    const shareChartRef = useRef(null);
    const timelineChartRef = useRef(null);


    // KPI and Card data
    const kpis = [
        {
            title: "Total Sessions",
            value: "1,247",
            trend: "↑ 12.5% vs yesterday",
            trendColor: "text-success",
            icon: <FaUsers />,
            bg: "bg-primary-subtle",
            iconColor: "text-primary",
        },
        {
            title: "Average Duration",
            value: "2.4h",
            trend: "↑ 8.2% increase",
            trendColor: "text-success",
            icon: <FaClock />,
            bg: "bg-success-subtle",
            iconColor: "text-success",
        },
        {
            title: "Peak Usage",
            value: "8:00 PM",
            trend: "↓ 30min earlier",
            trendColor: "text-danger",
            icon: <FaFire />,
            bg: "bg-warning-subtle",
            iconColor: "text-warning",
        },
    ];

    const cards = [
        {
            title: "Total Revenue",
            value: "$12,847",
            icon: <FaDollarSign />,
            bg: "bg-success-subtle",
            iconColor: "text-success",
        },
        {
            title: "Table Revenue",
            value: "$8,420",
            icon: <FaTable />,
            bg: "bg-primary-subtle",
            iconColor: "text-primary",
        },
        {
            title: "Order Revenue",
            value: "$4,127",
            icon: <FaUtensils />,
            bg: "bg-warning-subtle",
            iconColor: "text-warning",
        },
        {
            title: "Discounts Applied",
            value: "$300",
            icon: <FaTags />,
            bg: "bg-danger-subtle",
            iconColor: "text-danger",
        },
    ];

    // Initialize charts
    useEffect(() => {
        const initCharts = () => {
            // Initialize Category Chart
            const categoryChart = echarts.init(categoryChartRef.current);
            categoryChart.setOption({
                animation: false,
                grid: { top: 20, right: 20, bottom: 40, left: 60 },
                xAxis: {
                    type: 'category',
                    data: ['Food', 'Drinks', 'Games', 'Others'],
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                },
                series: [{
                    data: [8420, 3200, 1227, 1000],
                    type: 'bar',
                    itemStyle: {
                        color: 'rgba(87, 181, 231, 1)',
                        borderRadius: [4, 4, 0, 0]
                    },
                    barWidth: '60%'
                }],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    textStyle: { color: '#1f2937' }
                }
            });

            // Initialize Share Chart
            const shareChart = echarts.init(shareChartRef.current);
            shareChart.setOption({
                animation: false,
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    data: [
                        { value: 8420, name: 'Table Revenue', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
                        { value: 4127, name: 'Order Revenue', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
                        { value: 300, name: 'Discounts', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
                    ],
                    itemStyle: { borderRadius: 8 },
                    label: { show: false },
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
                }],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    textStyle: { color: '#1f2937' }
                }
            });

            // Initialize Timeline Chart
            const timelineChart = echarts.init(timelineChartRef.current);
            timelineChart.setOption({
                animation: false,
                grid: { top: 20, right: 20, bottom: 40, left: 60 },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLine: { lineStyle: { color: '#e5e7eb' } },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#f3f4f6' } }
                },
                series: [{
                    data: [2000, 3000, 2500, 4000, 3500, 4500, 3847],
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: 'rgba(251, 191, 114, 1)', width: 3 },
                    itemStyle: { color: 'rgba(251, 191, 114, 1)' },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(251, 191, 114, 0.1)' },
                                { offset: 1, color: 'rgba(251, 191, 114, 0.01)' }
                            ]
                        }
                    },
                    showSymbol: false
                }],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e5e7eb',
                    textStyle: { color: '#1f2937' }
                }
            });

            // Resize charts when window resizes
            const handleResize = () => {
                categoryChart.resize();
                shareChart.resize();
                timelineChart.resize();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                categoryChart.dispose();
                shareChart.dispose();
                timelineChart.dispose();
            };
        };

        // Wait for the DOM to be fully loaded before initializing charts
        const timer = setTimeout(initCharts, 100);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="p-3">
            <div className="">
                <div className="">
                    <h1 className="fs-3 fw-bold text-dark">Dashboard Overview</h1>

                    {/* KPI Cards */}
                    <div className="row g-4 mb-3 mt-1">
                        {kpis.map((item, idx) => (
                            <div key={idx} className="col-md-4">
                                <div className="card p-4 rounded shadow-sm bg-white h-100 border-0">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="small text-muted mb-1">{item.title}</p>
                                            <h4 className="fw-bold mb-1">{item.value}</h4>
                                            <div className={`small fw-medium ${item.trendColor}`}>
                                                {item.trend}
                                            </div>
                                        </div>
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center ${item.bg}`}
                                            style={{ width: "36px", height: "36px" }}
                                        >
                                            <span className={`${item.iconColor} fs-5`}>{item.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Summary Cards */}
                    <div className="row g-4 mb-3">
                        {cards.map((card, index) => (
                            <div key={index} className="col-md-3">
                                <div className="card shadow-sm border-0 rounded-4 h-100">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="mb-1 text-muted small">{card.title}</p>
                                            <h5 className="fw-bold mb-0">{card.value}</h5>
                                        </div>
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center ${card.bg}`}
                                            style={{ width: "36px", height: "36px" }}
                                        >
                                            <span className={`${card.iconColor} fs-5`}>{card.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Report Display Area */}
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="bg-white p-4 rounded shadow-sm border h-100">
                                <h3 className="h5 font-weight-semibold mb-3">Revenue by Category</h3>
                                <div ref={categoryChartRef} style={{ height: '300px', width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="bg-white p-4 rounded shadow-sm border h-100">
                                <h3 className="h5 font-weight-semibold mb-3">Revenue Share</h3>
                                <div ref={shareChartRef} style={{ height: '300px', width: '100%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="bg-white p-4 rounded shadow-sm border h-100">
                                <h3 className="h5 font-weight-semibold mb-3">Revenue Timeline</h3>
                                <div ref={timelineChartRef} style={{ height: '300px', width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;