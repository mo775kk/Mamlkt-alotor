/* Royal gate sound — starts only after the visitor presses the entrance button. */
(function(){
 "use strict";
 var wired=false;
 function playGateSound(){
  try{
   var Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
   var ctx=new Ctx();
   var start=function(){
    var now=ctx.currentTime;
    function tone(freq,at,dur,type,gain){
     var osc=ctx.createOscillator(),amp=ctx.createGain();
     osc.type=type||"sine";osc.frequency.setValueAtTime(freq,at);
     amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(gain||.045,at+.035);
     amp.gain.exponentialRampToValueAtTime(.0001,at+dur);
     osc.connect(amp);amp.connect(ctx.destination);osc.start(at);osc.stop(at+dur+.03);
    }
    // A low metallic hinge sweep followed by a short, bright royal chime.
    tone(118,now,.95,"sawtooth",.025);
    tone(174,now+.08,.85,"triangle",.025);
    tone(392,now+.32,.75,"sine",.045);
    tone(587.33,now+.48,.9,"sine",.035);
    tone(783.99,now+.64,.72,"sine",.022);
    window.setTimeout(function(){ctx.close().catch(function(){});},1800);
   };
   if(ctx.state==="suspended")ctx.resume().then(start).catch(function(){});else start();
  }catch(e){/* Sound is an enhancement; entrance animation still works. */}
 }
 function bind(){
  if(wired)return;var btn=document.getElementById("enterBtn");if(!btn)return;
  wired=true;btn.addEventListener("click",function(){playGateSound();},{capture:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
