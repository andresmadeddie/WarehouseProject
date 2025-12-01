// Data Management - Backend Version

// Base API URL - adjust to match your server
const API_URL = 'http://localhost:3000/api';

// Data storage - populated from backend
let warehouses = [];
let inventory = [];
let transfers = [];
let activityLog = [];

// Load data from backend
async function loadData() {
    try {
        console.log('Loading data from backend...');
        
        // Fetch all data from backend
        const [warehousesRes, inventoryRes, transfersRes, activityRes] = await Promise.all([
            fetch(`${API_URL}/warehouses`),
            fetch(`${API_URL}/inventory`),
            fetch(`${API_URL}/transfers`),
            fetch(`${API_URL}/activity`)
        ]);

        // Check if all requests were successful
        if (!warehousesRes.ok || !inventoryRes.ok || !transfersRes.ok || !activityRes.ok) {
            throw new Error('Failed to fetch data from server');
        }

        warehouses = await warehousesRes.json();
        inventory = await inventoryRes.json();
        transfers = await transfersRes.json();
        activityLog = await activityRes.json();

        console.log('Data loaded successfully:', {
            warehouses: warehouses.length,
            inventory: inventory.length,
            transfers: transfers.length,
            activities: activityLog.length
        });

    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Failed to load data from server. Make sure the backend is running.', error);
    }
}

// Add activity to log - saves to backend
async function addActivity(action, details) {
    const activity = {
        action,
        details,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_URL}/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });

        if (!response.ok) {
            throw new Error('Failed to save activity');
        }

        const savedActivity = await response.json();
        activityLog.unshift(savedActivity);
        if (activityLog.length > 50) activityLog.pop();

    } catch (error) {
        console.error('Error saving activity:', error);
    }
}

// Update warehouse stock - updates backend
async function updateWarehouseStock(warehouseId, quantity) {
    const warehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === warehouseId.toString();
    });
    
    if (warehouse) {
        warehouse.currentStock += quantity;
        
        try {
            const warehouseIdStr = warehouse._id || warehouse.id;
            const response = await fetch(`${API_URL}/warehouses/${warehouseIdStr}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse)
            });

            if (!response.ok) {
                throw new Error('Failed to update warehouse stock');
            }
        } catch (error) {
            console.error('Error updating warehouse stock:', error);
        }
    }
}

// Update warehouse selects in forms
function updateWarehouseSelects() {
    const selects = ['itemWarehouse', 'editItemWarehouse'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select warehouse...</option>' +
                warehouses.map(w => {
                    const wId = w._id || w.id;
                    return `<option value="${wId}">${w.name} - ${w.location}</option>`;
                }).join('');
        }
    });

    const filterSelect = document.getElementById('warehouseFilter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">All Warehouses</option>' +
            warehouses.map(w => {
                const wId = w._id || w.id;
                return `<option value="${wId}">${w.name}</option>`;
            }).join('');
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Reset forms
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Custom notification function to replace alert()
function showNotification(message, type = 'info') {
    const notification = document.getElementById('customNotification');
    const icon = document.getElementById('notificationIcon');
    const messageEl = document.getElementById('notificationMessage');
    
    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    icon.textContent = icons[type] || icons.info;
    messageEl.textContent = message;
    
    // Remove previous type classes
    notification.classList.remove('success', 'error', 'warning', 'info');
    // Add new type class
    notification.classList.add(type, 'show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.animation = '';
        }, 300);
    }, 3000);
}

// Optional(in dev): Create a confirm dialog replacement
function showConfirm(message, onConfirm, onCancel) {
    const confirmText = document.getElementById('confirmText');
    confirmText.textContent = message;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    // Remove old event listeners by cloning
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.onclick = () => {
        if (onConfirm) onConfirm();
        closeModal('confirmModal');
    };
    
    openModal('confirmModal');
}