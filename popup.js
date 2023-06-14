let rangeText = document.getElementById("rangeText");
let slider = document.getElementById("playbackSlider");
let clearButton = document.getElementById("clearButton");

const defaultSpeed = 1.0;
const lowerLimit = 0;
const higherLimit = 16;

function setSpeed(speed){
   slider.value = speed;

   let speedString = speed.toString();
   if(speedString.indexOf(".") == 1) speedString += ".0";
   
   rangeText.value = speedString;
   updatePlaybackSpeed(speed);
}

function getPlaybackSpeed(){
   chrome.tabs.query({
      "active" : true,
      "status" : "complete"
   }, (tabs)=>{
      if(tabs.length == 0){
         setTimeout(getPlaybackSpeed, 100);
         return;
      }

      let tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, {"message" : "get playback speed"});
   });
}

getPlaybackSpeed();

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
   if(request.message == "current speed"){
      let speed = request.speed;
      setSpeed(request.speed);
   }
});

clearButton.addEventListener("click", ()=>{
   setSpeed(defaultSpeed);
});

rangeText.addEventListener("keydown", (e)=>{
   if(e.key != "Enter") return;

   let value = parseFloat(rangeText.value);
   value = Math.round(value * 10) / 10;
   
   if(value < lowerLimit) value = lowerLimit;
   if(value > higherLimit) value = higherLimit;
   
   setSpeed(value);
});

slider.addEventListener("input", (e)=>{
   let speed = slider.value;
   setSpeed(speed);
});

function updatePlaybackSpeed(speed){
   chrome.tabs.getSelected(undefined, (tab)=>{
      chrome.tabs.sendMessage(tab.id, {"message" : "set playback speed", "speed" : speed});
   });
}