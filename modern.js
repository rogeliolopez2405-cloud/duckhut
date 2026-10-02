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
    const x=idle?244:480,y=479-Math.max(0,rise)*90+(reducedMotion?0:Math.sin(time*(laugh?18:5))*(laugh?3:1.5));
    const cream='#f7e7c9',light='#fff2d8',tan='#cfb28c',shadow='#b49573',ink='#302d32';
    c.save();c.beginPath();c.rect(0,0,960,489);c.clip();c.translate(x,y);
    // Soft shaggy tail and chest; all movement honors reduced-motion preferences.
    const wag=reducedMotion?0:Math.sin(time*12)*8;
    c.strokeStyle=tan;c.lineWidth=13;c.lineCap='round';c.beginPath();c.moveTo(24,66);c.quadraticCurveTo(64,70,51,37+wag);c.stroke();
    ellipse(c,51,37+wag,9,13,cream);ellipse(c,55,31+wag,5,8,light);
    ellipse(c,0,59,30,40,tan);ellipse(c,0,57,25,35,cream);
    for(let i=0;i<7;i++)ellipse(c,-23+i*7,69+(i%2)*7,6,17,i%2?light:cream);
    c.save();c.rotate(reducedMotion?0:Math.sin(time*2)*(idle?.025:.015));
    // Long floppy ears and layered fringe, matching the pet rather than a retriever.
    ellipse(c,-32,9,15,32,tan);ellipse(c,32,9,15,32,tan);
    for(const side of [-1,1])for(let i=0;i<4;i++)ellipse(c,side*(26+i*5),17+i*4,4,21,i%2?cream:tan);
    ellipse(c,0,-2,35,32,cream);
    for(let i=0;i<9;i++){const xx=-30+i*7.5;ellipse(c,xx,-15+Math.abs(xx)*.12,6,18,i%3?cream:light);}
    const blink=!reducedMotion&&time%5>4.8;
    if(blink||laugh){c.strokeStyle=ink;c.lineWidth=3;for(const xx of [-13,13]){c.beginPath();c.moveTo(xx-4,0);c.quadraticCurveTo(xx,-4,xx+4,0);c.stroke();}}
    else{ellipse(c,-13,-1,4.5,5,ink);ellipse(c,13,-1,4.5,5,ink);ellipse(c,-14,-2,1.4,1.4,light);ellipse(c,12,-2,1.4,1.4,light);}
    // Rounded, furry beard and muzzle with a dark nose emerging from the fringe.
    ellipse(c,0,22,25,24,tan);
    for(let i=0;i<7;i++)ellipse(c,-21+i*7,27+(i%2)*3,6,19,i%2?cream:light);
    ellipse(c,-11,14,15,12,cream);ellipse(c,11,14,15,12,cream);
    ellipse(c,0,11,9,7,ink);ellipse(c,-2,9,3,1.5,'#656064');
    ellipse(c,0,27,9,laugh?9:4,ink);if(laugh||!idle)ellipse(c,0,32,5,5,'#d48c88');
    c.strokeStyle=light;c.lineWidth=2;
    for(const side of [-1,1])for(let i=0;i<3;i++){c.beginPath();c.moveTo(side*(8+i*5),12);c.quadraticCurveTo(side*(22+i*3),18,side*(18+i*5),31+i*3);c.stroke();}
    // Folded blue-gray paper sailor hat: triangular crown, center seam and turned brim.
    c.fillStyle='#8198b0';c.beginPath();c.moveTo(-37,-27);c.lineTo(0,-72);c.lineTo(37,-27);c.closePath();c.fill();
    c.fillStyle='#617b97';c.beginPath();c.moveTo(0,-72);c.lineTo(37,-27);c.lineTo(3,-26);c.closePath();c.fill();
    c.strokeStyle='#c7d4de';c.lineWidth=1.5;c.beginPath();c.moveTo(-37,-27);c.lineTo(0,-72);c.lineTo(3,-26);c.stroke();
    c.fillStyle='#9cafc1';c.beginPath();c.moveTo(-43,-29);c.lineTo(40,-31);c.lineTo(34,-12);c.lineTo(-35,-10);c.closePath();c.fill();
    c.fillStyle='#748ca4';c.beginPath();c.moveTo(-35,-10);c.lineTo(-43,-29);c.lineTo(-28,-21);c.lineTo(34,-12);c.closePath();c.fill();
    c.strokeStyle='#c1d0dd';c.lineWidth=2;c.beginPath();c.moveTo(-35,-10);c.lineTo(34,-12);c.stroke();c.restore();
    if(!idle&&hits>0){duck(c,{x:-98,y:35,vx:-1,hit:true,phase:0},time,true);if(hits>=2)duck(c,{x:36,y:35,vx:1,hit:true,phase:0},time,true);}
    ellipse(c,laugh?-22:-29,laugh?39:57,11,10,light);ellipse(c,laugh?22:29,laugh?39:57,11,10,light);
    c.restore();
  }
  return{background,duck,dog};
})();
