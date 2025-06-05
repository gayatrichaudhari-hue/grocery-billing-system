const predefinedItems = [
    { name: 'Rice', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200} },
    { name: 'Wheat', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200} },
    { name: 'Sugar', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200} },
    { name: 'Salt', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'ponds powder', prices: { '50gm': 30, '100gm': 50,'150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'rava', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200 }},
    { name: 'cornflour', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'maida', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'coconut oil', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'dal', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
    { name: 'almond oil', prices: { '50gm': 30, '100gm': 50, '150gm': 90, '200gm': 100, '250gm': 150, '500gm': 200}},
     
];
// Global variables
let billItems = [];
let billNumber = Math.floor(Math.random() * 100000);
let itemIdCounter = 1;

// DOM elements
const itemForm = document.getElementById('itemForm');
const itemNameInput = document.getElementById('itemName');
const itemSizeSelect = document.getElementById('itemSize');
const sizeGroup = document.getElementById('sizeGroup');
const itemPriceInput = document.getElementById('itemPrice');
const itemQuantityInput = document.getElementById('itemQuantity');
const suggestionsDiv = document.getElementById('suggestions');
const billItemsDiv = document.getElementById('billItems');
const billSummaryDiv = document.getElementById('billSummary');
const actionButtonsDiv = document.getElementById('actionButtons');
const billModal = document.getElementById('billModal');
const billPreviewDiv = document.getElementById('billPreview');

document.getElementById('itemSize').addEventListener('change', () => {
    const inputVal = itemNameInput.value.trim().toLowerCase();
    const item = predefinedItems.find(i => i.name.toLowerCase() === inputVal);
    if (item) {
        const selectedSize = document.getElementById('itemSize').value;
        itemPriceInput.value = item.prices[selectedSize] || '';
    }
});

// Initialize the application
function init() {
    updateBillNumber();
    setupEventListeners();
    updateDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    itemForm.addEventListener('submit', handleAddItem);
    
    // Item name input for suggestions
    itemNameInput.addEventListener('input', handleNameInput);
    itemNameInput.addEventListener('focus', handleNameFocus);
    itemNameInput.addEventListener('blur', handleNameBlur);
    
    // Clear all button
    document.getElementById('clearAll').addEventListener('click', clearAllItems);
    
    // Modal controls
    document.getElementById('previewBill').addEventListener('click', showBillPreview);
    document.querySelector('.close').addEventListener('click', closeBillModal);
    document.getElementById('printBill').addEventListener('click', printBill);
    document.getElementById('downloadPdf').addEventListener('click', downloadBill);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === billModal) {
            closeBillModal();
        }
    });
}

// Update bill number display
function updateBillNumber() {
    document.getElementById('billNumber').textContent = `BillID: ${billNumber}`;
}

function handleNameInput(e) {
    const value = e.target.value.trim().toLowerCase();

    if (value.length > 0) {
        const filtered = predefinedItems.filter(item =>
            item.name.toLowerCase().includes(value)
        );
        showSuggestions(filtered.slice(0, 5));

        const exactMatch = predefinedItems.find(item =>
            item.name.toLowerCase() === value
        );
        if (exactMatch) {
    const selectedSize = document.getElementById('itemSize').value;
    itemPriceInput.value = exactMatch.prices[selectedSize] || '';

        } else {
            itemPriceInput.value = '';
        }
    } else {
        hideSuggestions();
        itemPriceInput.value = '';
    }
}

function handleNameFocus(e) {
    if (e.target.value.trim()) {
        handleNameInput(e);
    }
}

function handleNameBlur() {
    setTimeout(() => {
        hideSuggestions();
    }, 200);
}

function showSuggestions(items) {
    if (items.length === 0) {
        hideSuggestions();
        return;
    }

    suggestionsDiv.innerHTML = '';
    items.forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <span class="suggestion-name">${item.name}</span>
           
        `;
        suggestionItem.addEventListener('mousedown', () => selectSuggestion(item));
        suggestionsDiv.appendChild(suggestionItem);
    });

    suggestionsDiv.style.display = 'block';
}

function hideSuggestions() {
    suggestionsDiv.style.display = 'none';
}

function selectSuggestion(item) {
    itemNameInput.value = item.name;
    itemPriceInput.value = item.price;
    hideSuggestions();
    itemNameInput.focus();
    itemQuantityInput.focus();
}



// Called when an item name is selected or entered
function updateSizeOptions(productName) {
    const product = productData[productName];
    const sizeOptions = document.getElementById('sizeOptions');

    // Clear existing options
    sizeOptions.replaceChildren();

    if (product && product.sizes) {
        Object.keys(product.sizes).forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            sizeOptions.appendChild(option);
        });
    }
}


// Auto-suggestion selection or manual input event
itemNameInput.addEventListener('input', () => {
    const name = itemNameInput.value.trim();
    updateSizeOptions(name);
});

itemSizeSelect.addEventListener('change', () => {
    const productName = itemNameInput.value.trim();
    const selectedSize = itemSizeSelect.value;
    const product = productData[productName];
    if (product && product.sizes[selectedSize]) {
        itemPriceInput.value = product.sizes[selectedSize];
    } else {
        itemPriceInput.value = '';
    }
});

// Handle adding new item
function handleAddItem(e) {
    e.preventDefault();
    
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    const quantity = parseInt(itemQuantityInput.value);
    
    if (!name || !price || !quantity) {
        alert('Please fill in all fields');
        return;
    }
    
    if (price <= 0 || quantity <= 0) {
        alert('Price and quantity must be greater than 0');
        return;
    }
    
    const size = document.getElementById('itemSize').value;

const newItem = {
    id: itemIdCounter++,
    name: name,
    size: size,
    price: price,
    quantity: quantity,
    total: price * quantity

    };
    
    billItems.push(newItem);
  
  
    
    // Reset form
    itemForm.reset();
    itemQuantityInput.value = '1';
    
    updateDisplay();
}

// Update the display
function updateDisplay() {
    updateBillItems();
    updateStats();
    updateSummary();
    
    // Show/hide action buttons
    if (billItems.length > 0) {
        actionButtonsDiv.style.display = 'flex';
        billSummaryDiv.style.display = 'block';
    } else {
        actionButtonsDiv.style.display = 'none';
        billSummaryDiv.style.display = 'none';
    }
}

// Update bill items display
function updateBillItems() {
    if (billItems.length === 0) {
        billItemsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <div class="empty-text">No items added yet</div>
                
            </div>
        `;
        return;
    }
    
    billItemsDiv.innerHTML = '';
    billItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bill-item';
        itemDiv.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name} (${item.size})</div>

                <div class="item-price">₹${item.price.toFixed(2)} each</div>
            </div>
            <div class="item-controls">
                <span style="color: #6b7280; font-size: 0.9rem;">Qty:</span>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" onchange="updateItemQuantity(${item.id}, this.value)">
                <div class="item-total">₹${item.total.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
            </div>
        `;
        billItemsDiv.appendChild(itemDiv);
    });
}

// Update statistics
function updateStats() {
    const itemCount = billItems.length;
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('itemCount').textContent = itemCount;
    document.getElementById('subtotalAmount').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
}



// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) return;
    
    const item = billItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
        item.total = item.price * quantity;
        updateDisplay();
    }
}

// Remove item
function removeItem(itemId) {
    billItems = billItems.filter(item => item.id !== itemId);
    updateDisplay();
}

// Clear all items
function clearAllItems() {
    if (billItems.length === 0) 
      return;
    
    if (confirm('Are you sure you want to clear all items?')) {
        billItems = [];
        billNumber = Math.floor(Math.random() * 100000);
        updateBillNumber();
        updateDisplay();
    }
}

// Show bill preview modal
function showBillPreview() {
    generateBillPreview();
    billModal.style.display = 'block';
}

// Close bill modal
function closeBillModal() {
    billModal.style.display = 'none';
}

// Generate bill preview content
function generateBillPreview() {
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let itemsHtml = '';
    billItems.forEach(item => {
        itemsHtml += `
            <tr>
               <td>${item.name} (${item.size})</td>

                <td style="text-align: center;">₹${item.price.toFixed(2)}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    billPreviewDiv.innerHTML = `
        <div class="bill-preview">
            <div class="store-header">
                <div class="store-name">Grocery Store</div>
                <div class="store-info">
                    abc nagar, xyz 445301
                    Phone: 1234567890 | Email: .....
                </div>
            </div>
            
            <h3 style="text-align: center; margin-bottom: 20px; color: #374151;">INVOICE</h3>
            
            <div class="bill-details">
                <span>Bill No: ${billNumber}</span>
                <span>Date: ${currentDate}</span>
                <span>Time: ${currentTime}</span>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: center;">Price</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Tax (10%):</span>
                    <span>₹${tax.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 8px; font-weight: bold; font-size: 1.1rem;">
                    <span>Total:</span>
                    <span>₹${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="bill-footer">
                Thank you for shopping with us!
            </div>
        </div>
    `;
}

// Print bill
function printBill() {
    window.print();
}

// Download bill as text file 
function downloadBill() {
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');
    
    let billText = `
GROCERY STORE
abc nagar, xyz 445301
Phone: 1234567890 | Email: .....

INVOICE
========================================

Bill No: ${billNumber}
Date: ${currentDate}
Time: ${currentTime}

========================================
ITEMS:
========================================

`;
    
    billItems.forEach(item => {
        billText += `${item.name.padEnd(25)} ₹${item.price.toFixed(2).padStart(8)} x ${item.quantity.toString().padStart(3)} = ₹${item.total.toFixed(2).padStart(8)}\n`;
    });
    
    billText += `
========================================
SUMMARY:
========================================

Subtotal:                    ₹${subtotal.toFixed(2).padStart(8)}
Tax (10%):                   ₹${tax.toFixed(2).padStart(8)}
----------------------------------------
TOTAL:                       ₹${total.toFixed(2).padStart(8)}

========================================

Thank you for shopping with us!
`;
    
    // Create and download the file
    const blob = new Blob([billText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GroceryStore-Bill-${billNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);