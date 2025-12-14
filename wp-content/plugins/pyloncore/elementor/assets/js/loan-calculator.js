jQuery(document).ready(function($) {
    'use strict';

    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    // Calculate loan details
    function calculateLoan() {
        const loanAmount = parseFloat($('#pylon-loan-amount-value').text().replace(/,/g, ''));
        const loanTerm = parseInt($('#pylon-loan-term-value').text());
        const interestRate = parseFloat($('#pylon-interest-rate-value').text());
        
        // Monthly Interest Rate
        const monthlyRate = interestRate / 100 / 12;
        
        // EMI Calculation
        const emi = loanAmount * monthlyRate * 
                   Math.pow(1 + monthlyRate, loanTerm) / 
                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
        
        // Total Payment
        const totalPayment = emi * loanTerm;
        
        // Total Interest
        const totalInterest = totalPayment - loanAmount;
        
        // Update results
        $('#pylon-monthly-payment').text(emi.toFixed(2));
        $('#pylon-total-interest').text(totalInterest.toFixed(2));
        $('#pylon-total-payment').text(totalPayment.toFixed(2));
        
        // For style 2
        if ($('#pylon-loan-term-result').length) {
            $('#pylon-loan-term-result').text(loanTerm);
            $('#pylon-interest-rate-result').text(interestRate.toFixed(2));
        }
    }

    // Initialize sliders
    function initSliders() {
        // Loan Amount Slider
        $('#pylon-loan-amount-slider').slider({
            range: 'min',
            min: pylonLoanCalculator.min_amount,
            max: pylonLoanCalculator.max_amount,
            value: pylonLoanCalculator.default_amount,
            step: 100,
            slide: function(event, ui) {
                $('#pylon-loan-amount-value').text(formatNumber(ui.value));
                calculateLoan();
            },
            create: function() {
                $('#pylon-loan-amount-value').text(formatNumber($(this).slider('value')));
            }
        });

        // Loan Term Slider
        $('#pylon-loan-term-slider').slider({
            range: 'min',
            min: pylonLoanCalculator.min_term,
            max: pylonLoanCalculator.max_term,
            value: pylonLoanCalculator.default_term,
            slide: function(event, ui) {
                $('#pylon-loan-term-value').text(ui.value);
                if ($('#pylon-loan-term-result').length) {
                    $('#pylon-loan-term-result').text(ui.value);
                }
                calculateLoan();
            },
            create: function() {
                $('#pylon-loan-term-value').text($(this).slider('value'));
                if ($('#pylon-loan-term-result').length) {
                    $('#pylon-loan-term-result').text($(this).slider('value'));
                }
            }
        });

        // Interest Rate Slider
        $('#pylon-interest-rate-slider').slider({
            range: 'min',
            min: pylonLoanCalculator.min_interest,
            max: pylonLoanCalculator.max_interest,
            value: pylonLoanCalculator.default_interest,
            step: 0.1,
            slide: function(event, ui) {
                $('#pylon-interest-rate-value').text(ui.value.toFixed(2));
                if ($('#pylon-interest-rate-result').length) {
                    $('#pylon-interest-rate-result').text(ui.value.toFixed(2));
                }
                calculateLoan();
            },
            create: function() {
                $('#pylon-interest-rate-value').text($(this).slider('value').toFixed(2));
                if ($('#pylon-interest-rate-result').length) {
                    $('#pylon-interest-rate-result').text($(this).slider('value').toFixed(2));
                }
            }
        });

        // Initial calculation
        calculateLoan();
    }

    // Initialize calculator
    if (typeof pylonLoanCalculator !== 'undefined') {
        initSliders();
    }

    // Mobile touch support
    $(document).on('touchstart', '.ui-slider-handle', function() {
        $(this).addClass('ui-state-active');
    }).on('touchend', '.ui-slider-handle', function() {
        $(this).removeClass('ui-state-active');
    });
});