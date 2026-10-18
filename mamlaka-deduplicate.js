/* MAMLKAT AL-OTOR — safe duplicate-section prevention and accessible navigation */
(function(){
  "use strict";
  function clean(){
    var main=document.querySelector("main");
    if(!main)return;
    // Remove only repeated directory/quick-start cards when a matching destination
    // is already present in the main directory. Keep the actual catalog sections intact.
    var directory=main.querySelector("#homeIndex");
    if(directory){
      var seen=new Set();
      directory.querySelectorAll('a[href^="#"]').forEach(function(a){
        var href=a.getAttribute("href");
        if(!href||href==="#")return;
        if(seen.has(href)){a.remove();return;}
        seen.add(href);
      });
    }
    // Avoid duplicate IDs from future edits; preserve the first canonical target.
    var ids=new Set();
    main.querySelectorAll("[id]").forEach(function(el){
      if(ids.has(el.id)){el.removeAttribute("id");return;}
      ids.add(el.id);
    });
    // Ensure directory links have a visible, keyboard-friendly focus state.
    main.querySelectorAll('a[href^="#"],button').forEach(function(el){
      if(!el.hasAttribute("aria-label")&&!el.textContent.trim()&&!el.querySelector("svg[aria-hidden='true']"))return;
      el.classList.add("mamlaka-interactive");
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",clean,{once:true});else clean();
})();