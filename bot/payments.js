// payments.js - Интеграция с ЮMoney/ЮKassa
const fetch = require('node-fetch');

class PaymentService {
    constructor() {
        // ТВОИ ДАННЫЕ ИЗ ЮKASSA (получишь после регистрации)
        this.shopId = 'ТВОЙ_SHOP_ID'; // ВСТАВИТЬ ПОСЛЕ РЕГИСТРАЦИИ
        this.secretKey = 'ТВОЙ_SECRET_KEY'; // ВСТАВИТЬ ПОСЛЕ РЕГИСТРАЦИИ
    }
    
    async createPayment(amount, orderId, userId, description) {
        try {
            // Если нет ключей - возвращаем заглушку (режим скриншотов)
            if (this.shopId === 'ТВОЙ_SHOP_ID') {
                console.log('ℹ️ ЮMoney не настроен, используем режим скриншотов');
                return { success: false, error: 'not_configured' };
            }
            
            const response = await fetch('https://api.yookassa.ru/v3/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotence-Key': orderId.toString(),
                    'Authorization': 'Basic ' + Buffer.from(this.shopId + ':' + this.secretKey).toString('base64')
                },
                body: JSON.stringify({
                    amount: {
                        value: amount.toFixed(2),
                        currency: 'RUB'
                    },
                    confirmation: {
                        type: 'redirect',
                        return_url: 'https://t.me/FRPT_BOT'
                    },
                    capture: true,
                    description: description,
                    metadata: {
                        user_id: userId,
                        order_id: orderId
                    }
                })
            });
            
            const data = await response.json();
            
            if (data.confirmation && data.confirmation.confirmation_url) {
                return {
                    success: true,
                    paymentId: data.id,
                    url: data.confirmation.confirmation_url
                };
            } else {
                console.log('❌ Ошибка ЮMoney:', data);
                return { success: false, error: data };
            }
        } catch (error) {
            console.error('❌ Ошибка создания платежа:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new PaymentService();