import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Ensure you have the correct styling
import { useNavigate } from 'react-router-dom';
import Modal from '../components-manual-cv/Modal/Modal'; // Ensure correct import path
import Loader from "../components-manual-cv/loader"; // Ensure correct import path
import { useSelector } from 'react-redux';

const PricingPlan = () => {
    const [activeTab, setActiveTab] = useState('pricing');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [isError, setIsError] = useState(false); // Error state
    const [isErrorInfo, setIsErrorInfo] = useState(''); // Error message state
    const navigate = useNavigate();
    let { user } = useSelector(state => state.userAuth); // Fetch user from Redux store


    // Protect the dashboard - if no user is present, redirect to login
    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login page if user is not found
        }
    }, [user, navigate]);

    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logged out");
    };

    const handleTabChange = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    const renderContent = () => (
        <main className="bg-white p-4">
            <h2 className="mb-4">Pricing Plans</h2>
            <Row>
                {[
                    { title: 'Basic Plan', price: '$10/month', description: 'Ideal for individuals starting out. Includes basic features.' },
                    { title: 'Standard Plan', price: '$20/month', description: 'Great for small teams. Includes additional features and support.' },
                    { title: 'Premium Plan', price: '$30/month', description: 'Best for larger organizations. Includes all features and priority support.' },
                ].map((plan, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{plan.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{plan.price}</h6>
                                <p className="card-text">{plan.description}</p>
                                <Button variant="primary">Choose Plan</Button>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </main>
    );

    return (
        <>
            {isLoading && <Loader />} {/* Loader Component */}
            {isError && <Modal content={isErrorInfo} closeModal={() => setIsError(false)} />} {/* Modal for Error */}
            <div className="dashboard-container">
                <div className={`sidebar ${sidebarOpen ? 'visible' : ''}`}>
                    <div className="sidebar-header d-flex justify-content-between align-items-center">
                        <h4 className="text-white text-center bg-transparent">Dashboard</h4>
                        <Button
                            variant="outline-light"
                            className="d-md-none sidebar-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </Button>
                    </div>
                    <Nav className="flex-column">
                        {[
                            { name: 'My CVs', path: '/cvs' },
                            { name: 'Templates', path: '/template' },
                            { name: 'Profile Settings', path: '/profilesetting' },
                            { name: 'Pricing Plans', path: '/pricing' },
                        ].map((item, index) => (
                            <Nav.Link
                                key={index}
                                onClick={() => handleTabChange(item.name.toLowerCase().replace(' ', ''), item.path)}
                                className={`text-white ${activeTab === item.name.toLowerCase().replace(' ', '') ? 'active' : ''}`}
                            >
                                {item.name}
                            </Nav.Link>
                        ))}
                        <Nav.Link onClick={handleLogout} className="text-white">
                            Logout
                        </Nav.Link>
                    </Nav>
                </div>

                <Container fluid className="main-content">
                    <Navbar expand="lg" className="shadow-lg mb-4 py-3 header-navbar" style={{ backgroundColor: '#007bff' }}>
                        <Container fluid>
                            <Row className="w-100 align-items-center">
                                <Col xs={6} md={8} className="d-flex justify-content-end align-items-center">
                                    <FaUserCircle size={35} className="me-3 user-icon text-white" />
                                    <Button variant="outline-light" className="ml-auto me-3 logout-btn" onClick={handleLogout} style={{ borderRadius: '20px', padding: '0.5rem 1.5rem', fontWeight: '500' }}>
                                        Logout
                                    </Button>
                                </Col>

                                <Button
                                    variant="outline-light"
                                    className="d-lg-none ms-auto me-3 sidebar-toggle-btn"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    style={{ fontSize: '1.5rem', padding: '0.5rem', borderRadius: '10px' }}
                                >
                                    ☰
                                </Button>
                            </Row>
                        </Container>
                    </Navbar>

                    <div className="content">
                        {renderContent()}
                    </div>
                </Container>
            </div>

        </>

    );
};

export default PricingPlan;
