import React, { useState } from 'react';
import {
    Container,
    Form,
    Button,
    Card,
    Row,
    Col,
    Table,
    Alert,
    Navbar,
    Nav
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';

const SearchEmployee = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await employeeAPI.search(searchQuery);
            setSearchResults(response.data);
        } catch (error) {
            setError('Search failed');
            setSearchResults([]);
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
                                <h2 className="text-center mb-4">Search Employees</h2>

                                <Form onSubmit={handleSearch}>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Search by Department or Position</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter department or position..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                <Form.Text className="text-muted">
                                                    Search for employees by their department or position
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-grid gap-2 mt-3">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Searching...' : 'Search'}
                                        </Button>
                                    </div>
                                </Form>

                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                {searchResults.length > 0 && (
                                    <div className="mt-4">
                                        <h5>Search Results ({searchResults.length})</h5>
                                        <Table responsive striped hover>
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Position</th>
                                                <th>Department</th>
                                                <th>Salary</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {searchResults.map((employee) => (
                                                <tr key={employee._id}>
                                                    <td>{employee.first_name} {employee.last_name}</td>
                                                    <td>{employee.email}</td>
                                                    <td>{employee.position}</td>
                                                    <td>{employee.department}</td>
                                                    <td>${employee.salary.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                {searchResults.length === 0 && !loading && searchQuery && (
                                    <Alert variant="info" className="mt-3">
                                        No employees found matching your search criteria.
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SearchEmployee;