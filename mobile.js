'use strict';
(() => {
  const media=matchMedia('(max-width: 700px), (max-width: 1000px) and (max-height: 600px)');
  const dialog=document.getElementById('phone-dialog');
  const actions=document.querySelector('.header-actions'),aim=document.querySelector('.aim-settings');
  const actionsHome=actions.parentNode,aimHome=aim.parentNode,aimNext=aim.nextSibling;
  function layout(){
    document.body.classList.toggle('phone-layout',media.matches);
    if(media.matches){document.getElementById('phone-actions').append(actions);document.getElementById('phone-aim').append(aim);}
    else{dialog.close();actionsHome.append(actions);aimHome.insertBefore(aim,aimNext);}
  }
  document.getElementById('phone-menu').onclick=()=>{document.dispatchEvent(new Event('duckhut-help'));dialog.showModal();};
  document.getElementById('install-help').addEventListener('click',()=>dialog.close());
  media.addEventListener('change',layout);layout();
})();
