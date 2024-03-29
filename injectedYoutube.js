let video;

const defaultSpeed = 1.0;
const lowerLimit = 0;
const higherLimit = 16;

function urlChangeEvent(){
   video = undefined;

   if(location.href.indexOf("/watch") == -1){
      chrome.runtime.sendMessage({"message": "inactivate_icon"});
   }
   else{
      chrome.runtime.sendMessage({"message": "activate_icon"});

      let intervalHandler = setInterval(()=>{
         video = document.getElementsByTagName("video")[0];
         
         if(video !== undefined){
            clearInterval(intervalHandler);
            return;
         }
      }, 100);
   }
}

{
   let lastURL;
   
   function checkURL(){
      if(location.href != lastURL){
         urlChangeEvent();
         lastURL = location.href;
      }
   }

   setInterval(checkURL, 1000);
   checkURL();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
   if(message.message == "set playback speed"){
      let speed = message.speed;

      if(speed > higherLimit || speed < lowerLimit){
         console.error(`invalid speed ${speed}`);
         return;
      }

      if(video === undefined){
         console.error("Sorry, video not found!");
         return;
      }

      video.playbackRate = speed;
   }
   else if(message.message == "get playback speed"){
      let intervalHandler = setInterval(()=>{
         if(video === undefined) return;

         chrome.runtime.sendMessage({
            "message" : "current speed",
            "speed" : video.playbackRate
         });
         
         clearInterval(intervalHandler);
      }, 100);
   }
});