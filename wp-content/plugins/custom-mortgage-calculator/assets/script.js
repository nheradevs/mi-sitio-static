jQuery(document).ready(function ($) {

    // Default values (fallback)
    let interestFixed = 2.05;
    let euribor = 3.5;
    let differential = 0.35;

    // Load from Admin Settings if available
    if (typeof cmcData !== 'undefined') {
        interestFixed = parseFloat(cmcData.interestFixed) || 2.05;
        euribor = parseFloat(cmcData.euribor) || 3.5;
        differential = parseFloat(cmcData.differential) || 0.35;
    }

    // Update Display Values
    $('#cmc-fixed-rate-display').text(interestFixed);
    $('#cmc-var-diff-display').text(differential);

    // Elements
    const propertyValueInput = $('#cmc-property-value');
    const propertyValueSlider = $('#cmc-property-value-slider');
    const loanAmountInput = $('#cmc-loan-amount');
    const loanAmountSlider = $('#cmc-loan-amount-slider');
    const termInput = $('#cmc-term');
    const termSlider = $('#cmc-term-slider');

    const fixedPaymentDisplay = $('#cmc-fixed-payment');
    const variablePaymentDisplay = $('#cmc-variable-payment');
    const displayTerm = $('.cmc-display-term');

    // Sync Input and Slider
    function syncInputs(input, slider) {
        input.on('input', function () {
            let val = parseFloat(this.value);
            if (!isNaN(val)) {
                slider.val(val);
                updateSliderBackground(slider);
                calculateMortgage();
            }
        });
        slider.on('input', function () {
            input.val(this.value);
            updateSliderBackground(slider);
            calculateMortgage();
        });
    }

    syncInputs(propertyValueInput, propertyValueSlider);
    syncInputs(loanAmountInput, loanAmountSlider);
    syncInputs(termInput, termSlider);

    function updateCalculator() {
        let propertyValue = parseFloat($('#cmc-property-value').val()) || 0;
        let loanAmount = parseFloat($('#cmc-loan-amount').val()) || 0;
        let years = parseFloat($('#cmc-term').val()) || 0;

        // Update term display in results
        $('.cmc-term-display').text(years);

        // Logic to prevent loan amount > property value (optional but good UX)
        if (loanAmount > propertyValue) {
            // loanAmount = propertyValue;
            // $('#cmc-loan-amount').val(loanAmount);
            // $('#cmc-loan-amount-slider').val(loanAmount);
        }
    }

    // Calculation Logic
    function calculateMortgage() {
        let loanAmount = parseFloat(loanAmountInput.val());
        let termYears = parseFloat(termInput.val());

        if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(termYears) || termYears <= 0) {
            return;
        }

        // Update Term Display
        displayTerm.text(termYears);
        $('.cmc-term-display').text(termYears); // Added this line based on the instruction's intent

        // 1. Calculate Fixed Rate Payment
        let monthlyRateFixed = (interestFixed / 100) / 12;
        let numberOfPayments = termYears * 12;
        let paymentFixed = loanAmount * (monthlyRateFixed * Math.pow(1 + monthlyRateFixed, numberOfPayments)) / (Math.pow(1 + monthlyRateFixed, numberOfPayments) - 1);

        // 2. Calculate Variable Rate Payment
        let variableRateTotal = euribor + differential;
        let monthlyRateVar = (variableRateTotal / 100) / 12;
        let paymentVariable = loanAmount * (monthlyRateVar * Math.pow(1 + monthlyRateVar, numberOfPayments)) / (Math.pow(1 + monthlyRateVar, numberOfPayments) - 1);

        // Update UI
        fixedPaymentDisplay.text('€' + paymentFixed.toFixed(0)); // Round to whole number for cleaner look
        variablePaymentDisplay.text('€' + paymentVariable.toFixed(0));
    }

    // Add visual progress to sliders
    function updateSliderBackground(slider) {
        const value = (slider.val() - slider.attr('min')) / (slider.attr('max') - slider.attr('min')) * 100;
        // Use CSS variable for color if possible, else fallback
        let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--cmc-secondary').trim() || '#2c3e50';
        slider.css('background', `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${value}%, #e1e1e1 ${value}%, #e1e1e1 100%)`);
    }

    $('.cmc-slider').on('input', function () {
        updateSliderBackground($(this));
    });

    // Initialize
    $('.cmc-slider').each(function () {
        updateSliderBackground($(this));
    });
    calculateMortgage();
});
