import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Navbar,
    Nav,
    Alert
} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';

const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await employeeAPI.getById(id);
            setEmployee(response.data);
        } catch (error) {
            setError('Failed to fetch employee details');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;
    if (!employee) return <div className="text-center mt-5">Employee not found</div>;

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>Employee Management System</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/employees">Employee List</Nav.Link>
                            <Nav.Link as={Link} to="/employees/search">Search</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout ({user?.username})</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card>
                            <Card.Body className="text-center">
                                <div className="mb-4">
                                    {employee.profile_picture ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${employee.profile_picture}`}
                                            alt="Profile"
                                            className="employee-avatar-large"
                                        />
                                    ) : (
                                        <div
                                            className="employee-avatar-large"
                                            style={{
                                                backgroundColor: '#007bff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '48px',
                                                margin: '0 auto'
                                            }}
                                        >
                                            {employee.first_name[0]}{employee.last_name[0]}
                                        </div>
                                    )}
                                </div>

                                <h2>{employee.first_name} {employee.last_name}</h2>
                                <p className="text-muted">{employee.position}</p>

                                <Row className="mt-4 text-start">
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h6>Personal Information</h6>
                                                <p><strong>Email:</strong> {employee.email}</p>
                                                <p><strong>Department:</strong> {employee.department}</p>
                                                <p><strong>Position:</strong> {employee.position}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h6>Employment Details</h6>
                                                <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
                                                <p><strong>Date Joined:</strong> {new Date(employee.date_joined).toLocaleDateString()}</p>
                                                <p><strong>Employee Since:</strong> {Math.floor((new Date() - new Date(employee.date_joined)) / (1000 * 60 * 60 * 24 * 365))} years</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <div className="mt-4">
                                    <Button
                                        as={Link}
                                        to={`/employees/edit/${employee._id}`}
                                        variant="warning"
                                        className="me-2"
                                    >
                                        Update Information
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/employees"
                                        variant="secondary"
                                    >
                                        Back to List
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EmployeeDetails;