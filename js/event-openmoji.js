import { openMojiCatalog } from './openmoji-catalog.js';
import { openMojiReviewRevision, reviewedOpenMojiEntries, reviewedOpenMojiBindings, reviewedResultTitles } from './reviewed-event-openmoji.js';

const key=(title,text,slot)=>JSON.stringify([title??'',text??'',slot]);
const reviewed=new Map(reviewedOpenMojiEntries.map(([title,text,slot,plan])=>[key(title,text,slot),plan]));
const bindings=new Map(reviewedOpenMojiBindings.map(([title,label,slot,identity])=>[key(title,label,slot),reviewed.get(JSON.stringify(identity))]));
const resultTitles=new Map(reviewedResultTitles.map(([title,identity])=>[title,reviewed.get(JSON.stringify(identity))]));
const texts=new Map();
for(const [,text,slot,plan] of reviewedOpenMojiEntries) {
  const identity=key('',text,slot),old=texts.get(identity);
  if(old===undefined)texts.set(identity,plan);
  else if(old && old.code!==plan.code)texts.set(identity,null);
}
const normalized=new Map(Object.keys(openMojiCatalog).map(code=>[code.replaceAll('-FE0F',''),code]));
export function resolveOpenMojiCode(code='1F4AC') {
  const value=code.toUpperCase().replaceAll('_','-');
  return openMojiCatalog[value]?value:normalized.get(value.replaceAll('-FE0F',''))??'1F4AC';
}
export function getOpenMojiPlan(target,scene={},isResult=true) {
  const slot=isResult?'result':'scene';
  const title=target.mediaSceneTitle??scene.mediaSceneTitle??scene.title??target.title??'';
  const text=`${target.text??target.content??target.transitionText??target.label??''}`.trim();
  const label=target.label??target.mediaChoiceLabel;
  let plan=reviewed.get(key(title,text,slot))??reviewed.get(key(title,text.split('\n')[0],slot));
  if(!plan && label)plan=bindings.get(key(title,label,slot));
  if(!plan && !isResult)plan=bindings.get(key(title,'',slot));
  if(!plan && isResult)plan=resultTitles.get(target.title);
  if(!plan)plan=texts.get(key('',text,slot))??texts.get(key('',text.split('\n')[0],slot));
  const saved=target.imageOptions?.[0]?.plan;
  if(!plan && saved?.reviewRevision===openMojiReviewRevision && (text===saved.reviewText||text.startsWith(saved.reviewText+'\n')))plan=saved;
  if(!plan && isResult && target.content)for(const [identity,candidate] of texts) {
    const [,reviewText,reviewSlot]=JSON.parse(identity);
    if(candidate && reviewSlot===slot && reviewText && text.startsWith(reviewText+'\n')){plan=candidate;break;}
  }
  if(!plan) {
    const code=resolveOpenMojiCode(target.mediaReview?.code??(target.imageFallback??target.image??'').match(/\/([A-F0-9-]+)\.svg/)?.[1]);
    plan={code,action:'icon',label:target.mediaReview?.subject??target.imageAlt??target.title??openMojiCatalog[code].annotation};
  } else plan={...plan,reviewed:true};
  return {...plan,key:`openmoji-${plan.code}`,reviewRevision:openMojiReviewRevision,reviewText:text};
}
export function getEventOpenMoji(target,scene={},isResult=true) {
  const plan=getOpenMojiPlan(target,scene,isResult);
  return {url:new URL(`./img/events/openmoji/animated/svg/${plan.code}.svg`,import.meta.url).href,
    poster:new URL(`./img/events/openmoji/color/svg/${plan.code}.svg`,import.meta.url).href,
    alt:`OpenMoji: ${plan.label}`,source:plan.key,kind:'animated-openmoji',origin:'openmoji',plan};
}
export function getEventOpenMojiOptions(target,scene={},isResult=true) {
  return [getEventOpenMoji(target,scene,isResult)];
}
export function ensureEventOpenMoji(target,scene={}) {
  target.mediaReview??={code:resolveOpenMojiCode((target.imageFallback??target.image??'').match(/\/([A-F0-9-]+)\.svg/)?.[1]),subject:target.imageAlt??target.title??''};
  const image=getEventOpenMoji(target,scene);
  Object.assign(target,{image:image.url,imageAlt:image.alt,imageFallback:image.poster,imageFallbackAlt:image.alt,imageOptions:[image]});
  return target;
}
