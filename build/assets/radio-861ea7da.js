import{i as e,d as l,h as t,m as a,j as r,s as i,t as s}from"./index-d44b4c22.js";import{F as o}from"./FormControl-1561601a.js";import{F as d}from"./FormControlLabel-3f4cf9c3.js";import{F as n}from"./FormLabel-20daf39e.js";import{R as h,a as u}from"./RadioGroup-c56672d4.js";const c=s('<div class="relative px-4"><div class="absolute w-full h-full left-0 top-0 flex justify-between items-center"><div class="h-full w-[1px] bg-[#353535] relative flex justify-between flex-col"><div class="w-[15px] h-[1px] bg-[#353535]"></div><div class="w-[15px] h-[1px] bg-[#353535]"></div></div><div class="h-full w-[1px] bg-[#353535] relative flex justify-between flex-col rotate-180"><div class="w-[15px] h-[1px] bg-[#353535]"></div><div class="w-[15px] h-[1px] bg-[#353535]">'),f=s('<svg width="25" height="25" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="23" height="23" fill="white" fill-opacity="0.2" stroke="#757575" stroke-width="2"></rect><path d="M2 25L25 2" stroke="#757575" stroke-width="3">'),p=s('<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="25" height="25">'),g=({data:s=[{value:"male",label:"Male"},{value:"female",label:"Female"}],defaultValue:g="female",name:m="radio",id:w="demo-radio-buttons-group-label",label:v=null,className:x,onChange:b})=>(()=>{const j=c();return j.firstChild,e(j,l(o,{get children(){return[t((()=>v&&l(n,{id:w,children:v}))),l(h,{onChange:b,"aria-labelledby":w,defaultValue:g,name:m,color:"primary",class:`!d-flex !flex-row ${x||""}`,get children(){return s.map((e=>l(d,{get disabled(){return e?.disabled},get value(){return e.value},get sx(){return{color:"dark"===a()?"#eee":"#222"}},control:()=>l(u,{get inputProps(){return{"aria-label":e.label,"aria-level":e.type}},get icon(){return f()},get checkedIcon(){return(()=>{const e=p(),l=e.firstChild;return r((()=>i(l,"fill","dark"===a()?"#eee":"#555"))),e})()},color:"primary"}),get label(){return e.label}})))}})]}}),null),j})();export{g as R};
