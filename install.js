'use strict';
(() => {
  const dialog=document.getElementById('install-dialog'),install=document.getElementById('install-app');let prompt;
  document.getElementById('install-help').onclick=()=>{document.dispatchEvent(new Event('duckhut-help'));dialog.showModal()};
  document.getElementById('close-install').onclick=()=>dialog.close();
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;install.hidden=false;});
  install.onclick=async()=>{if(!prompt)return;await prompt.prompt();const choice=await prompt.userChoice;document.getElementById('install-status').textContent=choice.outcome==='accepted'?'Duckhut was added. Look for its icon on your device.':'You can install later or save a favorite.';prompt=null;install.hidden=true;};
  window.addEventListener('appinstalled',()=>{document.getElementById('install-status').textContent='Duckhut is installed on this device.';install.hidden=true;prompt=null;});
  // Separate manifest IDs let each edition have its own shortcut where supported.
  if(new URLSearchParams(location.search).get('edition')==='modern')document.querySelector('link[rel="manifest"]').href='modern.webmanifest';
  if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
