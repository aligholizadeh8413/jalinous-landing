// Pure camera math shared by the runtime and constraint tests.
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export const mix=(a,b,t)=>a+(b-a)*t;
export function cameraPose(progress,pointer,aspect,reducedMotion=false) {
  const p=clamp(progress,0,1), mobile=aspect<.76, tablet=aspect<1.25;
  const t=p*p*(3-2*p);
  const portraitFit=Math.max(1,.48/aspect);
  const distance=mobile?mix(84,76,t)*portraitFit:tablet?mix(61,49,t):mix(55,43,t);
  const yaw=(mobile?10:16)+clamp(pointer,-1,1)*(reducedMotion?0:mix(5,2.2,t));
  const radians=yaw*Math.PI/180;
  return {
    position:[Math.sin(radians)*distance,mobile?mix(19,17,t):mix(21.8,16.2,t),Math.cos(radians)*distance],
    target:[0,mobile?mix(7.3,8.8,t):mix(7.1,7.7,t),1],
    fov:mobile?49:tablet?41:37,
    shiftX:mobile?0:tablet?.155*t:.235*t,
    shiftY:mobile?mix(-.025,.18,t):-.015,
    yaw, progress:p
  };
}

export function createCameraRig(camera, reducedMotion) {
  let targetPointer=0,pointer=0;
  const fine=matchMedia('(pointer:fine)');
  const onPointer=e=>{if(fine.matches&&!reducedMotion)targetPointer=clamp(e.clientX/window.innerWidth*2-1,-1,1);};
  const onLeave=()=>{targetPointer=0;};
  window.addEventListener('pointermove',onPointer,{passive:true});
  document.addEventListener('pointerleave',onLeave);
  window.addEventListener('blur',onLeave);
  let lastPose;
  function update(progress,dt,width,height) {
    pointer=mix(pointer,targetPointer,1-Math.exp(-dt*3.8));
    const pose=cameraPose(reducedMotion?(progress>.48?1:0):progress,pointer,width/height,reducedMotion);
    camera.position.set(...pose.position);camera.lookAt(...pose.target);
    camera.fov=pose.fov;
    camera.setViewOffset(width,height,width*pose.shiftX,height*pose.shiftY,width,height);
    camera.updateProjectionMatrix();lastPose=pose;
  }
  return {update,get pose(){return lastPose;},dispose(){window.removeEventListener('pointermove',onPointer);document.removeEventListener('pointerleave',onLeave);window.removeEventListener('blur',onLeave);}};
}
