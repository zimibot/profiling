import{a as e,v as t,d as r,i,B as a,h as l,j as s,s as d,m as o,t as n}from"./index-60ffdcbe.js";import{C as v}from"./CircularProgress-6afa790f.js";import{F as c}from"./FormControlLabel-ed2de69f.js";import{A as p}from"./Add-55ecba14.js";import{E as f}from"./Edit-fea7dbbc.js";import{L as m}from"./index-7f37c568.js";import{T as b}from"./index-08d30a70.js";import"./FormControl-d7e9850b.js";import"./formControlState-865d6002.js";import"./Typography-63ca3400.js";import"./index-d49f25e3.js";import"./moment-0b360bb8.js";import"./avatar-0ae0561b.js";import"./index-d93c6e67.js";const x=n('<div class="flex-1 flex flex-col min-h-[600px] gap-4"><div class="w-full grid grid-cols-2 gap-2"></div><div class="relative flex-1"><div class="absolute left-0 w-full top-0 overflow-auto h-full grid grid-cols-2 gap-3 ">'),g=n('<div class="w-full flex-1 flex items-center justify-center">'),u=n('<div><div class="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50 flex justify-between items-center"><div>'),h=n("<span>DATA FROM <b>"),$=n('<div><div class="flex gap-4 items-start flex-1 relative"><div> <!> </div><div class="flex-1 "><div class="gap-2 flex flex-wrap px-4"></div></div></div><div class="w-full flex justify-between items-center absolute bottom-[-5px] left-0"><div></div><div>'),_=n("<div>"),C=n('<div class="whitespace-nowrap max-w-xs relative"><div class="text-ellipsis overflow-hidden relative">'),w=n('<a data-lightbox="image-2"><img class="w-20">'),y=n('<div class=" bg-[#1e1e1e] p-2"><div class="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50 flex justify-between items-center">'),j=n("<span>DATA FROM <b>ADDITIONAL INFO"),I=n('<div><div class="p-2 flex items-center px-4"><div></div></div><div class="w-full flex justify-between items-center absolute bottom-[-5px] left-0"><div></div><div>'),N=()=>{const[n]=e();let N=t().pathname.split("/"),k=N[N.length-2];return r(m,{title:"IDENTIFICATION",get children(){const e=x(),t=e.firstChild,m=t.nextSibling.firstChild;return i(t,r(a,{href:`#/deck-explorer/marked-profile/${k}/additional-info`,fullWidth:!0,variant:"contained",color:"secondary",get startIcon(){return r(p,{})},children:"ADDITIONAL INFO"}),null),i(t,r(a,{href:`/marked-profile/${k}/identification/edit`,fullWidth:!0,variant:"contained",color:"secondary",get startIcon(){return r(f,{})},children:"EDIT PERSONAL INDETIFICATION"}),null),i(m,(()=>{const e=l((()=>!!n().loading));return()=>e()?(()=>{const e=g();return i(e,r(v,{size:25})),e})():[l((()=>n()?.getProfile?.data?.map(((e,t)=>(()=>{const a=u(),v=a.firstChild,p=v.firstChild;return i(v,r(b,{get label(){return(()=>{const t=h(),r=t.firstChild.nextSibling;return i(r,(()=>e.label)),t})()}}),p),i(p,t+1),i(a,(()=>e.data.map((e=>(()=>{const t=$(),a=t.firstChild,n=a.firstChild,v=n.firstChild.nextSibling;v.nextSibling;const p=n.nextSibling.firstChild,f=a.nextSibling.firstChild,m=f.nextSibling;return i(n,(()=>1===e.total_data?"":`[${e.total_data}]`),v),i(n,(()=>e.label),null),i(p,(()=>e.data.map((t=>(()=>{const a=_();return i(a,r(c,{class:"pl-4 !m-0 border-[#454545] bg-[#2C2C2C] pr-2 py-1 flex gap-4 border-[0] max-w-sm",get label(){return(()=>{const r=C(),a=r.firstChild;return i(a,(()=>{const r=l((()=>"ID CARD PHOTO"!==e.label));return()=>r()?t.label:(()=>{const e=w(),r=e.firstChild;return s((i=>{const a=t.label,l=t.label;return a!==i._v$5&&d(e,"href",i._v$5=a),l!==i._v$6&&d(r,"src",i._v$6=l),i}),{_v$5:void 0,_v$6:void 0}),e})()})()),r})()}})),s((()=>d(a,"title",t.label))),a})())))),s((e=>{const r=`flex gap-4 relative border-b ${"dark"===o()?"border-[#333]":"border-[#aaa]"}  py-2 `,i=("dark"===o()?"text-[#aaa]":"text-[#444]")+" sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2",a=`h-2 w-2 ${"dark"===o()?"bg-[#222222]":"bg-[#aaa]"} left-0`,l=`h-2 w-2 ${"dark"===o()?"bg-[#222222]":"bg-[#aaa]"} right-0`;return r!==e._v$&&(t.className=e._v$=r),i!==e._v$2&&(n.className=e._v$2=i),a!==e._v$3&&(f.className=e._v$3=a),l!==e._v$4&&(m.className=e._v$4=l),e}),{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),t})()))),null),s((()=>a.className="bg-[#1e1e1e] p-2 "+(0===t?" col-span-full":n()?.getProfile?.data?.length<2?"col-span-full":""))),a})())))),l((()=>{const e=l((()=>n()?.additional?.items?.length>0));return()=>e()&&(()=>{const e=y(),t=e.firstChild;return i(t,r(b,{get label(){return j()}})),i(e,(()=>n()?.additional?.items.map((e=>(()=>{const t=I(),a=t.firstChild,l=a.firstChild,d=a.nextSibling.firstChild,n=d.nextSibling;return i(l,(()=>e.category)),i(a,r(c,{class:"pl-4 !m-0 border-[#454545] bg-[#2C2C2C] pr-2 py-1 flex gap-4 border-[0] max-w-sm",get label(){return(()=>{const t=C(),r=t.firstChild;return i(r,(()=>e.value)),t})()}}),null),s((e=>{const r="flex gap-4 relative border-b "+("dark"===o()?"border-[#333]":"border-[#aaa]"),i=("dark"===o()?"text-[#aaa]":"text-[#444]")+" sticky top-[10px] whitespace-nowrap w-[220px] z-10",a=`h-2 w-2 ${"dark"===o()?"bg-[#222222]":"bg-[#aaa]"} left-0`,s=`h-2 w-2 ${"dark"===o()?"bg-[#222222]":"bg-[#aaa]"} right-0`;return r!==e._v$7&&(t.className=e._v$7=r),i!==e._v$8&&(l.className=e._v$8=i),a!==e._v$9&&(d.className=e._v$9=a),s!==e._v$10&&(n.className=e._v$10=s),e}),{_v$7:void 0,_v$8:void 0,_v$9:void 0,_v$10:void 0}),t})()))),null),e})()})())]})()),e}})};export{N as default};
