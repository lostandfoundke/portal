// Unified mock data shared across pages (browser + Node compatible)
//
// Add <script src="js/mock-data.js"></script> before main.js in your HTML pages
// Node: require('./js/mock-data.js') will return the data object.

(function (root) {
    const MOCK_DATA = {
        users: [
            { id: 1, name: "Sarah Wanjiku", email: "sarah@example.com", phone: "+254712345678", location: "Nairobi" },
            { id: 2, name: "James Kiprotich", email: "james@example.com", phone: "+254723456789", location: "Eldoret" },
            { id: 3, name: "Amina Hassan", email: "amina@example.com", phone: "+254734567890", location: "Mombasa" }
        ],

        // Items - canonical list used across main and admin pages
        items: [
            {
                id: 1,
                type: "lost",
                category: "ids",
                title: "National ID Card - John Doe",
                description: "National ID card found near CBD bus station. Name visible: John Doe Kiprotich.",
                location: "Nairobi CBD",
                date: "2024-10-24",
                contact: "+254712345678",
                image: "resources/lost-items-collection.jpg",
                status: "active",
                userId: 1
            },
            {
                id: 2,
                type: "found",
                category: "wallets",
                title: "Black Wallet - Leather",
                description: "Black leather wallet found at Kenyatta University. Contains cash and cards.",
                location: "Kenyatta University",
                date: "2024-10-23",
                contact: "+254723456789",
                image: "resources/lost-items-collection.jpg",
                status: "active",
                userId: 2
            },
            {
                id: 3,
                type: "lost",
                category: "phones",
                title: "iPhone 14 Pro - Blue",
                description: "Lost iPhone 14 Pro blue color near Sarit Centre. Has a cracked screen protector.",
                location: "Westlands",
                date: "2024-10-22",
                contact: "+254734567890",
                image: "resources/lost-items-collection.jpg",
                status: "active",
                userId: 3
            },
            {
                id: 4,
                type: "found",
                category: "ids",
                title: "Student ID - University of Nairobi",
                description: "University of Nairobi student ID found. Name: Sarah Wanjiku Mwangi.",
                location: "University Way",
                date: "2024-10-21",
                contact: "+254712345678",
                image: "resources/lost-items-collection.jpg",
                status: "active",
                userId: 1
            }
        ],

        transactions: [
            { id: 1, amount: 20, type: "payment", status: "completed", userId: 1, itemId: 2 },
            { id: 2, amount: 20, type: "payment", status: "completed", userId: 2, itemId: 1 }
        ]
    };

    // Expose in browser
    if (typeof window !== 'undefined') {
        window.mockData = MOCK_DATA;
    }

    // Export for Node usage (validation script)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MOCK_DATA;
    }

    // Return for IIFE
    return MOCK_DATA;
})(this);