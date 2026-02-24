

let myTime = document.getElementById('output');

function tymDisplay(){

   myTime.style.color="white";
   myTime.style.fontFamily="georgia";
   myTime.style.fontWeight="bolder";

let currentTime = new Date(),
hour = currentTime.getHours(),
minute = currentTime.getMinutes(),
secs = currentTime.getSeconds();

if(hour <10){
    hour = "0" + hour;

}

if(minute <10){
    minute = "0" + minute;

}

if(secs<10){
    secs = "0" + secs;

}


let suffix = "AM";
if(hour >= 12){
    suffix ="PM";
    hour = hour - 12;
}

if(hour == 0){
    hour = 12;
}

myTime.innerHTML = hour + ":" + minute + ":" + secs + suffix;

}

 tymDisplay();

setInterval(tymDisplay, 1000);


