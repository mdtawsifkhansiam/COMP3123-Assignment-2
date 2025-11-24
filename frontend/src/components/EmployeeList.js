import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Button,
    Card,
    Row,
    Col,
    Alert,
    Modal,
    Navbar,
    Nav
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
        } catch (error) {
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await employeeAPI.delete(employeeToDelete._id);
            setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
        } catch (error) {
            setError('Failed to delete employee');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>Employee Management System</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/employees/search">Search</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout ({user?.username})</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Row className="mb-4">
                    <Col>
                        <h2>Employee List</h2>
                    </Col>
                    <Col className="text-end">
                        <Button as={Link} to="/employees/add" variant="primary">
                            Add New Employee
                        </Button>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                <Card>
                    <Card.Body>
                        <Table responsive striped hover>
                            <thead>
                            <tr>
                                <th>Profile</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee._id}>
                                    <td>
                                        {employee.profile_picture ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${employee.profile_picture}`}
                                                alt="Profile"
                                                className="employee-avatar"
                                            />
                                        ) : (
                                            <div
                                                className="employee-avatar"
                                                style={{
                                                    backgroundColor: '#007bff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {employee.first_name[0]}{employee.last_name[0]}
                                            </div>
                                        )}
                                    </td>
                                    <td>{employee.first_name}</td>
                                    <td>{employee.last_name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.position}</td>
                                    <td>{employee.department}</td>
                                    <td>${employee.salary.toLocaleString()}</td>
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`/employees/view/${employee._id}`}
                                            variant="info"
                                            size="sm"
                                            className="me-1"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/employees/edit/${employee._id}`}
                                            variant="warning"
                                            size="sm"
                                            className="me-1"
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(employee)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        {employees.length === 0 && (
                            <div className="text-center text-muted py-4">
                                No employees found. <Link to="/employees/add">Add the first employee</Link>.
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete {employeeToDelete?.first_name} {employeeToDelete?.last_name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default EmployeeList;