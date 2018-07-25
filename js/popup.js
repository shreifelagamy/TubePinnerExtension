$(function () {
    var extId = 'ponogadffpmjilenhjppjahhbglmagon'
    $(document).ready(function () {

        chrome.storage.sync.get(["appId"], function (result) {
            if (result.appId)
                extId = result.appId
        })

        $('#form').on('submit', function (e) {
            e.preventDefault()

            showLoadingText();
            /**
             * TODO: List todo
             * 1- Check if the website contain any video tags, iframes or is youtube
             * 2- if the website contain multiple tags display them to the user to choose from 
             * 3- display popup application per selection
             */
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "checkVideoExist"
                }, function (response) {
                    console.log(response)
                    removeLoading();

                    if( response && response.exists ) {
                        switch(response.type) {
                            case "youtube":
                                chrome.runtime.sendMessage(extId, {
                                    action: "showVideo",
                                    url: response.url
                                }, handleUnloadedExt)
                                break;

                            case "iframes":
                                case "videos":
                                drawLinks(response.urls);
                                break;
                        }

                    }
                    else {
                        showNoLinks();
                    }
                })
            })
        })
    })

    var removeLoading = function () {
        $('button').prop('disabled', false).find('i').removeClass(['ld', 'ld-surprise']);
        $('.form-control').find('label').text('');
    }

    var showLoadingText = function () {
        $('.form-control').find('label').text('Loading .... !');
        $('button').prop('disabled', true).find('i').addClass('ld ld-surprise');
    }

    var showNoLinks = function () {
        $('.form-control').find('label').text('No videos links found!');
    }

    var showLinksText = function () {
        $('#result').prepend('<p><b>found some links please choose one:</b></p>');
    }

    var showYoutubeMsg = function () {
        $('#result').prepend('<h3>Youtube found and video currently loaded</h3>');
    }

    var drawLinks = function (loop) {
        $('#result').html('<div class="list list-group"></div>')
        $.each(loop, function(i, v) {
            $('.list').append('<a class="links list-group-item list-group-item-action" href="'+v+'">'+_.truncate(v, { 'length': 28 })+'</a>')
        })
        iframeLinkClick()
        showLinksText();
    }

    var iframeLinkClick = function () {
        $('.links').on('click', function (e) {
            e.preventDefault();
            chrome.runtime.sendMessage(extId, {
                action: "showVideo",
                url: $(this).attr('href')
            }, handleUnloadedExt)
        })
    }

    var handleUnloadedExt = function (response) {
        if (typeof response == 'undefined')
            $('label').text('Please load tubepin app or check id')
        else 
            showYoutubeMsg();
    }
})