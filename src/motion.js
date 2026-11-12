import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function createMotion(state,reducedMotion) {
  const intro=document.querySelector('.introduction');
  const hero=document.querySelector('.hero-caption');
  const cue=document.querySelector('.scroll-cue');
  const progress=document.querySelector('.chapter-track i');
  const chapter=document.querySelector('#chapter-number');
  if(reducedMotion) {
    // Keep the camera stationary and expose copy through a simple scroll-linked cut.
    ScrollTrigger.create({trigger:'#experience',start:'top top',end:'bottom bottom',onUpdate:self=>{
      state.progress=self.progress;
      const end=self.progress>.48;
      gsap.set(hero,{autoAlpha:end?0:1});gsap.set(intro,{autoAlpha:end?1:0,y:0});
      document.querySelector('.stage').classList.toggle('reading',end);
      gsap.set('.intro-backdrop',{opacity:end?1:0});
      progress.style.transform=`scaleX(${Math.max(.05,self.progress)})`;
      chapter.textContent=end?'02':'01';cue.style.opacity=end?'0':'1';
    }});
    return;
  }
  const tl=gsap.timeline({scrollTrigger:{trigger:'#experience',start:'top top',end:'bottom bottom',scrub:.75,invalidateOnRefresh:true}});
  tl.to(state,{progress:1,ease:'none',duration:1},0)
    .to(hero,{autoAlpha:0,y:-24,duration:.24,ease:'none'},0)
    .fromTo(intro,{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.42,ease:'none'},.47)
    .to('.intro-backdrop',{opacity:1,duration:.4,ease:'none'},.38)
    .to(cue,{autoAlpha:0,duration:.18,ease:'none'},.1)
    .to(progress,{scaleX:1,duration:1,ease:'none'},0);
  tl.eventCallback('onUpdate',()=>{chapter.textContent=state.progress>.66?'02':'01';});
  ScrollTrigger.refresh();
}
