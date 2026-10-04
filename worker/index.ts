export interface Env { ESSEF_KV: KVNamespace }
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const enc=new TextEncoder();
async function hash(password:string, salt?:string){
 const saltBytes=salt?Uint8Array.from(atob(salt),c=>c.charCodeAt(0)):crypto.getRandomValues(new Uint8Array(16));
 const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:saltBytes,iterations:100000,hash:'SHA-256'},key,256);
 const hashBytes=new Uint8Array(bits);
 const toB64=(a:Uint8Array)=>btoa(String.fromCharCode(...a));
 return {hash:toB64(hashBytes),salt:toB64(saltBytes)};
}
const SESSION_COOKIE='ESSEF_SESSION';
const LEGACY_COOKIE='ESSSEF_SESSION';
function cookie(name:string,value:string,maxAge=60*60*24*7){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
function getSessionToken(req:Request){
 const c=req.headers.get('Cookie')||'';
 const get=(n:string)=>c.match(new RegExp(`${n}=([^;]+)`))?.[1] ?? null;
 return get(SESSION_COOKIE) ?? get(LEGACY_COOKIE);
}
async function userFrom(req:Request,env:Env){const token=getSessionToken(req);if(!token)return null;const id=await env.ESSEF_KV.get(`session:${token}`);if(!id)return null;return env.ESSEF_KV.get(`user:${id}`,{type:'json'}) as Promise<any>}
const safeUser=(u:any)=>{if(!u)return null;const {passwordHash,passwordSalt,...safe}=u;return safe};
export default {async fetch(req:Request,env:Env){
 const u=new URL(req.url);
 if(u.pathname==='/api/health'&&req.method==='GET')return json({ok:true,ts:new Date().toISOString()});
 if(!u.pathname.startsWith('/api/')) return new Response(null,{status:404});
 try{
  if(u.pathname==='/api/register'&&req.method==='POST'){const b:any=await req.json();const email=String(b.email||'').trim().toLowerCase();if(!email||!b.password||b.password.length<8)return json({error:'Invalid registration'},400);if(await env.ESSEF_KV.get(`email:${email}`))return json({error:'Email already used'},409);const id=crypto.randomUUID();const user={id,email,name:String(b.name||email.split('@')[0]),phone:String(b.phone||''),createdAt:new Date().toISOString()};const pw=await hash(b.password);await env.ESSEF_KV.put(`user:${id}`,JSON.stringify({...user,passwordHash:pw.hash,passwordSalt:pw.salt}));await env.ESSEF_KV.put(`email:${email}`,id);const token=crypto.randomUUID();await env.ESSEF_KV.put(`session:${token}`,id,{expirationTtl:60*60*24*7});return new Response(JSON.stringify({user}),{headers:{'content-type':'application/json','set-cookie':cookie(SESSION_COOKIE,token)}})}
  if(u.pathname==='/api/login'&&req.method==='POST'){const b:any=await req.json();const email=String(b.email||'').trim().toLowerCase();const id=await env.ESSEF_KV.get(`email:${email}`);if(!id)return json({error:'Invalid credentials'},401);const user:any=await env.ESSEF_KV.get(`user:${id}`,{type:'json'});if(!user||user.passwordHash!==(await hash(String(b.password||''),user.passwordSalt)).hash)return json({error:'Invalid credentials'},401);const token=crypto.randomUUID();await env.ESSEF_KV.put(`session:${token}`,id,{expirationTtl:60*60*24*7});return new Response(JSON.stringify({user:safeUser(user)}),{headers:{'content-type':'application/json','set-cookie':cookie(SESSION_COOKIE,token)}})}
  if(u.pathname==='/api/logout'&&req.method==='POST'){const token=getSessionToken(req);if(token)await env.ESSEF_KV.delete(`session:${token}`).catch(()=>{});return new Response('{}',{headers:{'content-type':'application/json','set-cookie':cookie(SESSION_COOKIE,'',0)}})}
  if(u.pathname==='/api/me'&&req.method==='GET'){const user:any=await userFrom(req,env);if(!user)return json({error:'Unauthorized'},401);return json({user:safeUser(user)})}
  if(u.pathname==='/api/profile'&&req.method==='PUT'){const user:any=await userFrom(req,env);if(!user)return json({error:'Unauthorized'},401);const b:any=await req.json();const updated={...user,name:String(b.name??user.name),phone:String(b.phone??user.phone)};await env.ESSEF_KV.put(`user:${user.id}`,JSON.stringify(updated));return json({user:safeUser(updated)})}
  return json({error:'Not found'},404)
 }catch(e){return json({error:'Server error'},500)}}};
