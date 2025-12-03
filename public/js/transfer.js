// Transfer Management Functions - Backend Version

// Open modal to create new transfer
function openTransferModal() {
    if (inventory.length === 0) {
        showNotification('No items available to transfer', 'info');
        return;
    }

    const selectEl = document.getElementById('transferItem');
    selectEl.innerHTML = '<option value="">Select an item...</option>' +
        inventory.map(item => {
            const itemId = item._id || item.id;
            const warehouse = warehouses.find(w => {
                const wId = w._id || w.id;
                const itemWId = item.warehouseId;
                return wId.toString() === itemWId.toString();
            });
            return `<option value="${itemId}">${item.name} (${item.sku}) - ${warehouse ? warehouse.name : 'Unknown'}</option>`;
        }).join('');

    openModal('transferModal');
}

// Update warehouse dropdowns when item is selected
function updateTransferWarehouses() {
    const itemId = document.getElementById('transferItem').value;
    if (!itemId) return;

    const item = inventory.find(i => {
        const iId = i._id || i.id;
        return iId.toString() === itemId.toString();
    });

    if (!item) return;

    const sourceWarehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === item.warehouseId.toString();
    });

    document.getElementById('transferFrom').value = sourceWarehouse ? sourceWarehouse.name : 'Unknown';
    document.getElementById('transferMaxQty').textContent = `Max: ${item.quantity} units`;

    const toSelect = document.getElementById('transferTo');
    toSelect.innerHTML = '<option value="">Select destination...</option>' +
        warehouses
            .filter(w => {
                const wId = w._id || w.id;
                return wId.toString() !== item.warehouseId.toString();
            })
            .map(w => {
                const wId = w._id || w.id;
                return `<option value="${wId}">${w.name}</option>`;
            })
            .join('');
}

// Execute transfer between warehouses
async function executeTransfer() {
    const itemId = document.getElementById('transferItem').value;
    const toWarehouseId = document.getElementById('transferTo').value;
    const quantity = parseInt(document.getElementById('transferQuantity').value);

    if (!itemId || !toWarehouseId || !quantity) {
        showNotification('Please fill all fields', 'warning');
        return;
    }

    // Find item using _id or id
    const item = inventory.find(i => {
        const iId = i._id || i.id;
        return iId.toString() === itemId.toString();
    });

    if (!item) {
        showNotification('Item not found', 'info');
        return;
    }

    if (quantity > item.quantity) {
        showNotification(`Cannot transfer more than available quantity (${item.quantity})`, 'warning');
        return;
    }

    // Find destination warehouse using _id or id
    const toWarehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === toWarehouseId.toString();
    });

    if (!toWarehouse) {
        showNotification('Destination warehouse not found', 'error');
        return;
    }

    if (toWarehouse.currentStock + quantity > toWarehouse.capacity) {
        showNotification(`Cannot transfer. Destination warehouse capacity exceeded. Available space: ${toWarehouse.capacity - toWarehouse.currentStock} units`, 'warning');
        return;
    }

    // Find source warehouse
    const fromWarehouse = warehouses.find(w => {
        const wId = w._id || w.id;
        return wId.toString() === item.warehouseId.toString();
    });

    const transferData = {
        itemId: item._id || item.id,
        itemName: item.name,
        fromWarehouseId: item.warehouseId,
        from: fromWarehouse.name,
        toWarehouseId: toWarehouseId,
        to: toWarehouse.name,
        quantity: quantity,
        date: new Date().toISOString()
    };

    try {
        // Create transfer record in backend
        const response = await fetch(`${API_URL}/transfers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transferData)
        });

        if (!response.ok) {
            throw new Error('Failed to create transfer');
        }

        const result = await response.json();

        // Check if item already exists in destination warehouse
        const existingItem = inventory.find(i =>
            i.sku === item.sku && i.warehouseId.toString() === toWarehouseId.toString()
        );

        if (existingItem) {
            // Update existing item quantity
            existingItem.quantity += quantity;
            const existingItemId = existingItem._id || existingItem.id;
            await fetch(`${API_URL}/inventory/${existingItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(existingItem)
            });
        } else {
            // Create new item in destination warehouse
            const newItem = {
                sku: item.sku,
                name: item.name,
                warehouseId: toWarehouseId,
                location: item.location,
                quantity: quantity,
                description: item.description
            };
            const newItemResponse = await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            const savedItem = await newItemResponse.json();
            inventory.push(savedItem);
        }

        // Update or delete source item
        item.quantity -= quantity;
        const sourceItemId = item._id || item.id;

        if (item.quantity === 0) {
            await fetch(`${API_URL}/inventory/${sourceItemId}`, {
                method: 'DELETE'
            });
            inventory = inventory.filter(i => {
                const iId = i._id || i.id;
                return iId.toString() !== sourceItemId.toString();
            });
        } else {
            await fetch(`${API_URL}/inventory/${sourceItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }

        // Update warehouse stocks
        await updateWarehouseStock(item.warehouseId, -quantity);
        await updateWarehouseStock(toWarehouseId, quantity);

        // Add to local transfers array
        transfers.push(result);

        // Log activity
        await addActivity('Transfer Completed', `${quantity} units of ${item.name} from ${fromWarehouse.name} to ${toWarehouse.name}`);

        // Re-render UI
        renderInventory();
        renderWarehouses();
        renderTransfers();
        renderDashboard();
        closeModal('transferModal');

        showNotification('transfer successful!', 'success');

    } catch (error) {
        console.error('Error executing transfer:', error);
        showNotification('Failed to execute transfer', 'error');
    }
}

// Render transfer history table
function renderTransfers() {
    const tbody = document.getElementById('transferHistory');

    if (!tbody) {
        console.error('Transfer history table body not found');
        return;
    }

    if (transfers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No transfers yet</td></tr>';
        return;
    }

    tbody.innerHTML = transfers.slice().reverse().map(transfer => `
        <tr>
            <td>${new Date(transfer.date).toLocaleDateString()}</td>
            <td>${transfer.itemName}</td>
            <td>${transfer.from}</td>
            <td>${transfer.to}</td>
            <td>${transfer.quantity}</td>
            <td><span class="badge badge-success">Completed</span></td>
        </tr>
    `).join('');
}