const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Endpoints for Database

// Health check & DB status
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        database: 'connected',
        timestamp: new Date().toISOString()
    });
});

// Database summary statistics
app.get('/api/stats', (req, res) => {
    try {
        const stats = db.getStats();
        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all bookings with optional query filters (?search=...&status=...)
app.get('/api/bookings', (req, res) => {
    try {
        const { search, status } = req.query;
        const bookings = db.getBookings({ search, status });
        res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Track booking by Tracking ID or Phone
app.get('/api/bookings/track/:query', (req, res) => {
    try {
        const { query } = req.params;
        const booking = db.trackBooking(query);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'No delivery package found with this Tracking ID or Phone Number.' });
        }
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single booking
app.get('/api/bookings/:id', (req, res) => {
    try {
        const booking = db.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new delivery booking in database
app.post('/api/bookings', (req, res) => {
    try {
        const { name, phone, pickup, dropoff, details, "bot-field": botField } = req.body;
        
        // Spam protection check
        if (botField) {
            return res.status(400).json({ success: false, error: 'Spam submission detected' });
        }

        if (!name || !phone || !pickup || !dropoff) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields: name, phone, pick-up address, and drop-off address.' });
        }

        const newBooking = db.createBooking({ name, phone, pickup, dropoff, details });
        res.status(201).json({ 
            success: true, 
            message: 'Booking saved successfully to database',
            booking: newBooking 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update booking status in database
app.patch('/api/bookings/:id/status', (req, res) => {
    try {
        const { status, note } = req.body;
        const validStatuses = ['Pending', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const updated = db.updateStatus(req.params.id, status, note);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: `Status updated to ${status}`, booking: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete booking from database
app.delete('/api/bookings/:id', (req, res) => {
    try {
        const deleted = db.deleteBooking(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, message: 'Booking deleted successfully from database' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Serve static assets from project root
app.use(express.static(path.join(__dirname), {
    extensions: ['html']
}));

// Fallback to index.html for any unmatched routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`OVO Logistics server running on http://0.0.0.0:${PORT}`);
});
