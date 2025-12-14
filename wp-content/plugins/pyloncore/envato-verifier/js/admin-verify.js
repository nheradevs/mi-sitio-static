jQuery(document).ready(function ($) {
    function showResponseMessage(type, message) {
        const noticeClass = {
            success: 'notice-success',
            error: 'notice-error',
            warning: 'notice-warning'
        }[type] || 'notice-info';

        $('#envato-response-area')
            .removeClass('notice-success notice-error notice-warning notice-info')
            .addClass('notice ' + noticeClass)
            .show()
            .find('p')
            .text(message);
    }

    $('#verify_btn').on('click', function (e) {
        e.preventDefault();
        const code = $('#purchase_code').val();

        $.post(EnvatoVerifier.ajax_url, {
            action: 'envato_verify',
            nonce: EnvatoVerifier.nonce,
            purchase_code: code
        }, function (response) {
            if (response.success) {
                showResponseMessage('success', response.data.remote_response.message || response.data.message);
                //location.reload(); // Optional
            } else {
                showResponseMessage('error', response.data.message);
            }
        });
    });

    $('#revoke_btn').on('click', function (e) {
        e.preventDefault();

        $.post(EnvatoVerifier.ajax_url, {
            action: 'envato_revoke',
            nonce: EnvatoVerifier.nonce
        }, function (response) {
            if (response.success) {
                showResponseMessage('success', response.data.message);
                location.reload(); // Optional
            } else {
                showResponseMessage('error', response.data.message);
            }
        });
    });
});
