
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

$(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        alert('ok 1')
    }, function(error) {
        alert('err 2')
/*
        cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to works.", //message 
                "Use GPS, with wifi or 3G.", //description 
                function(buttonIndex) {//callback 
                    switch (buttonIndex) {
                        case 0:
                            break;//cancel 
                        case 1:
                            break;//neutro option 
                        case 2:
                            break;//user go to configuration 
                    }
                },
                "Please Turn on GPS", //title 
                ["Cancel", "Later", "Go"]);//buttons 
                */
    }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });


        navigator.geolocation.watchPosition(function(res) {
            alert('watchPosition ok ')
        }
        , function(res) {
            //res.PERMISSION_DENIED == '1'
            var msg = '';
            for(var i in res)msg+="\n"+i+' => '+res[i]
            alert('watchPosition ERR '+msg)
        });
        
    if (!window.cordova) {

        window.facebookConnectPlugin = {
            getLoginStatus: function(s, f) {
                // Try will catch errors when SDK has not been init
                try {
                    FB.getLoginStatus(function(response) {
                        s(response);
                    });
                } catch (error) {
                    if (!f) {
                        console.error(error.message);
                    } else {
                        f(error.message);
                    }
                }
            },
            showDialog: function(options, s, f) {

                if (!options.name) {
                    options.name = "";
                }
                if (!options.message) {
                    options.message = "";
                }
                if (!options.caption) {
                    options.caption = "";
                }
                if (!options.description) {
                    options.description = "";
                }
                if (!options.href) {
                    options.href = "";
                }
                if (!options.picture) {
                    options.picture = "";
                }

                // Try will catch errors when SDK has not been init
                try {
                    FB.ui(options,
                            function(response) {
                                if (response && (response.request || !response.error_code)) {
                                    s(response);
                                } else {
                                    f(response);
                                }
                            });
                } catch (error) {
                    if (!f) {
                        console.error(error.message);
                    } else {
                        f(error.message);
                    }
                }
            },
            // Attach this to a UI element, this requires user interaction.
            login: function(permissions, s, f) {
                // JS SDK takes an object here but the native SDKs use array.
                var permissionObj = {};
                if (permissions && permissions.length > 0) {
                    permissionObj.scope = permissions.toString();
                }

                FB.login(function(response) {
                    if (response.authResponse) {
                        s(response);
                    } else {
                        f(response.status);
                    }
                }, permissionObj);
            },
            getAccessToken: function(s, f) {
                var response = FB.getAccessToken();
                if (!response) {
                    if (!f) {
                        console.error("NO_TOKEN");
                    } else {
                        f("NO_TOKEN");
                    }
                } else {
                    s(response);
                }
            },
            logEvent: function(eventName, params, valueToSum, s, f) {
                // AppEvents are not avaliable in JS.
                s();
            },
            logPurchase: function(value, currency, s, f) {
                // AppEvents are not avaliable in JS.
                s();
            },
            logout: function(s, f) {
                // Try will catch errors when SDK has not been init
                try {
                    FB.logout(function(response) {
                        s(response);
                    });
                } catch (error) {
                    if (!f) {
                        console.error(error.message);
                    } else {
                        f(error.message);
                    }
                }
            },
            api: function(graphPath, permissions, s, f) {
                // JS API does not take additional permissions

                // Try will catch errors when SDK has not been init
                try {
                    FB.api(graphPath, function(response) {
                        if (response.error) {
                            f(response);
                        } else {
                            s(response);
                        }
                    });
                } catch (error) {
                    if (!f) {
                        console.error(error.message);
                    } else {
                        f(error.message);
                    }
                }
            },
            // Browser wrapper API ONLY
            browserInit: function(appId, version) {
                if (!version) {
                    version = "v2.0";
                }
                FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: version
                });
            }
        };

        // Bake in the JS SDK
        (function() {
            if (!window.FB) {
                console.log("launching FB SDK");
                var e = document.createElement('script');
                e.src = 'https://connect.facebook.net/en_US/sdk.js';
                e.async = true;
                document.getElementById('fb-root').appendChild(e);
                window.setTimeout(function() {
                    if (!window.FB) {
                        // Probably not on server, use the sample sdk
                        e.src = 'phonegap/plugin/facebookConnectPlugin/fbsdk.js';
                        document.getElementById('fb-root').appendChild(e);
                        console.log("Attempt local load: ", e);
                    } else
                        console.log("FB SDK OK");
                }, 10000)
            }

        }());

        if (typeof module != 'undefined')
            module.exports = facebookConnectPlugin;
    }
});

var login = function() {
    if (!window.cordova) {
        var appId = '937608466368165';
        facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login(["email", "public_profile"
                //    ,"user_location"
    ],
            function(response) {
                alert(JSON.stringify(response))
            },
            function(response) {
                alert(JSON.stringify(response))
            });
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
            