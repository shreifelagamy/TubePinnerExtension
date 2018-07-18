$(function () {
    $(document).ready(function () {
        var extId = 'ponogadffpmjilenhjppjahhbglmagon'
        
        chrome.storage.sync.get(["appId"], function (result) {
            if(result.appId)
                extId = result.appId
        })

        $('#form').on('submit', function (e) {
            e.preventDefault()

            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.cookies.getAll({
                    url: tabs[0].url
                }, function(cookies) {
                    console.log(cookies)
                })
                // check if page has video
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "checkVideoExist"
                }, function (response) {

                    // return true if page contains video tag
                    if (response.exists) {
                        // check if the url is youtube or udemy
                        if(checkUrl(tabs[0].url) == 'udemy') {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                action: "getUdemyLink"
                            }, function (response) {
                                chrome.runtime.sendMessage(extId, {
                                    action: "showUdemy",
                                    url: tabs[0].url
                                    // url: response.payload
                                }, handleUnloadedExt)
                            })
                        } else {
                            chrome.runtime.sendMessage(extId, {
                                action: "showYoutube",
                                url: tabs[0].url
                            }, handleUnloadedExt)
                        }
                    }
                });
            })
        })
    })

    var handleUnloadedExt = function (response) {
        if( typeof response == 'undefined' )
            $('label').text('Please load tubepin app or check id')
    }

    var checkUrl = function (url) {
        if (url.includes('udemy'))
            return 'udemy';
        else
            return 'youtube';
    }
})