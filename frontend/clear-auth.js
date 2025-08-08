// Script to clear authentication data from localStorage
// Run this in the browser console to clear stored tokens

console.log('Clearing authentication data...');

// Clear all localStorage
localStorage.clear();

// Or specifically clear auth-related items
// localStorage.removeItem('token');
// localStorage.removeItem('user');

console.log('Authentication data cleared!');
console.log('Please refresh the page to see the login screen.');

// Optional: Refresh the page automatically
// window.location.reload(); 