import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const output='qa/browser';fs.mkdirSync(output,{recursive:true});
const baseline=Boolean(process.env.QA_BASELINE);
async function ready(page){
  await page.goto('./');
  await expect(page.locator('body')).toHaveClass(/is-ready/,{timeout:60000});
  await expect(page.locator('#scene canvas')).toBeVisible();
  await expect(page.locator('#fallback')).toBeHidden();
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.yaw,null,{timeout:60000});
}
async function scrollTo(page,progress){
  await page.evaluate(p=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*p),progress);
  await page.waitForFunction(p=>Math.abs(Number(document.querySelector('canvas').dataset.progress)-p)<.005,progress,{timeout:90000});
}
async function point(page,x,yaw){
  await page.mouse.move(x,400);
  await page.waitForFunction(y=>Math.abs(Number(document.querySelector('canvas').dataset.yaw)-y)<.13,yaw,{timeout:90000});
}
async function shot(page,name){await page.screenshot({path:`${output}/${name}.png`,animations:'disabled'});}
test('desktop: real WebGL, pointer extremes, scroll approach and reversal',async({page})=>{
  await page.setViewportSize({width:1280,height:800});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
  await ready(page);await point(page,640,baseline?16:17);await shot(page,'desktop-01-hero');
  await point(page,1,baseline?11:3);await shot(page,'desktop-02-left');
  const left=Number(await page.locator('canvas').getAttribute('data-yaw'));
  await point(page,1279,baseline?21:31);await shot(page,'desktop-03-right');
  const right=Number(await page.locator('canvas').getAttribute('data-yaw'));
  expect(right-left).toBeGreaterThan(baseline?9.5:27.5);
  await point(page,640,baseline?16:17);await shot(page,'desktop-04-center');
  await scrollTo(page,.5);await shot(page,'desktop-05-mid');
  await scrollTo(page,1);await shot(page,'desktop-06-close');
  await expect(page.locator('.introduction')).toBeVisible();
  const end=await page.locator('canvas').getAttribute('data-camera');
  await scrollTo(page,0);const start=await page.locator('canvas').getAttribute('data-camera');
  expect(end).not.toEqual(start);expect(errors).toEqual([]);expect(failed).toEqual([]);
  const info=await page.locator('canvas').evaluate(c=>({...c.dataset}));
  fs.writeFileSync(`${output}/desktop-metrics.json`,JSON.stringify({left,right,start,end,info,errors,failed},null,2));
  if(!baseline){
    await page.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await expect(page.locator('#fallback')).toBeVisible();
    await expect(page.locator('#fallback img')).toBeVisible();
    await shot(page,'desktop-08-webgl-fallback');
  }
});
test('portrait: touch scroll, hero, mid, final and reduced motion',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ready(page);await shot(page,'mobile-01-hero');
  const session=await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:650,id:1}]});
  for(let y=620;y>=220;y-=40){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y,id:1}]});await page.waitForTimeout(40);}
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>Number(document.querySelector('canvas').dataset.progress)>.1,null,{timeout:60000});
  await scrollTo(page,.5);await shot(page,'mobile-02-mid');
  await scrollTo(page,1);await shot(page,'mobile-03-close');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
  fs.writeFileSync(`${output}/mobile-metrics.json`,JSON.stringify(await page.locator('canvas').evaluate(c=>({...c.dataset})),null,2));
  await context.close();
  const reduced=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
  const rp=await reduced.newPage();await ready(rp);await scrollTo(rp,1);
  await expect(rp.locator('.introduction')).toBeVisible();await shot(rp,'desktop-07-reduced-motion');
  const before=await rp.locator('canvas').getAttribute('data-yaw');await rp.mouse.move(1270,400);
  expect(await rp.locator('canvas').getAttribute('data-yaw')).toEqual(before);
  await reduced.close();
});
