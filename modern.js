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
    const cream='#dfcfad',light='#f3e7ca',tan='#c4aa84',shadow='#9c8063',ink='#282729';
    c.save();c.beginPath();c.rect(0,0,960,489);c.clip();c.translate(x,y);
    // Tapered, irregular locks follow the real coat's direction instead of smooth bands.
    function lock(px,py,length,lean,width,color){c.fillStyle=color;c.beginPath();c.moveTo(px-width,py);c.bezierCurveTo(px-width-lean*.2,py+length*.45,px+lean-width,py+length*.9,px+lean,py+length);c.bezierCurveTo(px+lean+width*.25,py+length*.55,px+width,py+length*.2,px+width,py);c.fill();}
    function strand(px,py,length,lean,color){c.strokeStyle=color;c.lineWidth=.8;c.beginPath();c.moveTo(px,py);c.bezierCurveTo(px-3,py+length*.3,px+lean+3,py+length*.7,px+lean,py+length);c.stroke();}
    const wag=reducedMotion?0:Math.sin(time*10)*4;
    // Seated pear-shaped torso and a low feathered tail, like the photograph.
    ellipse(c,-15,65,39,33,tan);ellipse(c,-5,49,29,40,cream);
    c.strokeStyle=tan;c.lineWidth=16;c.lineCap='round';c.beginPath();c.moveTo(-31,77);c.quadraticCurveTo(-67,80,-62,57+wag);c.stroke();
    for(let i=0;i<8;i++)lock(-63+i*3,55+wag+(i%3)*4,21+(i%3)*4,-11+i,2, i%2?cream:light);
    for(let i=0;i<48;i++){const px=-39+(i*17)%66,py=25+(i*13)%57;lock(px,py,11+(i%5)*3,Math.sin(i*2)*8,3.4,i%4===0?tan:i%3===0?light:cream);}
    ellipse(c,-16,85,14,12,cream);ellipse(c,14,84,13,13,cream);
    for(let i=0;i<11;i++)lock(-29+i*4.5,70+(i%3)*4,20+(i%2)*5,Math.sin(i)*3,3, i%2?light:cream);
    c.save();c.rotate(reducedMotion?-.04:-.04+Math.sin(time*2)*.012);
    // A broader head, uneven hanging ears and a three-quarter muzzle pointing right.
    ellipse(c,-27,6,15,36,tan);ellipse(c,30,5,12,32,tan);
    for(let i=0;i<12;i++){const side=i<7?-1:1,px=side*(24+(i%7)*2.3);lock(px,-12+(i%3)*4,44+(i%4)*5,side*(3+(i%3)),3,i%3?cream:tan);strand(px,-6,43,side*5,light);}
    ellipse(c,0,-5,32,29,cream);ellipse(c,8,14,31,24,cream);
    // Small dark eyes sit under the fringe; the nearer eye is a little larger.
    const blink=!reducedMotion&&time%5>4.8;
    if(blink||laugh){c.strokeStyle=ink;c.lineWidth=2.4;for(const [ex,ey] of [[-12,-1],[16,-5]]){c.beginPath();c.moveTo(ex-4,ey);c.quadraticCurveTo(ex,ey-3,ex+4,ey);c.stroke();}}
    else{ellipse(c,-12,-1,5,4.4,ink);ellipse(c,16,-5,3.8,3.5,ink);ellipse(c,-13,-2,1,1,light);ellipse(c,15,-6,.8,.8,light);}
    for(let i=0;i<15;i++){const px=-29+i*4.1;lock(px,-28+(i%3)*2,15+(i%4)*5,Math.sin(i*1.8)*6,3,i%3?cream:light);strand(px,-25,17+(i%3)*4,Math.sin(i)*5,light);}
    // Full moustache and beard; nose offset right rather than centered on a toy face.
    ellipse(c,7,22,27,20,tan);ellipse(c,-2,16,22,15,cream);ellipse(c,24,15,16,14,cream);
    for(let i=0;i<19;i++){const px=-19+i*3.1;lock(px,10+(i%4)*3,24+(i%5)*2,(px-10)*.28,3,i%4===0?tan:i%3===0?light:cream);}
    c.strokeStyle=shadow;c.lineWidth=1.5;c.beginPath();c.moveTo(3,30);c.quadraticCurveTo(18,35,29,27);c.stroke();
    if(laugh){ellipse(c,15,30,9,6,ink);ellipse(c,17,34,5,4,'#c58e84');}
    else if(!idle){ellipse(c,16,32,5,3,'#bb817a');}
    c.save();c.translate(17,13);c.rotate(-.15);c.fillStyle=ink;c.beginPath();c.moveTo(-9,-4);c.quadraticCurveTo(0,-10,9,-4);c.quadraticCurveTo(9,3,1,8);c.quadraticCurveTo(-6,7,-9,-4);c.fill();ellipse(c,-2,-3,3,1,'#66615a');c.restore();
    for(let i=0;i<14;i++){const px=-25+i*4.7;strand(px,13+(i%4)*2,19+(i%5)*2,(px-12)*.3,i%3?light:tan);}
    // Soft, slightly askew folded paper with the broad brim and central crease in the photo.
    c.fillStyle='#8293a7';c.beginPath();c.moveTo(-37,-26);c.lineTo(-3,-64);c.lineTo(35,-29);c.closePath();c.fill();
    c.fillStyle='#667a93';c.beginPath();c.moveTo(-3,-64);c.lineTo(35,-29);c.lineTo(0,-22);c.closePath();c.fill();
    c.strokeStyle='#c0cbd3';c.lineWidth=1;c.beginPath();c.moveTo(-37,-26);c.lineTo(-3,-64);c.lineTo(0,-22);c.stroke();
    c.fillStyle='#8e9eb0';c.beginPath();c.moveTo(-43,-26);c.lineTo(-35,-35);c.lineTo(34,-32);c.lineTo(43,-22);c.lineTo(34,-13);c.lineTo(-40,-11);c.closePath();c.fill();
    c.fillStyle='#768aa2';c.beginPath();c.moveTo(-43,-26);c.lineTo(0,-29);c.lineTo(34,-13);c.lineTo(-40,-11);c.closePath();c.fill();
    c.strokeStyle='#b4c1ce';c.lineWidth=1.3;c.beginPath();c.moveTo(-40,-11);c.lineTo(34,-13);c.moveTo(-35,-35);c.lineTo(-43,-26);c.stroke();c.restore();
    if(!idle&&hits>0){duck(c,{x:-98,y:40,vx:-1,hit:true,phase:0},time,true);if(hits>=2)duck(c,{x:36,y:40,vx:1,hit:true,phase:0},time,true);}
    if(!idle){for(const side of [-1,1]){const px=side*(laugh?22:30),py=laugh?40:62;ellipse(c,px,py,10,9,cream);for(let i=0;i<4;i++)lock(px-7+i*4,py-3,13+(i%2)*3,side*2,2.5,i%2?light:cream);}}

    c.restore();
  }
  return{background,duck,dog};
})();
