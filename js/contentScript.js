// $(window).load(function () {
//     console.log('loaded')
// })

// chrome.runtime.sendMessage({action: "showPageAction"})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if( request.action == "checkVideoExist" ) {
        // check if youtube
        if( parseYoutubeId(window.location.href) && window.location.href.includes('youtube') ) {
            $('.ytp-play-button')[0].click()
            var time = $('.ytp-progress-bar').attr('aria-valuenow');
            sendResponse({exists: true, type: "youtube", url: parseUrl(window.location.href, time) })
        }
        else {
            var type = 'videos';
            var srcs = getVideoSources();
            // if no video srcs returned
            if( srcs.length == 0) {
                srcs = getIframeSources();
                type = 'iframes';
            }

            if( srcs.length == 0 )
                sendResponse({exists: false})
            else
                sendResponse({exists: true, type: type, urls: srcs})
        }
        
        sendResponse({exists: false})
        return true
    }

    sendResponse({exists: false})
    
})

var getVideoSources = function () {
    var videos = checkVideoTag()
    return getSources(videos);
}

var getIframeSources = function () {
    var iframes = checkIframes()
    return getSources(iframes)
}

var getSources = function (loop) {
    var srcs = new Array();
    $.each(loop, function (v, i) {
        var src = $(this).attr('src');
        if( src && (src.includes('video') || src.includes('embed') || src.includes('udemy') || src.includes('shahid')) && $.inArray(src, srcs) == -1 )
            srcs.push(src) 
    })

    return srcs;
}

var checkIframes = function () {
    return document.getElementsByTagName('iframe');
}

var checkVideoTag = function () {
    return document.getElementsByTagName('video');
}

// parse video id from url
var parseYoutubeId = function (url) {
    // http://stackoverflow.com/a/14701040
    var match = /^.*(youtube.com\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/.exec(url);

    if (match instanceof Array && match[2] !== undefined) {
        return match[2];
    } else {
        return false;
    }
}

var parseUrl = function (url, time) {
    var videoId = parseYoutubeId(url),
        listId = getUrlVars(url, 'list'),
        embedUrl = '';

    if (videoId) {
        embedUrl = window.location.protocol+'//www.youtube.com/embed/' + videoId;

        if (typeof listId !== 'undefined') {
            embedUrl += '?list=' + listId;

            if (typeof time !== 'undefined' && time !== false) {
                embedUrl += '&start=' + time;
            }
        } else {
            // embedUrl += 'autoplay=1';

            if (typeof time !== 'undefined' && time !== false) {
                embedUrl += '?start=' + time;
            }
        }

        return embedUrl;
    } else {
        return false;
    }
}

var getUrlVars = function (url, variable) {
    var vars = {},
        hash,
        hashes = url.slice(url.indexOf('?') + 1).split('&');

    for (var i = 0, len = hashes.length; i < len; i += 1) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars[variable];
}