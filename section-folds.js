/* Accessible compact section controls for Mamlakat Al-Otor */
(function(){
  'use strict';
  function setupFold(section, index){
    if(!section || section.dataset.foldReady==='true') return;
    var heading=section.querySelector(':scope > .section-heading');
    if(!heading) return;
    var children=Array.from(section.children);
    var content=document.createElement('div');
    content.className='section-fold-content';
    content.id='section-fold-content-'+index;
    content.hidden=true;
    children.forEach(function(node){
      if(node!==heading) content.appendChild(node);
    });
    var title=heading.querySelector('h2,h3');
    var titleText=title ? title.textContent.trim() : 'تفاصيل القسم';
    var copy=Array.from(heading.children).find(function(node){return node!==title && !node.contains(title);});
    if(copy && copy.parentElement===heading && !copy.classList.contains('section-heading-copy')){
      var titleWrap=document.createElement('div');
      titleWrap.className='section-heading-copy';
      heading.insertBefore(titleWrap,heading.firstChild);
      Array.from(heading.children).forEach(function(node){
        if(node!==titleWrap && node.tagName!=='BUTTON') titleWrap.appendChild(node);
      });
    }
    var button=document.createElement('button');
    button.type='button';
    button.className='section-fold-toggle';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls',content.id);
    button.innerHTML='<span class="fold-label">عرض التفاصيل</span><span class="fold-chevron" aria-hidden="true">⌄</span>';
    button.addEventListener('click',function(){
      var opening=button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(opening));
      content.hidden=!opening;
      button.querySelector('.fold-label').textContent=opening?'إخفاء التفاصيل':'عرض التفاصيل';
      if(opening) section.classList.add('section-is-open'); else section.classList.remove('section-is-open');
    });
    heading.appendChild(button);
    section.appendChild(content);
    section.dataset.foldReady='true';
  }
  function init(){
    var sections=Array.from(document.querySelectorAll('main section.section, main section.products-section, main section.blend-section, main section.advisor-section, main section.gift-section, main section.category-section, main .taxonomy-public-section'));
    sections.forEach(function(section,index){setupFold(section,index+1);});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();