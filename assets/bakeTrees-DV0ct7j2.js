import{G as P,a as E,B as L,V as M,W as H,S as I,b as V,O as A,M as U,c as D,D as F,C as q,d as Q}from"./index-DiubDrrM.js";const s={tile:256,azimuths:8,elevations:[12,48],perRow:4};async function X(O){const n=s.tile*2,u=[],j=new P;for(const e of O){const o=await j.loadAsync(e.url),c=e.nodes?e.nodes.map(a=>o.scene.getObjectByName(a)):[o.scene];for(const a of c){const t=new E,i=a.clone();i.position.set(0,0,0),t.add(i),t.updateMatrixWorld(!0);const l=new L().setFromObject(t),h=l.getCenter(new M);i.position.x-=h.x,i.position.z-=h.z,i.position.y-=l.min.y,t.updateMatrixWorld(!0);const v=new L().setFromObject(t);u.push({root:t,height:v.max.y,radius:Math.max(v.max.x,-v.min.x,v.max.z,-v.min.z)})}}const S=u.length,d=Math.ceil(Math.sqrt(S)),_=Math.ceil(S/d),y=d*n*s.perRow,p=_*n*s.perRow,r=new H({antialias:!0,alpha:!0,preserveDrawingBuffer:!0});r.setPixelRatio(1),r.setSize(y,p,!1),r.setClearColor(0,0),r.outputColorSpace=I,r.autoClear=!1;const g=new V,b=e=>(e.map?.updateMatrix(),e.map?e.map.matrix.clone():new Q),k=(e,o)=>new D({uniforms:{map:{value:e.map},uvT:{value:b(e)},color:{value:e.color??new q(1,1,1)},uH:{value:o.height},uR:{value:o.radius}},side:F,vertexShader:`uniform mat3 uvT; varying vec2 vUv; varying vec3 vLocal;
        void main() { vUv = (uvT * vec3(uv, 1.0)).xy; vLocal = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vLocal, 1.0); }`,fragmentShader:`uniform sampler2D map; uniform vec3 color; uniform float uH; uniform float uR; varying vec2 vUv; varying vec3 vLocal;
        void main() {
          vec4 t = texture2D(map, vUv);
          if (t.a < 0.3) discard;
          // Soft self-shadowing: leaves deep inside the crown and near the bottom are darker.
          float outer = clamp(length(vLocal.xz) / uR, 0.0, 1.0);
          float up = clamp(vLocal.y / uH, 0.0, 1.0);
          float ao = mix(0.45, 1.0, clamp(outer * 0.7 + up * 0.5, 0.0, 1.0));
          gl_FragColor = vec4(t.rgb * color * ao, 1.0);
          #include <colorspace_fragment>
        }`}),B=(e,o)=>new D({uniforms:{map:{value:e.map},uvT:{value:b(e)},uCrown:{value:new M(0,o.height*.55,0)}},side:F,vertexShader:`uniform mat3 uvT; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
        void main() { vUv = (uvT * vec3(uv, 1.0)).xy; vN = normalize(mat3(modelMatrix) * normal); vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }`,fragmentShader:`uniform sampler2D map; uniform vec3 uCrown; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
        void main() {
          if (texture2D(map, vUv).a < 0.3) discard;
          vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
          vec3 sphere = normalize(vW - uCrown);
          vec3 w = normalize(mix(n, sphere, 0.6));
          vec3 v = normalize((viewMatrix * vec4(w, 0.0)).xyz);
          gl_FragColor = vec4(v * 0.5 + 0.5, 1.0);
        }`}),G=(e,o)=>e.root.traverse(c=>{const a=c;if(!a.isMesh)return;const t=a.userData;t.src??=a.material,a.material=o==="albedo"?k(t.src,e):B(t.src,e)}),z={albedo:"",normal:""};for(const e of["albedo","normal"]){r.setScissorTest(!1),r.clear(),r.setScissorTest(!0),u.forEach((a,t)=>{G(a,e),g.add(a.root);const i=Math.max(a.radius,...s.elevations.map(x=>{const m=U.degToRad(x);return(a.height*Math.cos(m)+2*a.radius*Math.sin(m))/2}))*1.04;a.half=i;const l=new A(-i,i,i,-i,.1,400),h=t%d*n*s.perRow,v=Math.floor(t/d)*n*s.perRow;let f=0;for(const x of s.elevations)for(let m=0;m<s.azimuths;m++,f++){const R=m/s.azimuths*Math.PI*2,w=U.degToRad(x),C=new M(0,a.height*.5,0);l.position.set(Math.sin(R)*Math.cos(w),Math.sin(w),Math.cos(R)*Math.cos(w)).multiplyScalar(200).add(C),l.lookAt(C),l.updateMatrixWorld();const T=h+f%s.perRow*n,N=v+Math.floor(f/s.perRow)*n,W=p-N-n;r.setViewport(T,W,n,n),r.setScissor(T,W,n,n),r.render(g,l)}g.remove(a.root)});const o=document.createElement("canvas");o.width=y/2,o.height=p/2;const c=o.getContext("2d");c.imageSmoothingEnabled=!0,c.imageSmoothingQuality="high",c.drawImage(r.domElement,0,0,o.width,o.height),z[e]=o.toDataURL("image/png")}return{...z,variants:u.map(e=>({height:e.height,radius:e.radius,half:e.half}))}}export{s as IMPOSTOR,X as bakeTrees};
