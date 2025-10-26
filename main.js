// Lost & Found Kenya - Main JavaScript File

// Mock data for demonstration
const mockData = {
    users: [
        { id: 1, name: "Sarah Wanjiku", email: "sarah@example.com", phone: "+254712345678", location: "Nairobi" },
        { id: 2, name: "James Kiprotich", email: "james@example.com", phone: "+254723456789", location: "Eldoret" },
        { id: 3, name: "Amina Hassan", email: "amina@example.com", phone: "+254734567890", location: "Mombasa" }
    ],
    
    items: [
        {
            id: 1,
            type: "lost",
            category: "lost-ids",
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
            category: "found-items",
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
            category: "lost-items",
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
            category: "found-ids",
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
    // Check for logged in user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Initialize search suggestions
    setupSearchSuggestions();
    
    // Load category counts
    updateCategoryCounts();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    // Login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    // Implementation for mobile menu
    console.log('Mobile menu toggled');
}

// Login modal functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    
    // Mock authentication
    const user = mockData.users.find(u => u.email === email);
    if (user && password) { // Simple validation
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        hideLoginModal();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && currentUser) {
        loginBtn.textContent = currentUser.name;
        loginBtn.onclick = function() {
            window.location.href = 'dashboard.html';
        };
    }
}

// Search functionality
function setupSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !suggestions) return;
    
    const sampleSuggestions = [
        'National ID', 'Student ID', 'Passport', 'Driving License',
        'iPhone', 'Samsung', 'Wallet', 'Keys', 'Bag', 'Laptop',
        'Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru'
    ];
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }
        
        const filtered = sampleSuggestions.filter(s => 
            s.toLowerCase().includes(value)
        );
        
        if (filtered.length > 0) {
            suggestions.innerHTML = filtered.map(s => 
                `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer" onclick="selectSuggestion('${s}')">${s}</div>`
            ).join('');
            suggestions.classList.remove('hidden');
        } else {
            suggestions.classList.add('hidden');
        }
    });
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('searchSuggestions');
    
    if (searchInput) {
        searchInput.value = suggestion;
    }
    if (suggestions) {
        suggestions.classList.add('hidden');
    }
    
    performSearch();
}

function handleSearchInput() {
    // Real-time search suggestions
    setupSearchSuggestions();
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    // Store search query for results page
    localStorage.setItem('searchQuery', query);
    
    // Redirect to search results page
    window.location.href = 'search-results.html';
}

// Category filtering
function filterCategory(category) {
    localStorage.setItem('selectedCategory', category);
    window.location.href = 'search-results.html';
}

// Update category counts
function updateCategoryCounts() {
    const categories = ['lost-ids', 'found-ids', 'lost-items', 'found-items'];
    
    categories.forEach(category => {
        const count = mockData.items.filter(item => item.category === category).length;
        const element = document.getElementById(category.replace('-', '') + 'Count');
        if (element) {
            element.textContent = `${count} items`;
        }
    });
}

// Load recent posts
function loadRecentPosts() {
    const recentPostsList = document.getElementById('recentPostsList');
    if (!recentPostsList) return;
    
    const recentItems = mockData.items.slice(0, 6);
    
    recentPostsList.innerHTML = recentItems.map(item => `
        <li class="splide__slide">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer" onclick="viewItem(${item.id})">
                <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${item.type.toUpperCase()}
                        </span>
                        <span class="text-sm text-gray-500">${item.location}</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed line-clamp-2">${item.description}</p>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-sm text-gray-500">${formatDate(item.date)}</span>
                        <button class="text-safaricom-green font-semibold hover:text-green-600 transition-colors">
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
        </li>
    `).join('');
    
    // Initialize Splide slider
    if (typeof Splide !== 'undefined') {
        new Splide('#recentPostsSlider', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            breakpoints: {
                768: { perPage: 1 },
                1024: { perPage: 2 }
            }
        }).mount();
    }
}

// View item details
function viewItem(itemId) {
    const item = mockData.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Store selected item for detail page
    localStorage.setItem('selectedItem', JSON.stringify(item));
    
    // Redirect to item detail page or show modal
    window.location.href = `search-results.html?item=${itemId}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Animate elements on page load
function animateElements() {
    // Animate hero text
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.hero-bg h1 span',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: anime.stagger(200),
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: '.category-card',
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }
}

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