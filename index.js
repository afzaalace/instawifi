var shell = require('shelljs');
var b = require('bonescript');
console.log("Starting WPA Service");
shell.exec("wpa_supplicant -D nl80211 -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf -B", {
    silent: true
}, function (code, data) {
    console.log("Started WPA Service");
    var btn = "P8_19";
    var led = "USR3";
    var connecting = 0;
    var ledstatus = 0;
    var debounce;
    var blinker;
    var toggleLED = function () {
        ledstatus = ledstatus ? 0 : 1;
        b.digitalWrite(led, ledstatus);
    };
    b.pinMode(btn, b.INPUT);
    b.attachInterrupt(btn, true, b.CHANGE, function (x) {
        if (x.value == 1 && connecting == 0) {
            clearInterval(debounce);
            debounce = setTimeout(function () {
                connecting = 0;
            }, 8000);
            setInterval(toggleLED, 100);
            shell.exec("wpa_cli wps_pbc", function (code, data) {});
        }
    });
    setTimeout(function () {
        require('dns').resolve('www.google.com', function (err) {
            if (err) { // no connection
            } else {
                clearInterval(toggleLED);
                b.digitalWrite(led, 1);
            }
        });
    }, 8000);
});
