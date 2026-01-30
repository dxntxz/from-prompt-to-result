// FROM PROMPT TO RESULT - Telegram Mini App
// Версия 1.0

const CONFIG = {
    appName: "FROM PROMPT TO RESULT",
    version: "1.0",
    telegramBot: "@toresfrpro",
    supportLink: "https://t.me/toresfrpro",
    
    products: [
        {
            id: "school_pack_v1",
            name: "🎓 FROM PROMPT TO RESULT: ШКОЛА",
            tagline: "26 промптов для учебы в школе",
            description: "Полный набор из 26 промптов для всех школьных предметов. Русский язык, математика, история, литература и другие. Версия 1.0",
            price: 299,
            features: [
                "26 готовых промптов",
                "Все основные школьные предметы",
                "Структура сочинений и эссе",
                "Анализ стихотворений",
                "Решение задач с объяснением",
                "Подготовка к устным ответам",
                "Идеи для школьных проектов"
            ],
            image: "assets/images/school-pack.png",
            demoPrompt: "Ты — эксперт по литературе...",
            includes: "HTML файл с 26 промптами",
            version: "1.0"
        },
        {
            id: "student_pack_v1", 
            name: "🎓 FROM PROMPT TO RESULT: УНИВЕРСИТЕТ",
            tagline: "30 промптов для студентов",
            description: "Профессиональные промпты для студентов университетов. Курсовые работы, дипломы, лабораторные, научные статьи. Версия 1.0",
            price: 399,
            features: [
                "30 промптов для вуза",
                "Написание курсовых работ",
                "Структура дипломов",
                "Оформление научных статей",
                "Презентации для защиты",
                "Анализ исследований",
                "Библиографические списки"
            ],
            image: "assets/images/student-pack.png",
            demoPrompt: "Ты — научный руководитель...",
            includes: "HTML файл с 30 промптами",
            version: "1.0"
        },
        {
            id: "presentation_pack_v1",
            name: "📊 FROM PROMPT TO RESULT: ПРЕЗЕНТАЦИИ",
            tagline: "20 промптов для создания презентаций",
            description: "Специализированные промпты для создания эффективных презентаций. Структура, дизайн, выступление, Canva/PPT. Версия 1.0",
            price: 349,
            features: [
                "20 промптов для презентаций",
                "Структура слайдов",
                "Дизайн-рекомендации",
                "Тексты для выступлений",
                "Работа с Canva и PowerPoint",
                "Инфографика и визуализация",
                "Питч-деки и защита проектов"
            ],
            image: "assets/images/presentation-pack.png",
            demoPrompt: "Ты — эксперт по презентациям...",
            includes: "HTML файл с 20 промптами",
            version: "1.0"
        }
    ],
    
    paymentMethods: [
        { id: "yoomoney", name: "ЮMoney / СБП", icon: "💳" },
        { id: "crypto", name: "Криптовалюта (USDT)", icon: "₿" },
        { id: "bank_card", name: "Банковская карта", icon: "💎" }
    ]
};

// Глобальные переменные
let tg = null;
let user = null;
let cart = [];
let isInitialized = false;

// Инициализация Telegram WebApp
function initTelegramApp() {
    if (typeof Telegram !== 'undefined') {
        tg = Telegram.WebApp;
        
        // Настройка WebApp
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#ffffff');
        
        // Получаем данные пользователя
        user = tg.initDataUnsafe?.user || {
            id: Date.now(),
            first_name: 'Покупатель',
            username: 'guest'
        };
        
        // Загружаем корзину из localStorage
        loadCart();
        
        // Настраиваем главную кнопку
        updateMainButton();
        
        // Отправляем событие загрузки
        tg.sendData(JSON.stringify({
            action: "app_loaded",
            app: "FROM PROMPT TO RESULT Store",
            version: CONFIG.version,
            user_id: user.id
        }));
        
        isInitialized = true;
        console.log("FROM PROMPT TO RESULT Store initialized");
    } else {
        console.warn("Telegram WebApp not available");
        // Режим разработки
        user = { id: 0, first_name: 'Developer', username: 'dev' };
        loadCart();
        isInitialized = true;
    }
}

// Загрузка корзины
function loadCart() {
    const saved = localStorage.getItem('fptr_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

// Сохранение корзины
function saveCart() {
    localStorage.setItem('fptr_cart', JSON.stringify(cart));
    updateMainButton();
}

// Обновление главной кнопки
function updateMainButton() {
    if (!tg) return;
    
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setText(`🛒 Корзина (${cart.length}) - ${total} ₽`);
        tg.MainButton.onClick = showCartSection;
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Показать раздел корзины
function showCartSection() {
    document.getElementById('cartSection').style.display = 'block';
    document.getElementById('productsSection').style.display = 'none';
    renderCart();
    tg.MainButton.hide();
    
    // Добавляем кнопку "Вернуться"
    const backBtn = document.createElement('button');
    backBtn.className = 'store-btn secondary';
    backBtn.textContent = '← НАЗАД К ТОВАРАМ';
    backBtn.onclick = showProductsSection;
    document.getElementById('cartSection').prepend(backBtn);
}

// Показать раздел товаров
function showProductsSection() {
    document.getElementById('productsSection').style.display = 'block';
    document.getElementById('cartSection').style.display = 'none';
    updateMainButton();
}

// Рендер товаров
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = CONFIG.products.map(product => `
        <div class="product-card">
            <div class="product-badge">${product.price} ₽</div>
            <div class="product-name">${product.name}</div>
            <div class="product-tagline" style="color:#666; font-size:12px; margin-bottom:10px;">
                ${product.tagline}
            </div>
            <div class="product-description">${product.description}</div>
            
            <ul class="product-features">
                ${product.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            
            <div style="margin: 15px 0; font-size: 11px; color: #999;">
                Версия: ${product.version} • Включает: ${product.includes}
            </div>
            
            <button onclick="addToCart('${product.id}')" class="store-btn">
                🛒 ДОБАВИТЬ В КОРЗИНУ
            </button>
            
            <button onclick="showDemo('${product.id}')" class="store-btn secondary">
                👁 ПРЕДПРОСМОТР ПРОМПТА
            </button>
        </div>
    `).join('');
}

// Добавить в корзину
function addToCart(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push({
        ...product,
        cartId: Date.now() + Math.random()
    });
    
    saveCart();
    showNotification(`${product.name} добавлен в корзину!`);
    
    if (tg) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Рендер корзины
function renderCart() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('totalPrice');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="store-loader">Корзина пуста</div>';
        if (totalElement) totalElement.textContent = '0';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.tagline}</small>
            </div>
            <div style="text-align: right;">
                <div>${item.price} ₽</div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#f00; font-size:12px; cursor:pointer; margin-top:5px;">
                    ❌ УДАЛИТЬ
                </button>
            </div>
        </div>
    `).join('');
    
    if (totalElement) totalElement.textContent = total;
}

// Удалить из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateMainButton();
    
    if (tg) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Показать демо промпта
function showDemo(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product || !tg) return;
    
    tg.showPopup({
        title: `Демо: ${product.name}`,
        message: `Пример промпта из этого набора:\n\n"${product.demoPrompt}"\n\nХотите увидеть больше? Приобретите полную версию!`,
        buttons: [
            {id: 'buy', type: 'default', text: '🛒 КУПИТЬ СЕЙЧАС'},
            {type: 'cancel', text: 'ЗАКРЫТЬ'}
        ]
    });
    
    tg.onEvent('popupButtonClicked', (btn) => {
        if (btn.id === 'buy') {
            addToCart(productId);
        }
    });
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    if (tg) {
        tg.showPopup({
            title: '💰 ОФОРМЛЕНИЕ ЗАКАЗА',
            message: `Сумма заказа: ${total} ₽\n\nВыберите способ оплаты:`,
            buttons: CONFIG.paymentMethods.map(method => ({
                id: method.id,
                type: 'default',
                text: `${method.icon} ${method.name}`
            })).concat([{type: 'cancel', text: 'ОТМЕНА'}])
        });
        
        tg.onEvent('popupButtonClicked', (btn) => {
            if (btn.id !== 'cancel') {
                processPayment(btn.id);
            }
        });
    } else {
        // Режим разработки
        alert(`Заказ на ${total} ₽\nВ реальном приложении здесь будет оплата`);
    }
}

// Обработка платежа
function processPayment(method) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Отправляем данные о заказе
    const orderData = {
        action: "create_order",
        user_id: user.id,
        products: cart.map(item => item.id),
        total: total,
        payment_method: method,
        timestamp: Date.now()
    };
    
    if (tg) {
        tg.sendData(JSON.stringify(orderData));
        showNotification('Заказ создан! Ожидайте инструкции по оплате в боте.');
        
        // Очищаем корзину после успешного заказа
        setTimeout(() => {
            cart = [];
            saveCart();
            showProductsSection();
        }, 2000);
    }
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'store-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем заголовок
    document.title = `FROM PROMPT TO RESULT Store v${CONFIG.version}`;
    
    // Рендерим продукты
    renderProducts();
    
    // Инициализируем Telegram App
    setTimeout(() => {
        initTelegramApp();
        
        // Если в корзине уже есть товары
        if (cart.length > 0) {
            renderCart();
        }
        
        // Показываем контент
        document.getElementById('loading').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        
    }, 500);
});

// Глобальные функции для кнопок
window.showDemo = showDemo;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.showCartSection = showCartSection;
window.showProductsSection = showProductsSection;