import { mentors, resources, progress } from './data';
import type { UserProfile, MentorMatch, Skill } from './types';
export const normalize = (s: string) => s.toLowerCase().trim();
const domains: Record<string,string[]> = {'AI / Machine Learning':['ai','machine learning','deep learning','ml'],MLOps:['mlops','machine learning','ai'], 'Data Science':['data science','data scientist','data engineer','ai'], 'Cloud Computing':['cloud','aws'],DevOps:['devops','infrastructure'],Cybersecurity:['cybersecurity','security'],'Full Stack Development':['full stack','frontend','front end','react','web developer'],'Software Engineering':['software','programming','developer']};
function aligned(text: string, domain: string) {return (domains[domain] ?? [domain]).some(term=>new RegExp('(^|[^a-z])'+term+'([^a-z]|$)','i').test(text));}
function overlap(a:string[],b:string[]) { return [...new Set(a)].filter(x=>b.some(y=>normalize(x)===normalize(y))); }
export function getMatches(p: UserProfile): MentorMatch[] {
return mentors.map(mentor=>{
const desired=overlap(p.desiredSkills,mentor.skills), existing=overlap(p.skills,mentor.skills);
const interestHits=p.interests.filter(i=>mentor.interests.some(j=>normalize(i)===normalize(j))||aligned(i,mentor.domain));
const career=aligned(p.careerGoal,mentor.domain)?40:mentor.skills.some(s=>normalize(s).length>2 && normalize(p.careerGoal).includes(normalize(s)))?20:0;
const breakdown={career,desired:p.desiredSkills.length?30*desired.length/p.desiredSkills.length:0,existing:p.skills.length?20*existing.length/p.skills.length:0,interests:p.interests.length?10*interestHits.length/p.interests.length:0};
const reasons=[career?`${mentor.domain} expertise aligns with your career goal.`:`Offers a different perspective through ${mentor.domain}.`,desired.length?`Covers ${desired.join(', ')}, which you want to learn.`:'No exact desired-skill overlap yet.',existing.length?`Builds on your ${existing.slice(0,3).join(', ')} background.`:'Introduces skills beyond your current background.',interestHits.length?`Shares your interest in ${interestHits.join(', ')}.`:'Explore their mentoring focus for a broader perspective.'];
return {mentor,score:Math.round(Object.values(breakdown).reduce((a,b)=>a+b,0)),reasons,overlap:existing,desired,breakdown};
}).sort((a,b)=>b.score-a.score||a.mentor.name.localeCompare(b.mentor.name));
}
export function getRecommendations(p: UserProfile) {
const matches=getMatches(p); const leading=matches[0];
const candidates=[...p.desiredSkills,...(leading.score?leading.mentor.expertise:[]),...p.interests.flatMap(i=>mentors.filter(m=>aligned(i,m.domain)).flatMap(m=>m.expertise.slice(0,1)))];
const unique=[...new Set(candidates.map(x=>x.trim()).filter(Boolean))].filter(x=>!p.skills.some(s=>normalize(s)===normalize(x)));
const skills: Skill[]=unique.slice(0,4).map(name=>({name,reason:p.desiredSkills.some(s=>normalize(s)===normalize(name))?'A skill you chose to develop.':'Connects your interests with a relevant mentor’s expertise.',relevance:`Supports your path toward ${p.careerGoal}.`}));
const latest=progress.at(-1)!;
const ranked=resources.map(resource=>{const desired=p.desiredSkills.some(s=>normalize(s)===normalize(resource.skill));const suggested=skills.some(s=>normalize(s.name)===normalize(resource.skill));const current=p.skills.some(s=>normalize(s)===normalize(resource.skill));const value=latest[resource.skill as keyof typeof latest];const practice=current && typeof value==='number'&&value<85;return {...resource,rank:(desired?50:0)+(suggested?30:0)+(practice?15:0),reason:desired?`Builds ${resource.skill}, one of your chosen next skills.`:suggested?`Develops a recommended skill for ${p.careerGoal}.`:practice?`Your latest demo progress in ${resource.skill} is ${value}%; reinforce it with practice.`:'Broadens your technical foundations.'};}).filter(r=>r.rank>0).sort((a,b)=>b.rank-a.rank).slice(0,4);
return {skills,resources:ranked,matches:matches.slice(0,3)};
}
