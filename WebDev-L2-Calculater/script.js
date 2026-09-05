document.addEventListener('DOMContentLoaded', () => {
  const previousOperandTextElement = document.getElementById('previousOperand');
  const currentOperandTextElement = document.getElementById('currentOperand');
  const keypad = document.querySelector('.calculator-keypad');

  let currentOperand = '0';
  let previousOperand = '';
  let selectedOperator = undefined;
  let shouldResetScreen = false;
  let hasError = false;

  function clearCalculator() {
    currentOperand = '0';
    previousOperand = '';
    selectedOperator = undefined;
    shouldResetScreen = false;
    hasError = false;
    updateDisplay();
  }

  /* Removes the last entered character from the current input*/
  function deleteLastDigit() {
    if (hasError) {
      clearCalculator();
      return;
    }

    if (shouldResetScreen) {
      return;
    }

    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }

    if (currentOperand === '' || currentOperand === '-') {
      currentOperand = '0';
    }

    updateDisplay();
  }

  function toggleSign() {
    if (hasError || currentOperand === '0' || currentOperand === '') return;

    if (currentOperand.startsWith('-')) {
      currentOperand = currentOperand.substring(1);
    } else {
      currentOperand = '-' + currentOperand;
    }

    updateDisplay();
  }

  function appendNumber(number) {
    if (hasError) {
      clearCalculator();
    }

    if (shouldResetScreen) {
      currentOperand = '';
      shouldResetScreen = false;
    }

    if (number === '.') {
      if (currentOperand.includes('.')) return;
      if (currentOperand === '' || currentOperand === '0') {
        currentOperand = '0.';
        updateDisplay();
        return;
      }
    }

    if (currentOperand === '0' && number === '0') {
      return;
    }

    if (currentOperand === '0' && number !== '.') {
      currentOperand = number;
    } else {
      currentOperand += number;
    }

    updateDisplay();
  }

  function chooseOperator(operator) {
    if (hasError) return;

    if (currentOperand === '') {
      if (previousOperand !== '') {
        selectedOperator = operator;
        updateDisplay();
      }
      return;
    }

    if (previousOperand !== '' && selectedOperator !== undefined) {
      compute();
      if (hasError) return;
    }

    selectedOperator = operator;
    previousOperand = currentOperand;
    currentOperand = '';
    shouldResetScreen = false;
    updateDisplay();
  }

  function compute() {
    if (hasError) return;
    if (selectedOperator === undefined || previousOperand === '' || currentOperand === '') {
      return;
    }

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      displayError('Invalid Input');
      return;
    }

    let computationResult;

    switch (selectedOperator) {
      case '+':
        computationResult = prev + current;
        break;
      case '−':
      case '-':
        computationResult = prev - current;
        break;
      case '×':
      case '*':
        computationResult = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          displayError('Cannot divide by zero');
          return;
        }
        computationResult = prev / current;
        break;
      default:
        return;
    }

    computationResult = Math.round((computationResult + Number.EPSILON) * 1e12) / 1e12;

    currentOperand = computationResult.toString();
    selectedOperator = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
  }

  function displayError(message) {
    hasError = true;
    currentOperand = message;
    previousOperand = '';
    selectedOperator = undefined;
    shouldResetScreen = true;
    updateDisplay();
  }

  function formatDisplayNumber(numberString) {
    if (!numberString) return '';
    if (hasError) return numberString;
    if (numberString === '-') return '-';
    if (numberString.includes('e') || numberString.includes('E')) {
      return numberString;
    }

    const parts = numberString.split('.');
    const integerDigits = parseFloat(parts[0]);
    const decimalDigits = parts[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en-US', {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    }
    return integerDisplay;
  }

  function updateDisplay() {
    if (hasError) {
      currentOperandTextElement.textContent = currentOperand;
      previousOperandTextElement.textContent = '';
      currentOperandTextElement.style.fontSize = '1.35rem';
      currentOperandTextElement.style.color = '#f87171';
      return;
    }

    currentOperandTextElement.style.fontSize = '';
    currentOperandTextElement.style.color = '';

    const currentDisplayValue = formatDisplayNumber(currentOperand) || (previousOperand ? formatDisplayNumber(previousOperand) : '0');
    currentOperandTextElement.textContent = currentDisplayValue;

    if (selectedOperator != null && previousOperand !== '') {
      previousOperandTextElement.textContent = `${formatDisplayNumber(previousOperand)} ${selectedOperator}`;
    } else {
      previousOperandTextElement.textContent = '';
    }
  }

  /* Event delegation on the keypad using addEventListener*/
  keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.number != null) {
      appendNumber(button.dataset.number);
      return;
    }

    if (button.dataset.operator != null) {
      chooseOperator(button.dataset.operator);
      return;
    }

    const action = button.dataset.action;
    switch (action) {
      case 'decimal':
        appendNumber('.');
        break;
      case 'calculate':
        compute();
        break;
      case 'clear':
        clearCalculator();
        break;
      case 'delete':
        deleteLastDigit();
        break;
      case 'toggle-sign':
        toggleSign();
        break;
    }
  });

  /* Keyboard support for standard operations*/
  window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
      appendNumber(key);
      return;
    }

    if (key === '.') {
      appendNumber('.');
      return;
    }

    if (key === '+') {
      chooseOperator('+');
      return;
    }
    if (key === '-') {
      chooseOperator('−');
      return;
    }
    if (key === '*') {
      chooseOperator('×');
      return;
    }
    if (key === '/') {
      event.preventDefault(); // Prevent quick search in browsers
      chooseOperator('÷');
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      compute();
      return;
    }

    if (key === 'Backspace') {
      deleteLastDigit();
      return;
    }

    if (key === 'Escape' || key.toLowerCase() === 'c') {
      clearCalculator();
    }
  });

  updateDisplay();
});
