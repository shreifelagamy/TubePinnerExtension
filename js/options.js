$(function () {
    var input = $('#app_id')

    $(document).ready(function () {
        chrome.storage.sync.get(['appId'], function(result) {
            input.val(result.appId)
        });
    });

    $('#options').on('submit', function () {
        var id = input.val()
        if(id) {
            chrome.storage.sync.set({'appId': id}, function () {
                close();
            });
        }
    });
})