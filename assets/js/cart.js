// FROM PROMPT TO RESULT - Логика корзины

class CartManager {
    constructor() {
        this.key = 'fptr_cart_v1';
        this.items = this.load();
    }
    
    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Cart load error:', e);
            return [];
        }
    }
    
    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.items));
            this.updateUI();
            return true;
        } catch (e) {
            console.error('Cart save error:', e);
            return false;
        }
    }
    
    add(product) {
        const item = {
            ...product,
            id: product.id,
            addedAt: new Date().toISOString(),
            quantity: 1
        };
        
        this.items.push(item);
        return this.save();
    }
    
    remove(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            return this.save();
        }
        return false;
    }
    
    clear() {
        this.items = [];
        return this.save();
    }
    
    get total() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    get count() {
        return this.items.length;
    }
    
    updateUI() {
        // Обновляем счетчик в заголовке
        const counter = document.getElementById('cartCounter');
        if (counter) {
            counter.textContent = this.count > 0 ? ` (${this.count})` : '';
        }
        
        // Обновляем Telegram кнопку если есть
        if (window.tg && window.tg.MainButton) {
            if (this.count > 0) {
                window.tg.MainButton.setText(`🛒 Корзина: ${this.total} ₽`);
                window.tg.MainButton.show();
            } else {
                window.tg.MainButton.hide();
            }
        }
    }
}

// Глобальный экземпляр корзины
const FPTRCart = new CartManager();

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FPTRCart;
}