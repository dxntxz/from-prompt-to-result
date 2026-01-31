// FROM PROMPT TO RESULT - Telegram Mini App
// Версия 1.0

console.log("APP.JS ЗАГРУЖЕН!");

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
            price: 349,
            features: [
                "26 готовых промптов",
                "Все основные школьные предметы",
                "Структура сочинений и эссе",
                "Анализ стихотворений",
                "Решение задач с объяснением",
                "Подготовка к устным ответам",
                "Идеи для школьных проектов"
            ],
            image: "",
            demoPrompt: "Ты — эксперт по литературе и талантливый редактор. Мне нужно написать сочинение на тему \"{ТЕМА}\" для {КЛАСС} класса. Основная мысль: {ОСНОВНАЯ МЫСЛЬ}. Предложи четкую структуру (введение, аргументы, вывод), 3 сильных аргумента с примерами из произведения \"{НАЗВАНИЕ ПРОИЗВЕДЕНИЯ}\" и клишированные фразы для связки частей. Объём: {КОЛИЧЕСТВО} слов.",
            includes: "HTML файл с 26 промптами",
            version: "1.0"
        },
        {
            id: "student_pack_v1", 
            name: "🎓 FROM PROMPT TO RESULT: УНИВЕРСИТЕТ",
            tagline: "30 промптов для студентов",
            description: "Профессиональные промпты для студентов университетов. Курсовые работы, дипломы, лабораторные, научные статьи. Версия 1.0",
            price: 349,
            features: [
                "30 промптов для вуза",
                "Написание курсовых работ",
                "Структура дипломов",
                "Оформление научных статей",
                "Презентации для защиты",
                "Анализ исследований",
                "Библиографические списки"
            ],
            image: "",
            demoPrompt: "Ты — научный руководитель с 10-летним опытом. Помоги структурировать курсовую работу по теме \"{ТЕМА}\". Нужно: 1) Определить актуальность темы, 2) Сформулировать цель и задачи, 3) Предложить план из 3 глав с подпунктами, 4) Дать рекомендации по источникам (не старше 5 лет). Объём: 25-30 страниц.",
            includes: "HTML файл с 30 промптами",
            version: "1.0"
        },
        {
            id: "presentation_pack_v1",
            name: "📊 FROM PROMPT TO RESULT: ПРЕЗЕНТАЦИИ",
            tagline: "20 промптов для создания презентаций",
            description: "Специализированные промпты для создания эффективных презентаций. Структура, дизайн, выступление, Canva/PPT. Версия 1.0",
            price: 449,
            features: [
                "20 промптов для презентаций",
                "Структура слайдов",
                "Дизайн-рекомендации",
                "Тексты для выступлений",
                "Работа с Canva и PowerPoint",
                "Инфографика и визуализация",
                "Питч-деки и защита проектов"
            ],
            image: "",
            demoPrompt: "Ты — эксперт по презентациям и публичным выступлениям. Помоги создать презентацию на тему \"{ТЕМА}\". Нужно: 1) Определить целевую аудиторию, 2) Предложить структуру из 10 слайдов, 3) Дать советы по визуальному оформлению (цвета, шрифты, изображения), 4) Написать тексты для ключевых слайдов. Для защиты проекта в университете.",
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
let currentPreviewProduct = null;

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

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
    updateCartBadge();
}

// Обновить счетчики корзины
function updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    const iconBadge = document.getElementById('cartIconBadge');
    const cartButton = document.querySelector('.cart-button');
    
    if (iconBadge) {
        iconBadge.textContent = cart.length;
        iconBadge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
    
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Обновление главной кнопки Telegram
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

// Инициализация Telegram
function initTelegramApp() {
    if (typeof Telegram !== 'undefined') {
        tg = Telegram.WebApp;
        tg.expand();
        user = tg.initDataUnsafe?.user || { id: Date.now(), first_name: 'Покупатель' };
    } else {
        user = { id: 0, first_name: 'Developer' };
    }
    loadCart();
    isInitialized = true;
}

// ==================== РЕНДЕР ТОВАРОВ ====================

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) {
        console.error("Container #productsContainer not found!");
        return;
    }
    
    console.log("Рендерю товары...", CONFIG.products.length);
    
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
    
    console.log("Товары отрендерены!");
}

// ==================== КОРЗИНА ====================

function showCartSection() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        renderCart();
        document.body.style.overflow = 'hidden';
    }
}

function showProductsSection() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function renderCart() {
    const container = document.getElementById('cartItemsModal');
    const totalElement = document.getElementById('totalPriceModal');
    
    if (!container) {
        console.error("Контейнер корзины не найден!");
        return;
    }
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">🛒</div>
                <h3 style="margin-bottom: 10px;">Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
            </div>
        `;
        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item-modal">
            <div class="cart-item-info-modal">
                <div class="cart-item-name-modal">${item.name}</div>
                <div class="cart-item-desc-modal">${item.tagline}</div>
            </div>
            <div style="text-align: right;">
                <div class="cart-item-price-modal">${item.price} ₽</div>
                <button onclick="removeFromCart(${index})" class="cart-item-remove-modal">
                    ❌ Удалить
                </button>
            </div>
        </div>
    `).join('');
    
    if (totalElement) totalElement.textContent = `${total} ₽`;
}

function addToCart(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push({
        ...product,
        cartId: Date.now() + Math.random()
    });
    
    saveCart();
    showNotification(`${product.name} добавлен в корзину!`);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('fptr_cart');
    showNotification('Корзина очищена!');
    showProductsSection();
    updateCartBadge();
}

// ==================== ПРЕДПРОСМОТР ====================

function showDemo(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) return;
    
    currentPreviewProduct = product;
    
    document.getElementById('previewTitle').textContent = `ПРЕДПРОСМОТР: ${product.name}`;
    document.getElementById('previewProductName').textContent = product.name;
    document.getElementById('previewPrice').textContent = `${product.price} ₽`;
    document.getElementById('previewPromptText').value = product.demoPrompt;
    
    const featuresList = document.getElementById('previewFeatures');
    if (featuresList) {
        featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
    }
    
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
    currentPreviewProduct = null;
}

function copyPreviewPrompt() {
    const textarea = document.getElementById('previewPromptText');
    if (!textarea) return;
    
    textarea.select();
    try {
        navigator.clipboard.writeText(textarea.value);
        showNotification('Промпт скопирован!');
    } catch (err) {
        document.execCommand('copy');
        showNotification('Промпт скопирован!');
    }
}

function addToCartFromPreview() {
    if (!currentPreviewProduct) return;
    addToCart(currentPreviewProduct.id);
    closePreview();
}

// ==================== ЗАКАЗ ====================

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Заказ на ${total} ₽\nВ реальном приложении здесь будет оплата`);
}

// ==================== УТИЛИТЫ ====================

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

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

function initializeApp() {
    console.log("Инициализация приложения...");
    document.title = `FROM PROMPT TO RESULT Store v${CONFIG.version}`;
    
    // Рендерим товары сразу
    renderProducts();
    
    // Инициализируем Telegram через 100мс
    setTimeout(() => {
        initTelegramApp();
        updateCartBadge();
        console.log("Приложение инициализировано!");
    }, 100);
}

// Запускаем при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Экспорт функций в глобальную область
window.showDemo = showDemo;
window.closePreview = closePreview;
window.copyPreviewPrompt = copyPreviewPrompt;
window.addToCartFromPreview = addToCartFromPreview;
window.clearCart = clearCart;
window.showCartSection = showCartSection;
window.showProductsSection = showProductsSection;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;