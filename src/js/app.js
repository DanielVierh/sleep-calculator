let currentHour = "";
let currentMin = "";
const btn_toggle_wecker = document.getElementById("btn_toggle_wecker");
const hidden_Container = document.getElementById("hidden_Container");
const btn_save_wecker = document.getElementById("btn_save_wecker");
const inp_wecker = document.getElementById("inp_wecker");
const outp_wakeup_time = document.getElementById("outp_wakeup_time");
const outp_wecker_label = document.getElementById("outp_wecker_label")
let wecker_is_hidden = true;
let wecker_is_set = false;
let stand_up_time;


window.onload = () => {
    if (localStorage.getItem("stored_Wakeup_time") != "") {
        try {
            stand_up_time = JSON.parse(localStorage.getItem("stored_Wakeup_time"));
            if(stand_up_time !== '') {
                wecker_is_set = true;
                inp_wecker.value = stand_up_time;
            }
        } catch (error) {
            console.log(error);
        }
    }
}




function splitVal(val, marker, pos) {
    const elem = val.split(marker);
    const retVal = elem[pos];
    return retVal;
}

function takeSleepTime(timeVal) {
    document.getElementById("showSleepTime").innerHTML = timeVal;
    const timeArray = timeVal.split(':');
    const sHour = timeArray[0];
    const sMin = timeArray[1];
    calcSleeptime(parseInt(sHour), parseInt(sMin));
    showSuccess();
}

function sleepNow() {
    document.getElementById("showSleepTime").innerHTML = currentHour + ":" + currentMin;
    calcSleeptime(parseInt(currentHour), parseInt(currentMin));
    showSuccess();
}

function calcSleeptime(sleepTimeHour, sleepTimeMinute) {
    // Ein Schlafinterval hat 90 Min = 5400 Sek
    // Die übergebene gesplittete Uhrzeit Stunden in Sekunden rechnen und Restminuten hinzufügen
    let sleepTimeInSeconds = ((sleepTimeHour * 60) + sleepTimeMinute) * 60;
    // Schleife für Tabelle 
    for (let i = 1; i <= 8; i++) {
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
    var chours = Math.floor(csec_num / 3600);
    var cminutes = Math.floor((csec_num - (chours * 3600)) / 60);
    return addAZero(chours) + ':' + addAZero(cminutes);
}

setInterval(() => {
    getNow()
}, 1000);

function getNow() {
    let date = new Date();
    let day = date.getDate();
    let year = date.getFullYear();
    let month = splitVal(date + '', ' ', 1);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    document.getElementById("currentTime").innerHTML = addAZero(hours) + ":" + addAZero(minutes) + ":" + addAZero(seconds);
    currentHour = addAZero(hours);
    currentMin = addAZero(minutes);

    if (wecker_is_set === true) {
        // TODO: So dynamisch programmieren, dass wirkich ein Tag draufgerechnet wird (Ende des Monats kann es zu Fehlern kommen)
        const wakeup_Hour = splitVal(stand_up_time, ':', 0);
        const wakeup_Minute = splitVal(stand_up_time, ':', 1);
        const current_Hour = hours;
        const current_Minute = minutes;
        outp_wecker_label.innerHTML = `Wecker [${stand_up_time}]`
        if (wakeup_Hour > current_Hour) {
            const wakeup_date = new Date(`${month} ${day} ${year} ${addAZero(wakeup_Hour)}:${addAZero(wakeup_Minute)}`)
            const now_date = new Date(`${month} ${day} ${year} ${addAZero(current_Hour)}:${addAZero(current_Minute)}`)
            outp_wakeup_time.innerHTML = diff_minutes(wakeup_date, now_date)
        } else {
            const wakeup_date = new Date(`${month} ${day + 1} ${year} ${addAZero(wakeup_Hour)}:${addAZero(wakeup_Minute)}`)
            const now_date = new Date(`${month} ${day} ${year} ${addAZero(current_Hour)}:${addAZero(current_Minute)}`)
            console.log(diff_minutes(wakeup_date, now_date));
            outp_wakeup_time.innerHTML = diff_minutes(wakeup_date, now_date)
        }
    }
}

function addAZero(val) {
    if (val < 10) {
        val = "0" + val;
    }
    return val;
}


function showSuccess() {
    // Kurz eine andere Farbe bei Zelle anzeigen 
    setTimeout(() => {
        document.getElementById("slpInterval_1").style.background = "rgba(14, 146, 199, 0.068)";
    }, 2000);
    document.getElementById("slpInterval_1").style.background = "blue";
}


btn_toggle_wecker.addEventListener("click", () => {
    if (wecker_is_hidden) {
        wecker_is_hidden = false;
        hidden_Container.classList.add("active");
    } else {
        wecker_is_hidden = true;
        hidden_Container.classList.remove("active")
    }
});


btn_save_wecker.addEventListener("click", () => {
    stand_up_time = inp_wecker.value;
    if (stand_up_time !== '') {
        wecker_is_set = true;
        localStorage.setItem('stored_Wakeup_time', JSON.stringify(stand_up_time));
        // Wecker Settings schließen
        hidden_Container.classList.remove("active")
    } else {
        wecker_is_set = false;
    }
})

function diff_minutes(dt2, dt1) {
    var distance = dt2 - dt1;
    // In lesbare Zeit umwandeln
    var countHours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var countMinutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));

    return `Schlafzeit: ${addAZero(countHours)}:${addAZero(countMinutes)}`
}



