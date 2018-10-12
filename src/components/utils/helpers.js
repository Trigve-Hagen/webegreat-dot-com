export function convertTime(timeString) {
    let dateArgs = timeString.slice(0, 19).split("T");

    var time = dateArgs[1].split(':'); // your input
    var newdate = dateArgs[0].split('-');

    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);

    let timeValue = newdate[1] + "/" + newdate[2] + "/" + newdate[0] + " ";

    if (hours > 0 && hours <= 12) {
        timeValue += "" + hours;
    } else if (hours > 12) {
        timeValue += "" + (hours - 12);
    } else if (hours == 0) {
        timeValue += "12";
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

    return timeValue;
}