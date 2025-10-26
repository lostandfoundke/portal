// Lost & Found Kenya - Main JavaScript File

// Use shared mock data if present (fallback safely)
let mockData = {
    users: [],
    items: [],
    transactions: []
};

(function loadSharedMock() {
    try {
        if (typeof window !== 'undefined' && window.mockData) {
            mockData = window.mockData;
        } else if (typeof require === 'function') {
            // Node / build-time fallback (useful for scripts)
            // try requiring the shared mock file (relative path from this file)
            // adjust path if you move files around.
            // This require is wrapped in try/catch so runtime in browser won't break.
            // eslint-disable-next-line global-require
            const nodeMock = require('./js/mock-data.js');
            if (nodeMock) mockData = nodeMock;
        }
    } catch (err) {
        console.warn('Shared mock data not found, using empty defaults.', err);
    }
})();

// Global variables
let currentUser = null;
let searchResults = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadRecentPosts();
    animateElements();
});

// Initialize application
function initializeApp() {
    // ... rest of existing initializeApp implementation ...
}

// (rest of main.js continues unchanged)
// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// M-Pesa payment simulation
function initiatePayment(itemId, amount = 20) {
    return new Promise((resolve, reject) => {
        showNotification('Initiating M-Pesa payment...', 'info');
        
        // Simulate M-Pesa STK Push
        setTimeout(() => {
            // Simulate payment success (80% success rate)
            if (Math.random() > 0.2) {
                const transaction = {
                    id: Date.now(),
                    amount: amount,
                    itemId: itemId,
                    status: 'completed',
                    timestamp: new Date().toISOString()
                };
                
                mockData.transactions.push(transaction);
                localStorage.setItem('transaction', JSON.stringify(transaction));
                
                showNotification(`M-Pesa payment of Ksh. ${amount} successful!`, 'success');
                resolve(transaction);
            } else {
                showNotification('M-Pesa payment failed. Please try again.', 'error');
                reject(new Error('Payment failed'));
            }
        }, 3000);
    });
}

// Admin functions (restricted access)
function isAdmin() {
    return currentUser && currentUser.email === 'moneymaker9767@gmail.com';
}

// Export functions for use in other pages
window.LostFoundApp = {
    mockData,
    currentUser,
    showNotification,
    initiatePayment,
    formatDate,
    isAdmin,
    filterCategory,
    viewItem
};

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}