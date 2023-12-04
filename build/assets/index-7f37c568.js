import{a as e,v as l,l as a,n as i,d as t,i as r,h as s,P as d,j as p,s as o,B as n,m,t as c}from"./index-60ffdcbe.js";import{C as f}from"./index-d49f25e3.js";import{C as y,T as h}from"./index-08d30a70.js";import{h as k}from"./moment-0b360bb8.js";import{a as x}from"./avatar-0ae0561b.js";const g=c('<div class="py-6 flex-1 flex flex-col"><div class="flex-1 flex flex-col">'),v=c('<div><div class="p-4 space-y-4"><div><div><p class="pl-4"></p></div><div><p class="pl-[20px]"></p></div><div><p class="pl-4"></p></div><div><p class="pl-4"> WIB</p></div></div><div class="flex gap-2">'),u=c('<img class="xl:object-cover object-contain object-center w-full h-full">'),b=({children:c,title:b})=>{const[E,{update:P}]=e(),C=l();let _=C?.pathname?.split("/")[3]||null;return a((()=>{P((e=>({...e,loading:!0}))),i().get(`/deck-explorer/marked_profile?keyword=${_}`).then((e=>{const l=e.data.items,a=e.data.additional,{type:i,family:t,family_member:r,alias:s,phone_list:d,kendaraan:p,data:o}=l,n=0!==o.length?"personal_identitas":null,m=0!==t.length?"family-connection":null,c=0!==r.length?"family-member-detail":null,f=0!==s.length?"alias":null,y=0!==d.length?"phone-list":null,h=0!==p.length?"vehicle":null,k=[{title:"PERSONAL IDENTIFICATION",key:"personal_identitas",display:!!n,path:`/deck-explorer/marked-profile/${_}/identification`},{title:"FAMILY MEMBER",key:"family-member",display:!!m,path:`/deck-explorer/marked-profile/${_}/family-member`,dinamis:!0},{title:"FAMILY MEMBER DETAIL",key:"family-member-detail",display:!!c,path:`/deck-explorer/marked-profile/${_}/family-member-detail`,dinamis:!0},{title:"ALIAS PROFILE",key:"alias",display:!!f,path:`/deck-explorer/marked-profile/${_}/alias-profile`,dinamis:!0},{title:"PHONE LIST",key:"phone-list",display:!!y,path:`/deck-explorer/marked-profile/${_}/phone-list`,dinamis:!0},{title:"VEHICLE",key:"vehicle",display:!!h,path:`/deck-explorer/marked-profile/${_}/vehicle`,dinamis:!0},{title:"MAP TRACKING",key:"map_tracking",display:!0,path:`/deck-explorer/marked-profile/${_}/map-tracking`},{title:"PICTURE",key:"pict",display:!0,path:`/deck-explorer/marked-profile/${_}/picture`},{title:"VIDEOS",key:"videos",display:!0,path:`/deck-explorer/marked-profile/${_}/videos`},{title:"DOCUMENTS",key:"documents",display:!0,path:`/deck-explorer/marked-profile/${_}/documents`}].map((e=>("personal_identitas"!==e.key||n||(e.display=!1),"family-member"!==e.key||"NKK"!==i&&m||(e.display=!1),"family-member-detail"!==e.key||c||(e.display=!1),"vehicle"!==e.key||h||(e.display=!1),"alias"!==e.key||f||(e.display=!1),"phone-list"!==e.key||y||(e.display=!1),e)));P((e=>({...e,additional:a,getProfile:l,getFamily:{data:t},getFamilyMemberDetail:{data:r},getVehicle:{data:p},getAlias:{data:s},getPhoneList:{data:d},tabs:k,loading:!1})))}))})),t(f,{get children(){const e=g(),l=e.firstChild;return r(l,(()=>{const e=s((()=>!!E()?.tabs));return()=>e()&&t(y,{title:b,isTabs:!0,className:"relative xl:flex grid gap-4 flex-1 min-h-[600px]",get children(){return[(()=>{const e=v(),l=e.firstChild,a=l.firstChild,i=a.firstChild,s=i.firstChild,c=i.nextSibling,f=c.firstChild,y=c.nextSibling,g=y.firstChild,b=y.nextSibling,P=b.firstChild,C=P.firstChild,_=a.nextSibling;return r(l,t(d,{square:!0,elevation:2,class:"relative w-full xl:h-[280px] h-[400px]",get children(){return(()=>{const e=u();return p((()=>o(e,"src",E()?.getProfile?.foto_url?.label?(E()?.getProfile?.foto_url.type,E()?.getProfile?.foto_url?.label):x))),e})()}}),a),r(i,t(h,{className:"!py-0",label:"Profile Name"}),s),r(s,(()=>E()?.getProfile?.profile_name)),r(c,t(h,{className:"!py-0",label:"CASE GROUP"}),f),r(f,(()=>E()?.getProfile?.case_group)),r(y,t(h,{className:"!py-0",label:"REMARKS"}),g),r(g,(()=>E()?.getProfile?.remarks)),r(b,t(h,{className:"!py-0",label:"DATE CREATED"}),P),r(P,(()=>k(E()?.getProfile?.timestamp).format("D/M/Y || H:M")),C),r(_,t(n,{color:"secondary",variant:"contained",fullWidth:!0,children:"EXPORT [.PDF]"})),p((l=>{const i="min-w-[300px] col-span-1 xl:max-w-[280px] max-w-full border-r-2 "+("dark"===m()?"border-[#0A0A0A]":""),t="space-y-2 "+("dark"===m()?"text-white":"text-[#444]");return i!==l._v$&&(e.className=l._v$=i),t!==l._v$2&&(a.className=l._v$2=t),l}),{_v$:void 0,_v$2:void 0}),e})(),c]}})})()),e}})};export{b as L};
