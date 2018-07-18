chrome.runtime.sendMessage({action: "showPageAction"})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if( request.action == 'getUdemyLink' ) {
        var src = $('video').attr('src')
        sendResponse({payload: src})
    }
    else if( request.action == "checkVideoExist" ) {
        sendResponse({exists: $('video').length})
        return true
    }

})