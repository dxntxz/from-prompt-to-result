const TelegramBot = require('node-telegram-bot-api');
const stats = require('./stats.js');
const paymentService = require('./payments.js');
const fetch = require('node-fetch');
const http = require('http');

// Хранилище временных заказов (ожидающих оплату)
const pendingOrders = new Map();

// === НАСТРОЙКИ ===
const BOT_TOKEN = '8547736027:AAFJenejXk1_l93gBJztUcxvLB33AKx_VaQ';

// СПИСОК АДМИНОВ
const ADMINS = [
    '622566308',           // Основной админ
    '5134277038',        // Второй админ
];

// Создаем бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Функция проверки админа
function isAdmin(userId) {
    return ADMINS.includes(userId.toString());
}

// Функция загрузки данных из data.json
function loadData() {
    try {
        const fs = require('fs');
        const data = fs.readFileSync('./data.json', 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { users: [], orders: [], purchases: [] };
    }
}

// Функция сохранения данных
function saveData(data) {
    try {
        const fs = require('fs');
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
}

// Настройка бота при запуске
async function setupBot() {
    console.log('🤖 Запуск бота From Prompt To Result...');
    console.log('👑 Админы:', ADMINS.join(', '));
    console.log('📱 Username бота: @FromPromptToResultBot');
    
    try {
        // Установка меню команд
        await bot.setMyCommands([
            { command: '/start', description: 'Запустить бота' },
            { command: '/help', description: 'Помощь' },
            { command: '/buy', description: 'Купить промпты' },
            { command: '/support', description: 'Поддержка' },
            { command: '/admin', description: 'Админ-панель' }
        ]);
        
        // Установка кнопки WebApp в меню
        await bot.setChatMenuButton({
            menu_button: {
                type: 'web_app',
                text: '🛒 Открыть магазин',
                web_app: { 
                    url: 'https://dxntxz.github.io/from-prompt-to-result/' 
                }
            }
        });
        
        console.log('✅ Кнопка WebApp установлена в меню');
    } catch (error) {
        console.log('⚠️ Ошибка настройки бота:', error.message);
    }
    
    console.log('✅ Бот инициализирован!');
}

// === КОМАНДЫ ===

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || 'друг';
    
    stats.addUser(userId);
    const isUserAdmin = isAdmin(userId);
    
    const keyboard = {
        inline_keyboard: [
            [{ 
                text: '🛒 Открыть магазин (WebApp)', 
                web_app: { 
                    url: 'https://dxntxz.github.io/from-prompt-to-result/' 
                } 
            }],
            [
                { text: '💳 Способы оплаты', callback_data: 'payment_methods' },
                { text: '📞 Поддержка', url: 'https://t.me/toresfrpro' }
            ]
        ]
    };
    
    let startText = `👋 Привет, ${userName}!\n\n`;
    startText += `🏪 *Добро пожаловать в "From Prompt To Result"*\n\n`;
    startText += `🛒 *Наши товары:*\n`;
    startText += `• 🏫 SCHOOL PACK (26 промптов) - 349₽\n`;
    startText += `• 🎓 STUDENT PACK (30 промптов) - 349₽\n`;
    startText += `• 📊 PRESENTATION PACK (20 промптов) - 449₽\n`;
    startText += `• 🔬 SCIENCE PACK (30 промптов) - 449₽\n\n`;
    startText += `✨ *Как купить:*\n`;
    startText += `1. Нажми кнопку "🛒 Открыть магазин"\n`;
    startText += `2. Выбери нужные промпты\n`;
    startText += `3. Добавь в корзину и оформи заказ\n`;
    startText += `4. Оплати через СБП/ЮMoney\n`;
    startText += `5. Получи файлы мгновенно!\n\n`;
    startText += `📋 *Команды:*\n`;
    startText += `/help - подробная помощь\n`;
    startText += `/buy - процесс покупки\n`;
    startText += `/support - связь с нами`;
    
    if (isUserAdmin) {
        startText += `\n/admin - панель администратора`;
    }
    
    bot.sendMessage(chatId, startText, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
    });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    stats.addUser(userId);
    
    const keyboard = {
        inline_keyboard: [
            [{ 
                text: '🛒 Открыть магазин', 
                web_app: { 
                    url: 'https://dxntxz.github.io/from-prompt-to-result/' 
                } 
            }]
        ]
    };
    
    const helpText = `
❓ *Помощь и инструкции*

🎯 *Как купить через магазин (WebApp):*
1. Нажми "🛒 Открыть магазин"
2. Выбери товар → "Предпросмотр промпта"
3. Добавь в корзину → оформи заказ
4. Получишь ссылку на оплату в боте

💳 *Способы оплаты:*
• ЮMoney (быстро)
• СБП по номеру телефона
• Банковская карта
• USDT (криптовалюта)

⚡ *Мгновенная выдача:* После оплаты файлы приходят автоматически!

❓ *Вопросы?* Пиши /support
    `;
    
    bot.sendMessage(chatId, helpText, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
    });
});

// Команда /buy с интеграцией платежей
bot.onText(/\/buy/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    stats.addUser(userId);
    
    bot.sendMessage(chatId, '🛍 *ВЫБЕРИТЕ ТОВАР:*', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏫 SCHOOL PACK (349 ₽)', callback_data: 'buy_school' }],
                [{ text: '🎓 STUDENT PACK (349 ₽)', callback_data: 'buy_student' }],
                [{ text: '📊 PRESENTATION PACK (449 ₽)', callback_data: 'buy_presentation' }],
                [{ text: '🔬 SCIENCE PACK (449 ₽)', callback_data: 'buy_science' }]
            ]
        }
    });
});

// Обработка callback-кнопок
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;
    
    // Сразу отвечаем, чтобы не истекло время
    await bot.answerCallbackQuery(callbackQuery.id).catch(e => {});
    
    // Обработка способов оплаты
    if (data.startsWith('pay_')) {
        const paymentMethods = {
            'pay_yoomoney': '💳 *ЮMoney*\nНомер: `4100117823993121`',
            'pay_crypto': '💰 *USDT (TRC20)*\nАдрес: `TNDVk6PmHe9YpFqL5hMXoAEzGK3j2j8Lb5`',
            'pay_sbp': '📱 *СБП*\nТелефон: `+79528730411`',
            'pay_card': '💳 *Карта*\nНомер: `5536 9141 3697 9513`'
        };
        
        if (paymentMethods[data]) {
            await bot.sendMessage(userId, paymentMethods[data], { parse_mode: 'Markdown' });
        }
        return;
    }
    
    // Обработка покупки товаров
    let productId, productName, price;
    
    if (data === 'buy_school') {
        productId = 'school_pack_v1';
        productName = '🏫 SCHOOL PACK';
        price = 349;
    } else if (data === 'buy_student') {
        productId = 'student_pack_v1';
        productName = '🎓 STUDENT PACK';
        price = 349;
    } else if (data === 'buy_presentation') {
        productId = 'presentation_pack_v1';
        productName = '📊 PRESENTATION PACK';
        price = 449;
    } else if (data === 'buy_science') {
        productId = 'science_student_plus_pack_v1';
        productName = '🔬 SCIENCE PACK';
        price = 449;
    } else if (data === 'payment_methods') {
        await bot.sendMessage(userId, `
💳 *Доступные способы оплаты:*

1. *ЮMoney* - мгновенный перевод
2. *USDT (TRC20)* - криптовалюта
3. *СБП* - по номеру телефона
4. *Банковская карта* - любой банк

👉 Для получения реквизитов нажми /buy
        `, { parse_mode: 'Markdown' });
        return;
    } else {
        return;
    }
    
    // Создаем заказ
    const orderId = Date.now();
    const order = {
        id: orderId,
        userId: userId,
        productId: productId,
        productName: productName,
        price: price,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    pendingOrders.set(orderId.toString(), order);
    
    // Показываем, что создаем платеж
    await bot.sendMessage(userId, '⏳ Создаем платеж...');
    
    // Создаем платеж в ЮMoney
    const payment = await paymentService.createPayment(
        price, 
        orderId, 
        userId, 
        `Покупка ${productName}`
    );
    
    if (payment.success) {
        order.paymentId = payment.paymentId;
        
        await bot.sendMessage(userId, 
            `🧾 *ЗАКАЗ #${orderId}*\n\n` +
            `Товар: ${productName}\n` +
            `Сумма: ${price} ₽\n\n` +
            `💳 *Оплата через СБП/ЮMoney:*\n` +
            `[Перейти к оплате](${payment.url})\n\n` +
            `_После оплаты файл придет автоматически в этот чат_`,
            { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
    } else {
        // Заглушка: если ЮMoney не работает - показываем реквизиты для скриншотов
        await bot.sendMessage(userId, 
            `🧾 *ЗАКАЗ #${orderId}*\n\n` +
            `Товар: ${productName}\n` +
            `Сумма: ${price} ₽\n\n` +
            `💳 *Оплатите напрямую:*\n\n` +
            `📱 *СБП:* \`+79528730411\`\n` +
            `💳 *Карта:* \`5536 9141 3697 9513\`\n\n` +
            `✅ *После оплаты ОТПРАВЬТЕ СКРИНШОТ в этот чат*\n` +
            `Админ проверит и пришлет файлы вручную.`,
            { parse_mode: 'Markdown' }
        );
    }
});

// Команда /support
bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    stats.addUser(userId);
    
    const supportText = `
📞 *Поддержка*

💬 *Основной канал:* @toresfrpro
👤 *Создатель:* @dxntxz

⏰ *Время ответа:* 1-12 часов

🆘 *Для срочных вопросов:*
1. Напиши "СРОЧНО" в начале
2. Укажи номер заказа (если есть)
3. Приложи скриншот

🔧 *Частые вопросы:*
• Не открывается магазин - попробуй /start
• Не приходят файлы - проверь "Мои покупки" в магазине
• Оплата не подтверждается - пришли скриншот чека
    `;
    
    bot.sendMessage(chatId, supportText, { parse_mode: 'Markdown' });
});

// === АДМИН ПАНЕЛЬ ===

// Команда /admin
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id.toString();
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) {
        bot.sendMessage(chatId, '❌ Эта команда только для администратора!');
        return;
    }
    
    const currentStats = stats.getStats();
    const lastUpdate = new Date(currentStats.lastUpdated).toLocaleString('ru-RU');
    
    const adminText = `
👑 *Панель администратора*

👤 *Вы:* ${msg.from.first_name || 'Админ'}
🆔 *Ваш ID:* ${userId}

📊 *Статистика:*
• 👥 Пользователей: ${currentStats.totalUsers}
• 📦 Всего заказов: ${currentStats.totalOrders}
• 💰 Общая выручка: ${currentStats.totalRevenue}₽
• ✅ Подтверждено: ${currentStats.confirmedOrders}
• ⏳ Ожидают: ${currentStats.pendingOrders}

📈 *За сегодня:*
• 📦 Заказов: ${currentStats.todayOrders}
• 💰 Выручка: ${currentStats.todayRevenue}₽

🔄 *Обновлено:* ${lastUpdate}

⚡ *Команды админа:*
• \`/stats\` - подробная статистика
• \`/orders\` - список заказов
• \`/confirm ID СУММА\` - подтвердить оплату
• \`/admins\` - список администраторов
    `;
    
    bot.sendMessage(chatId, adminText, { parse_mode: 'Markdown' });
});

// Команда /admins
bot.onText(/\/admins/, (msg) => {
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) {
        bot.sendMessage(msg.chat.id, '❌ Только для администраторов!');
        return;
    }
    
    let adminsList = '👑 *Список администраторов:*\n\n';
    
    ADMINS.forEach((adminId, index) => {
        adminsList += `${index + 1}. ID: ${adminId}`;
        if (adminId === userId.toString()) {
            adminsList += ' 👈 (это вы)';
        }
        adminsList += '\n';
    });
    
    adminsList += `\nВсего администраторов: ${ADMINS.length}`;
    
    bot.sendMessage(msg.chat.id, adminsList, { parse_mode: 'Markdown' });
});

// Команда /stats
bot.onText(/\/stats/, (msg) => {
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    const currentStats = stats.getStats();
    const lastUpdate = new Date(currentStats.lastUpdated).toLocaleString('ru-RU');
    
    const avgCheck = currentStats.totalOrders > 0 
        ? Math.round(currentStats.totalRevenue / currentStats.totalOrders) 
        : 0;
    
    const conversion = currentStats.totalUsers > 0 
        ? ((currentStats.totalOrders / currentStats.totalUsers) * 100).toFixed(1) 
        : 0;
    
    const detailedStats = `
📈 *Подробная статистика*

👥 *Пользователи:*
• Всего уникальных: ${currentStats.totalUsers}

📦 *Заказы:*
• Всего: ${currentStats.totalOrders}
• ✅ Подтверждено: ${currentStats.confirmedOrders}
• ⏳ Ожидают: ${currentStats.pendingOrders}

💰 *Финансы:*
• Общая выручка: ${currentStats.totalRevenue}₽
• Средний чек: ${avgCheck}₽
• За сегодня: ${currentStats.todayRevenue}₽

📊 *Эффективность:*
• Конверсия: ${conversion}%

⏰ *Обновлено:* ${lastUpdate}
    `;
    
    bot.sendMessage(msg.chat.id, detailedStats, { parse_mode: 'Markdown' });
});

// Команда /orders
bot.onText(/\/orders/, (msg) => {
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    const pendingOrders = stats.getOrders('pending', 5);
    const confirmedOrders = stats.getOrders('confirmed', 5);
    
    let ordersText = `📋 *Список заказов*\n\n`;
    
    if (pendingOrders.length > 0) {
        ordersText += `⏳ *Ожидают оплаты (${pendingOrders.length}):*\n`;
        pendingOrders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString('ru-RU');
            ordersText += `• #${order.id.slice(-6)} - ${order.amount}₽ - ${date}\n`;
        });
        ordersText += `\n`;
    }
    
    if (confirmedOrders.length > 0) {
        ordersText += `✅ *Подтверждены (${confirmedOrders.length}):*\n`;
        confirmedOrders.forEach(order => {
            const date = new Date(order.confirmedAt || order.date).toLocaleDateString('ru-RU');
            ordersText += `• #${order.id.slice(-6)} - ${order.amount}₽ - ${date}\n`;
        });
    }
    
    if (pendingOrders.length === 0 && confirmedOrders.length === 0) {
        ordersText += `📭 Заказов пока нет`;
    }
    
    ordersText += `\n\n📊 Всего заказов: ${pendingOrders.length + confirmedOrders.length}`;
    
    bot.sendMessage(msg.chat.id, ordersText, { parse_mode: 'Markdown' });
});

// Команда подтверждения оплаты
bot.onText(/\/confirm (\d+) (\d+)/, async (msg, match) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    
    if (!isAdmin(userId)) {
        bot.sendMessage(chatId, '❌ Только для админа!');
        return;
    }
    
    const targetUserId = match[1];
    const amount = parseInt(match[2]);
    const adminName = msg.from.first_name || 'Админ';
    
    try {
        // Создаем заказ в статистике
        const orderId = stats.addOrder(targetUserId, amount);
        
        // Подтверждаем заказ
        stats.confirmOrder(orderId);
        
        // Отправляем пользователю подтверждение
        const confirmationText = `
✅ *Оплата подтверждена!*

💰 *Сумма:* ${amount}₽
📅 *Дата:* ${new Date().toLocaleDateString('ru-RU')}
🎫 *Номер заказа:* ${orderId}
👨‍💼 *Подтвердил:* ${adminName}

🔗 *Ваши файлы доступны:*
• [Все промпты](https://dxntxz.github.io/from-prompt-to-result/)
• [Школьные](https://dxntxz.github.io/from-prompt-to-result/school-prompts.html)
• [Студенческие](https://dxntxz.github.io/from-prompt-to-result/student-prompts.html)
• [Презентации](https://dxntxz.github.io/from-prompt-to-result/presentation-prompts.html)
• [Научные](https://dxntxz.github.io/from-prompt-to-result/science-prompts.html)

💾 *Сохраните эти ссылки!*
📧 *Вопросы:* @toresfrpro

🎉 *Спасибо за покупку!*
        `;
        
        await bot.sendMessage(targetUserId, confirmationText, { parse_mode: 'Markdown' });
        
        // Сообщаем всем админам
        const currentStats = stats.getStats();
        const adminMessage = `
✅ *Оплата подтверждена*

👨‍💼 *Админ:* ${adminName} (${userId})
👤 *Пользователь:* ${targetUserId}
💰 *Сумма:* ${amount}₽
📦 *Номер заказа:* ${orderId}
📅 *Время:* ${new Date().toLocaleTimeString('ru-RU')}

📊 *Обновленная статистика:*
• Выручка: ${currentStats.totalRevenue}₽
• Заказов: ${currentStats.totalOrders}
• Подтверждено: ${currentStats.confirmedOrders}

Файлы отправлены пользователю.
        `;
        
        for (const adminId of ADMINS) {
            try {
                await bot.sendMessage(adminId, adminMessage, { parse_mode: 'Markdown' });
            } catch (error) {
                console.log(`❌ Не удалось отправить админу ${adminId}:`, error.message);
            }
        }
        
        console.log(`✅ Админ ${userId} подтвердил оплату: ${targetUserId} - ${amount}₽ (${orderId})`);
        
    } catch (error) {
        await bot.sendMessage(chatId, `❌ Ошибка: ${error.message}`);
        console.log('❌ Ошибка подтверждения оплаты:', error.message);
    }
});

// Обработка фотографий (скриншоты оплаты) - ЗАГЛУШКА
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Если от админа - игнорируем
    if (isAdmin(userId)) return;
    
    stats.addUser(userId);
    
    // Уведомляем пользователя
    await bot.sendMessage(chatId, 
        '📸 *Скриншот получен!*\n\n' +
        'Проверяем оплату... Обычно это занимает 1-2 часа.\n' +
        'Как только подтвердим - вы получите ссылки на файлы.',
        { parse_mode: 'Markdown' }
    );
    
    // Пересылаем всем админам
    try {
        const adminMessage = `📸 *Новый скриншот оплаты*\n\n👤 Пользователь: ${userId}\n👤 Имя: ${msg.from.first_name || 'Не указано'}\n📅 ${new Date().toLocaleString('ru-RU')}\n\nДля подтверждения оплаты:\n\`/confirm ${userId} СУММА\`\n\n*Пример:* \`/confirm ${userId} 349\``;
        
        for (const adminId of ADMINS) {
            try {
                await bot.forwardMessage(adminId, chatId, msg.message_id);
                await bot.sendMessage(adminId, adminMessage, { parse_mode: 'Markdown' });
            } catch (error) {
                console.log(`❌ Не удалось отправить админу ${adminId}:`, error.message);
            }
        }
        
        console.log(`📸 Скриншот от ${userId} переслан всем админам`);
    } catch (error) {
        console.log('❌ Ошибка пересылки скриншота:', error.message);
    }
});

// Обработка данных из WebApp
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            if (data.action === 'new_order') {
                const userId = msg.from.id;
                const orderData = data;
                
                // Проверяем, есть ли уже такие покупки
                const data_file = loadData();
                const alreadyPurchased = data_file.purchases?.filter(p => 
                    p.userId === userId && 
                    orderData.items.some(item => item.id === p.productId)
                ) || [];
                
                if (alreadyPurchased.length > 0) {
                    bot.sendMessage(userId, '❌ Некоторые товары уже куплены!');
                    return;
                }
                
                // Создаем заказ
                const orderId = stats.addOrder(userId, orderData.total);
                
                // Уведомляем админов
                ADMINS.forEach(adminId => {
                    bot.sendMessage(adminId, 
                        `🛍 *Новый заказ из WebApp #${orderId}*\n\n` +
                        `От: @${msg.from.username || 'нет username'} (${userId})\n` +
                        `Сумма: ${orderData.total} ₽\n` +
                        `Товаров: ${orderData.items.length}\n\n` +
                        `Подтвердить: /confirm ${userId} ${orderData.total}`,
                        { parse_mode: 'Markdown' }
                    );
                });
                
                // Отвечаем пользователю
                bot.sendMessage(userId, 
                    `✅ *Заказ #${orderId} принят!*\n\n` +
                    `💰 Сумма к оплате: ${orderData.total} ₽\n\n` +
                    `💳 *Реквизиты для оплаты:*\n` +
                    `📱 СБП: \`+79528730411\`\n` +
                    `💳 Карта: \`5536 9141 3697 9513\`\n\n` +
                    `📸 *После оплаты отправьте СКРИНШОТ в этот чат*`,
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (e) {
            console.error('Ошибка обработки web_app_data:', e);
        }
    }
});

// === ВЕБХУК ДЛЯ ЮMONEY ===
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/yookassa-webhook') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                if (data.event === 'payment.succeeded') {
                    await handleSuccessfulPayment(data.object);
                }
                
                res.writeHead(200);
                res.end('OK');
            } catch (e) {
                console.error('Webhook error:', e);
                res.writeHead(500);
                res.end('Error');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(3000, () => {
    console.log('🌐 Webhook server listening on port 3000');
});

// Функция обработки успешного платежа
async function handleSuccessfulPayment(paymentData) {
    const { order_id, user_id } = paymentData.metadata || {};
    const order = pendingOrders.get(order_id?.toString());
    
    if (!order || order.status === 'paid') return;
    
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    
    // Сохраняем в data.json
    const data = loadData();
    if (!data.purchases) data.purchases = [];
    data.purchases.push({
        userId: user_id,
        productId: order.productId,
        productName: order.productName,
        price: order.price,
        date: order.paidAt,
        orderId: order_id
    });
    saveData(data);
    
    // Отправляем файл
    let filePath;
    if (order.productId === 'school_pack_v1') filePath = '../school-prompts.html';
    else if (order.productId === 'student_pack_v1') filePath = '../student-prompts.html';
    else if (order.productId === 'presentation_pack_v1') filePath = '../presentation-prompts.html';
    else if (order.productId === 'science_student_plus_pack_v1') filePath = '../science-prompts.html';
    
    try {
        await bot.sendDocument(user_id, filePath, {
            caption: `✅ *ОПЛАЧЕНО!*\n\nВаш файл с промптами: ${order.productName}\n\nСпасибо за покупку!`,
            parse_mode: 'Markdown'
        });
        
        bot.sendMessage(user_id, 
            `🌐 *Веб-версия:*\nhttps://dxntxz.github.io/from-prompt-to-result/${filePath.split('/').pop()}`,
            { parse_mode: 'Markdown' }
        );
        
        ADMINS.forEach(adminId => {
            bot.sendMessage(adminId, 
                `💰 *УСПЕШНАЯ ОПЛАТА*\n\n` +
                `Заказ #${order_id}\n` +
                `Пользователь: ${user_id}\n` +
                `Товар: ${order.productName}\n` +
                `Сумма: ${order.price} ₽\n` +
                `Файл отправлен автоматически`,
                { parse_mode: 'Markdown' }
            );
        });
        
        pendingOrders.delete(order_id.toString());
        
    } catch (error) {
        console.error('Ошибка отправки файла:', error);
    }
}

// Логирование всех сообщений
bot.on('message', (msg) => {
    const userId = msg.from?.id;
    if (userId && msg.text && !msg.text.startsWith('/')) {
        stats.addUser(userId);
    }
    console.log(`📩 ${msg.chat.id}: ${msg.text || '(фото/документ)'}`);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка бота:', error.message);
});

// Запуск бота
setupBot();

console.log('🚀 Бот запущен и готов к работе!');	