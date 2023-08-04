import{d as O,o as d,c as g,F as E,r as $,a as L,b as q,e as S,t as F,u as w,l as re,_ as N,f as Y,g as se,h as M,i as x,w as C,j as H,k as R,m as T,v as J,n as B,p as G,q as z,s as ne,x as Q,y as Z,z as P,A as ce,B as ue,C as me,D as de,E as A,G as oe,H as fe,I as _e,J as ae,K as ve,L as ye,M as ge,N as be,O as Se}from"./index-b11ab33f.js";const we={class:"component-list"},xe=["data-index"],Ce=O({__name:"ComponentList",setup(a){const e=n=>{n.dataTransfer.setData("index",n.target.dataset.index)};return(n,c)=>(d(),g("div",we,[(d(!0),g(E,null,$(w(re),(o,u)=>(d(),g("div",{key:u,class:"item",draggable:"true",onDragstart:c[0]||(c[0]=r=>e(r)),"data-index":u},[(d(),L(q(o.icon),{class:"icon"})),S("span",null,F(o.label),1)],40,xe))),128))]))}});const ke=N(Ce,[["__scopeId","data-v-c47933ae"]]),Le={class:"attr-list"},Me=O({__name:"AttrList",setup(a){const e=R.editorStore,n=Y({excludes:["VPicture","VGroup"],options:[{label:"左对齐",value:"left"},{label:"居中",value:"center"},{label:"右对齐",value:"right"}],map:{left:"x 坐标",top:"y 坐标",height:"高",width:"宽",color:"颜色",backgroundColor:"背景色",borderWidth:"边框宽度",borderColor:"边框颜色",borderRadius:"边框半径",fontSize:"字体大小",fontWeight:"字体粗细",lineHeight:"行高",letterSpacing:"字间距",textAlign:"对齐方式",opacity:"透明度"}}),c=se(()=>e.editorState.curComponent?Object.keys(e.editorState.curComponent.style):[]),o=se(()=>e.editorState.curComponent);return(u,r)=>{const p=M("el-color-picker"),_=M("el-option"),y=M("el-select"),m=M("el-input"),h=M("el-form-item"),s=M("el-form");return d(),g("div",Le,[x(s,null,{default:C(()=>[(d(!0),g(E,null,$(c.value.filter(t=>t!="rotate"),(t,l)=>(d(),L(h,{key:l,label:n.map[t]},{default:C(()=>[t=="borderColor"?(d(),L(p,{key:0,modelValue:o.value.style[t],"onUpdate:modelValue":i=>o.value.style[t]=i},null,8,["modelValue","onUpdate:modelValue"])):t=="color"?(d(),L(p,{key:1,modelValue:o.value.style[t],"onUpdate:modelValue":i=>o.value.style[t]=i},null,8,["modelValue","onUpdate:modelValue"])):t=="backgroundColor"?(d(),L(p,{key:2,modelValue:o.value.style[t],"onUpdate:modelValue":i=>o.value.style[t]=i},null,8,["modelValue","onUpdate:modelValue"])):t=="textAlign"?(d(),L(y,{key:3,modelValue:o.value.style[t],"onUpdate:modelValue":i=>o.value.style[t]=i},{default:C(()=>[(d(!0),g(E,null,$(n.options,i=>(d(),L(_,{key:i.value,label:i.label,value:i.value},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])):(d(),L(m,{key:4,type:"number",modelValue:o.value.style[t],"onUpdate:modelValue":i=>o.value.style[t]=i},null,8,["modelValue","onUpdate:modelValue"]))]),_:2},1032,["label"]))),128)),o.value&&!n.excludes.includes(o.value.component)?(d(),L(h,{key:0,label:"内容"},{default:C(()=>[x(m,{type:"textarea",modelValue:o.value.propValue,"onUpdate:modelValue":r[0]||(r[0]=t=>o.value.propValue=t)},null,8,["modelValue"])]),_:1})):H("",!0)]),_:1})])}}});const De=N(Me,[["__scopeId","data-v-8c0b3edf"]]),Ie=O({__name:"ContextMenu",setup(a){const e=R.editorStore;Y({copyData:null});const n=()=>{e.copy()},c=()=>{e.paste(!0),e.recordSnapshot()},o=()=>{e.cut()},u=()=>{e.deleteComponent(),e.recordSnapshot()},r=()=>{e.upComponent(),e.recordSnapshot()},p=()=>{e.downComponent(),e.recordSnapshot()},_=()=>{e.topComponent(),e.recordSnapshot()},y=()=>{e.bottomComponent(),e.recordSnapshot()};return(m,h)=>T((d(),g("div",{class:"contextmenu",style:B({top:w(e).editorState.menuTop+"px",left:w(e).editorState.menuLeft+"px"})},[S("ul",null,[w(e).editorState.curComponent?(d(),g(E,{key:0},[S("li",{onClick:n},"复制"),S("li",{onClick:c},"粘贴"),S("li",{onClick:o},"剪切"),S("li",{onClick:u},"删除"),S("li",{onClick:_},"置顶"),S("li",{onClick:y},"置底"),S("li",{onClick:r},"上移"),S("li",{onClick:p},"下移")],64)):(d(),g("li",{key:1,onClick:c},"粘贴"))])],4)),[[J,w(e).editorState.menuShow]])}});const Pe=N(Ie,[["__scopeId","data-v-a4cd2f9f"]]),Ve={class:"mark-line"},Ae=O({__name:"MarkLine",setup(a){const e=R.editorStore,n=new Map,c=(m,h)=>{m&&n.set(h,m)},o=Y({lines:["xt","xc","xb","yl","yc","yr"],diff:3,lineStatus:{xt:!1,xc:!1,xb:!1,yl:!1,yc:!1,yr:!1}});G(()=>{z.on("move",m=>{r(m.isDownward,m.isRightward)}),z.on("unMove",()=>{u()})});const u=()=>{Object.keys(o.lineStatus).forEach(m=>{o.lineStatus[m]=!1})},r=(m,h)=>{const s=e.editorState.componentData,t=ne(e.editorState.curComponent.style),l=t.width/2,i=t.height/2;u(),s.forEach(f=>{if(f==e.editorState.curComponent)return;const b=ne(f.style),{top:v,left:k,bottom:I,right:D}=b,V=b.width/2,U=b.height/2,X={top:[{isNearly:y(t.top,v),lineNode:n.get("xt"),line:"xt",dragShift:v,lineShift:v},{isNearly:y(t.bottom,v),lineNode:n.get("xt"),line:"xt",dragShift:v-t.height,lineShift:v},{isNearly:y(t.top+i,v+U),lineNode:n.get("xc"),line:"xc",dragShift:v+U-i,lineShift:v+U},{isNearly:y(t.top,I),lineNode:n.get("xb"),line:"xb",dragShift:I,lineShift:I},{isNearly:y(t.bottom,I),lineNode:n.get("xb"),line:"xb",dragShift:I-t.height,lineShift:I}],left:[{isNearly:y(t.left,k),lineNode:n.get("yl"),line:"yl",dragShift:k,lineShift:k},{isNearly:y(t.right,k),lineNode:n.get("yl"),line:"yl",dragShift:k-t.width,lineShift:k},{isNearly:y(t.left+l,k+V),lineNode:n.get("yc"),line:"yc",dragShift:k+V-l,lineShift:k+V},{isNearly:y(t.left,D),lineNode:n.get("yr"),line:"yr",dragShift:D,lineShift:D},{isNearly:y(t.right,D),lineNode:n.get("yr"),line:"yr",dragShift:D-t.width,lineShift:D}]},j=[],{rotate:te}=e.editorState.curComponent.style;Object.keys(X).forEach(W=>{X[W].forEach(K=>{K.isNearly&&(e.setShapePosStyle({key:W,value:te!=0?p(W,K,t):K.dragShift}),K.lineNode.style[W]=`${K.lineShift}px`,j.push(K.line))})}),j.length&&_(j,m,h)})},p=(m,h,s)=>{const{width:t,height:l}=e.editorState.curComponent.style;return m=="top"?Math.round(h.dragShift-(l-s.height)/2):Math.round(h.dragShift-(t-s.width)/2)},_=(m,h,s)=>{s?m.includes("yr")?o.lineStatus.yr=!0:m.includes("yc")?o.lineStatus.yc=!0:m.includes("yl")&&(o.lineStatus.yl=!0):m.includes("yl")?o.lineStatus.yl=!0:m.includes("yc")?o.lineStatus.yc=!0:m.includes("yr")&&(o.lineStatus.yr=!0),h?m.includes("xb")?o.lineStatus.xb=!0:m.includes("xc")?o.lineStatus.xc=!0:m.includes("xt")&&(o.lineStatus.xt=!0):m.includes("xt")?o.lineStatus.xt=!0:m.includes("xc")?o.lineStatus.xc=!0:m.includes("xb")&&(o.lineStatus.xb=!0)},y=(m,h)=>Math.abs(m-h)<=o.diff;return(m,h)=>(d(),g("div",Ve,[(d(!0),g(E,null,$(o.lines,s=>T((d(),g("div",{key:s,class:Q(["line",s.includes("x")?"xline":"yline"]),ref_for:!0,ref:t=>c(t,s)},null,2)),[[J,o.lineStatus[s]||!1]])),128))]))}});const Oe=N(Ae,[["__scopeId","data-v-763a98e8"]]);async function pe(a,e=[]){if(a){const n=c=>new Promise(o=>{a.classList.add("animate__animated","animate__"+c.value);const u=()=>{a.removeEventListener("animationend",u),a.removeEventListener("animationcancel",u),a.classList.remove("animate__animated","animate__"+c.value),o()};a.addEventListener("animationend",u),a.addEventListener("animationcancel",u)});for(let c=0,o=e.length;c<o;c++)await n(e[c])}else console.log("runAnimation el为空")}const Ne={lt:Ee,t:$e,rt:Ye,r:Ue,rb:Xe,b:Re,lb:He,l:Be};function Ee(a,e,n){const{symmetricPoint:c}=n,o=Z(e,c),u=P(e,o,-a.rotate),r=P(c,o,-a.rotate),p=r.x-u.x,_=r.y-u.y;p>0&&_>0&&(a.width=Math.round(p),a.height=Math.round(_),a.left=Math.round(u.x),a.top=Math.round(u.y))}function $e(a,e,n){const{symmetricPoint:c,curPoint:o}=n,u=P(e,o,-a.rotate),r=P({x:o.x,y:u.y},o,a.rotate),p=Math.sqrt((r.x-c.x)**2+(r.y-c.y)**2);if(p>0){const _={x:r.x-(r.x-c.x)/2,y:r.y+(c.y-r.y)/2};a.height=Math.round(p),a.top=Math.round(_.y-p/2),a.left=Math.round(_.x-a.width/2)}}function Ue(a,e,n){const{symmetricPoint:c,curPoint:o}=n,u=P(e,o,-a.rotate),r=P({x:u.x,y:o.y},o,a.rotate),p=Math.sqrt((r.x-c.x)**2+(r.y-c.y)**2);if(p>0){const _={x:r.x-(r.x-c.x)/2,y:r.y+(c.y-r.y)/2};a.width=Math.round(p),a.top=Math.round(_.y-a.height/2),a.left=Math.round(_.x-p/2)}}function Re(a,e,n){const{symmetricPoint:c,curPoint:o}=n,u=P(e,o,-a.rotate),r=P({x:o.x,y:u.y},o,a.rotate),p=Math.sqrt((r.x-c.x)**2+(r.y-c.y)**2);if(p>0){const _={x:r.x-(r.x-c.x)/2,y:r.y+(c.y-r.y)/2};a.height=Math.round(p),a.top=Math.round(_.y-p/2),a.left=Math.round(_.x-a.width/2)}}function Be(a,e,n){const{symmetricPoint:c,curPoint:o}=n,u=P(e,o,-a.rotate),r=P({x:u.x,y:o.y},o,a.rotate),p=Math.sqrt((r.x-c.x)**2+(r.y-c.y)**2);if(p>0){const _={x:r.x-(r.x-c.x)/2,y:r.y+(c.y-r.y)/2};a.width=Math.round(p),a.top=Math.round(_.y-a.height/2),a.left=Math.round(_.x-p/2)}}function Ye(a,e,n){const{symmetricPoint:c}=n,o=Z(e,c),u=P(e,o,-a.rotate),r=P(c,o,-a.rotate),p=u.x-r.x,_=r.y-u.y;p>0&&_>0&&(a.width=Math.round(p),a.height=Math.round(_),a.left=Math.round(r.x),a.top=Math.round(u.y))}function Xe(a,e,n){const{symmetricPoint:c}=n,o=Z(e,c),u=P(c,o,-a.rotate),r=P(e,o,-a.rotate),p=r.x-u.x,_=r.y-u.y;p>0&&_>0&&(a.width=Math.round(p),a.height=Math.round(_),a.left=Math.round(u.x),a.top=Math.round(u.y))}function He(a,e,n){const{symmetricPoint:c}=n,o=Z(e,c),u=P(c,o,-a.rotate),r=P(e,o,-a.rotate),p=u.x-r.x,_=r.y-u.y;p>0&&_>0&&(a.width=Math.round(p),a.height=Math.round(_),a.left=Math.round(r.x),a.top=Math.round(u.y))}function Te(a,e,n,c){Ne[a](e,n,c)}const ze=["onMousedown"],We=O({__name:"ShapeComponent",props:{active:{type:Boolean,default:!1},element:{require:!0,type:Object},defaultStyle:{require:!0,type:Object},index:{require:!0,type:[Number,String]}},setup(a){const e=a,n=R.editorStore,c=ce(),o=Y({pointList:["lt","t","rt","r","rb","b","lb","l"],initialAngle:{lt:0,t:45,rt:90,r:135,rb:180,b:225,lb:270,l:315},angleToCursor:[{start:338,end:23,cursor:"nw"},{start:23,end:68,cursor:"n"},{start:68,end:113,cursor:"ne"},{start:113,end:158,cursor:"e"},{start:158,end:203,cursor:"se"},{start:203,end:248,cursor:"s"},{start:248,end:293,cursor:"sw"},{start:293,end:338,cursor:"w"}],cursors:{}});G(()=>{n.editorState.curComponent&&(o.cursors=p()),z.on("runAnimation",()=>{e.element===n.getCurComponent&&c.value!==void 0&&pe(c.value,n.getCurComponent.animations)})});const u=h=>{var U;h.preventDefault(),h.stopPropagation();const s={...e.defaultStyle},t=h.clientY,l=h.clientX,i=s.rotate,f=(U=c.value)==null?void 0:U.getBoundingClientRect(),b=(f==null?void 0:f.left)+(f==null?void 0:f.width)/2,v=(f==null?void 0:f.top)+(f==null?void 0:f.height)/2,k=Math.atan2(t-v,l-b)/(Math.PI/180);let I=!1;const D=X=>{I=!0;const j=X.clientX,te=X.clientY,W=Math.atan2(te-v,j-b)/(Math.PI/180);s.rotate=i+W-k,n.setShapeStyle(s)},V=()=>{I&&n.recordSnapshot(),document.removeEventListener("mousemove",D),document.removeEventListener("mouseup",V),o.cursors=p()};document.addEventListener("mousemove",D),document.addEventListener("mouseup",V)},r=h=>{var D,V;const s=(D=e.defaultStyle)==null?void 0:D.height,t=(V=e.defaultStyle)==null?void 0:V.width,l=/t/.test(h),i=/b/.test(h),f=/l/.test(h),b=/r/.test(h);let v=0,k=0;return h.length===2?(v=f?0:t,k=l?0:s):((l||i)&&(v=t/2,k=l?0:s),(f||b)&&(v=f?0:t,k=Math.floor(s/2))),{marginLeft:"-4px",marginTop:"-4px",left:`${v}px`,top:`${k}px`,cursor:o.cursors[h]}},p=()=>{const h=(n.editorState.curComponent.style.rotate+360)%360,s={};let t=-1;return o.pointList.forEach(l=>{const i=(o.initialAngle[l]+h)%360,f=o.angleToCursor.length;for(;;){t=(t+1)%f;const b=o.angleToCursor[t];if(i<23||i>=338){s[l]="nw-resize";return}if(b.start<=i&&i<b.end){s[l]=b.cursor+"-resize";return}}}),s},_=h=>{var I,D;((I=e.element)==null?void 0:I.component)!="v-text"&&((D=e.element)==null?void 0:D.component)!="rect-shape"&&h.preventDefault(),h.stopPropagation(),n.setCurComponent({component:e.element,index:e.index}),o.cursors=p();const s={...e.defaultStyle},t=h.clientY,l=h.clientX,i=Number(s.top),f=Number(s.left);let b=!1;const v=V=>{b=!0;const U=V.clientX,X=V.clientY;s.top=X-t+i,s.left=U-l+f,n.setShapeStyle(s),me(()=>{z.emit("move",{isDownward:X-t>0,isRightward:U-l>0})})},k=()=>{b&&n.recordSnapshot(),z.emit("unMove"),document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",k)};document.addEventListener("mousemove",v),document.addEventListener("mouseup",k)},y=h=>{h.stopPropagation(),h.preventDefault(),n.hideContextMenu()},m=(h,s)=>{s.stopPropagation(),s.preventDefault();const t={...e.defaultStyle},l={x:t.left+t.width/2,y:t.top+t.height/2},i=n.editorState.editor.getBoundingClientRect(),f={x:s.clientX-(i==null?void 0:i.left),y:s.clientY-(i==null?void 0:i.top)},b={x:l.x-(f.x-l.x),y:l.y-(f.y-l.y)};let v=!1,k=!0;const I=V=>{if(k){k=!1;return}v=!0;const U={x:V.clientX-(i==null?void 0:i.left),y:V.clientY-(i==null?void 0:i.top)};Te(h,t,U,{center:l,curPoint:f,symmetricPoint:b}),n.setShapeStyle(t)},D=()=>{document.removeEventListener("mousemove",I),document.removeEventListener("mouseup",D),v&&n.recordSnapshot()};document.addEventListener("mousemove",I),document.addEventListener("mouseup",D)};return(h,s)=>{const t=M("RefreshRight"),l=M("el-icon");return d(),g("div",{ref_key:"thisRef",ref:c,class:Q(["shape",{active:a.active}]),onClick:y,onMousedown:_},[T(x(l,{class:"el-icon-refresh-right",onMousedown:u},{default:C(()=>[x(t)]),_:1},512),[[J,a.active]]),(d(!0),g(E,null,$(a.active?o.pointList:[],i=>(d(),g("div",{class:"shape-point",onMousedown:f=>m(i,f),key:i,style:B(r(i))},null,44,ze))),128)),ue(h.$slots,"default",{},void 0,!0)],34)}}});const Ke=N(We,[["__scopeId","data-v-371f5d66"]]),je=O({__name:"AreaComponent",props:{start:{type:Object},width:{type:Number},height:{type:Number}},setup(a){return(e,n)=>(d(),g("div",{style:B({left:a.start.x+"px",top:a.start.y+"px",width:a.width+"px",height:a.height+"px"}),class:"area"},null,4))}});const qe=N(je,[["__scopeId","data-v-b92f54dd"]]),Fe=O({__name:"EditorComponent",props:{isEdit:{type:Boolean,default:!0}},setup(a){const e=Y({editorX:0,editorY:0,start:{x:0,y:0},width:0,height:0,isShowArea:!1}),n=R.editorStore;G(()=>{n.getEditor();const s=n.editorState.editor.getBoundingClientRect();e.editorX=s.x,e.editorY=s.y,z.on("hideArea",()=>{o()})});const c=s=>{const t=n.editorState.curComponent;(!t||t.component!="v-text"&&t.component!="rect-shape")&&s.preventDefault(),o();const l=s.clientX,i=s.clientY;e.start.x=l-e.editorX,e.start.y=i-e.editorY,e.isShowArea=!0;const f=v=>{e.width=Math.abs(v.clientX-l),e.height=Math.abs(v.clientY-i),v.clientX<l&&(e.start.x=v.clientX-e.editorX),v.clientY<i&&(e.start.y=v.clientY-e.editorY)},b=v=>{if(document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",b),v.clientX==l&&v.clientY==i){o();return}u()};document.addEventListener("mousemove",f),document.addEventListener("mouseup",b)},o=()=>{e.isShowArea=!1,e.width=0,e.height=0},u=()=>{const s=r();if(s.length<=1){o();return}let t=1/0,l=1/0,i=-1/0,f=-1/0;s.forEach(b=>{const v=ne(b.style);v.left<l&&(l=v.left),v.top<t&&(t=v.top),v.right>i&&(i=v.right),v.bottom>f&&(f=v.bottom)}),e.start.x=l,e.start.y=t,e.width=i-l,e.height=f-t,n.setAreaData({style:{left:l,top:t,width:e.width,height:e.height},components:s})},r=()=>{const s=[],{x:t,y:l}=e.start;return n.editorState.componentData.forEach(i=>{const{left:f,top:b,width:v,height:k}=i.style;t<=f&&l<=b&&f+v<=t+e.width&&b+k<=l+e.height&&s.push(i)}),s},p=s=>{s.stopPropagation(),s.preventDefault();let t=s.target,l=s.offsetY,i=s.offsetX;for(;!t.className.includes("editor");)i+=t.offsetLeft,l+=t.offsetTop,t=t.parentNode;n.showContextMenu({top:l,left:i})},_=s=>{const t={};return["width","height","top","left","rotate"].forEach(l=>{l!="rotate"?t[l]=s[l]+"px":t.transform="rotate("+s[l]+"deg)"}),t},y=s=>de(s,["top","left","width","height","rotate"]),m=(s,t)=>{n.setShapeStyle({height:h(s,t)})},h=(s,t)=>{let{lineHeight:l,fontSize:i,height:f}=s.style;l===""&&(l=1.5);const b=(t.split("<br>").length-1)*l*i;return f>b?f:b};return(s,t)=>(d(),g("div",{class:Q(["editor",{edit:a.isEdit}]),id:"editor",style:B({width:w(n).editorState.canvasStyleData.width+"px",height:w(n).editorState.canvasStyleData.height+"px",transform:"scale("+w(n).editorState.canvasStyleData.scale/100+")"}),onContextmenu:p,onMousedown:c},[(d(!0),g(E,null,$(w(n).editorState.componentData,(l,i)=>(d(),L(Ke,{defaultStyle:l.style,style:B(_(l.style)),key:l.id,active:l===w(n).editorState.curComponent,element:l,index:i},{default:C(()=>[l.component!="v-text"?(d(),L(q(l.component),{key:0,class:"component",style:B(y(l.style)),propValue:l.propValue,element:l,id:"component"+l.id},null,8,["style","propValue","element","id"])):(d(),L(q(l.component),{key:1,class:"component",style:B(y(l.style)),propValue:l.propValue,onInput:m,element:l,id:"component"+l.id},null,40,["style","propValue","element","id"]))]),_:2},1032,["defaultStyle","style","active","element","index"]))),128)),x(Pe),x(Oe),T(x(qe,{start:e.start,width:e.width,height:e.height},null,8,["start","width","height"]),[[J,e.isShowArea]])],38))}});const Je=N(Fe,[["__scopeId","data-v-9f078f3b"]]),le={redirect(a){a&&(window.location.href=a)},alert(a){a&&alert(a)}},Ge=[{key:"redirect",label:"跳转事件",event:le.redirect,param:""},{key:"alert",label:"alert 事件",event:le.alert,param:""}],Qe=O({__name:"ComponentWrapper",props:{config:{}},setup(a){const e=a,n=ce();G(()=>{n.value!==void 0&&pe(n.value,e.config.animations)});const c=()=>{const o=e.config.events;Object.keys(o).forEach(u=>{le[u](o[u])})};return(o,u)=>(d(),g("div",{onClick:c,ref_key:"wrapperDom",ref:n},[(d(),L(q(o.config.component),{class:"component",style:B(w(de)(o.config.style)),propValue:o.config.propValue,element:o.config},null,8,["style","propValue","element"]))],512))}});const Ze=N(Qe,[["__scopeId","data-v-f9a224a7"]]),et={key:0,class:"bg"},tt={class:"canvas-container"},ot=O({__name:"Preview",props:{show:{type:Boolean}},emits:["update:show"],setup(a,{emit:e}){const n=R.editorStore.editorState,c=()=>{e("update:show",!1)};return(o,u)=>{const r=M("el-button");return o.show?(d(),g("div",et,[x(r,{onClick:c,class:"close"},{default:C(()=>[A("关闭")]),_:1}),S("div",tt,[S("div",{class:"canvas",style:B({width:w(n).canvasStyleData.width+"px",height:w(n).canvasStyleData.height+"px",transform:"scale("+w(n).canvasStyleData.scale/100+")"})},[(d(!0),g(E,null,$(w(n).componentData,(p,_)=>(d(),L(Ze,{key:_,config:p},null,8,["config"]))),128))],4)])])):H("",!0)}}});const nt=N(ot,[["__scopeId","data-v-5b8d6646"]]),ee=a=>(ge("data-v-46fd08cc"),a=a(),be(),a),at={class:"toolbar"},lt=ee(()=>S("label",{for:"input",class:"insert"},"插入图片",-1)),st={class:"canvas-config"},it=ee(()=>S("span",null,"画布大小",-1)),rt=ee(()=>S("span",null,"*",-1)),ct={class:"canvas-config"},ut=ee(()=>S("span",null,"画布比例",-1)),dt=O({__name:"Toolbar",setup(a){const e=R.editorStore,n=Y({isShowPreview:!1}),c=()=>{e.compose(),e.recordSnapshot()},o=()=>{e.decompose(),e.recordSnapshot()},u=()=>{e.undo()},r=()=>{e.redo()},p=s=>{const t=s.target.files[0];if(!t.type.includes("image")){fe("只能插入图片");return}const l=new FileReader;l.onload=i=>{const f=i.target.result,b=new Image;b.onload=()=>{e.addComponent({component:{..._e,id:ae(),component:"v-picture",label:"图片",icon:"",propValue:f,style:{...ve,top:0,left:0,width:b.width,height:b.height}},index:void 0})},b.src=f},l.readAsDataURL(t)},_=()=>{n.isShowPreview=!0,e.setEditMode("read")},y=()=>{e.setEditMode("edit")},m=()=>{localStorage.setItem("canvasData",JSON.stringify(e.editorState.componentData)),localStorage.setItem("canvasStyle",JSON.stringify(e.editorState.canvasStyleData)),ye.success("保存成功")},h=()=>{e.setComponentData([])};return(s,t)=>{const l=M("el-button");return d(),g("div",null,[S("div",at,[x(l,{onClick:u},{default:C(()=>[A("撤消")]),_:1}),x(l,{onClick:r},{default:C(()=>[A("重做")]),_:1}),lt,S("input",{type:"file",onChange:p,id:"input",hidden:""},null,32),x(l,{onClick:_,style:{"margin-left":"10px"}},{default:C(()=>[A("预览")]),_:1}),x(l,{onClick:m},{default:C(()=>[A("保存")]),_:1}),x(l,{onClick:h},{default:C(()=>[A("清空画布")]),_:1}),x(l,{onClick:c,disabled:!w(e).editorState.areaData.components.length},{default:C(()=>[A("组合")]),_:1},8,["disabled"]),x(l,{onClick:o,disabled:!w(e).editorState.curComponent||w(e).editorState.curComponent.component!="Group"},{default:C(()=>[A("拆分")]),_:1},8,["disabled"]),S("div",st,[it,T(S("input",{"onUpdate:modelValue":t[0]||(t[0]=i=>w(e).editorState.canvasStyleData.width=i)},null,512),[[oe,w(e).editorState.canvasStyleData.width]]),rt,T(S("input",{"onUpdate:modelValue":t[1]||(t[1]=i=>w(e).editorState.canvasStyleData.height=i)},null,512),[[oe,w(e).editorState.canvasStyleData.height]])]),S("div",ct,[ut,T(S("input",{"onUpdate:modelValue":t[2]||(t[2]=i=>w(e).editorState.canvasStyleData.scale=i)},null,512),[[oe,w(e).editorState.canvasStyleData.scale]]),A(" % ")])]),x(nt,{show:n.isShowPreview,"onUpdate:show":t[3]||(t[3]=i=>n.isShowPreview=i),onChange:y},null,8,["show"])])}}});const pt=N(dt,[["__scopeId","data-v-46fd08cc"]]),ie=[{label:"进入",children:[{label:"渐显",value:"fadeIn"},{label:"向右进入",value:"fadeInLeft"},{label:"向左进入",value:"fadeInRight"},{label:"向上进入",value:"fadeInUp"},{label:"向下进入",value:"fadeInDown"},{label:"向右长距进入",value:"fadeInLeftBig"},{label:"向左长距进入",value:"fadeInRightBig"},{label:"向上长距进入",value:"fadeInUpBig"},{label:"向下长距进入",value:"fadeInDownBig"},{label:"旋转进入",value:"rotateIn"},{label:"左顺时针旋转",value:"rotateInDownLeft"},{label:"右逆时针旋转",value:"rotateInDownRight"},{label:"左逆时针旋转",value:"rotateInUpLeft"},{label:"右逆时针旋转",value:"rotateInUpRight"},{label:"弹入",value:"bounceIn"},{label:"向右弹入",value:"bounceInLeft"},{label:"向左弹入",value:"bounceInRight"},{label:"向上弹入",value:"bounceInUp"},{label:"向下弹入",value:"bounceInDown"},{label:"光速从右进入",value:"lightSpeedInRight"},{label:"光速从左进入",value:"lightSpeedInLeft"},{label:"光速从右退出",value:"lightSpeedOutRight"},{label:"光速从左退出",value:"lightSpeedOutLeft"},{label:"Y轴旋转",value:"flip"},{label:"中心X轴旋转",value:"flipInX"},{label:"中心Y轴旋转",value:"flipInY"},{label:"左长半径旋转",value:"rollIn"},{label:"由小变大进入",value:"zoomIn"},{label:"左变大进入",value:"zoomInLeft"},{label:"右变大进入",value:"zoomInRight"},{label:"向上变大进入",value:"zoomInUp"},{label:"向下变大进入",value:"zoomInDown"},{label:"向右滑动展开",value:"slideInLeft"},{label:"向左滑动展开",value:"slideInRight"},{label:"向上滑动展开",value:"slideInUp"},{label:"向下滑动展开",value:"slideInDown"}]},{label:"强调",children:[{label:"弹跳",value:"bounce"},{label:"闪烁",value:"flash"},{label:"放大缩小",value:"pulse"},{label:"放大缩小弹簧",value:"rubberBand"},{label:"左右晃动",value:"headShake"},{label:"左右扇形摇摆",value:"swing"},{label:"放大晃动缩小",value:"tada"},{label:"扇形摇摆",value:"wobble"},{label:"左右上下晃动",value:"jello"},{label:"Y轴旋转",value:"flip"}]},{label:"退出",children:[{label:"渐隐",value:"fadeOut"},{label:"向左退出",value:"fadeOutLeft"},{label:"向右退出",value:"fadeOutRight"},{label:"向上退出",value:"fadeOutUp"},{label:"向下退出",value:"fadeOutDown"},{label:"向左长距退出",value:"fadeOutLeftBig"},{label:"向右长距退出",value:"fadeOutRightBig"},{label:"向上长距退出",value:"fadeOutUpBig"},{label:"向下长距退出",value:"fadeOutDownBig"},{label:"旋转退出",value:"rotateOut"},{label:"左顺时针旋转",value:"rotateOutDownLeft"},{label:"右逆时针旋转",value:"rotateOutDownRight"},{label:"左逆时针旋转",value:"rotateOutUpLeft"},{label:"右逆时针旋转",value:"rotateOutUpRight"},{label:"弹出",value:"bounceOut"},{label:"向左弹出",value:"bounceOutLeft"},{label:"向右弹出",value:"bounceOutRight"},{label:"向上弹出",value:"bounceOutUp"},{label:"向下弹出",value:"bounceOutDown"},{label:"中心X轴旋转",value:"flipOutX"},{label:"中心Y轴旋转",value:"flipOutY"},{label:"左长半径旋转",value:"rollOut"},{label:"由小变大退出",value:"zoomOut"},{label:"左变大退出",value:"zoomOutLeft"},{label:"右变大退出",value:"zoomOutRight"},{label:"向上变大退出",value:"zoomOutUp"},{label:"向下变大退出",value:"zoomOutDown"},{label:"向左滑动收起",value:"slideOutLeft"},{label:"向右滑动收起",value:"slideOutRight"},{label:"向上滑动收起",value:"slideOutUp"},{label:"向下滑动收起",value:"slideOutDown"}]}],ht=O({__name:"Modal",props:{show:{type:Boolean}},emits:["update:show"],setup(a,{emit:e}){const n=()=>{e("update:show")},c=o=>{o.stopPropagation()};return(o,u)=>o.show?(d(),g("div",{key:0,class:"modal-bg",onClick:n},[S("div",{class:"fadeInLeft animated modal",onClick:c},[ue(o.$slots,"default",{},void 0,!0)])])):H("",!0)}});const he=N(ht,[["__scopeId","data-v-b4747281"]]),mt={class:"animation-list"},ft={key:0,class:"div-animation"},_t={class:"el-scrollbar-view"},vt=["onMouseover","onClick"],yt=O({__name:"AnimationList",setup(a){const e=R.editorStore,n=Y({isShowAnimation:!1,animationClassData:ie,animationActiveName:"进入",showAnimatePanel:!1,hoverPreviewAnimate:""}),c=r=>{e.addAnimation(r),n.isShowAnimation=!1},o=()=>{z.emit("runAnimation")},u=r=>{e.removeAnimation(r)};return(r,p)=>{const _=M("el-button"),y=M("el-tag"),m=M("el-scrollbar"),h=M("el-tab-pane"),s=M("el-tabs");return d(),g("div",mt,[w(e).editorState.curComponent?(d(),g("div",ft,[x(_,{onClick:p[0]||(p[0]=t=>{n.isShowAnimation=!0})},{default:C(()=>[A("添加动画")]),_:1}),x(_,{onClick:o},{default:C(()=>[A("预览动画")]),_:1}),S("div",null,[(d(!0),g(E,null,$(w(e).editorState.curComponent.animations,(t,l)=>(d(),L(y,{key:l,closable:"",onClose:i=>u(l)},{default:C(()=>[A(F(t.label),1)]),_:2},1032,["onClose"]))),128))])])):H("",!0),x(he,{show:n.isShowAnimation,"onUpdate:show":p[2]||(p[2]=t=>n.isShowAnimation=t)},{default:C(()=>[x(s,{type:"card",modelValue:n.animationActiveName,"onUpdate:modelValue":p[1]||(p[1]=t=>n.animationActiveName=t)},{default:C(()=>[(d(!0),g(E,null,$(w(ie),t=>(d(),L(h,{key:t.label,label:t.label,name:t.label},{default:C(()=>[x(m,{class:"animate-container"},{default:C(()=>[S("div",_t,[(d(!0),g(E,null,$(t.children,(l,i)=>(d(),g("div",{class:"animate",key:i,onMouseover:f=>n.hoverPreviewAnimate=l.value,onClick:f=>c(l)},[S("div",{class:Q([n.hoverPreviewAnimate===l.value&&"animate__animated animate__"+l.value])},F(l.label),3)],40,vt))),128))])]),_:2},1024)]),_:2},1032,["label","name"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["show"])])}}});const gt=N(yt,[["__scopeId","data-v-41b1b119"]]),bt={class:"event-list"},St={key:0,class:"div-events"},wt=O({__name:"EventList",setup(a){const e=R.editorStore,n=Y({isShowEvent:!1,eventURL:"",eventActiveName:"redirect",eventList:Ge}),c=(u,r)=>{n.isShowEvent=!1,e.addEvent({event:u,param:r})},o=u=>{e.removeEvent(u)};return(u,r)=>{const p=M("el-button"),_=M("el-tag"),y=M("el-input"),m=M("el-tab-pane"),h=M("el-tabs");return d(),g("div",bt,[w(e).editorState.curComponent?(d(),g("div",St,[x(p,{onClick:r[0]||(r[0]=s=>n.isShowEvent=!0)},{default:C(()=>[A("添加事件")]),_:1}),S("div",null,[(d(!0),g(E,null,$(Object.keys(w(e).editorState.curComponent.events),s=>(d(),L(_,{key:s,closable:"",onClose:t=>o(s)},{default:C(()=>[A(F(s),1)]),_:2},1032,["onClose"]))),128))])])):H("",!0),x(he,{show:n.isShowEvent,"onUpdate:show":r[2]||(r[2]=s=>n.isShowEvent=s)},{default:C(()=>[x(h,{type:"card",modelValue:n.eventActiveName,"onUpdate:modelValue":r[1]||(r[1]=s=>n.eventActiveName=s)},{default:C(()=>[(d(!0),g(E,null,$(n.eventList,s=>(d(),L(m,{key:s.key,label:s.label,name:s.key,style:{padding:"0 20px"}},{default:C(()=>[s.key=="redirect"?(d(),L(y,{key:0,modelValue:s.param,"onUpdate:modelValue":t=>s.param=t,type:"textarea",placeholder:"请输入完整的 URL"},null,8,["modelValue","onUpdate:modelValue"])):H("",!0),s.key=="alert"?(d(),L(y,{key:1,modelValue:s.param,"onUpdate:modelValue":t=>s.param=t,type:"textarea",placeholder:"请输入要 alert 的内容"},null,8,["modelValue","onUpdate:modelValue"])):H("",!0),x(p,{style:{"margin-top":"20px"},onClick:t=>c(s.key,s.param)},{default:C(()=>[A("确定")]),_:2},1032,["onClick"])]),_:2},1032,["label","name"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["show"])])}}});const xt=N(wt,[["__scopeId","data-v-03af1cf7"]]),Ct={class:"home"},kt={class:"left"},Lt={class:"center"},Mt={class:"right"},Dt={key:1,class:"placeholder"},It={key:1,class:"placeholder"},Pt={key:1,class:"placeholder"},Vt=O({__name:"Home",setup(a){const e=R.editorStore,n=Y({activeName:"attr",reSelectAnimateIndex:void 0}),c=()=>{localStorage.getItem("canvasData")&&e.setComponentData(u(JSON.parse(localStorage.getItem("canvasData")))),localStorage.getItem("canvasStyle")&&e.setCanvasStyle(JSON.parse(localStorage.getItem("canvasStyle")))},o=()=>{let t=!1;window.onkeydown=l=>{l.keyCode==17?t=!0:t&&l.keyCode==67?e.copy():t&&l.keyCode==86?(e.paste(!1),e.recordSnapshot()):t&&l.keyCode==88&&e.cut()},window.onkeyup=l=>{l.keyCode==17&&(t=!1)}},u=y=>(y.forEach(m=>{m.id=ae()}),y),r=y=>{y.preventDefault(),y.stopPropagation();const m=Se.cloneDeep(re[y.dataTransfer.getData("index")]);m.style.top=y.offsetY,m.style.left=y.offsetX,m.id=ae(),e.addComponent({component:m,index:void 0}),e.recordSnapshot()},p=y=>{y.preventDefault(),y.dataTransfer.dropEffect="copy"},_=()=>{e.setCurComponent({component:null,index:null}),e.hideContextMenu()};return c(),o(),(y,m)=>{const h=M("el-tab-pane"),s=M("el-tabs");return d(),g("div",Ct,[x(pt),S("main",null,[S("section",kt,[x(ke)]),S("section",Lt,[S("div",{class:"content",onDrop:r,onDragover:p,onClick:_},[x(Je)],32)]),S("section",Mt,[x(s,{modelValue:n.activeName,"onUpdate:modelValue":m[0]||(m[0]=t=>n.activeName=t),type:"card"},{default:C(()=>[x(h,{label:"属性",name:"attr"},{default:C(()=>[w(e).editorState.curComponent?(d(),L(De,{key:0})):(d(),g("p",Dt,"请选择组件"))]),_:1}),x(h,{label:"动画",name:"animation"},{default:C(()=>[w(e).editorState.curComponent?(d(),L(gt,{key:0})):(d(),g("p",It,"请选择组件"))]),_:1}),x(h,{label:"事件",name:"events"},{default:C(()=>[w(e).editorState.curComponent?(d(),L(xt,{key:0})):(d(),g("p",Pt,"请选择组件"))]),_:1})]),_:1},8,["modelValue"])])])])}}});const Ot=N(Vt,[["__scopeId","data-v-4abad892"]]);export{Ot as default};
