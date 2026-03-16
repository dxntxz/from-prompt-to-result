// FROM PROMPT TO RESULT - Telegram Mini App
// Версия 1.0

console.log("APP.JS ЗАГРУЖЕН!");

const CONFIG = {
    appName: "FROM PROMPT TO RESULT",
    version: "1.0",
    telegramBot: "@toresfrpro",
    supportLink: "https://t.me/toresfrpro",
    
    baseUrl: "https://dxntxz.github.io/from-prompt-to-result/",

    products: [
        {
            id: "school_pack_v1",
            name: "🏫 FROM PROMPT TO RESULT: SCHOOL PACK",
            tagline: "26 промптов для учебы в школе",
            description: "Полный набор из 26 промптов для всех школьных предметов. Русский язык, математика, история, литература и другие. Версия 1.0",
            price: 349,
            features: [
                "26 готовых промптов",
                "Все основные школьные предметы",
                "Структура сочинений и эссе",
                "Анализ стихотворений",
                "Решение задач с объяснением",
                "Подготовка к устных ответов",
                "Идеи для школьных проектов"
            ],
            image: "",
            demoPrompt: "Ты — эксперт по литературе и талантливый редактор. Мне нужно написать сочинение на тему \"{ТЕМА}\" для {КЛАСС} класса. Основная мысль: {ОСНОВНАЯ МЫСЛЬ}. Предложи четкую структуру (введение, аргументы, вывод), 3 сильных аргумента с примерами из произведения \"{НАЗВАНИЕ ПРОИЗВЕДЕНИЯ}\" и клишированные фразы для связки частей. Объём: {КОЛИЧЕСТВО} слов.",
            includes: "HTML файл с 26 промптами",
            version: "1.0",
            fileUrl: "school-prompts.html"
        },
        {
            id: "student_pack_v1", 
            name: "🎓 FROM PROMPT TO RESULT: STUDENT PACK",
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
            version: "1.0",
            fileUrl: "student-prompts.html"
        },
        {
            id: "presentation_pack_v1",
            name: "📊 FROM PROMPT TO RESULT: PRESENTATION PACK",
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
            version: "1.0",
            fileUrl: "presentation-prompts.html"
        },
        {
            id: "science_student_plus_pack_v1",
            name: "🔬 FROM PROMPT TO RESULT: SCIENCE PACK | STUDENT+ PACK",
            tagline: "30 научных промптов для студентов и исследователей",
            description: "Продвинутый набор из 30 промптов для научной работы. Форматы: IMRaD, PRISMA, NIH, COREQ, PICO, APA. Для научных статей, дипломов, курсовых, исследовательских проектов. Версия 1.0",
            price: 449,
            features: [
                "30 специализированных промптов",
                "Форматы: IMRaD, PRISMA, NIH, COREQ",
                "Методология: количественные и качественные исследования",
                "Статистический анализ: SPSS, R, NVivo",
                "Академические навыки: поиск литературы, письмо, критика",
                "Практические задачи: отчеты, ТЗ, архитектурные проекты",
                "Язык и карьера: CV, motivation letters, переводы"
            ],
            image: "",
            demoPrompt: "Ты научный редактор журнала \"{НАЗВАНИЕ ЖУРНАЛА}\". Создай научную статью по теме \"{ТЕМА}\" в формате IMRaD. Introduction: начни с research gap, затем актуальность проблемы, сформулируй гипотезы и цели. Methods: детально опиши дизайн исследования, выборку, процедуру сбора данных, инструменты и статистические методы. Results: представь результаты с таблицами и рисунками, включи описательную статистику и тесты значимости. Discussion: интерпретируй результаты в контексте существующих исследований, обсуди ограничения и предложи направления для будущих работ. Объем: 4000-5000 слов, стиль - академический английский (APA 7th edition).",
            includes: "HTML файл с 30 промптами",
            version: "1.0",
            fileUrl: "science-prompts.html"
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

// ==================== СИСТЕМА ПОКУПОК ====================

// Хранилище купленных товаров
const PURCHASE_STORAGE_KEY = 'fptr_purchased_v1';

// Загрузить купленные товары
function loadPurchased() {
    const saved = localStorage.getItem(PURCHASE_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Сохранить купленные товары
function savePurchased(purchased) {
    localStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(purchased));
}

// Проверить, куплен ли товар
function isProductPurchased(productId) {
    const purchased = loadPurchased();
    return purchased.includes(productId);
}

// Добавить товар в купленные
function markAsPurchased(productId) {
    const purchased = loadPurchased();
    if (!purchased.includes(productId)) {
        purchased.push(productId);
        savePurchased(purchased);
        return true;
    }
    return false;
}

// Получить купленные товары
function getPurchasedProducts() {
    const purchasedIds = loadPurchased();
    return CONFIG.products.filter(product => 
        purchasedIds.includes(product.id)
    );
}

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
    
    container.innerHTML = CONFIG.products.map(product => {
        // Проверяем, куплен ли товар
        const isPurchased = isProductPurchased(product.id);
        
        return `
        <div class="product-card">
            <div class="product-badge ${isPurchased ? 'purchased' : ''}" 
                 style="${isPurchased ? 'background: #00a000; color: white;' : ''}">
                ${isPurchased ? '✅' : `${product.price} ₽`}
            </div>
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
                ${isPurchased ? '<br>✅ <strong>Уже куплено!</strong>' : ''}
            </div>
            
            ${isPurchased ? `
                <button class="store-btn purchased-btn" style="background: #00a000; color: white;" disabled>
                    ✅ КУПЛЕНО
                </button>
                <button onclick="openPurchasedFile('${product.id}')" class="store-btn secondary">
                    📁 ОТКРЫТЬ ФАЙЛ
                </button>
            ` : `
                <button onclick="addToCart('${product.id}')" class="store-btn">
                    🛒 ДОБАВИТЬ В КОРЗИНУ
                </button>
                <button onclick="showDemo('${product.id}')" class="store-btn secondary">
                    👁 ПРЕДПРОСМОТР ПРОМПТА
                </button>
            `}
        </div>
        `;
    }).join('');
    
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
    
    container.innerHTML = cart.map((item, index) => {
        // Проверяем, куплен ли уже этот товар
        const isAlreadyPurchased = isProductPurchased(item.id);
        
        return `
        <div class="cart-item-modal" style="${isAlreadyPurchased ? 'background: #ffe6e6;' : ''}">
            <div class="cart-item-info-modal">
                <div class="cart-item-name-modal">${item.name}</div>
                <div class="cart-item-desc-modal">${item.tagline}</div>
                ${isAlreadyPurchased ? 
                    '<div style="color: #ff3333; font-size: 11px; margin-top: 5px;">⚠️ Уже куплено!</div>' : 
                    ''}
            </div>
            <div style="text-align: right;">
                <div class="cart-item-price-modal">${item.price} ₽</div>
                <button onclick="removeFromCart(${index})" class="cart-item-remove-modal">
                    ❌ Удалить
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    if (totalElement) totalElement.textContent = `${total} ₽`;
}

function addToCart(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) return;
    
    // Проверяем, куплен ли уже товар
    if (isProductPurchased(productId)) {
        showNotification('❌ Этот товар уже куплен!');
        return;
    }
    
    // Проверяем, есть ли уже в корзине
    const alreadyInCart = cart.find(item => item.id === productId);
    if (alreadyInCart) {
        showNotification('⚠️ Товар уже в корзине!');
        return;
    }
    
    cart.push({
        ...product,
        cartId: Date.now() + Math.random()
    });
    
    saveCart();
    showNotification(`✅ ${product.name} добавлен в корзину!`);
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

// ==================== ЗАКАЗ ====================

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    // Проверяем, не пытаются ли купить уже купленный товар
    const alreadyPurchasedItems = cart.filter(item => 
        isProductPurchased(item.id)
    );
    
    if (alreadyPurchasedItems.length > 0) {
        showNotification('❌ Некоторые товары уже куплены! Удалите их из корзины.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemsList = cart.map(item => `• ${item.name} - ${item.price} ₽`).join('\n');
    
    // ========== НОВЫЙ КОД С TELEGRAM ИНТЕГРАЦИЕЙ ==========
    
    // Проверяем, доступен ли Telegram
    if (window.FPTRTelegram && FPTRTelegram.initialized) {
        // Используем Telegram Payments (если настроено)
        if (FPTRTelegram.tg && FPTRTelegram.tg.initInvoice) {
            FPTRTelegram.initiatePayment(cart, total);
            return; // Ждем ответа от платежей
        }
        
        // Если платежи не настроены, отправляем данные боту
        const orderData = {
            action: 'new_order',
            user_id: FPTRTelegram.user?.id || 0,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price
            })),
            total: total,
            timestamp: Date.now()
        };
        
        // Показываем подтверждение через Telegram
        FPTRTelegram.showConfirm(
            'ОФОРМЛЕНИЕ ЗАКАЗА',
            `Товаров: ${cart.length}\nСумма: ${total} ₽\n\nОтправить заказ в бот?`,
            (confirmed) => {
                if (confirmed) {
                    // Отправляем в бота
                    if (FPTRTelegram.sendData(orderData)) {
                        showNotification('✅ Заказ отправлен боту!');
                        
                        // Помечаем товары как купленные
                        cart.forEach(item => {
                            markAsPurchased(item.id);
                        });
                        
                        // Очищаем корзину
                        cart = [];
                        saveCart();
                        
                        // Обновляем интерфейс
                        renderProducts();
                        showProductsSection();
                        
                        // Показываем сообщение
                        setTimeout(() => {
                            alert(`✅ ЗАКАЗ ОТПРАВЛЕН!\n\nБот @FRPT_BOT пришлет подтверждение и реквизиты для оплаты.\n\nПосле оплаты вы получите доступ к файлам.`);
                        }, 500);
                    } else {
                        showNotification('❌ Ошибка отправки. Попробуйте еще раз.');
                    }
                }
            }
        );
    } else {
        // Если Telegram не доступен (локальное тестирование)
        const useTelegram = confirm(
            `⚠️ Telegram WebApp не обнаружен.\n\nВы в режиме локального тестирования.\n\nХотите симулировать покупку?`
        );
        
        if (useTelegram) {
            // Симуляция покупки (старая логика)
            showNotification('✅ Тестовая покупка!');
            
            cart.forEach(item => {
                markAsPurchased(item.id);
            });
            
            cart = [];
            saveCart();
            renderProducts();
            showProductsSection();
            
            alert(`✅ ТЕСТОВАЯ ПОКУПКА\n\nТовары помечены как купленные.\nФайлы доступны для открытия.`);
        }
    }
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

// ==================== TЕСТ ===================

function resetAllData() {
    if (confirm('⚠️ ВНИМАНИЕ!\n\nВы уверены, что хотите сбросить ВСЕ данные?\n\n• Корзина будет очищена\n• История покупок удалена\n\nЭто действие нельзя отменить!')) {
        // Очищаем корзину
        cart = [];
        localStorage.removeItem('fptr_cart');
        
        // Очищаем историю покупок
        localStorage.removeItem(PURCHASE_STORAGE_KEY);
        
        // Обновляем интерфейс
        renderProducts();
        renderCart();
        updateCartBadge();
        
        showNotification('✅ Все данные сброшены!');
    }
}

// ==================== ОТКРЫТИЕ КУПЛЕННЫХ ФАЙЛОВ ====================

function openPurchasedFile(productId) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product) {
        showNotification('Товар не найден');
        return;
    }
    
    if (!isProductPurchased(productId)) {
        showNotification('❌ Сначала купите этот товар!');
        return;
    }
    
    const fileLinks = {
        'school_pack_v1': 'school-prompts.html',
        'student_pack_v1': 'student-prompts.html', 
        'presentation_pack_v1': 'presentation-prompts.html',
        'science_student_plus_pack_v1': 'science-prompts.html'
    };
    
    const fileName = fileLinks[productId];
    
    if (fileName) {
        // Для GitHub Pages используем абсолютный путь
        const fullUrl = CONFIG.baseUrl ? CONFIG.baseUrl + fileName : fileName;
        
        // Открываем файл
        window.open(fullUrl, '_blank');
        showNotification(`📁 Открываю: ${product.name}`);
    }
}

// ==================== ЛИЧНЫЙ КАБИНЕТ ====================

function showMyPurchases() {
    const purchasedProducts = getPurchasedProducts();
    
    if (purchasedProducts.length === 0) {
        showNotification('У вас пока нет покупок');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 600px;">
            <div class="modal-header">
                <h3>📁 МОИ ПОКУПКИ</h3>
                <button onclick="this.parentElement.parentElement.remove()" class="modal-close-btn">✕</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px; color: #666; font-size: 14px;">
                    Всего куплено товаров: ${purchasedProducts.length}
                </div>
                
                <div class="purchased-items">
                    ${purchasedProducts.map(product => `
                        <div class="cart-item-modal" style="margin-bottom: 10px;">
                            <div class="cart-item-info-modal">
                                <div class="cart-item-name-modal">${product.name}</div>
                                <div class="cart-item-desc-modal">${product.tagline}</div>
                                <div style="font-size: 11px; color: #00a000; margin-top: 5px;">
                                    ✅ Куплено
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <button onclick="openPurchasedFile('${product.id}')" class="store-btn" style="padding: 8px 12px; font-size: 12px;">
                                    📁 ОТКРЫТЬ
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="store-btn secondary">
                        ЗАКРЫТЬ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Функция для создания временного файла при локальном тестировании
function createTemporarySchoolFile() {
    // Создаем временный HTML файл с промптами
    const tempHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>FROM PROMPT TO RESULT | ШКОЛЬНЫЕ ПРОМПТЫ</title>
    <style>
        body { font-family: Courier, monospace; padding: 20px; }
        h1 { color: #000; }
        .prompt { border: 2px solid #000; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🎓 FROM PROMPT TO RESULT: ШКОЛЬНЫЕ ПРОМПТЫ</h1>
    <p>Версия 1.0 | 26 промптов</p>
    
    <div class="prompt">
        <h3>📝 Промпт 1: Написание сочинения</h3>
        <code>Ты — эксперт по литературе и талантливый редактор. Мне нужно написать сочинение на тему "{ТЕМА}" для {КЛАСС} класса...</code>
    </div>
    
    <div class="prompt">
        <h3>📝 Промпт 2: Анализ стихотворения</h3>
        <code>Разбери стихотворение {АВТОР} "{НАЗВАНИЕ}" как для урока литературы в {КЛАСС} классе...</code>
    </div>
    
    <p style="margin-top: 30px; color: #666;">
        ✅ Это демо-версия файла. При запуске на GitHub Pages откроется полный файл с 26 промптами.
    </p>
</body>
</html>`;
    
    // Создаем blob и открываем в новой вкладке
    const blob = new Blob([tempHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showNotification('📄 Открыт демо-файл для тестирования');
}

window.createTemporarySchoolFile = createTemporarySchoolFile;

// Функция для создания временного файла для student pack
function createTemporaryStudentFile() {
    const tempHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>FROM PROMPT TO RESULT | STUDENT PACK</title>
    <style>
        body { font-family: Courier, monospace; padding: 20px; }
        h1 { color: #000; }
        .prompt { border: 2px solid #000; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🎓 FROM PROMPT TO RESULT: STUDENT PACK</h1>
    <p>Версия 1.0 | 30 промптов | Цена: 349 ₽</p>
    
    <div class="prompt">
        <h3>📝 Промпт 1: Курсовая работа</h3>
        <code>Ты — научный руководитель с 10-летним опытом. Помоги структурировать курсовую работу по теме "{ТЕМА}"...</code>
    </div>
    
    <div class="prompt">
        <h3>📝 Промпт 2: Дипломная работа</h3>
        <code>Ты дипломный руководитель. Разработай ВКР по теме "{ТЕМА}" по ФГОС 3++...</code>
    </div>
    
    <p style="margin-top: 30px; color: #666;">
        ✅ Это демо-версия файла. При запуске на GitHub Pages откроется полный файл с 30 промптами (student-prompts.html).
    </p>
</body>
</html>`;
    
    const blob = new Blob([tempHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showNotification('📄 Открыт демо-файл STUDENT PACK для тестирования');
}

// Функция для создания временного файла для presentation pack
function createTemporaryPresentationFile() {
    const tempHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>FROM PROMPT TO RESULT | PRESENTATION PACK</title>
    <style>
        body { font-family: Courier, monospace; padding: 20px; }
        h1 { color: #000; }
        .prompt { border: 2px solid #000; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>📊 FROM PROMPT TO RESULT: PRESENTATION PACK</h1>
    <p>Версия 1.0 | 20 промптов | Цена: 449 ₽</p>
    
    <div class="prompt">
        <h3>📝 Промпт 1: Презентация по принципам TED</h3>
        <code>Ты спикер TED. Разработай презентацию по теме "{ТЕМА}" по принципам TED Talks...</code>
    </div>
    
    <div class="prompt">
        <h3>📝 Промпт 2: Создание слайдов в Canva</h3>
        <code>Ты дизайнер презентаций. Создай структуру слайдов для презентации на тему "{ТЕМА}"...</code>
    </div>
    
    <p style="margin-top: 30px; color: #666;">
        ✅ Это демо-версия файла. При запуске на GitHub Pages откроется полный файл с 20 промптами (presentation-prompts.html).
    </p>
</body>
</html>`;
    
    const blob = new Blob([tempHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showNotification('📄 Открыт демо-файл PRESENTATION PACK для тестирования');
}

// Функция для создания временного файла для science pack
function createTemporaryScienceFile() {
    const tempHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>FROM PROMPT TO RESULT | SCIENCE PACK | STUDENT+ PACK</title>
    <style>
        body { font-family: Courier, monospace; padding: 20px; }
        h1 { color: #000; }
        .prompt { border: 2px solid #000; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🔬 FROM PROMPT TO RESULT: SCIENCE PACK | STUDENT+ PACK</h1>
    <p>Версия 1.0 | 30 промптов | Цена: 449 ₽</p>
    
    <div class="prompt">
        <h3>📝 Промпт 1: Научная статья в формате IMRaD</h3>
        <code>Ты научный редактор журнала "{НАЗВАНИЕ ЖУРНАЛА}". Создай научную статью по теме "{ТЕМА}" в формате IMRaD...</code>
    </div>
    
    <div class="prompt">
        <h3>📝 Промпт 2: Research Proposal по схеме NIH</h3>
        <code>Ты грантовый специалист. Разработай research proposal по теме "{ТЕМА}" по схеме NIH...</code>
    </div>
    
    <p style="margin-top: 30px; color: #666;">
        ✅ Это демо-версия файла. При запуске на GitHub Pages откроется полный файл с 30 промптами (science-prompts.html).
    </p>
</body>
</html>`;
    
    const blob = new Blob([tempHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showNotification('📄 Открыт демо-файл SCIENCE PACK для тестирования');
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
window.createTemporaryStudentFile = createTemporaryStudentFile;
window.createTemporaryPresentationFile = createTemporaryPresentationFile;
window.createTemporaryScienceFile = createTemporaryScienceFile;
window.renderProducts = renderProducts;
window.showMyPurchases = showMyPurchases;
window.openPurchasedFile = openPurchasedFile;
window.isProductPurchased = isProductPurchased;
window.resetAllData = resetAllData;
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