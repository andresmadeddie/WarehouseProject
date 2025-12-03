// Inventory Management Functions - Backend Version

// Open modal to add new inventory item
function openAddItemModal() {
    if (warehouses.length === 0) {
        showNotification('Please add a warehouse first', 'warning');
        return;
    }
    updateWarehouseSelects();
    openModal('addItemModal');
}

// Add new inventory item to backend
async function addItem() {
    // Get form values
    const sku = document.getElementById('itemSku').value.trim();
    const name = document.getElementById('itemName').value.trim();
    const warehouseId = document.getElementById('itemWarehouse').value;
    const location = document.getElementById('itemLocation').value.trim();
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const description = document.getElementById('itemDescription').value.trim();

    // Validate required fields
    if (!sku || !name || !warehouseId || !location || !quantity) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    // Check for duplicate SKU in same warehouse
    const existingItem = inventory.find(item => item.sku === sku && item.warehouseId === warehouseId);
    if (existingItem) {
        const update = confirm(`Item with SKU "${sku}" already exists in this warehouse. Update quantity instead?`);
        if (update) {
            // Update existing item quantity
            existingItem.quantity += quantity;

            try {
                // Update item in backend
                await fetch(`${API_URL}/inventory/${existingItem._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(existingItem)
                });

                // Update warehouse stock
                await updateWarehouseStock(warehouseId, quantity);

                // Log activity
                await addActivity('Inventory Updated', `${sku} quantity increased by ${quantity}`);

                // Re-render UI
                renderInventory();
                renderWarehouses();
                renderDashboard();
                closeModal('addItemModal');

                showNotification('Item quantity updated successfully!', 'success');

            } catch (error) {
                console.error('Error updating item:', error);
                showNotification('Failed to update item quantity', 'error');
            }
        }
        return;
    }

    // Check warehouse capacity
    const warehouse = warehouses.find(w => w._id === warehouseId || w.id === warehouseId);
    if (warehouse.currentStock + quantity > warehouse.capacity) {
        showNotification(`Cannot add items. Warehouse capacity exceeded. Available space: ${warehouse.capacity - warehouse.currentStock} units`, 'warning');
        return;
    }

    // Create new item object
    const newItem = {
        sku,
        name,
        warehouseId,
        location,
        quantity,
        description
    };

    try {
        // Save new item to backend
        const response = await fetch(`${API_URL}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) {
            throw new Error('Failed to add item');
        }

        // Get saved item with generated ID
        const savedItem = await response.json();
        inventory.push(savedItem);

        // Update warehouse stock
        await updateWarehouseStock(warehouseId, quantity);

        // Log activity
        await addActivity('Item Added', `${name} (${sku}) added to inventory`);

        // Re-render UI
        renderInventory();
        renderWarehouses();
        renderDashboard();
        closeModal('addItemModal');

        showNotification('Item added to inventory successfully!', 'success');

    } catch (error) {
        console.error('Error adding item:', error);
        showNotification('Failed to add item to inventory', 'error');
    }
}

// Open modal to edit existing inventory item
function editItem(id) {
    // Find item by ID (handle both _id from MongoDB and id)
    const item = inventory.find(i => i._id === id || i.id === id);
    if (!item) return;

    // Populate form with current values
    document.getElementById('editItemId').value = item._id || item.id;
    document.getElementById('editItemSku').value = item.sku;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemLocation').value = item.location;
    document.getElementById('editItemQuantity').value = item.quantity;
    document.getElementById('editItemDescription').value = item.description || '';

    // Update warehouse dropdown and select current warehouse
    updateWarehouseSelects();
    document.getElementById('editItemWarehouse').value = item.warehouseId;

    openModal('editItemModal');
}

// Save edited inventory item to backend
async function saveItemEdit() {
    // Get item ID and find current item
    const id = document.getElementById('editItemId').value;
    const item = inventory.find(i => (i._id && i._id.toString() === id) || (i.id && i.id.toString() === id));
    if (!item) return;

    // Store old values for comparison
    const oldQuantity = item.quantity;
    const oldWarehouseId = item.warehouseId;

    // Get new values from form
    const newWarehouseId = document.getElementById('editItemWarehouse').value;
    const newQuantity = parseInt(document.getElementById('editItemQuantity').value);

    // Handle warehouse change
    if (oldWarehouseId !== newWarehouseId) {
        const newWarehouse = warehouses.find(w => w._id === newWarehouseId || w.id === newWarehouseId);

        // Check destination warehouse capacity
        if (newWarehouse.currentStock + newQuantity > newWarehouse.capacity) {
            showNotification(`Cannot move items. Target warehouse capacity exceeded.`, 'warning');
            return;
        }

        // Update both warehouse stocks
        await updateWarehouseStock(oldWarehouseId, -oldQuantity);
        await updateWarehouseStock(newWarehouseId, newQuantity);
    } else {
        // Only quantity changed - check capacity
        const diff = newQuantity - oldQuantity;
        const warehouse = warehouses.find(w => w._id === oldWarehouseId || w.id === oldWarehouseId);

        if (warehouse.currentStock + diff > warehouse.capacity) {
            showNotification(`Cannot increase quantity. Warehouse capacity exceeded. Available space: ${warehouse.capacity - warehouse.currentStock} units`, 'warning');
            return;
        }

        await updateWarehouseStock(oldWarehouseId, diff);
    }

    // Update item object with new values
    item.sku = document.getElementById('editItemSku').value.trim();
    item.name = document.getElementById('editItemName').value.trim();
    item.warehouseId = newWarehouseId;
    item.location = document.getElementById('editItemLocation').value.trim();
    item.quantity = newQuantity;
    item.description = document.getElementById('editItemDescription').value.trim();

    showNotification('Item updated successfully!', 'success');

    try {
        // Update item in backend
        const itemId = item._id || item.id;
        await fetch(`${API_URL}/inventory/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        // Log activity
        await addActivity('Item Updated', `${item.name} (${item.sku}) modified`);

        // Re-render UI
        renderInventory();
        renderWarehouses();
        renderDashboard();
        closeModal('editItemModal');

    } catch (error) {
        console.error('Error updating item:', error);
        showNotification('Failed to update item', 'error');
    }
}

// Delete inventory item from backend
function deleteItem(id) {
    // Find item by ID
    const item = inventory.find(i => (i._id && i._id.toString() === id.toString()) || (i.id && i.id.toString() === id.toString()));
    if (!item) return;

    // Show confirmation dialog
    document.getElementById('confirmText').textContent = `Are you sure you want to delete "${item.name}" (${item.sku})?`;

    // Set up delete action
    document.getElementById('confirmActionBtn').onclick = async () => {
        try {
            // Delete from backend
            const itemId = item._id || item.id;
            const response = await fetch(`${API_URL}/inventory/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // Update warehouse stock
            await updateWarehouseStock(item.warehouseId, -item.quantity);

            // Remove from local array
            inventory = inventory.filter(i => {
                const currentId = i._id || i.id;
                const deleteId = item._id || item.id;
                return currentId.toString() !== deleteId.toString();
            });

            // Log activity
            await addActivity('Item Deleted', `${item.name} (${item.sku}) removed`);

            // Re-render UI
            renderInventory();
            renderWarehouses();
            renderDashboard();
            closeModal('confirmModal');

            showNotification('Item deleted successfully!', 'success');

        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('Failed to delete item', 'error');
            closeModal('confirmModal');
        }
    };

    openModal('confirmModal');
}

// Render inventory table with all items
function renderInventory() {
    const tbody = document.getElementById('inventoryTable');

    // Show empty state if no items
    if (inventory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No inventory items yet. Add your first item to get started!</td></tr>';
        return;
    }

    // Generate table rows for each item
    tbody.innerHTML = inventory.map(item => {
        // Find warehouse for this item
        const warehouse = warehouses.find(w => {
            const warehouseId = w._id || w.id;
            return warehouseId === item.warehouseId || warehouseId.toString() === item.warehouseId.toString();
        });

        // Get item ID (handle both _id and id)
        const itemId = item._id || item.id;

        return `
            <tr>
                <td><strong>${item.sku}</strong></td>
                <td>${item.name}</td>
                <td>${warehouse ? warehouse.name : 'Unknown'}</td>
                <td>${item.location}</td>
                <td>${item.quantity.toLocaleString()}</td>
                <td>${item.description || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn" onclick="editItem('${itemId}')" title="Edit">✏️</button>
                        <button class="icon-btn danger" onclick="deleteItem('${itemId}')" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter inventory based on search and warehouse filter
function filterInventory() {
    // Get filter values
    const search = document.getElementById('inventorySearch').value.toLowerCase();
    const warehouseFilter = document.getElementById('warehouseFilter').value;

    // Filter table rows
    const rows = document.querySelectorAll('#inventoryTable tr');
    rows.forEach(row => {
        // Skip if this is the empty state row
        if (row.querySelector('.icon-btn') === null) {
            return;
        }

        // Get row text for search matching
        const text = row.textContent.toLowerCase();

        // Extract item ID from edit button
        const editBtn = row.querySelector('.icon-btn');
        const onclickAttr = editBtn.getAttribute('onclick');
        const itemIdMatch = onclickAttr.match(/editItem\(['"](.+?)['"]\)/);
        const itemId = itemIdMatch ? itemIdMatch[1] : null;

        // Find item in inventory
        const item = inventory.find(i => {
            const id = i._id || i.id;
            return id.toString() === itemId;
        });

        // Check search match
        const matchesSearch = text.includes(search);

        // Check warehouse filter match - handle both ObjectId and string
        let matchesWarehouse = !warehouseFilter;
        if (warehouseFilter && item) {
            const itemWarehouseId = item.warehouseId._id || item.warehouseId;
            matchesWarehouse = itemWarehouseId.toString() === warehouseFilter.toString();
        }

        // Show/hide row based on filters
        row.style.display = (matchesSearch && matchesWarehouse) ? '' : 'none';
    });
}