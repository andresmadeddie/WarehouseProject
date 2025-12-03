// Main Application Initialization

// Wait for DOM to fully load before initializing application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();        // Load data from backend (async)
        updateWarehouseSelects(); // Populate dropdowns after data loads
        setupEventListeners();   // Attach event handlers to interactive elements
        renderDashboard();       // Display dashboard statistics and alerts
        renderWarehouses();      // Populate warehouse grid with current data
        renderInventory();       // Populate inventory table with current data
        renderTransfers();       // Populate transfer history table
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Failed to load application. Please check console for errors.');
    }
});

// Configure event listeners for user interactions
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tab buttons
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            // Hide all tab content sections
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            // Activate clicked tab button
            tab.classList.add('active');
            // Show corresponding tab content using data-tab attribute
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Search and filter functionality
    const warehouseSearch = document.getElementById('warehouseSearch');
    const inventorySearch = document.getElementById('inventorySearch');
    const warehouseFilter = document.getElementById('warehouseFilter');

    if (warehouseSearch && typeof filterWarehouses === 'function') {
        warehouseSearch.addEventListener('input', filterWarehouses);
    }
    if (inventorySearch && typeof filterInventory === 'function') {
        inventorySearch.addEventListener('input', filterInventory);
    }
    if (warehouseFilter && typeof filterInventory === 'function') {
        warehouseFilter.addEventListener('change', filterInventory);
    }

    // Button click handlers - Warehouse
    const addWarehouseBtn = document.getElementById('addWarehouseBtn');
    const confirmAddWarehouse = document.getElementById('confirmAddWarehouse');
    const confirmEditWarehouse = document.getElementById('confirmEditWarehouse');

    if (addWarehouseBtn && typeof openAddWarehouseModal === 'function') {
        addWarehouseBtn.addEventListener('click', openAddWarehouseModal);
    }
    if (confirmAddWarehouse && typeof addWarehouse === 'function') {
        confirmAddWarehouse.addEventListener('click', addWarehouse);
    }
    if (confirmEditWarehouse && typeof saveWarehouseEdit === 'function') {
        confirmEditWarehouse.addEventListener('click', saveWarehouseEdit);
    }

    // Button click handlers - Inventory
    const addItemBtn = document.getElementById('addItemBtn');
    const confirmAddItem = document.getElementById('confirmAddItem');
    const confirmEditItem = document.getElementById('confirmEditItem');

    if (addItemBtn && typeof openAddItemModal === 'function') {
        addItemBtn.addEventListener('click', openAddItemModal);
    }
    if (confirmAddItem && typeof addItem === 'function') {
        confirmAddItem.addEventListener('click', addItem);
    }
    if (confirmEditItem && typeof saveItemEdit === 'function') {
        confirmEditItem.addEventListener('click', saveItemEdit);
    }

    // Button click handlers - Transfer
    const newTransferBtn = document.getElementById('newTransferBtn');
    const confirmTransfer = document.getElementById('confirmTransfer');
    const transferItem = document.getElementById('transferItem');

    if (newTransferBtn && typeof openTransferModal === 'function') {
        newTransferBtn.addEventListener('click', openTransferModal);
    }
    if (confirmTransfer && typeof executeTransfer === 'function') {
        confirmTransfer.addEventListener('click', executeTransfer);
    }
    if (transferItem && typeof updateTransferWarehouses === 'function') {
        transferItem.addEventListener('change', updateTransferWarehouses);
    }

    // Modal close buttons - using data attributes
    document.querySelectorAll('.modal-close, [data-action="cancel"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && typeof closeModal === 'function') {
                closeModal(modal.id);
            }
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && typeof closeModal === 'function') {
                closeModal(modal.id);
            }
        });
    });
}