'use strict';
// Afterglow: an original, smooth Canvas renderer sharing the classic game rules.
window.DuckhutModern=(()=>{
  const ellipse=(c,x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
  function background(c,t,reduced){
    const sky=c.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#142a53');sky.addColorStop(.54,'#72709a');sky.addColorStop(.8,'#eab6a2');sky.addColorStop(1,'#233653');c.fillStyle=sky;c.fillRect(0,0,960,540);
    const glow=c.createRadialGradient(724,163,5,724,163,180);glow.addColorStop(0,'#ffd5b06b');glow.addColorStop(1,'#ffb08500');c.fillStyle=glow;c.fillRect(500,0,460,400);ellipse(c,724,163,42,42,'#ffe5c2');
    for(let i=0;i<30;i++){const x=(i*137+33)%960,y=(i*71)%170;c.globalAlpha=.25+(reduced?.2:Math.sin(t*.4+i)*.15);ellipse(c,x,y,1,1,'#e5f7ff')}c.globalAlpha=1;
    for(let layer=0;layer<3;layer++){c.fillStyle=['#4d577d','#344968','#213b55'][layer];c.beginPath();c.moveTo(0,400);for(let x=0;x<=960;x+=12)c.lineTo(x,300+layer*35+Math.sin(x*.009+layer*2)*25+Math.sin(x*.021+layer)*11);c.lineTo(960,450);c.lineTo(0,450);c.fill();}
    const water=c.createLinearGradient(0,365,0,540);water.addColorStop(0,'#526382');water.addColorStop(1,'#102e45');c.fillStyle=water;c.fillRect(0,380,960,160);
    for(let i=0;i<28;i++){const y=385+i*5,x=724-(i*7)/2+(reduced?0:Math.sin(t*1.5+i)*6);c.fillStyle='rgba(255,209,175,'+(.23-i*.006)+')';c.fillRect(x,y,i*7+12,1.5)}
    for(let i=0;i<22;i++){const x=(i*139)%960,y=404+(i*31)%122;c.strokeStyle='#8cbed526';c.lineWidth=1;c.beginPath();c.ellipse(x+(reduced?0:Math.sin(t+i)*4),y,20+i%5*7,2,0,0,Math.PI*2);c.stroke()}
    c.fillStyle='#112f39';c.beginPath();c.moveTo(0,465);c.bezierCurveTo(140,430,250,466,395,486);c.bezierCurveTo(680,520,800,444,960,459);c.lineTo(960,540);c.lineTo(0,540);c.fill();
    for(let i=0;i<48;i++){const x=(i*127)%960,h=24+(i*31)%78,y=500+(i*13)%38,sway=reduced?0:Math.sin(t*.7+i)*4;c.strokeStyle=i%2?'#214b4b':'#163b43';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-5,y-h/2,x+sway,y-h);c.stroke();if(i%4===0){c.lineWidth=5;c.strokeStyle='#42544b';c.beginPath();c.moveTo(x+sway,y-h);c.lineTo(x+sway,y-h-14);c.stroke()}}
    for(let i=0;i<9;i++){const x=(i*173+120)%960,y=420+(i*19)%72;c.globalAlpha=reduced?.45:.3+.25*Math.sin(t*1.4+i);ellipse(c,x,y,2,2,'#abf6d0')}c.globalAlpha=1;
  }
  function duck(c,d,t,reduced){
    c.save();c.translate(d.x+32,d.y+20);if(d.vx<0)c.scale(-1,1);if(d.hit)c.rotate(.6);
    c.shadowColor='#060e2560';c.shadowBlur=8;
    ellipse(c,-2,5,25,13,'#d8c7b4');ellipse(c,-3,8,22,10,'#a38d84');
    c.fillStyle='#414d65';c.beginPath();c.moveTo(-22,1);c.lineTo(-38,-5);c.lineTo(-29,12);c.closePath();c.fill();
    c.shadowBlur=0;const flap=d.hit?8:reduced?-12:Math.sin(t*16+d.phase)*19;
    c.fillStyle='#586883';c.beginPath();c.moveTo(-13,5);c.quadraticCurveTo(-12,-18+flap,12,-26+flap);c.quadraticCurveTo(12,-1,8,9);c.fill();
    ellipse(c,17,-7,12,13,'#3bbaa0');ellipse(c,21,-12,11,10,'#43c7aa');ellipse(c,23,-12,2.5,2.5,'#101d36');ellipse(c,24,-13,1,1,'#fff');
    c.fillStyle='#f2b868';c.beginPath();c.moveTo(29,-10);c.lineTo(43,-5);c.lineTo(29,-3);c.closePath();c.fill();c.strokeStyle='#eff6e6';c.lineWidth=3;c.beginPath();c.moveTo(11,0);c.quadraticCurveTo(16,4,23,0);c.stroke();c.restore();
  }
  function dog(c,{time,remaining,hits,idle,reducedMotion}){
    const rise=idle?1:Math.min(1,(3.2-remaining)/.35,remaining/.35),laugh=!idle&&hits===0;
    const x=idle?244:480,y=479-Math.max(0,rise)*77+(reducedMotion?0:Math.sin(time*(laugh?20:5))*2);
    c.save();c.beginPath();c.rect(0,0,960,489);c.clip();
    c.strokeStyle='#b88b67';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(x+22,y+65);c.quadraticCurveTo(x+51,y+59,x+47,y+43+(reducedMotion?0:Math.sin(time*12)*7));c.stroke();
    ellipse(c,x,y+56,24,35,'#ba906e');ellipse(c,x,y+53,14,28,'#f0d8b3');ellipse(c,x,y+3,31,28,'#cfa67e');ellipse(c,x-29,y+3,12,24,'#815e4f');ellipse(c,x+29,y+3,12,24,'#815e4f');ellipse(c,x-9,y-3,3,4,'#182b3b');ellipse(c,x+9,y-3,3,4,'#182b3b');ellipse(c,x,y+13,18,13,'#f2dabc');ellipse(c,x,y+8,7,5,'#233444');
    ellipse(c,x,y+20,8,laugh?8:5,'#4b3540');if(!laugh)ellipse(c,x+2,y+24,4,5,'#e6a098');
    c.strokeStyle='#60dccc';c.lineWidth=5;c.beginPath();c.moveTo(x-17,y+30);c.lineTo(x+17,y+30);c.stroke();ellipse(c,x,y+35,4,5,'#f7dca0');
    if(!idle&&hits>0){duck(c,{x:x-98,y:y+22,vx:-1,hit:true,phase:0},time,true);if(hits>=2)duck(c,{x:x+36,y:y+22,vx:1,hit:true,phase:0},time,true);ellipse(c,x-26,y+42,10,9,'#cfa67e');ellipse(c,x+26,y+42,10,9,'#cfa67e')}
    if(laugh){ellipse(c,x-19,y+21,9,8,'#cfa67e');ellipse(c,x+19,y+21,9,8,'#cfa67e')}c.restore();
  }
  return{background,duck,dog};
})();
