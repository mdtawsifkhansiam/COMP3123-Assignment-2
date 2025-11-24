const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new employee
router.post('/', upload.single('profile_picture'), async (req, res) => {
    try {
        const { first_name, last_name, email, position, department, salary, date_joined } = req.body;

        // Validation
        if (!first_name || !last_name || !email || !position || !department || !salary || !date_joined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employeeData = {
            first_name,
            last_name,
            email,
            position,
            department,
            salary: Number(salary),
            date_joined
        };

        if (req.file) {
            employeeData.profile_picture = req.file.filename;
        }

        const employee = new Employee(employeeData);
        await employee.save();

        res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update employee
router.put('/:id', upload.single('profile_picture'), async (req, res) => {
    try {
        const { first_name, last_name, email, position, department, salary, date_joined } = req.body;

        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Employee with this email already exists' });
            }
        }

        const updateData = {
            first_name,
            last_name,
            email,
            position,
            department,
            salary: Number(salary),
            date_joined
        };

        if (req.file) {
            updateData.profile_picture = req.file.filename;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search employees
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const employees = await Employee.find({
            $or: [
                { department: { $regex: query, $options: 'i' } },
                { position: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;