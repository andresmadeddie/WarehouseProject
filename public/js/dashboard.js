// Dashboard Functions

function renderDashboard() {
    const totalWarehouses = warehouses.length;
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const avgCapacity = warehouses.length > 0
        ? (warehouses.reduce((sum, w) => sum + (w.currentStock / w.capacity * 100), 0) / warehouses.length).toFixed(1)
        : 0;

    const alerts = getAlerts();

    document.getElementById('totalWarehouses').textContent = totalWarehouses;
    document.getElementById('totalItems').textContent = totalItems.toLocaleString();
    document.getElementById('avgCapacity').textContent = avgCapacity + '%';
    document.getElementById('totalAlerts').textContent = alerts.length;

    // Render alerts
    const alertsContainer = document.getElementById('alertsContainer');
    if (alerts.length > 0) {
        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <span>${alert.icon}</span>
                <div>
                    <strong>${alert.title}</strong>
                    <div>${alert.message}</div>
                </div>
            </div>
        `).join('');
    } else {
        alertsContainer.innerHTML = '';
    }

    // Render activity log
    renderActivityLog();
}

function getAlerts() {
    const alerts = [];
    warehouses.forEach(warehouse => {
        const usage = (warehouse.currentStock / warehouse.capacity) * 100;
        if (usage >= 90) {
            alerts.push({
                type: 'danger',
                icon: '🚨',
                title: 'Critical Capacity',
                message: `${warehouse.name} is at ${usage.toFixed(1)}% capacity`
            });
        } else if (usage >= 75) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                title: 'High Capacity',
                message: `${warehouse.name} is at ${usage.toFixed(1)}% capacity`
            });
        }
    });
    return alerts;
}

function renderActivityLog() {
    const activityLogEl = document.getElementById('activityLog');
    if (activityLog.length > 0) {
        activityLogEl.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activityLog.slice(0, 10).map(log => `
                            <tr>
                                <td>${new Date(log.timestamp).toLocaleString()}</td>
                                <td>${log.action}</td>
                                <td>${log.details}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        activityLogEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No activity yet</p></div>';
    }
}