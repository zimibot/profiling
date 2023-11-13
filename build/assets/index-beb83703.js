import{p as e,q as t,r,v as o,w as a,x as i,y as s,z as n,k as l,C as c,d,D as h,f as u,t as p,i as m,B as g,b as v,h as w,j as f,s as b}from"./index-d44b4c22.js";import{D as C}from"./Divider-2cde6a4f.js";import{S as k}from"./SwitchBase-26455d91.js";import{C as x}from"./index-c66b90dd.js";import{T as S,C as y}from"./index-71d95980.js";import{C as z}from"./index-24a514f7.js";import{U as j}from"./Upload-2b6ed8b9.js";import{R as M}from"./radio-861ea7da.js";import{D as $}from"./input-3843779d.js";import{C as R}from"./Close-c6817fe5.js";import{c as I,a as L}from"./index.module-085e1610.js";import"./formControlState-b6945e4c.js";import"./FormControlLabel-3f4cf9c3.js";import"./FormControl-1561601a.js";import"./Typography-f2013cfe.js";import"./useControlled-15fabf1b.js";import"./index-1522cdc1.js";import"./FormLabel-20daf39e.js";import"./RadioGroup-c56672d4.js";import"./Visibility-0e2812d4.js";import"./CircularProgress-07fdfeec.js";import"./isHostComponent-aa695ee2.js";const P=e("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),B=r()({name:"MuiSwitch",selfPropNames:["checkedIcon","classes","color","disabled","icon","size","value"],propDefaults:({set:e})=>e({color:"primary",size:"medium"}),utilityClass:function(e){return t("MuiSwitch",e)},slotClasses:e=>({root:["root",!!e.edge&&`edge${o(e.edge)}`,`size${o(e.size)}`],switchBase:["switchBase",`color${o(e.color)}`,!!e.checked&&"checked",!!e.disabled&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]})}),E=a("span",{name:"MuiSwitch",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,r.edge&&t[`edge${o(r.edge)}`],t[`size${o(r.size)}`]]}})((({ownerState:e})=>({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"},..."start"===e.edge&&{marginLeft:-8},..."end"===e.edge&&{marginRight:-8},..."small"===e.size&&{width:40,height:24,padding:7,[`& .${P.thumb}`]:{width:16,height:16},[`& .${P.switchBase}`]:{padding:4,[`&.${P.checked}`]:{transform:"translateX(16px)"}}}}))),U=a(k,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.switchBase,{[`& .${P.input}`]:t.input},"default"!==r.color&&t[`color${o(r.color)}`]]}})((({theme:e})=>({position:"absolute",top:0,left:0,zIndex:1,color:"light"===e.palette.mode?e.palette.common.white:e.palette.grey[300],transition:e.transitions.create(["left","transform"],{duration:e.transitions.duration.shortest}),[`&.${P.checked}`]:{transform:"translateX(20px)"},[`&.${P.disabled}`]:{color:"light"===e.palette.mode?e.palette.grey[100]:e.palette.grey[600]},[`&.${P.checked} + .${P.track}`]:{opacity:.5},[`&.${P.disabled} + .${P.track}`]:{opacity:"light"===e.palette.mode?.12:.2},[`& .${P.input}`]:{left:"-100%",width:"300%"}})),(({theme:e,ownerState:t})=>({"&:hover":{backgroundColor:i(e.palette.action.active,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},..."default"!==t.color&&{[`&.${P.checked}`]:{color:e.palette[t.color].main,"&:hover":{backgroundColor:i(e.palette[t.color].main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${P.disabled}`]:{color:"light"===e.palette.mode?s(e.palette[t.color].main,.62):n(e.palette[t.color].main,.55)}},[`&.${P.checked} + .${P.track}`]:{backgroundColor:e.palette[t.color].main}}}))),A=a("span",{name:"MuiSwitch",slot:"Track",overridesResolver:(e,t)=>t.track})((({theme:e})=>({height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:e.transitions.create(["opacity","background-color"],{duration:e.transitions.duration.shortest}),backgroundColor:"light"===e.palette.mode?e.palette.common.black:e.palette.common.white,opacity:"light"===e.palette.mode?.38:.3}))),D=a("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:(e,t)=>t.thumb})((({theme:e})=>({boxShadow:e.shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}))),H=B.component((function({allProps:e,props:t,classes:r,otherProps:o}){const a=()=>d(D,{get class(){return r.thumb},ownerState:e}),i=l(r,{get root(){return r.switchBase}}),[,s]=c(o,["sx"]),n=l(s,{get checkedIcon(){return t.checkedIcon||a},get disabled(){return t.disabled},get icon(){return t.icon||a},get value(){return t.value}});return d(E,{get class(){return h(r.root,o.class)},get sx(){return o.sx},ownerState:e,get children(){return[d(U,l({type:"checkbox",ownerState:e},n,{classes:i})),d(A,{get class(){return r.track},ownerState:e})]}})})),N=p('<svg><path d="M0 0h24v24H0z" fill="none"></svg>',!1,!0),O=p('<svg><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></svg>',!1,!0),T=u((()=>[N(),O()]),"AccountBox"),V=p('<svg><path d="M0 0h24v24H0z" fill="none"></svg>',!1,!0),F=p('<svg><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></svg>',!1,!0),_=u((()=>[V(),F()]),"Logout"),q=p('<svg><g><rect fill="none" height="24" width="24"></rect><path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V7h14V19z M13.5,13 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5S13.5,12.17,13.5,13z M12,9c-2.73,0-5.06,1.66-6,4 c0.94,2.34,3.27,4,6,4s5.06-1.66,6-4C17.06,10.66,14.73,9,12,9z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 c1.38,0,2.5,1.12,2.5,2.5C14.5,14.38,13.38,15.5,12,15.5z"></svg>',!1,!0),X=u((()=>q()),"Preview"),G=p('<form class="max-w-[500px] space-y-4"><div></div><div></div><div></div><div>'),K=p('<div class="col-span-5 flex flex-col flex-1">'),J=p('<div class="flex justify-between items-center"><span>Reset Password</span><div>'),W=({onClose:e})=>{const t=I({password:L("",{required:!0}),re_password:L("",{required:!0}),other_password:L("",{required:!0})});return(()=>{const r=K();return m(r,d(y,{title:"Account Settings",className:"space-y-4",get children(){return d(z,{get title(){return(()=>{const t=J(),r=t.firstChild.nextSibling;return m(r,d(g,{onClick:e,color:"error",variant:"outlined",get startIcon(){return d(R,{})},children:"CLOSE"})),t})()},get children(){const e=G(),r=e.firstChild,o=r.nextSibling,a=o.nextSibling,i=a.nextSibling;return m(r,d(S,{label:"Current Password"}),null),m(r,d($,{removeicon:!0,get control(){return t.controls.password}}),null),m(o,d(S,{label:"New Password"}),null),m(o,d($,{type:"password",removeicon:!0,get control(){return t.controls.re_password}}),null),m(a,d(S,{label:"RE New Password"}),null),m(a,d($,{type:"password",removeicon:!0,get control(){return t.controls.other_password}}),null),m(i,d(g,{color:"secondary",variant:"contained",size:"large",children:"SAVE"})),e}})}})),r})()},Q=p('<div><div><div class="relative"><input class="absolute w-full h-full top-0 left-0 opacity-0" type="file">'),Y=p("<div>"),Z=p("<div><div>"),ee=p("<div><div>OFF<!>ON"),te=p('<div class="flex flex-1 flex-col py-4"><div class="grid grid-cols-8 flex-1 gap-4"><div class="col-span-3 flex flex-col">'),re=p('<div class="w-48 p-2"><img>'),oe=()=>{let e=/true/.test(localStorage.getItem("mode"));const[t,r]=v(e),[o,a]=v(!1),[i,s]=v(null);let n=[{label:"PHONE NUMBER",type:"number",value:"phone_number"},{label:"ID NUMBER",type:"number",value:"id_number"},{label:"MARKED PROFILE",type:"teks",value:"marked_profile"}];const l=e=>{let t=e.target.checked;r(e.target.checked),localStorage.setItem("mode",t),window.api.invoke("change_theme",t?"dark":"light"),setTimeout((()=>{window.location.reload()}),200)},c=()=>{a()},h=async e=>{let t=e.target.files[0];if(t){let e=new Image,o=await(r=t,new Promise(((e,t)=>{const o=new FileReader;o.readAsDataURL(r),o.onload=()=>e(o.result),o.onerror=t})));e.onload=function(){this.width;let e=this.height;URL.revokeObjectURL(o),e>80?alert("Ukuran height logo tidak boleh lebih dari 80px"):s(o)},e.src=o}var r};return d(x,{get children(){const e=te(),r=e.firstChild,s=r.firstChild;return m(s,d(y,{title:"System Settings",get children(){return d(z,{className:"min-w-[500px] space-y-4",get children(){return[(()=>{const e=Q(),t=e.firstChild,r=t.firstChild,o=r.firstChild;return m(e,d(S,{label:"Update Logo"}),t),m(t,(()=>{const e=w((()=>!!i()));return()=>e()&&(()=>{const e=re(),t=e.firstChild;return f((()=>b(t,"src",i()))),e})()})(),r),m(r,d(g,{variant:"contained",color:"secondary",get startIcon(){return d(j,{})},children:"Upload Logo "}),o),o.addEventListener("change",h),e})(),(()=>{const e=Y();return m(e,d(S,{label:"Default Search"}),null),m(e,d(M,{data:n}),null),e})(),d(g,{variant:"contained",color:"secondary",children:"UPDATE"}),d(C,{}),(()=>{const e=Z(),t=e.firstChild;return m(e,d(S,{label:"Account"}),t),m(t,d(g,{onClick:()=>a("account"),variant:"contained",color:"secondary",get startIcon(){return d(T,{})},children:"Account Settings"})),e})(),(()=>{const e=ee(),r=e.firstChild,o=r.firstChild.nextSibling;return o.nextSibling,m(e,d(S,{label:"Dark Mode"}),r),m(r,d(H,{color:"default",value:"dark",get defaultChecked(){return t()},onChange:l}),o),e})(),(()=>{const e=Z(),t=e.firstChild;return m(e,d(S,{label:"Log Activity"}),t),m(t,d(g,{onClick:()=>a("preview"),variant:"contained",color:"secondary",get startIcon(){return d(X,{})},children:"Preview Log"})),e})(),(()=>{const e=Z(),t=e.firstChild;return m(e,d(S,{label:"Log OUT"}),t),m(t,d(g,{onClick:()=>{localStorage.clear(),window.location.reload()},variant:"contained",color:"secondary",get startIcon(){return d(_,{})},children:"EXIT"})),e})()]}})}})),m(r,(()=>{const e=w((()=>"account"===o()));return()=>e()&&d(W,{onClose:c})})(),null),e}})};export{oe as default};
