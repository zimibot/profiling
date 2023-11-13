import{f as e,t,p as o,q as r,r as n,d as i,v as a,w as s,Y as l,x as c,C as d,k as p,Z as u,Q as m,P as g,K as h,D as v,_ as f,R as x,a as C,m as b,i as k,j as S,B as y}from"./index-d44b4c22.js";import{S as P}from"./SwitchBase-26455d91.js";import{B as M,M as w,F as D}from"./Modal-3c0cb9cc.js";import{c as W}from"./FormLabel-20daf39e.js";import{T as B}from"./Typography-f2013cfe.js";const T=t('<svg><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></svg>',!1,!0),$=e((()=>T()),"CheckBox"),R=t('<svg><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></svg>',!1,!0),I=e((()=>R()),"CheckBoxOutlineBlank"),z=t('<svg><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></svg>',!1,!0),A=e((()=>z()),"IndeterminateCheckBox");const H=o("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary"]),F=n()({name:"MuiCheckbox",propDefaults:({set:e})=>e({color:"primary",indeterminate:!1,size:"medium",checkedIcon:()=>i($,{}),icon:()=>i(I,{}),indeterminateIcon:()=>i(A,{})}),selfPropNames:["checked","checkedIcon","classes","color","disableRipple","disabled","icon","id","indeterminate","indeterminateIcon","inputProps","inputRef","onChange","required","size","value"],utilityClass:function(e){return r("MuiCheckbox",e)},slotClasses:e=>({root:["root",e.indeterminate&&"indeterminate",`color${a(e.color)}`]})}),N=s(P,{skipProps:l.filter((e=>"classes"!==e)),name:"MuiCheckbox",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,o.indeterminate&&t.indeterminate,"default"!==o.color&&t[`color${a(o.color)}`]]}})((({theme:e,ownerState:t})=>({color:e.palette.text.secondary,...!t.disableRipple&&{"&:hover":{backgroundColor:c("default"===t.color?e.palette.action.active:e.palette[t.color].main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},..."default"!==t.color&&{[`&.${H.checked}, &.${H.indeterminate}`]:{color:e.palette[t.color].main},[`&.${H.disabled}`]:{color:e.palette.action.disabled}}}))),j=F.component((function({allProps:e,classes:t,props:o}){const[,r]=d(e,["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size"]),n=p((()=>o.classes||{}),t);return i(u.Provider,{value:{get fontSize(){return o.size}},get children(){return i(N,p({type:"checkbox"},r,{classes:n,get inputProps(){return{"data-indeterminate":o.indeterminate,...o.inputProps||{}}},get icon(){return o.indeterminate?o.indeterminateIcon:o.icon},get checkedIcon(){return o.indeterminate?o.indeterminateIcon:o.checkedIcon},ownerState:e}))}})})),V=t('<svg><path d="M0 0h24v24H0z" fill="none"></svg>',!1,!0),L=t('<svg><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></svg>',!1,!0),E=e((()=>[V(),L()]),"CheckBox"),K=t('<svg><path d="M0 0h24v24H0z" fill="none"></svg>',!1,!0),O=t('<svg><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></svg>',!1,!0),Y=e((()=>[K(),O()]),"CheckBoxOutlineBlank"),X=e=>{const t=e.sx||{borderRadius:0,padding:0};return i(j,p(e,{get icon(){return i(Y,{color:"primary"})},get checkedIcon(){return i(E,{})},sx:t}))},q=m({});const G=o("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),Q=n()({name:"MuiDialog",selfPropNames:["aria-describedby","aria-labelledby","children","classes","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],utilityClass:function(e){return r("MuiDialog",e)},slotClasses:e=>({root:["root"],container:["container",`scroll${a(e.scroll)}`],paper:["paper",`paperScroll${a(e.scroll)}`,`paperWidth${a(String(e.maxWidth))}`,e.fullWidth&&"paperFullWidth",e.fullScreen&&"paperFullScreen"]})}),Z=s(M,{name:"MuiDialog",slot:"Backdrop"})({zIndex:-1}),_=s(w,{name:"MuiDialog",slot:"Root",overridesResolver:(e,t)=>t.root})({"@media print":{position:"absolute !important"}}),J=s("div",{name:"MuiDialog",slot:"Container",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.container,t[`scroll${a(o.scroll)}`]]}})((({ownerState:e})=>({height:"100%","@media print":{height:"auto"},outline:0,..."paper"===e.scroll&&{display:"flex",justifyContent:"center",alignItems:"center"},..."body"===e.scroll&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}}}))),U=s(g,{name:"MuiDialog",slot:"Paper",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.paper,t[`scrollPaper${a(o.scroll)}`],t[`paperWidth${a(String(o.maxWidth))}`],o.fullWidth&&t.paperFullWidth,o.fullScreen&&t.paperFullScreen]}})((({theme:e,ownerState:t})=>({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"},..."paper"===t.scroll&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},..."body"===t.scroll&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},...!t.maxWidth&&{maxWidth:"calc(100% - 64px)"},..."xs"===t.maxWidth&&{maxWidth:"px"===e.breakpoints.unit?Math.max(e.breakpoints.values.xs,444):`${e.breakpoints.values.xs}${e.breakpoints.unit}`,[`&.${G.paperScrollBody}`]:{[e.breakpoints.down(Math.max(e.breakpoints.values.xs,444)+64)]:{maxWidth:"calc(100% - 64px)"}}},..."xs"!==t.maxWidth&&{maxWidth:`${e.breakpoints.values[t.maxWidth]}${e.breakpoints.unit}`,[`&.${G.paperScrollBody}`]:{[e.breakpoints.down(e.breakpoints.values[t.maxWidth]+64)]:{maxWidth:"calc(100% - 64px)"}}},...t.fullWidth&&{width:"calc(100% - 64px)"},...t.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${G.paperScrollBody}`]:{margin:0,maxWidth:"100%"}}}))),ee=Q.defineComponent((function(e){const t=f(e),o=Q.useThemeProps({props:e}),r=h(),n={get enter(){return r.transitions.duration.enteringScreen},get exit(){return r.transitions.duration.leavingScreen}},[,a]=d(o,["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","class","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"]),s=p({disableEscapeKeyDown:!1,fullScreen:!1,fullWidth:!1,maxWidth:"sm",PaperComponent:g,PaperProps:{},scroll:"paper",TransitionComponent:D,transitionDuration:n},o),l=s,c=Q.useClasses(l);let u=null;const m=e=>{u=e.target===e.currentTarget},x=W((()=>o["aria-labelledby"])),C={get titleId(){return x()}};return i(_,p({get class(){return v(c.root,o.class)},get BackdropProps(){return p({get transitionDuration(){return s.transitionDuration},get as(){return o.BackdropComponent}},(()=>o.BackdropProps))},closeAfterTransition:!0,BackdropComponent:Z,get disableEscapeKeyDown(){return s.disableEscapeKeyDown},get onClose(){return o.onClose},get open(){return o.open},ref:t,onClick:e=>{u&&(u=null,o.onBackdropClick&&o.onBackdropClick(e),o.onClose&&o.onClose(e,"backdropClick"))},ownerState:l},a,{get children(){return i(s.TransitionComponent,p({appear:!0,get in(){return o.open},get timeout(){return s.transitionDuration}},(()=>o.TransitionProps),{get children(){return i(J,{get class(){return v(c.container)},onMouseDown:m,ownerState:l,get children(){return i(U,p({get component(){return s.PaperComponent},elevation:24,role:"dialog",get"aria-describedby"(){return o["aria-describedby"]},get"aria-labelledby"(){return x()}},(()=>s.PaperProps),{get class(){return v(c.paper,s.PaperProps.class)},ownerState:l,get children(){return i(q.Provider,{value:C,get children(){return o.children}})}}))}})}}))}}))}));o("MuiDialogActions",["root","spacing"]);const te=n()({name:"MuiDialogActions",selfPropNames:["children","classes","disableSpacing"],utilityClass:function(e){return r("MuiDialogActions",e)},slotClasses:e=>({root:["root",!e.disableSpacing&&"spacing"]})}),oe=s("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,!o.disableSpacing&&t.spacing]}})((({ownerState:e})=>({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto",...!e.disableSpacing&&{"& > :not(:first-of-type)":{marginLeft:8}}}))),re=te.defineComponent((function(e){const t=te.useThemeProps({props:e}),[,o]=d(t,["class","disableSpacing"]),r=p({disableSpacing:!1},t),n=te.useClasses(r);return i(oe,p({get class(){return v(n.root,t.class)},ownerState:r},o))}));const ne=o("MuiDialogTitle",["root"]);o("MuiDialogContent",["root","dividers"]);const ie=n()({name:"MuiDialogContent",selfPropNames:["children","classes","dividers"],utilityClass:function(e){return r("MuiDialogContent",e)},slotClasses:e=>({root:["root",e.dividers&&"dividers"]})}),ae=s("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e;return[t.root,o.dividers&&t.dividers]}})((({theme:e,ownerState:t})=>({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px",...t.dividers?{padding:"16px 24px",borderTop:`1px solid ${e.palette.divider}`,borderBottom:`1px solid ${e.palette.divider}`}:{[`.${ne.root} + &`]:{paddingTop:0}}}))),se=ie.defineComponent((function(e){const t=ie.useThemeProps({props:e}),[,o]=d(t,["class","dividers"]),r=p({dividers:!1},t),n=p(t,{get dividers(){return r.dividers}}),a=ie.useClasses(n);return i(ae,p({get class(){return v(a.root,t.class)},ownerState:n},o))}));o("MuiDialogContentText",["root"]);const le=n()({name:"MuiDialogContentText",selfPropNames:["classes"],utilityClass:function(e){return r("MuiDialogContentText",e)},slotClasses:()=>({root:["root"]})}),ce=s(B,{skipProps:l.filter((e=>"classes"!==e)),name:"MuiDialogContentText",slot:"Root",overridesResolver:(e,t)=>t.root})({}),de=le.defineComponent((function(e){const t=f(e),o=le.useThemeProps({props:e}),[,r]=d(o,["children"]),n=le.useClasses(r);return i(ce,p({variant:"body1",color:"text.secondary",ref:t,ownerState:r},o,{get component(){return o.component??"p"},classes:n}))})),pe=n()({name:"MuiDialogTitle",selfPropNames:["children","classes"],utilityClass:function(e){return r("MuiDialogTitle",e)},slotClasses:()=>({root:["root"]})}),ue=s(B,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,t)=>t.root})({padding:"16px 24px",flex:"0 0 auto"}),me=pe.defineComponent((function(e){const t=pe.useThemeProps({props:e}),[,o]=d(t,["class","id"]),r=t,n=pe.useClasses(r),a=x(q);return i(ue,p({get class(){return v(n.root,t.class)},ownerState:r,variant:"h6",get id(){return a.titleId??t.id}},o,{get component(){return t.component??"h2"}}))})),ge=t("<span>");function he({title:e="INFORMATION",description:t,name:o="open",handleClick:r}){const[n,{update:a}]=C(),s=()=>{r()},l=()=>{a((e=>({...e,[o]:!1})))};return i(ee,{get open(){return n()[o]},onClose:l,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",get sx(){return{".MuiPaper-root":{bgcolor:"dark"===b()?"#171717":"#eee",color:"dark"===b()?"#ccc":"#444"}}},get children(){return[i(me,{id:"alert-dialog-title",children:e}),i(se,{get children(){return i(de,{id:"alert-dialog-description",class:"",get children(){const e=ge();return k(e,t),S((()=>e.className="dark"===b()?"text-white":"#000")),e}})}}),i(re,{get children(){return[i(y,{color:"error",onClick:l,children:"Cancel"}),i(y,{color:"info",onClick:s,children:"Agree"})]}})]}})}export{he as A,X as C};
