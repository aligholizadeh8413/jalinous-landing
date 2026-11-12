import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const output='qa/browser';
fs.mkdirSync(output,{recursive:true});
async function ready(page){
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/is-ready/,{timeout:45000});
  await expect(page.locator('#scene canvas')).toBeVisible();
  await expect(page.locator('#fallback')).toBeHidden();
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.yaw,{timeout:45000});
}
async function scrollTo(page,progress){
  await page.evaluate(p=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*p),progress);
  await page.waitForFunction(p=>Math.abs(Number(document.querySelector('canvas').dataset.progress)-p)<.01,progress,{timeout:45000});
}
async function shot(page,name){
  await page.waitForTimeout(1200);
  await page.screenshot({path:`${output}/${name}.png`,animations:'disabled'});
}
test('desktop: real WebGL, pointer extremes, scroll approach and reversal',async({page})=>{
  await page.setViewportSize({width:1440,height:960});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ready(page);
  await page.mouse.move(720,480);await shot(page,'desktop-01-hero');
  await page.mouse.move(0,480);await page.waitForTimeout(3500);await shot(page,'desktop-02-left');
  const left=Number(await page.locator('canvas').getAttribute('data-yaw'));
  await page.mouse.move(1439,480);await page.waitForTimeout(3500);await shot(page,'desktop-03-right');
  const right=Number(await page.locator('canvas').getAttribute('data-yaw'));
  expect(right-left).toBeGreaterThan(8);
  await page.mouse.move(720,480);await page.waitForTimeout(2500);await shot(page,'desktop-04-center');
  await scrollTo(page,.5);await shot(page,'desktop-05-mid');
  await scrollTo(page,1);await shot(page,'desktop-06-close');
  await expect(page.locator('.introduction')).toBeVisible();
  const end=await page.locator('canvas').getAttribute('data-camera');
  await scrollTo(page,0);const start=await page.locator('canvas').getAttribute('data-camera');
  expect(end).not.toEqual(start);
  expect(errors).toEqual([]);
  const info=await page.locator('canvas').evaluate(c=>({...c.dataset}));
  fs.writeFileSync(`${output}/desktop-metrics.json`,JSON.stringify({left,right,start,end,info,errors},null,2));
});
test('portrait: hero, mid, final and reduced motion',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();await ready(page);await shot(page,'mobile-01-hero');
  await scrollTo(page,.5);await shot(page,'mobile-02-mid');
  await scrollTo(page,1);await shot(page,'mobile-03-close');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await context.close();
  const reduced=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  const rp=await reduced.newPage();await ready(rp);await scrollTo(rp,1);
  await expect(rp.locator('.introduction')).toBeVisible();await shot(rp,'desktop-07-reduced-motion');
  await reduced.close();
});
