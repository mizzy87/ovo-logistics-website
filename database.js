const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if database file does not exist
const initialSeed = {
    bookings: [
        {
            id: "OVO-78219",
            name: "Chinedu Eze",
            phone: "08031234567",
            pickup: "14 Allen Avenue, Ikeja, Lagos",
            dropoff: "22 Adeola Odeku St, Victoria Island, Lagos",
            details: "Confidential corporate documents (Express delivery)",
            status: "In Transit",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: "Booking submitted online" },
                { status: "Picked Up", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Rider assigned and package collected from Ikeja" },
                { status: "In Transit", timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), note: "Dispatch rider en route to Victoria Island" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
        },
        {
            id: "OVO-54128",
            name: "Amina Yusuf",
            phone: "08149876543",
            pickup: "Admiralty Way, Lekki Phase 1, Lagos",
            dropoff: "Area 11, Garki, Abuja",
            details: "Fragile electronics box (Laptop & accessories)",
            status: "Picked Up",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), note: "Booking submitted online" },
                { status: "Picked Up", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: "Package picked up and scanned at hub" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
            id: "OVO-91043",
            name: "Babajide Martins",
            phone: "09025551234",
            pickup: "Bode Thomas Street, Surulere, Lagos",
            dropoff: "Woji Road, GRA Phase 2, Port Harcourt",
            details: "Native fashion wear parcels (5 sets)",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), note: "Booking submitted online" },
                { status: "Picked Up", timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), note: "Package picked up from Surulere" },
                { status: "In Transit", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), note: "Interstate transit to Rivers State" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Recipient confirmed receipt" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
            id: "OVO-33182",
            name: "Ngozi Adeleke",
            phone: "08051239876",
            pickup: "Maryland Mall, Anthony, Lagos",
            dropoff: "Ring Road, Ibadan, Oyo State",
            details: "Cosmetics & skin care wholesale carton",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 50).toISOString(), note: "Booking submitted online" },
                { status: "Picked Up", timestamp: new Date(Date.now() - 3600000 * 46).toISOString(), note: "Rider picked up from Maryland" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), note: "Delivered to Ibadan outlet" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 30).toISOString()
        },
        {
            id: "OVO-62910",
            name: "Tunde Bakare",
            phone: "07038882211",
            pickup: "Computer Village, Ikeja, Lagos",
            dropoff: "Alaba International Market, Ojo, Lagos",
            details: "Smartphones & network accessories (2 cartons)",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 75).toISOString(), note: "Booking submitted online" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 68).toISOString(), note: "Safe drop-off verified" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 75).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 68).toISOString()
        },
        {
            id: "OVO-41829",
            name: "Fatima Bello",
            phone: "08129994433",
            pickup: "Garki Area 2, Abuja",
            dropoff: "Maitama District, Abuja",
            details: "Medical equipment supplies (Urgent delivery)",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 98).toISOString(), note: "Booking submitted online" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 94).toISOString(), note: "Hospital desk signed delivery" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 98).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 94).toISOString()
        },
        {
            id: "OVO-88301",
            name: "Kayode Williams",
            phone: "08027776655",
            pickup: "Ikoyi Club 1938, Ikoyi, Lagos",
            dropoff: "Banana Island, Ikoyi, Lagos",
            details: "Architectural blueprints & contract documents",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 122).toISOString(), note: "Booking submitted online" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 118).toISOString(), note: "Recipient confirmed" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 122).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 118).toISOString()
        },
        {
            id: "OVO-19402",
            name: "Sandra Okon",
            phone: "09012228899",
            pickup: "Calabar Road, Calabar, Cross River",
            dropoff: "Marian Road, Calabar",
            details: "Artisan bakery gift hamper box",
            status: "Delivered",
            statusHistory: [
                { status: "Pending", timestamp: new Date(Date.now() - 3600000 * 146).toISOString(), note: "Booking submitted online" },
                { status: "Delivered", timestamp: new Date(Date.now() - 3600000 * 142).toISOString(), note: "Delivered in perfect condition" }
            ],
            createdAt: new Date(Date.now() - 3600000 * 146).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 142).toISOString()
        }
    ],
    metadata: {
        created: new Date().toISOString(),
        version: "1.0.0"
    }
};

// Helper to read DB
function readDb() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
            return initialSeed;
        }
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database file, resetting to initial seed:", err);
        return initialSeed;
    }
}

// Helper to write DB atomically
function writeDb(data) {
    try {
        const tempFile = `${DB_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
        fs.renameSync(tempFile, DB_FILE);
        return true;
    } catch (err) {
        console.error("Error writing to database:", err);
        return false;
    }
}

// Initialize on require
readDb();

const Database = {
    // Get all bookings with optional filtering
    getBookings(filters = {}) {
        const db = readDb();
        let results = [...(db.bookings || [])];

        if (filters.status && filters.status !== 'All') {
            results = results.filter(b => b.status.toLowerCase() === filters.status.toLowerCase());
        }

        if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(b => 
                (b.id && b.id.toLowerCase().includes(q)) ||
                (b.name && b.name.toLowerCase().includes(q)) ||
                (b.phone && b.phone.includes(q)) ||
                (b.pickup && b.pickup.toLowerCase().includes(q)) ||
                (b.dropoff && b.dropoff.toLowerCase().includes(q))
            );
        }

        // Sort latest first
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return results;
    },

    // Get single booking by ID
    getBookingById(id) {
        const db = readDb();
        return db.bookings.find(b => b.id.toUpperCase() === id.toUpperCase()) || null;
    },

    // Search by ID or Phone for tracking
    trackBooking(query) {
        if (!query) return null;
        const db = readDb();
        const cleanQuery = query.trim().toUpperCase();
        
        // Exact match on ID or phone match
        return db.bookings.find(b => 
            b.id.toUpperCase() === cleanQuery || 
            b.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
        ) || null;
    },

    // Create a new booking
    createBooking(payload) {
        const db = readDb();
        
        // Generate friendly random tracking code
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        const trackingId = `OVO-${randomDigits}`;

        const now = new Date().toISOString();
        const newBooking = {
            id: trackingId,
            name: payload.name ? payload.name.trim() : 'Anonymous',
            phone: payload.phone ? payload.phone.trim() : '',
            pickup: payload.pickup ? payload.pickup.trim() : '',
            dropoff: payload.dropoff ? payload.dropoff.trim() : '',
            details: payload.details ? payload.details.trim() : '',
            status: 'Pending',
            statusHistory: [
                {
                    status: 'Pending',
                    timestamp: now,
                    note: 'Delivery booking submitted online'
                }
            ],
            createdAt: now,
            updatedAt: now
        };

        db.bookings.unshift(newBooking);
        writeDb(db);
        return newBooking;
    },

    // Update booking status
    updateStatus(id, newStatus, note = '') {
        const db = readDb();
        const booking = db.bookings.find(b => b.id.toUpperCase() === id.toUpperCase());
        if (!booking) return null;

        const now = new Date().toISOString();
        booking.status = newStatus;
        booking.updatedAt = now;

        if (!booking.statusHistory) {
            booking.statusHistory = [];
        }

        booking.statusHistory.push({
            status: newStatus,
            timestamp: now,
            note: note || `Status updated to ${newStatus}`
        });

        writeDb(db);
        return booking;
    },

    // Delete a booking
    deleteBooking(id) {
        const db = readDb();
        const initialLen = db.bookings.length;
        db.bookings = db.bookings.filter(b => b.id.toUpperCase() !== id.toUpperCase());
        if (db.bookings.length !== initialLen) {
            writeDb(db);
            return true;
        }
        return false;
    },

    // Database statistics
    getStats() {
        const db = readDb();
        const total = db.bookings.length;
        const pending = db.bookings.filter(b => b.status === 'Pending').length;
        const pickedUp = db.bookings.filter(b => b.status === 'Picked Up').length;
        const inTransit = db.bookings.filter(b => b.status === 'In Transit').length;
        const delivered = db.bookings.filter(b => b.status === 'Delivered').length;

        return {
            total,
            pending,
            pickedUp,
            inTransit,
            delivered
        };
    }
};

module.exports = Database;
