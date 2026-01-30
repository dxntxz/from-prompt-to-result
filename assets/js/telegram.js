 FROM PROMPT TO RESULT - Интеграция с Telegram API

class TelegramIntegration {
    constructor() {
        this.tg = null;
        this.user = null;
        this.initialized = false;
    }
    
    init() {
        if (typeof Telegram === 'undefined') {
            console.warn('Telegram WebApp not available');
            return false;
        }
        
        this.tg = Telegram.WebApp;
        
         Базовые настройки
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.tg.setHeaderColor('#000000');
        this.tg.setBackgroundColor('#ffffff');
        
         Получаем данные пользователя
        this.user = this.tg.initDataUnsafe.user  {
            id 0,
            first_name 'Гость',
            username 'guest'
        };
        
         Настраиваем кнопку
        this.setupMainButton();
        
        this.initialized = true;
        console.log('Telegram WebApp initialized for FROM PROMPT TO RESULT');
        return true;
    }
    
    setupMainButton() {
        if (!this.tg) return;
        
        this.tg.MainButton.setText('🛒 ОТКРЫТЬ КОРЗИНУ');
        this.tg.MainButton.onClick = () = {
            this.sendData({
                action 'open_cart',
                user_id this.user.id
            });
            
             В приложении переключаемся на корзину
            if (typeof showCartSection === 'function') {
                showCartSection();
            }
        };
    }
    
    showCartButton(count, total) {
        if (!this.tg) return;
        
        if (count  0) {
            this.tg.MainButton.setText(`🛒 КОРЗИНА ${total} ₽`);
            this.tg.MainButton.show();
        } else {
            this.tg.MainButton.hide();
        }
    }
    
    sendData(data) {
        if (!this.tg) return false;
        
        try {
            this.tg.sendData(JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Send data error', e);
            return false;
        }
    }
    
    showAlert(title, message) {
        if (!this.tg) {
            alert(`${title}nn${message}`);
            return;
        }
        
        this.tg.showAlert(`${title}nn${message}`);
    }
    
    showConfirm(title, message, callback) {
        if (!this.tg) {
            const result = confirm(`${title}nn${message}`);
            callback(result);
            return;
        }
        
        this.tg.showConfirm(`${title}nn${message}`, callback);
    }
    
     Покупка через Telegram Payments
    initiatePayment(products, total) {
        if (!this.tg  !this.tg.initInvoice) {
            this.showAlert('Ошибка', 'Платежи не поддерживаются');
            return;
        }
        
        const invoice = {
            title 'FROM PROMPT TO RESULT - Покупка промптов',
            description `Покупка ${products.length} наборов промптов`,
            payload JSON.stringify({
                user_id this.user.id,
                products products.map(p = p.id),
                total total
            }),
            currency 'RUB',
            prices [{
                label `Наборы промптов (${products.length} шт)`,
                amount total  100  в копейках
            }]
        };
        
        this.tg.openInvoice(invoice, (status) = {
            if (status === 'paid') {
                this.showAlert('Успешно!', 'Оплата прошла успешно! Ссылки отправлены вам в бота.');
                
                 Отправляем подтверждение
                this.sendData({
                    action 'payment_success',
                    user_id this.user.id,
                    amount total
                });
                
                 Очищаем корзину
                if (typeof FPTRCart !== 'undefined') {
                    FPTRCart.clear();
                }
                
            } else if (status === 'failed') {
                this.showAlert('Ошибка', 'Оплата не прошла. Попробуйте еще раз.');
            }
        });
    }
    
     Вибрация
    hapticFeedback(type = 'light') {
        if (!this.tg  !this.tg.HapticFeedback) return;
        
        const types = {
            'light' 'impactOccurred',
            'medium' 'impactOccurred',
            'heavy' 'impactOccurred',
            'success' 'notificationOccurred',
            'error' 'notificationOccurred'
        };
        
        if (types[type]) {
            this.tg.HapticFeedback[types[type]](type);
        }
    }
}

 Глобальный экземпляр
const FPTRTelegram = new TelegramIntegration();

 Автоинициализация при загрузке
document.addEventListener('DOMContentLoaded', () = {
    setTimeout(() = {
        FPTRTelegram.init();
    }, 100);
});