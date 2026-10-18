/* MAMLKAT AL-OTOR — all section details remain visible.
   Directory links navigate directly to the requested section; no section content is folded or hidden. */
(function(){
  "use strict";
  function revealAll(){
    document.querySelectorAll("main .section-fold-content").forEach(function(content){
      content.hidden=false;
      content.removeAttribute("hidden");
      content.style.removeProperty("display");
    });
    document.querySelectorAll("main .section-fold-toggle").forEach(function(button){
      button.remove();
    });
    document.querySelectorAll("main section[data-fold-ready]").forEach(function(section){
      delete section.dataset.foldReady;
      section.classList.add("section-is-open");
    });
  }
  function targetFromHash(hash){
    if(!hash || hash==="#") return null;
    var id;
    try{id=decodeURIComponent(hash.slice(1));}catch(e){id=hash.slice(1);}
    return document.getElementById(id);
  }
  function navigateTo(target, updateHash){
    if(!target)return;
    var section=target.closest("main section");
    if(section){
      section.querySelectorAll(".section-fold-content").forEach(function(content){
        content.hidden=false;
        content.removeAttribute("hidden");
      });
      section.classList.add("section-is-open");
    }
    if(updateHash && target.id && location.hash!=="#"+target.id){
      history.pushState(null,"","#"+encodeURIComponent(target.id));
    }
    window.requestAnimationFrame(function(){
      target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
      if(target.matches("input,select,textarea,button,[tabindex]") && !target.disabled){
        try{target.focus({preventScroll:true});}catch(e){}
      }
    });
  }
  function bindDirectory(){
    document.addEventListener("click",function(event){
      var link=event.target.closest('a[href^="#"]');
      if(!link)return;
      var href=link.getAttribute("href");
      if(!href || href==="#")return;
      var target=targetFromHash(href);
      if(!target)return;
      // Let product/action links keep their normal behavior; section and directory links
      // should always reveal the selected destination and scroll to it.
      if(target.closest("main section") || target.matches("main section, #home")){
        event.preventDefault();
        navigateTo(target,true);
        if(link.closest("#mainNav")){
          var nav=document.getElementById("mainNav"),toggle=document.getElementById("menuToggle");
          nav && nav.classList.remove("open");
          if(toggle){toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","فتح القائمة");}
        }
      }
    });
    window.addEventListener("hashchange",function(){navigateTo(targetFromHash(location.hash),false);});
    window.addEventListener("popstate",function(){navigateTo(targetFromHash(location.hash),false);});
    if(location.hash){
      window.setTimeout(function(){navigateTo(targetFromHash(location.hash),false);},120);
    }
  }
  function init(){revealAll();bindDirectory();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();