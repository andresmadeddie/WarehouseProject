// Warehouse Management Functions - Backend Version

// Open modal to add new warehouse
function openAddWarehouseModal() {
    openModal('addWarehouseModal');
}

// Add new warehouse to backend
async function addWarehouse() {
    // Get form values
    const name = document.getElementById('warehouseName').value.trim();
    const location = document.getElementById('warehouseLocation').value.trim();
    const capacity = parseInt(document.getElementById('warehouseCapacity').value);

    // Validate required fields
    if (!name || !location || !capacity) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    // Create new warehouse object
    const newWarehouse = {
        name,
        location,
        capacity,
        currentStock: 0
    };

    try {
        // Save to backend
        const response = await fetch(`${API_URL}/warehouses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newWarehouse)
        });

        if (!response.ok) {
            throw new Error('Failed to add warehouse');
        }

        const savedWarehouse = await response.json();
        warehouses.push(savedWarehouse);
        
        await addActivity('Warehouse Added', `${name} in ${location}`);
        renderWarehouses();
        renderDashboard();
        closeModal('addWarehouseModal');
        updateWarehouseSelects();

        showNotification('Warehouse added successfully!', 'success');

    } catch (error) {
        console.error('Error adding warehouse:', error);
        showNotification('Failed to add warehouse', 'error');
    }
}

// Open modal to edit existing warehouse
function editWarehouse(id) {
    const warehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === id.toString();
    });
    
    if (!warehouse) return;

    document.getElementById('editWarehouseId').value = warehouse._id || warehouse.id;
    document.getElementById('editWarehouseName').value = warehouse.name;
    document.getElementById('editWarehouseLocation').value = warehouse.location;
    document.getElementById('editWarehouseCapacity').value = warehouse.capacity;
    openModal('editWarehouseModal');
}

// Save edited warehouse to backend
async function saveWarehouseEdit() {
    const id = document.getElementById('editWarehouseId').value;
    const name = document.getElementById('editWarehouseName').value.trim();
    const location = document.getElementById('editWarehouseLocation').value.trim();
    const capacity = parseInt(document.getElementById('editWarehouseCapacity').value);

    const warehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === id.toString();
    });
    
    if (!warehouse) return;

    if (capacity < warehouse.currentStock) {
        showNotification(`Cannot reduce capacity below current stock (${warehouse.currentStock})`, 'warning');
        return;
    }

    warehouse.name = name;
    warehouse.location = location;
    warehouse.capacity = capacity;

    try {
        // Update in backend
        await fetch(`${API_URL}/warehouses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(warehouse)
        });

        await addActivity('Warehouse Updated', `${name} details modified`);
        renderWarehouses();
        renderDashboard();
        closeModal('editWarehouseModal');
        updateWarehouseSelects();

        showNotification('Warehouse updated successfully!', 'success');

    } catch (error) {
        console.error('Error updating warehouse:', error);
        showNotification('Failed to update warehouse', 'error');
    }
}

// Delete warehouse from backend
function deleteWarehouse(id) {
    const warehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === id.toString();
    });
    
    if (!warehouse) return;

    // Check if warehouse has inventory
    const hasInventory = inventory.some(item => item.warehouseId.toString() === id.toString());
    if (hasInventory) {
        showNotification('Cannot delete warehouse with existing inventory. Please transfer or remove all items first.', 'warning');
        return;
    }

    document.getElementById('confirmText').textContent = `Are you sure you want to delete "${warehouse.name}"?`;
    document.getElementById('confirmActionBtn').onclick = async () => {
        try {
            // Delete from backend
            await fetch(`${API_URL}/warehouses/${id}`, {
                method: 'DELETE'
            });

            warehouses = warehouses.filter(w => {
                const wId = w._id || w.id;
                return wId.toString() !== id.toString();
            });
            
            await addActivity('Warehouse Deleted', `${warehouse.name} removed`);
            renderWarehouses();
            renderDashboard();
            closeModal('confirmModal');
            updateWarehouseSelects();

            showNotification('Warehouse deleted successfully!', 'success');

        } catch (error) {
            console.error('Error deleting warehouse:', error);
            showNotification('Failed to delete warehouse', 'error');
        }
    };
    openModal('confirmModal');
}

// Render warehouse cards
function renderWarehouses() {
    const grid = document.getElementById('warehouseGrid');
    
    if (!grid) {
        console.error('Warehouse grid not found');
        return;
    }
    
    if (warehouses.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏢</div><p>No warehouses yet. Add your first warehouse to get started!</p></div>';
        return;
    }

    grid.innerHTML = warehouses.map(warehouse => {
        const usage = (warehouse.currentStock / warehouse.capacity) * 100;
        const usageClass = usage >= 90 ? 'danger' : usage >= 75 ? 'warning' : '';
        const itemCount = inventory.filter(item => item.warehouseId.toString() === (warehouse._id || warehouse.id).toString()).length;
        const warehouseId = warehouse._id || warehouse.id;

        return `
            <div class="warehouse-card">
                <div class="warehouse-header">
                    <div>
                        <div class="warehouse-name">${warehouse.name}</div>
                        <div class="warehouse-location">📍 ${warehouse.location}</div>
                    </div>
                    <div class="action-buttons">
                        <button class="icon-btn" onclick="editWarehouse('${warehouseId}')" title="Edit">✏️</button>
                        <button class="icon-btn danger" onclick="deleteWarehouse('${warehouseId}')" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="capacity-bar">
                    <div class="capacity-fill ${usageClass}" style="width: ${usage}%"></div>
                </div>
                <div class="capacity-text">
                    ${warehouse.currentStock.toLocaleString()} / ${warehouse.capacity.toLocaleString()} units (${usage.toFixed(1)}%)
                </div>
                <div style="margin-top: 12px; font-size: 14px; color: #6b7280;">
                    📦 ${itemCount} item types
                </div>
            </div>
        `;
    }).join('');
}

// Filter warehouses based on search
function filterWarehouses() {
    const search = document.getElementById('warehouseSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.warehouse-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(search) ? 'block' : 'none';
    });
}