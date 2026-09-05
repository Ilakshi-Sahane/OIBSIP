document.addEventListener('DOMContentLoaded', () => {
    const temperatureInput = document.getElementById('temperature-input');
    const unitSelect = document.getElementById('unit-select');
    const convertButton = document.getElementById('convert-button');
    const errorContainer = document.getElementById('error-container');
    const errorMessageText = document.getElementById('error-message-text');

    const resultCelsius = document.getElementById('result-celsius');
    const resultFahrenheit = document.getElementById('result-fahrenheit');
    const resultKelvin = document.getElementById('result-kelvin');

    const cardCelsius = document.getElementById('result-card-celsius');
    const cardFahrenheit = document.getElementById('result-card-fahrenheit');
    const cardKelvin = document.getElementById('result-card-kelvin');

    const ABSOLUTE_ZERO = {
        celsius: -273.15,
        fahrenheit: -459.67,
        kelvin: 0
    };

    /**
     * Show error message container with custom text.
     * @param {string} message 
     */
    function showError(message) {
        errorMessageText.textContent = message;
        errorContainer.classList.remove('hidden');
        clearResults();
    }

    function hideError() {
        errorMessageText.textContent = '';
        errorContainer.classList.add('hidden');
    }

    
    function clearResults() {
        resultCelsius.textContent = '--';
        resultFahrenheit.textContent = '--';
        resultKelvin.textContent = '--';
    }

    /**
     * Format numbers to remove unnecessary trailing zeros and cap decimals.
     * @param {number} num 
     * @returns {string}
     */
    function formatTemperature(num) {
        const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    function updateActiveCardHighlight(unit) {
        cardCelsius.classList.remove('input-unit-active');
        cardFahrenheit.classList.remove('input-unit-active');
        cardKelvin.classList.remove('input-unit-active');

        if (unit === 'celsius') cardCelsius.classList.add('input-unit-active');
        if (unit === 'fahrenheit') cardFahrenheit.classList.add('input-unit-active');
        if (unit === 'kelvin') cardKelvin.classList.add('input-unit-active');
    }

    /**
     * Main calculation function that validates input and updates UI.
     */
    function performConversion() {
        const rawInput = temperatureInput.value.trim();
        const selectedUnit = unitSelect.value;

        updateActiveCardHighlight(selectedUnit);

        if (rawInput === '') {
            hideError();
            clearResults();
            return;
        }

        const numericValue = Number(rawInput);
        if (isNaN(numericValue)) {
            showError('Please enter a valid numeric temperature value.');
            return;
        }

        if (numericValue < ABSOLUTE_ZERO[selectedUnit]) {
            const unitLabel = selectedUnit === 'celsius' ? '°C' : selectedUnit === 'fahrenheit' ? '°F' : 'K';
            showError(`Input value cannot be below absolute zero (${ABSOLUTE_ZERO[selectedUnit]} ${unitLabel}).`);
            return;
        }

        hideError();
        let celsiusVal, fahrenheitVal, kelvinVal;

        switch (selectedUnit) {
            case 'celsius':
                celsiusVal = numericValue;
                fahrenheitVal = (numericValue * 9 / 5) + 32;
                kelvinVal = numericValue + 273.15;
                break;

            case 'fahrenheit':
                celsiusVal = (numericValue - 32) * 5 / 9;
                fahrenheitVal = numericValue;
                kelvinVal = ((numericValue - 32) * 5 / 9) + 273.15;
                break;

            case 'kelvin':
                celsiusVal = numericValue - 273.15;
                fahrenheitVal = ((numericValue - 273.15) * 9 / 5) + 32;
                kelvinVal = numericValue;
                break;
        }

        resultCelsius.textContent = formatTemperature(celsiusVal);
        resultFahrenheit.textContent = formatTemperature(fahrenheitVal);
        resultKelvin.textContent = formatTemperature(kelvinVal);
    }

    convertButton.addEventListener('click', performConversion);

    temperatureInput.addEventListener('input', performConversion);

    unitSelect.addEventListener('change', performConversion);

    updateActiveCardHighlight(unitSelect.value);
});
