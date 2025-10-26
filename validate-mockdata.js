#!/usr/bin/env node
// Validation script for mock-data.js
// Usage: node scripts/validate-mockdata.js
// This script requires js/mock-data.js to export the data object (module.exports)

const path = require('path');

let data;
try {
    // Adjust path as needed if you run this script from a different CWD
    data = require(path.join(__dirname, '..', 'js', 'mock-data.js'));
} catch (err) {
    console.error('ERROR: Could not load js/mock-data.js. Make sure the file exists and exports the data.');
    console.error(err.message);
    process.exit(1);
}

const { users = [], items = [], transactions = [] } = data;

// Helper to find duplicates by key
function findDuplicates(arr, key) {
    const map = new Map();
    for (const obj of arr) {
        const k = obj[key];
        if (map.has(k)) map.set(k, map.get(k) + 1);
        else map.set(k, 1);
    }
    return [...map.entries()].filter(([, count]) => count > 1).map(([k, count]) => ({ id: k, count }));
}

// 1) Duplicate ID checks
const duplicateUserIds = findDuplicates(users, 'id');
const duplicateItemIds = findDuplicates(items, 'id');
const duplicateTransactionIds = findDuplicates(transactions, 'id');

// 2) Category consistency report
const categoryCounts = items.reduce((acc, it) => {
    const c = it.category || 'undefined';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
}, {});

// 3) Items referencing non-existent userId
const userIds = new Set(users.map(u => u.id));
const itemsWithInvalidUser = items.filter(it => it.userId != null && !userIds.has(it.userId));

// 4) Transactions referencing non-existent itemId or userId
const itemIds = new Set(items.map(i => i.id));
const transactionIssues = transactions.filter(tx => {
    const badItem = tx.itemId != null && !itemIds.has(tx.itemId);
    const badUser = tx.userId != null && !userIds.has(tx.userId);
    return badItem || badUser;
});

console.log('Mock data validation report');
console.log('===========================');

if (duplicateUserIds.length) {
    console.log('\nDuplicate user IDs found:');
    console.table(duplicateUserIds);
} else {
    console.log('\nNo duplicate user IDs found.');
}

if (duplicateItemIds.length) {
    console.log('\nDuplicate item IDs found:');
    console.table(duplicateItemIds);
} else {
    console.log('\nNo duplicate item IDs found.');
}

if (duplicateTransactionIds.length) {
    console.log('\nDuplicate transaction IDs found:');
    console.table(duplicateTransactionIds);
} else {
    console.log('\nNo duplicate transaction IDs found.');
}

console.log('\nCategory summary (items):');
console.table(Object.entries(categoryCounts).map(([category, count]) => ({ category, count })));

if (itemsWithInvalidUser.length) {
    console.log('\nItems referencing non-existent userId:');
    console.table(itemsWithInvalidUser.map(i => ({ id: i.id, title: i.title, userId: i.userId })));
} else {
    console.log('\nAll items reference valid users (or have no userId).');
}

if (transactionIssues.length) {
    console.log('\nTransactions referencing non-existent itemId or userId:');
    console.table(transactionIssues.map(t => ({ id: t.id, itemId: t.itemId, userId: t.userId })));
} else {
    console.log('\nAll transactions reference valid items and users.');
}

console.log('\nValidation complete.');