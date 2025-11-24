import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetails from './components/EmployeeDetails';
import SearchEmployee from './components/SearchEmployee';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                  path="/employees"
                  element={
                    <PrivateRoute>
                      <EmployeeList />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/employees/add"
                  element={
                    <PrivateRoute>
                      <EmployeeForm />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/employees/edit/:id"
                  element={
                    <PrivateRoute>
                      <EmployeeForm />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/employees/view/:id"
                  element={
                    <PrivateRoute>
                      <EmployeeDetails />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/employees/search"
                  element={
                    <PrivateRoute>
                      <SearchEmployee />
                    </PrivateRoute>
                  }
              />
              <Route path="/" element={<Navigate to="/employees" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;