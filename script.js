// Script to select video player/element and alter it's desired properties

// Select video player
var vids = document.getElementsByTagName("video");

console.log(vids);

// edges case
if (vids.length == 0){
    alert("No video player found!\nTry again!");

    // return;
}

// Consider only first (0th) element
var vid = vids[0];

// Change the video players playback rate from the input text field
function changePlaybackRate() {
    const btn = document.getElementById("submit");
    const input = document.getElementById("speed_input");
    const speed = input.value;

    console.log(speed);

    try {
        // low speed cases -> send alert
        if (speed < 0.07){
            alert("Speed too low!\nTortoise could beat you...");

            return;
        }
        // high speed cases -> send alert
        else if (speed > 16){
            alert("Speed too high!\nYou'll be faster than light!");

            return;
        }
        
        vid.playbackRate = speed;
    }
    catch (err) {
        alert("Something went wrong!\nTry again!");
    } 
} 