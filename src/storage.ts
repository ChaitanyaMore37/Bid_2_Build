import { profile, initialActivities, mentors, resources } from './data';
import type { AppData } from './types';
export const STORAGE_KEY='codetrack.v1';
const strings=(x:unknown): x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string');
export function loadData():AppData {
 const defaults:AppData={version:1,profile,saved:[],comparison:[],activities:initialActivities,feedback:[]};
 try { const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return defaults;const d=JSON.parse(raw);if(d.version!==1)return defaults;
 const p=d.profile;if(p&&['name','education','careerGoal'].every(k=>typeof p[k]==='string')&&['skills','desiredSkills','interests'].every(k=>strings(p[k])))defaults.profile=p;
 if(Array.isArray(d.saved))defaults.saved=d.saved.filter((s:any)=>s&&((s.kind==='mentor'&&mentors.some(m=>m.id===s.id))||(s.kind==='resource'&&resources.some(r=>r.id===s.id))));
 if(strings(d.comparison))defaults.comparison=[...new Set<string>(d.comparison)].filter(id=>mentors.some(m=>m.id===id)).slice(0,3);
 if(Array.isArray(d.activities))defaults.activities=d.activities.filter((a:any)=>a&&['id','action','entity','timestamp'].every(k=>typeof a[k]==='string')&&Number.isFinite(Date.parse(a.timestamp)));
 if(Array.isArray(d.feedback))defaults.feedback=d.feedback.filter((f:any)=>f&&['id','about','entity','helpful','improvement','comments','timestamp'].every(k=>typeof f[k]==='string'));
 return defaults;
 } catch{return defaults;}
}
export function persist(data:AppData){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
