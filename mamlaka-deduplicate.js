/* MAMLKAT AL-OTOR — non-destructive duplicate diagnostics and accessible navigation */
(function(){
  "use strict";
  function enhance(){
    var main=document.querySelector("main");
    if(!main)return;
    // Never remove customer-facing links, content, or IDs at runtime.
    // Duplicate cleanup belongs in the source files so navigation targets stay stable.
    main.querySelectorAll('a[href^="#"],button').forEach(function(el){
      if(el.hasAttribute("aria-label")||el.textContent.trim()||el.querySelector("svg[aria-hidden='true']")){
        el.classList.add("mamlaka-interactive");
      }
    });
    var ids=new Set(),duplicates=[];
    main.querySelectorAll("[id]").forEach(function(el){
      if(ids.has(el.id))duplicates.push(el.id);
      else ids.add(el.id);
    });
    if(duplicates.length)console.warn("[Mamlakat Al-Otor] Duplicate IDs detected; kept intact to avoid breaking links:",Array.from(new Set(duplicates)));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();