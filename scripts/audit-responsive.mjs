import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import 'dotenv/config';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
const root=process.cwd();
const chrome=process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'redline-browser-'));
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','3100'],{cwd:root,env:{...process.env,BETTER_AUTH_URL:'http://localhost:3100'},windowsHide:true,stdio:'ignore'});
const browser=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9223','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws;let id=0;const pending=new Map();
let db, sessionId, paidViewportChecks = 0;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
try{
 let targets; for(let i=0;i<100;i++){try{targets=await(await fetch('http://127.0.0.1:9223/json')).json();if(targets.length&&(await fetch('http://localhost:3100/login')).ok)break;}catch{}await delay(300);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(m.error.message)):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.text);return result.result.value;};
 await send('Page.enable'); await send('Runtime.enable');
 const routes=['/login','/signup','/dashboard','/dashboard/markets','/dashboard/watchlist','/dashboard/portfolio','/dashboard/market-briefing','/dashboard/upgrade','/dashboard/billing'];
 const problems=[];
 for(const width of [320,375,390,430,768,1024,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:800,deviceScaleFactor:1,mobile:width<768});
 for(const route of routes){await send('Page.navigate',{url:'http://localhost:3100'+route});await delay(350);
 await evaluate('document.fonts.ready');
 const result=await evaluate(`(()=>{const w=${width};return {viewportWidth:w,innerWidth,scrollWidth:document.documentElement.scrollWidth, offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect(); const style=getComputedStyle(el);return r.width>0&&r.right>w+2&&r.left>=0&&style.position!=='fixed'&&!el.closest('.terminal-sidebar,.orbital-scene')&&!el.closest('svg')&&!el.closest('.table-wrap,.holdings-table-wrap,.market-table-wrap,.matrix-table-wrap');}).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,right:Math.round(el.getBoundingClientRect().right)}))}})()`);
 if(result.scrollWidth>width+1)problems.push({route,width,...result});
 if(width===320 && route==='/dashboard') {
  const previousPath=await evaluate('document.querySelector(".price-line").getAttribute("d")');
  await evaluate('document.querySelector(".chart-scrubber input").focus()');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home'});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Home',code:'Home'});
  if(!await evaluate('document.querySelector(".chart-scrubber input").value === "0"'))throw Error('Chart keyboard inspection failed');
  await evaluate('[...document.querySelectorAll(".timeframes button")].find(b=>b.textContent.trim()==="1W").click()');await delay(200);
  if(previousPath===await evaluate('document.querySelector(".price-line").getAttribute("d")'))throw Error('Timeframe did not update chart');
 }
 if(width===390&&['/login','/dashboard','/dashboard/watchlist','/dashboard/markets','/dashboard/portfolio','/dashboard/market-briefing','/dashboard/upgrade'].includes(route)){
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(os.tmpdir(),'redline-'+route.split('/').filter(Boolean).join('-')+'-390.png'),Buffer.from(shot.data,'base64'));
 }
 }
 }
 for(const width of [320,375,390,430,768,1024,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:450,deviceScaleFactor:1,mobile:width<768});
 await send('Page.navigate',{url:'http://localhost:3100/dashboard'});await delay(500);
 if(await evaluate('document.documentElement.scrollWidth > '+(width+1))) problems.push({route:'/dashboard',width,height:450,kind:'short-height overflow'});
 if(width<=768){
 await evaluate(`document.querySelector('[aria-label="Open navigation"]').click()`);await delay(100);
 if(!await evaluate(`document.querySelector('.terminal-sidebar').contains(document.activeElement) && document.body.style.overflow === "hidden"`))throw Error('Drawer focus/scroll lock failed');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await delay(100);
 if(await evaluate(`document.querySelector('.terminal-sidebar').classList.contains("is-open")`))throw Error('Drawer Escape failed');
 }
 await evaluate('document.querySelector(".plan-badge-upgrade-link").click()');await delay(100);
 if(await evaluate('document.documentElement.scrollWidth > '+(width+1))) problems.push({route:'pricing modal',width,height:450});
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await delay(100);
 if(await evaluate('!!document.querySelector(".pricing-modal-container")'))throw Error('Pricing Escape failed');
}
if(process.argv.includes('--paid')) {
 const { PrismaClient } = await import('../src/generated/prisma/client.ts');
 const { PrismaPg } = await import('@prisma/adapter-pg');
 db = new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
 const subscription = await db.billingSubscription.findFirst({where:{entitled:true}});
 if(!subscription)throw Error('No existing paid subscription to audit');
 sessionId=randomUUID();const token=randomBytes(32).toString('base64url');
 await db.session.create({data:{id:sessionId,token,userId:subscription.userId,expiresAt:new Date(Date.now()+3600000)}});
 const signature=createHmac('sha256',process.env.BETTER_AUTH_SECRET).update(token).digest('base64');
 await send('Network.setCookie',{name:'better-auth.session_token',value:encodeURIComponent(token+'.'+signature),url:'http://localhost:3100',path:'/',httpOnly:true,sameSite:'Lax'});
 // A test-only cookie insertion needs a new document to refresh Better Auth's
 // previously anonymous client cache, just as a completed sign-in does.
 await send('Page.navigate',{url:'http://localhost:3100/dashboard'});
 await delay(500);
 for(const width of [320,375,390,430,768,1024,1440]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:800,deviceScaleFactor:1,mobile:width<768});
  for(const route of routes.filter(p=>p.startsWith('/dashboard'))) {
   const linked = await evaluate(`!!document.querySelector('a[href="${route}"]')`);
   if(linked) await evaluate(`document.querySelector('a[href="${route}"]').click()`);
   else await send('Page.navigate',{url:'http://localhost:3100'+route});
   let pro=false;for(let attempt=0;attempt<200;attempt++){await delay(150);pro=await evaluate(`location.pathname === '${route}' && !!document.querySelector(".plan-badge.pro-active")`);if(pro)break;}
   await delay(200);
   if(!pro) {
    const diagnostic=await evaluate(`(async()=>{const s=await fetch('/api/auth/get-session').then(r=>r.json());const r=await fetch('/api/billing/plan');const b=await r.json();return {hasSession:!!s?.user,billingHttp:r.status,plan:b.plan,error:b.error};})()`);
    throw Error('Paid UI did not unlock: '+route+' '+JSON.stringify(diagnostic));
   }
   if(await evaluate('document.documentElement.scrollWidth > '+(width+1)))problems.push({route,width,kind:'paid overflow',details:await evaluate(`([...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>${width+2}&&r.left>=0&&!el.closest('svg')&&!el.closest('.terminal-sidebar,.table-wrap,.holdings-table-wrap,.market-table-wrap,.matrix-table-wrap');}).slice(0,5).map(el=>({cls:el.className,right:Math.round(el.getBoundingClientRect().right)})))`)});
   if(!await evaluate('document.querySelector("meta[name=robots]")?.content.includes("noindex")'))throw Error('Missing dashboard noindex');
   paidViewportChecks++;
   if(width===1440&&route==='/dashboard') { const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'redline-desktop-1440.png'),Buffer.from(shot.data,'base64')); }
  }
 }
 await send('Network.clearBrowserCookies');
}
await send('Page.navigate',{url:'http://localhost:3100/login'});await delay(500);
const manifest=await send('Page.getAppManifest');if(manifest.errors?.length)throw Error('Invalid browser app manifest');
const seo=await evaluate(`({title:document.title,canonical:document.querySelector('link[rel="canonical"]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,jsonLd:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@type']})`);
await evaluate('navigator.serviceWorker.ready');
const cachePaths=await evaluate('(async()=>{const result=[];for(const key of await caches.keys()){const cache=await caches.open(key);for(const req of await cache.keys())result.push(new URL(req.url).pathname);}return result;})()');
if(cachePaths.some(p=>p.startsWith('/api/')||p.startsWith('/dashboard')||p==='/login'||p==='/signup'))throw Error('Sensitive cache entry');
server.kill();await delay(500);
await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
await send('Page.navigate',{url:'http://localhost:3100/dashboard/billing'});await delay(500);
if(!await evaluate('document.body.innerText.includes("A moment to reconnect.")'))throw Error('Offline fallback failed: '+JSON.stringify(await evaluate('({title:document.title,text:document.body.innerText.slice(0,180),controller:!!navigator.serviceWorker?.controller})')));
if(!await evaluate('fetch("/api/auth/get-session").then(()=>false).catch(()=>true)'))throw Error('API must remain network-only offline');
await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
console.log(JSON.stringify({viewportRouteChecks:63,paidViewportChecks,shortHeightWidths:7,drawerAndModalChecks:true,chartKeyboardAndTimeframe:true,offlineFallback:true,offlineApiNetworkOnly:true,manifestValid:true,cachePaths,seo,problems},null,2));
if(problems.length)process.exitCode=1;
}catch(e){console.error(e.message);process.exitCode=1;}finally{ws?.close();browser.kill();server.kill();if(db){if(sessionId)await db.session.deleteMany({where:{id:sessionId}});await db.$disconnect();}}
