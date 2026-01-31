const TelegramBot = require('node-telegram-bot-api');

// === НАСТРОЙКИ ===
// ВСТАВЬ СВОЙ ТОКЕН БОТА ОТ @BotFather
const BOT_TOKEN = '8547736027:AAFJenejXk1_l93gBJztUcxvLB33AKx_VaQ';
// ВСТАВЬ СВОЙ ID ОТ @userinfobot
const ADMIN_ID = '622566308';

// Создаем бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Бот запущен! Ожидание команд...');
console.log('👑 Админ ID:', ADMIN_ID);
console.log('📱 Username бота: @FromPromptToResultBot');

// === КОМАНДЫ ===

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'друг';
    
    const startText = `
👋 Привет, ${userName}!

🏪 *Добро пожаловать в "From Prompt To Result"*

🛒 *Наши товары:*
• 🎓 Школьные промпты - 349₽
• 📚 Студенческие промпты - 349₽
• 🎨 Промпты для презентаций - 449₽

✨ *Как купить:*
1. Открой наш магазин
2. Выбери нужные промпты
3. Оплати любым удобным способом
4. Получи файлы сразу!

📱 *Ссылки:*
🛒 [Магазин](https://dxntxz.github.io/from-prompt-to-result/)
💬 [Поддержка](https://t.me/toresfrpro)

📋 *Команды:*
/help - помощь
/buy - как купить
/support - поддержка
    `;
    
    bot.sendMessage(chatId, startText, { parse_mode: 'Markdown' });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpText = `
❓ *Помощь по боту*

🛒 *Процесс покупки:*
1. Зайдите в наш [магазин](https://dxntxz.github.io/from-prompt-to-result/)
2. Добавьте промпты в корзину
3. Нажмите "Оформить заказ"
4. Оплатите удобным способом
5. Получите ссылки на файлы

💳 *Способы оплаты:*
• СБП (по номеру телефона)
• Банковская карта
• ЮMoney
• Криптовалюта (USDT)

📦 *После оплаты:*
1. Пришлите скриншот чека в этот чат
2. Админ подтвердит оплату (1-2 часа)
3. Получите ссылки на файлы с промптами

⚠️ *Важно:* Каждая покупка дает доступ навсегда!
    `;
    
    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Команда /buy
bot.onText(/\/buy/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🛒 Открыть магазин', url: 'https://dxntxz.github.io/from-prompt-to-result/' }],
            [{ text: '💬 Написать в поддержку', url: 'https://t.me/toresfrpro' }],
            [{ text: '💳 Реквизиты для оплаты', callback_data: 'payment_details' }]
        ]
    };
    
    bot.sendMessage(chatId, 
        '🛒 *Покупка промптов*\n\n' +
        'Нажмите кнопку ниже, чтобы открыть магазин и выбрать промпты.\n\n' +
        'После оформления заказа я пришлю реквизиты для оплаты.',
        { parse_mode: 'Markdown', reply_markup: keyboard }
    );
});

// Кнопка "Реквизиты для оплаты"
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    
    if (data === 'payment_details') {
        const paymentText = `
💳 *Реквизиты для оплаты:*

📱 *СБП (по номеру телефона):*
+7 (XXX) XXX-XX-XX
(Напиши /support чтобы получить актуальный номер)

💳 *Банковская карта (Тинькофф):*
2200 XXXX XXXX XXXX
Иван И.

💰 *ЮMoney:*
4100 XXXX XXXX XXXX

🔗 *Крипто (USDT TRC20):*
TXXXXXXXXXXXXXXX

⚠️ *Перед оплатой:*
1. Убедитесь в правильности суммы
2. Сохраните чек/скриншот оплаты
3. Пришлите скриншот в этот чат

*После оплаты мы подтвердим её в течение 1-2 часов.*
        `;
        
        bot.sendMessage(msg.chat.id, paymentText, { parse_mode: 'Markdown' });
        bot.answerCallbackQuery(callbackQuery.id);
    }
});

// Команда /support
bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;
    
    const supportText = `
📞 *Поддержка*

По любым вопросам:
• Покупка и оплата
• Доступ к файлам
• Технические проблемы

💬 *Наш канал:* @toresfrpro
👤 *Владелец:* напишите личное сообщение

⏰ *Время ответа:* 1-2 часа в рабочее время

🆘 *Срочная помощь:* укажите в сообщении "СРОЧНО" и номер заказа
    `;
    
    bot.sendMessage(chatId, supportText, { parse_mode: 'Markdown' });
});

// === АДМИН ПАНЕЛЬ ===

// Команда /admin
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id.toString();
    
    if (chatId !== ADMIN_ID) {
        bot.sendMessage(chatId, '❌ Эта команда только для администратора!');
        return;
    }
    
    const adminKeyboard = {
        inline_keyboard: [
            [
                { text: '📊 Статистика', callback_data: 'admin_stats' },
                { text: '📋 Последние заказы', callback_data: 'admin_orders' }
            ],
            [
                { text: '✅ Подтвердить оплату', callback_data: 'admin_confirm' },
                { text: '📤 Выдать файлы', callback_data: 'admin_send' }
            ],
            [
                { text: '📢 Сделать рассылку', callback_data: 'admin_broadcast' },
                { text: '🔄 Обновить бота', callback_data: 'admin_restart' }
            ]
        ]
    };
    
    bot.sendMessage(chatId, 
        '👑 *Панель администратора*\n\nВыберите действие:',
        { parse_mode: 'Markdown', reply_markup: adminKeyboard }
    );
});

// Обработка админ-кнопок
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg.chat.id.toString();
    
    if (chatId !== ADMIN_ID) {
        bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Доступ запрещен!' });
        return;
    }
    
    if (data === 'admin_stats') {
        bot.sendMessage(chatId, 
            '📊 *Статистика бота*\n\n' +
            '👥 Пользователей: 0\n' +
            '🛒 Заказов: 0\n' +
            '💰 Продаж: 0₽\n' +
            '✅ Подтвержденных: 0\n' +
            '⏳ Ожидают: 0',
            { parse_mode: 'Markdown' }
        );
    }
    
    if (data === 'admin_confirm') {
        bot.sendMessage(chatId,
            '✅ *Подтверждение оплаты*\n\n' +
            'Для подтверждения оплаты отправьте команду:\n' +
            '`/confirm USER_ID ORDER_ID AMOUNT`\n\n' +
            '*Пример:*\n' +
            '`/confirm 123456789 order_001 349`\n\n' +
            'Где:\n' +
            '• USER_ID - ID пользователя\n' +
            '• ORDER_ID - номер заказа\n' +
            '• AMOUNT - сумма оплаты',
            { parse_mode: 'Markdown' }
        );
    }
    
    bot.answerCallbackQuery(callbackQuery.id);
});

// Команда подтверждения оплаты
bot.onText(/\/confirm (.+)/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    
    if (chatId !== ADMIN_ID) {
        bot.sendMessage(chatId, '❌ Эта команда только для администратора!');
        return;
    }
    
    const params = match[1].split(' ');
    if (params.length < 3) {
        bot.sendMessage(chatId, '❌ Формат: /confirm USER_ID ORDER_ID AMOUNT\nПример: /confirm 123456789 order_001 349');
        return;
    }
    
    const userId = params[0];
    const orderId = params[1];
    const amount = params[2];
    
    // Отправляем пользователю подтверждение
    const userMessage = `
✅ *Оплата подтверждена!*

📦 *Детали заказа:*
• Номер: ${orderId}
• Сумма: ${amount}₽
• Дата: ${new Date().toLocaleDateString('ru-RU')}

🔗 *Ваши файлы:*
• [Школьные промпты](https://dxntxz.github.io/from-prompt-to-result/school-prompts.html)
• [Студенческие промпты](https://dxntxz.github.io/from-prompt-to-result/student-prompts.html)
• [Промпты для презентаций](https://dxntxz.github.io/from-prompt-to-result/presentation-prompts.html)

💾 *Сохраните эти ссылки!*
📧 *По вопросам:* @toresfrpro
    `;
    
    try {
        bot.sendMessage(userId, userMessage, { parse_mode: 'Markdown' });
        
        bot.sendMessage(chatId,
            `✅ *Оплата подтверждена*\n\n` +
            `👤 Пользователь: ${userId}\n` +
            `📦 Заказ: ${orderId}\n` +
            `💰 Сумма: ${amount}₽\n\n` +
            `Файлы отправлены пользователю.`,
            { parse_mode: 'Markdown' }
        );
        
        console.log(`✅ Оплата подтверждена: ${userId} - ${orderId} - ${amount}₽`);
    } catch (error) {
        bot.sendMessage(chatId, `❌ Ошибка: ${error.message}`);
    }
});

// Обработка фото (скриншоты оплаты)
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    
    // Если фото от админа - игнорируем
    if (chatId.toString() === ADMIN_ID) return;
    
    // Пересылаем админу
    bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
    
    // Уведомляем админа
    bot.sendMessage(ADMIN_ID,
        `📸 *Получен скриншот оплаты*\n\n` +
        `👤 От пользователя: ${chatId}\n` +
        `📅 Время: ${new Date().toLocaleTimeString('ru-RU')}\n\n` +
        `Для подтверждения оплаты:\n` +
        `\`/confirm ${chatId} order_${Date.now()} СУММА\``,
        { parse_mode: 'Markdown' }
    );
    
    // Уведомляем пользователя
    bot.sendMessage(chatId,
        '📸 *Скриншот получен!*\n\n' +
        'Мы проверим оплату и в течение 1-2 часов подтвердим её.\n' +
        'После подтверждения вы получите ссылки на файлы с промптами.\n\n' +
        '⏳ *Статус:* ожидание проверки',
        { parse_mode: 'Markdown' }
    );
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка бота:', error.message);
    console.log('🔄 Перезапускаю бота через 5 секунд...');
    setTimeout(() => {
        console.log('🔄 Перезапуск...');
    }, 5000);
});

// Логирование всех сообщений (для отладки)
bot.on('message', (msg) => {
    console.log(`📩 ${msg.chat.id}: ${msg.text || '(фото/документ)'}`);
});

console.log('✅ Бот инициализирован!');
console.log('📁 Рабочая папка:', __dirname);