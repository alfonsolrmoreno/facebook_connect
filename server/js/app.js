$(document).ready(function() {
    $.ajaxSetup({cache: true});
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
        FB.init({
            appId: '937608466368165',
            version: 'v2.5' // or v2.0, v2.1, v2.2, v2.3
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(function(a, b, c, d) {
            clog(a, b, c, d)
        });
    });
});

splash_hide();

function display_app() {
    if (!this.destroyed) {
        $.backstretch('destroy');
        this.destroyed = true;
    }
    $('#img_white_bg').remove();
    $('#img_loading_gif').remove();
}
display_app();

var login = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email'});
}

var showDialog = function() {
    facebookConnectPlugin.showDialog({method: "feed"},
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var apiTest = function() {
    facebookConnectPlugin.api("me/?fields=id,email", ["user_birthday"],
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var logPurchase = function() {
    facebookConnectPlugin.logPurchase(1.99, "USD",
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var logEvent = function() {
    // For more information on AppEvent param structure see
    // https://developers.facebook.com/docs/ios/app-events
    // https://developers.facebook.com/docs/android/app-events
    facebookConnectPlugin.logEvent("Purchased",
            {
                NumItems: 1,
                Currency: "USD",
                ContentType: "shoes",
                ContentID: "HDFU-8452"
            }, null,
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var getAccessToken = function() {
    facebookConnectPlugin.getAccessToken(
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var getStatus = function() {
    facebookConnectPlugin.getLoginStatus(
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}

var logout = function() {
    facebookConnectPlugin.logout(
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
}
            