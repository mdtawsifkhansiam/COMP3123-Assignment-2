import React, { useState, useEffect } from 'react';
import {
    Container,
    Form,
    Button,
    Card,
    Row,
    Col,
    Alert,
    Navbar,
    Nav
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        date_joined: '',
        profile_picture: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    useEffect(() => {
        if (isEdit) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await employeeAPI.getById(id);
            const employee = response.data;
            setFormData({
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                position: employee.position,
                department: employee.department,
                salary: employee.salary.toString(),
                date_joined: employee.date_joined.split('T')[0],
                profile_picture: null
            });
            if (employee.profile_picture) {
                setPreviewImage(`http://localhost:5000/uploads/${employee.profile_picture}`);
            }
        } catch (error) {
            setError('Failed to fetch employee data');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profile_picture: file
        });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEdit) {
                await employeeAPI.update(id, formData);
            } else {
                await employeeAPI.create(formData);
            }
            navigate('/employees');
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                            <Card.Body>
                                <h2 className="text-center mb-4">
                                    {isEdit ? 'Update Employee' : 'Add New Employee'}
                                </h2>
                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>First Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Last Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Position *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Department *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Salary *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="salary"
                                                    value={formData.salary}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Date Joined *</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="date_joined"
                                                    value={formData.date_joined}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Profile Picture</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {previewImage && (
                                            <div className="mt-2">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                            size="lg"
                                        >
                                            {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Add Employee')}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            as={Link}
                                            to="/employees"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EmployeeForm;