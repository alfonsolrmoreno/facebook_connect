APP_SUFIX = '';
APP_ONLINE = true;

MSG_SEM_NET = "Este aplicativo precisa de internet. Por favor verifique sua conexão e tente de novo.";

APP_FW = 'jqm';

DEVICE_UUID = '';

function res_url() {
    return 'https://192.168.0.76/facebook_connect/server/';
}

function server_url() {
    return 'https://192.168.0.76/facebook_connect/server/';
}

function api_url() {
    return server_url() + 'api_entrypoint.php';
}

function splash_show() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.show();
    }
}

function splash_hide() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.hide();
    }
}

function gen_uid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

function clog() {
    if (APP_SUFIX == '_dev' || APP_SUFIX == '_qa') {
        for (var arg = 0; arg < arguments.length; ++arg) {
            if (typeof arguments[arg] == 'object') {
                console.dir(arguments[arg]);
            } else {
                console.log(arguments[arg]);
            }
        }
    }
}

function nalert(message, title, buttonName, alertCallback) {
    if (!title)
        title = '';

    if (!buttonName)
        buttonName = 'OK';

    if (typeof navigator == 'undefined' ||
            typeof navigator.notification == 'undefined' ||
            typeof navigator.notification.alert != 'function') {
        alert(message);
        if (typeof alertCallback == 'function')
            alertCallback()
    } else {
        navigator.notification.alert(message, alertCallback, title, buttonName)
    }
}

function loadIniScript(tries) {

    if (!tries)
        tries = 0

    //var url = res_url() + 'app_loader.js' + '?v=' + gen_uid()
    var url = res_url() + 'js/app.js' + '?v=' + gen_uid()

    $.ajax({
        url: url
        , dataType: "script"
        , charset: 'ISO-8859-1'
        , scriptCharset: 'ISO-8859-1'
        , crossDomain: true
        , success: function(data, textStatus, jqXHR) {
        }
        , error: function(jqXHR, textStatus, errorThrown) {
            if (tries < 300) {
                tries++
                window.setTimeout(function() {
                    loadIniScript(tries)
                }, 3000)
            }
        }
    })
}

function app_connected() {

    if (typeof navigator == 'undefined' || typeof navigator.connection == 'undefined' || typeof Connection == 'undefined')
        return true;
    //nova API (direto em navigator.connection)
    if (typeof Connection != 'undefined'
            && typeof navigator.connection != 'undefined'
            && typeof navigator.connection.type != 'undefined'
            && navigator.connection.type == Connection.NONE)
        return false;

    return true;
}

function onOnline() {
    APP_ONLINE = true;

    clog('onOnline')

    if (typeof window.alert_sem_conn != 'undefined')
        window.clearTimeout(window.alert_sem_conn)
}

function showOfflineMsg() {
    window.alert_sem_conn = window.setTimeout(function() {
        if (!APP_ONLINE)
            onOffline(true)
    }, 33000);
}

function onOffline(show_alert) {
    APP_ONLINE = false;

    clog('onOffline')

    if (typeof window.alert_sem_conn != 'undefined')
        window.clearTimeout(window.alert_sem_conn)

    if (show_alert) {
        nalert(MSG_SEM_NET, 'Sem conexão', 'OK', function() {
            showOfflineMsg()
        });
    } else {
        showOfflineMsg()
    }
}

progress_bar = ''

function startApp() {
    //$('body').append('<img src="app_res/images/loading.gif" id="img_loading_gif" style="z-index:10001;position:absolute;width:170px;height:227px;left:50%;top:50%;margin-left:-85px;margin-top:-114px">');
    //var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 20
    //var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20

    $('body').append(
            '<div class="progress_circle" id="img_loading_gif"></div>'
            );
    progress_bar = new ProgressBar.Circle(document.getElementById('img_loading_gif'), {
        trailColor: '#eee',
        trailWidth: 11,
        duration: 1,
        strokeWidth: 11,
        // Set default step function for all animate calls
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
        }
    });
    //$.backstretch("app_res/images/w.png");
    $.backstretch("app_res/images/splashes/splash-port.png");
    $('.backstretch').prop({id: 'img_white_bg'}).css('z-index', '10000')

    var wait_one_int = true;
    if (app_connected()) {
        loadIniScript();
    } else {
        APP_INIT_INTERVAL = window.setInterval(function() {
            if (app_connected()) {
                window.clearInterval(APP_INIT_INTERVAL);
                loadIniScript();
            } else {
                if (wait_one_int) {
                    wait_one_int = false;
                } else {
                    splash_hide();
                    show_msg_sem_net();
                }
            }
        }, 1000);
    }
}

function onDeviceready() {
    if (!!window.cordova) {
        window.plugins.uniqueDeviceID.get(function success(uuid) {
            DEVICE_UUID = uuid;
        }, function() {});
    }
    //wp8 nao tem window.alert nativo
    if (typeof window.alert == 'undefined' &&
            typeof navigator != 'undefined' &&
            typeof navigator.notification != 'undefined' &&
            typeof navigator.notification.alert == 'function')
        window.alert = navigator.notification.alert;

    //https://github.com/apache/cordova-plugin-network-information/blob/df7aac845dc7deddbdb76e89216776a802ee8b67/doc/index.md
    //Applications typically should use document.addEventListener to attach an event listener once the deviceready event fires.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    startApp();
}

$(function() {
//o event onDeviceready soh existe em mobile/cordova
//!!window.cordova resolve true se for cordova
    if (!!window.cordova) {
        document.addEventListener("deviceready", onDeviceready, false);
    } else {
        onDeviceready();
    }
})