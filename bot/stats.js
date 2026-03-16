const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data.json');

// Начальные данные
let stats = {
    users: [],
    orders: [],
    revenue: 0,
    confirmed: 0,
    pending: 0,
    lastUpdated: new Date().toISOString()
};

// Загрузить данные
function loadStats() {
    try {
        if (fs.existsSync(DATA_PATH)) {
            const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
            stats = { ...stats, ...data };
            console.log('📊 Статистика загружена');
        }
    } catch (error) {
        console.log('❌ Ошибка загрузки статистики:', error.message);
        saveStats();
    }
}

// Сохранить данные
function saveStats() {
    try {
        stats.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DATA_PATH, JSON.stringify(stats, null, 2), 'utf8');
        console.log('💾 Статистика сохранена');
    } catch (error) {
        console.log('❌ Ошибка сохранения:', error.message);
    }
}

// Добавить пользователя
function addUser(userId) {
    if (!stats.users.includes(userId)) {
        stats.users.push(userId);
        saveStats();
        console.log(`👤 Новый пользователь: ${userId}`);
    }
}

// Добавить заказ
function addOrder(userId, amount, items = []) {
    const order = {
        id: `order_${Date.now()}`,
        userId: userId,
        amount: amount,
        items: items,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    stats.orders.push(order);
    stats.pending++;
    stats.revenue += amount;
    saveStats();
    
    console.log(`📦 Новый заказ: ${amount}₽ от ${userId}`);
    return order.id;
}

// Подтвердить заказ
function confirmOrder(orderId) {
    const order = stats.orders.find(o => o.id === orderId);
    if (order && order.status === 'pending') {
        order.status = 'confirmed';
        order.confirmedAt = new Date().toISOString();
        
        stats.pending--;
        stats.confirmed++;
        saveStats();
        
        console.log(`✅ Заказ подтвержден: ${orderId}`);
        return true;
    }
    return false;
}

// Получить статистику
function getStats() {
    const today = new Date().toLocaleDateString('ru-RU');
    const todayOrders = stats.orders.filter(order => 
        new Date(order.date).toLocaleDateString('ru-RU') === today
    );
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.amount, 0);
    
    return {
        totalUsers: stats.users.length,
        totalOrders: stats.orders.length,
        totalRevenue: stats.revenue,
        confirmedOrders: stats.confirmed,
        pendingOrders: stats.pending,
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        lastUpdated: stats.lastUpdated
    };
}

// Получить заказы
function getOrders(status = 'all', limit = 10) {
    let filtered = stats.orders;
    if (status !== 'all') {
        filtered = stats.orders.filter(o => o.status === status);
    }
    return filtered.slice(-limit).reverse();
}

// Инициализация
loadStats();

module.exports = {
    loadStats,
    saveStats,
    addUser,
    addOrder,
    confirmOrder,
    getStats,
    getOrders
};