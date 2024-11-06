function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3;
        const duration = 3 + Math.random() * 3;
        
        star.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            --duration: ${duration}s;
        `;
        
        starsContainer.appendChild(star);
    }
}

let exchangeRates = {};
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        exchangeRates = data.rates;
        populateDropdowns();
    } catch (error) {
        showError('Failed to fetch exchange rates. Please try again later.');
    }
}
function populateDropdowns() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    fromSelect.innerHTML = '<option value="" disabled selected>Select currency</option>';
    toSelect.innerHTML = '<option value="" disabled selected>Select currency</option>';
    Object.keys(exchangeRates).sort().forEach(currency => {
        const fromOption = new Option(currency, currency);
        const toOption = new Option(currency, currency);
        
        fromSelect.add(fromOption);
        toSelect.add(toOption);
    });
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
}
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (!amount || !fromCurrency || !toCurrency) {
        showError('Please fill in all fields');
        return;
    }
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];
    const resultElement = document.getElementById('result');
    const convertedAmountElement = document.getElementById('convertedAmount');
    const conversionRateElement = document.getElementById('conversionRate');
    
    convertedAmountElement.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
    conversionRateElement.textContent = `1 ${fromCurrency} = ${(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} ${toCurrency}`;
    
    resultElement.classList.add('visible');
    document.getElementById('error').classList.remove('visible');
}


function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    document.getElementById('result').classList.remove('visible');
}

function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    if (document.getElementById('amount').value) {
        convertCurrency();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    fetchExchangeRates();
    
    document.getElementById('convertBtn').addEventListener('click', convertCurrency);
    document.getElementById('swapBtn').addEventListener('click', swapCurrencies);
    
    document.getElementById('amount').addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    });
    
    document.getElementById('fromCurrency').addEventListener('change', () => {
        if (document.getElementById('amount').value) {
            convertCurrency();
        }
    });
    
    document.getElementById('toCurrency').addEventListener('change', () => {
        if (document.getElementById('amount').value) {
            convertCurrency();
        }
    });
});