// Select DOM elements for slider and number output
let slider = document.querySelector('#slider');
let numberOutput = document.querySelector('.character-amount');

// DOM elements for password display and copy functionality
const passwordArea = document.querySelector('.password-text');
const copyGraphic = document.querySelector('.copy');
const copiedText = document.querySelector('.copied-text');
const button = document.querySelector('.generate');

// Input and form elements for interaction
const input = document.querySelector("input");
const form = document.querySelector('.form-section');

// Checkbox elements for selecting character types
const uppercaseCheckbox = document.querySelector('#uppercase');
const lowercaseCheckbox = document.querySelector('#lowercase');
const numbersCheckbox = document.querySelector('#numbers');
const symbolsCheckbox = document.querySelector('#symbols');
const checkboxContainer = document.querySelector('.checkbox-container:nth-of-type(4)');

// Error message display
const error = document.querySelector('.error');

// Password strength elements
const strengthWord = document.querySelector('.strength-word');
const tooWeak = document.querySelector('#too-weak');
const weak = document.querySelector('#weak');
const medium = document.querySelector('#medium');
const strong = document.querySelector('#strong');

// Character arrays for password generation
const uppercaseArray = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const lowercaseArray = [...'abcdefghijklmnopqrstuvwxyz'];
const numbersArray = [...'0123456789'];
const symbolsArray = [...'!@#$%^&*()-_+=[]{}|;:,.<>?'];

// --SLIDER FUNCTIONALITY--

// Display slider value
numberOutput.innerText = slider.value;

// Update slider value display dynamically
slider.oninput = function () {
    numberOutput.textContent = this.value;
};

// Set background size of the input range element
setBackgroundSize(input);
function setBackgroundSize(input) {
    input.style.setProperty("--background-size", `${getBackgroundSize(input)}%`);
}

// Update slider background size when value changes
input.addEventListener("input", () => setBackgroundSize(input));

// Calculate background size percentage for slider
function getBackgroundSize(input) {
    const min = +input.min || 1;
    const max = +input.max || 20;
    const value = +input.value;
    const size = (value - min) / (max - min) * 100;
    return size;
}

// -- SLIDER FUNCTIONALITY END --

// Generate a master array based on selected character types
function getMasterArray() {
    masterArray = [];
    if (uppercaseCheckbox.checked) masterArray.push(...uppercaseArray);
    if (lowercaseCheckbox.checked) masterArray.push(...lowercaseArray);
    if (numbersCheckbox.checked) masterArray.push(...numbersArray);
    if (symbolsCheckbox.checked) masterArray.push(...symbolsArray);
    return masterArray;
}

// Class for password generation
class RandomPasswordGenerator {
    constructor() {
        this.password = [];
    }

    // Method to generate a random password
    generate(masterArray, length) {
        this.password = []; // Reset password
        const usedIndices = new Set(); // Track used indices for uniqueness

        // Generate password until desired length is reached
        while (this.password.length < length) {
            const randomIndex = Math.floor(Math.random() * masterArray.length);
            if (!usedIndices.has(randomIndex)) {
                this.password.push(masterArray[randomIndex]);
                usedIndices.add(randomIndex);
            }
        }
        return this.password;
    }
}

// Button click event to generate password
button.addEventListener('click', (e) => {
    e.preventDefault();

    // Show error if no character type is selected
    if (!uppercaseCheckbox.checked && !lowercaseCheckbox.checked &&
        !numbersCheckbox.checked && !symbolsCheckbox.checked) {
        error.style.display = 'block';
        checkboxContainer.style.marginBottom = '1rem';
        return error;
    } else {
        error.style.display = 'none';
        checkboxContainer.style.marginBottom = '2rem';
    }

    // Generate password and display
    const passwordGenerator = new RandomPasswordGenerator();
    const passwordArray = passwordGenerator.generate(getMasterArray(), slider.value);
    const passwordString = passwordArray.join('');
    checkPasswordStrength(passwordString);
    passwordArea.innerText = passwordString;
    passwordArea.style.opacity = '1';
});

// Copy password functionality
copyGraphic.addEventListener('click', () => {
    const copyPassword = passwordArea.innerText;
    navigator.clipboard.writeText(copyPassword);
    copiedText.innerText = 'copied';
    passwordArea.innerText = 'P4$5W0rD!';
    passwordArea.style.opacity = '0.25';

    // Reset state after copy
    setTimeout(() => copiedText.innerText = '', 3000);
    form.reset();
    setBackgroundSize(input);
    numberOutput.textContent = '10';
    resetBars();
});

// Check password strength based on length and character types
function checkPasswordStrength(password) {
    resetBars();
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()\-_+=\[\]{}|;:,.<>?]/.test(password);
    const characterTypes = hasUppercase + hasLowercase + hasNumbers + hasSymbols;

    // Update strength indicators
    if (length < 8) {
        strengthWord.innerText = 'too weak!';
        tooWeak.style.backgroundColor = 'hsl(0, 91%, 63%)'; // Red
    } else if (length >= 8 && characterTypes === 1) {
        strengthWord.innerText = 'weak';
        tooWeak.style.backgroundColor = 'hsl(13, 95%, 66%)'; // Orange
        weak.style.backgroundColor = 'hsl(13, 95%, 66%)';
    } else if (length >= 8 && characterTypes >= 2) {
        strengthWord.innerText = 'medium';
        tooWeak.style.backgroundColor = 'hsl(42, 91%, 68%)'; // Yellow
        weak.style.backgroundColor = 'hsl(42, 91%, 68%)';
        medium.style.backgroundColor = 'hsl(42, 91%, 68%)';
    } else if (length >= 8 && characterTypes >= 3) {
        strengthWord.innerText = 'strong';
        tooWeak.style.backgroundColor = 'hsl(127, 100%, 82%)'; // Green
        weak.style.backgroundColor = 'hsl(127, 100%, 82%)';
        medium.style.backgroundColor = 'hsl(127, 100%, 82%)';
        strong.style.backgroundColor = 'hsl(127, 100%, 82%)';
    }
}

// Reset strength indicator bars
function resetBars() {
    strengthWord.innerText = '';
    [tooWeak, weak, medium, strong].forEach(bar => {
        bar.style.border = '2px solid hsl(252, 11%, 91%)';
        bar.style.backgroundColor = 'transparent';
    });
}
