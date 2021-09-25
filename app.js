let currentHour = "";
let currentMin = "";

function takeSleepTime(timeVal) {
    document.getElementById("showSleepTime").innerHTML = timeVal;
    const timeArray = timeVal.split(':');
    const sHour = timeArray[0];
    const sMin = timeArray[1];
    calcSleeptime(parseInt(sHour), parseInt(sMin));
}

function sleepNow() {
    document.getElementById("showSleepTime").innerHTML = currentHour + ":" + currentMin;
    calcSleeptime(parseInt(currentHour), parseInt(currentMin));
}

function calcSleeptime(sleepTimeHour, sleepTimeMinute) {
    // Ein Schlafinterval hat 90 Min = 5400 Sek
    // Die übergebene gesplittete Uhrzeit Stunden in Sekunden rechnen und Restminuten hinzufügen
    let sleepTimeInSeconds = ((sleepTimeHour * 60) + sleepTimeMinute) * 60;
    // Schleife für Tabelle 
    for(let i = 1; i <= 8; i++) {
        // Ein Intervall wird hinzugefügt
        sleepTimeInSeconds += 5400;
        // Wenn größer als 24 in Sekunden dann Differenz bilden
        if (sleepTimeInSeconds > 86400) {
            const diff = sleepTimeInSeconds - 86400;
            sleepTimeInSeconds = diff;
        }
        // String Wert für Umrechnung
        const secTime = sleepTimeInSeconds.toString();
        // Zell ID generieren und Zwischenstand eintragen
        const cell = "slpInterval_" + i;
        document.getElementById(cell).innerHTML = secTime.toHHMMSS();
    }
}

String.prototype.toHHMMSS = function () {
    var csec_num = parseInt(this, 10);
    var chours   = Math.floor(csec_num / 3600);
    var cminutes = Math.floor((csec_num - (chours * 3600)) / 60);
    return addAZero(chours)+':'+addAZero(cminutes);
}

setInterval(() => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    document.getElementById("currentTime").innerHTML = addAZero(hours) + ":" + addAZero(minutes) + ":" + addAZero(seconds);
    currentHour = addAZero(hours);
    currentMin = addAZero(minutes);
}, 1000);


function addAZero(val) {
    if(val < 10){
        val = "0" + val;
    }
    return val;
}