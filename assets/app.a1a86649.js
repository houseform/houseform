import{_ as d,f as k,o as s,c as r,A as _,x as o,a as v,t as x,N as g,O as f,e as $,F as A,M as L,b as P,C as S,a3 as p,d as j,K as h,a4 as I,u as T,h as E,l as M,a5 as R,a6 as D,a7 as F,a8 as O,a9 as N,aa as V,ab as B,ac as H,ad as J,ae as z,af as G,ag as Z,H as K}from"./chunks/framework.989a1717.js";import{t as l}from"./chunks/theme.ee2c408b.js";const b=n=>(g("data-v-b1848c2a"),n=n(),f(),n),U={class:"click-to-iframe-container"},X=["src"],q={key:1,class:"iframe-replacement-container"},Q=b(()=>o("svg",{class:"iframe-replacement-icon",width:"158",height:"158",viewBox:"0 0 158 158",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[o("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M79 158C122.63 158 158 122.63 158 79C158 35.3695 122.63 0 79 0C35.3695 0 0 35.3695 0 79C0 122.63 35.3695 158 79 158ZM77.2 112.333L91.9333 97.7334C96.1333 93.5334 98.4667 87.9333 98.4667 81.9333C98.4667 75.9333 96.1333 70.3334 91.9333 66.0668C89.7333 63.9333 85.8667 63.8667 83.6667 66.0668C83.1184 66.6064 82.683 67.2499 82.3858 67.9595C82.0886 68.6691 81.9355 69.4307 81.9355 70.2001C81.9355 70.9694 82.0886 71.7311 82.3858 72.4407C82.683 73.1503 83.1184 73.7937 83.6667 74.3334C85.6667 76.4 86.8667 79 86.8667 81.9333C86.8667 84.8 85.6667 87.5334 83.6667 89.6001L69 104.2C64.9333 108.333 57.8667 108.333 53.8 104.2C52.7897 103.209 51.9872 102.026 51.4393 100.721C50.8915 99.4164 50.6093 98.0154 50.6093 96.6001C50.6093 95.1848 50.8915 93.7837 51.4393 92.4788C51.9872 91.1738 52.7897 89.9912 53.8 89L56.4667 86.2667L56.1333 85.2667C55.0667 82.3334 54.5333 79 54.6 75.6667L54.6667 71.6667L45.6667 80.7334C36.8 89.5334 36.8 103.733 45.6667 112.333C49.9333 116.8 55.6667 119 61.4 119C67.1333 119 72.8667 116.8 77.2 112.333ZM103.4 86.3334L112.333 77.2667C116.667 73 119 67.4 119 61.4C119 55.4 116.667 49.8 112.333 45.6667C110.278 43.5691 107.825 41.9027 105.118 40.7651C102.41 39.6274 99.5033 39.0415 96.5667 39.0415C93.6301 39.0415 90.723 39.6274 88.0156 40.7651C85.3083 41.9027 82.8552 43.5691 80.8 45.6667L66.0667 60.2667C61.8727 64.4688 59.5172 70.1632 59.5172 76.1001C59.5172 82.037 61.8727 87.7313 66.0667 91.9333C67.2 93.0668 68.7333 93.6001 70.2 93.6001C70.9653 93.6122 71.7253 93.4711 72.4352 93.1848C73.1451 92.8986 73.7905 92.473 74.3333 91.9333C75.4667 90.8667 76.0667 89.4 76.0667 87.8C76.0667 86.2001 75.4667 84.7334 74.3333 83.6667C72.3333 81.6001 71.1333 79 71.1333 76.0668C71.1333 73.2001 72.3333 70.4667 74.3333 68.4667L89 53.8C93 49.7334 100.133 49.6667 104.2 53.8C105.21 54.7911 106.013 55.9738 106.561 57.2788C107.109 58.5837 107.391 59.9847 107.391 61.4C107.391 62.8153 107.109 64.2164 106.561 65.5214C106.013 66.8263 105.21 68.0089 104.2 69L101.533 71.8L101.867 72.7334C102.933 75.6667 103.467 79 103.4 82.3334V86.3334Z",fill:"var(--vp-c-bg)"})],-1)),W={class:"iframe-replacement-title"},Y=b(()=>o("span",{class:"visually-hidden"},"An embedded webpage:",-1)),nn={__name:"ClickToIFrame",props:["src","title"],setup(n){const t=n,e=k(!1);function a(){e.value=!0}return(y,c)=>(s(),r("div",U,[e.value?(s(),r("iframe",{key:0,src:t.src},null,8,X)):_("",!0),e.value?_("",!0):(s(),r("div",q,[Q,o("p",W,[Y,v(x(t.title),1)]),o("button",{class:"iframe-replacement-button",onClick:c[0]||(c[0]=u=>a())}," Run embed ")]))]))}},tn=d(nn,[["__scopeId","data-v-b1848c2a"]]);const en={flex:"~ wrap gap2","justify-center":""},on=["href","aria-label"],an=["src","alt"],sn={__name:"Contributors",props:["allContributors"],setup(n){const t=n,e=$(()=>t.allContributors.contributors);return(a,y)=>(s(),r("div",en,[(s(!0),r(A,null,L(P(e),({login:c,name:u,avatar_url:w})=>(s(),r("a",{key:c,href:`https://github.com/${c}`,"m-0":"",rel:"noopener noreferrer","aria-label":`${u} on GitHub`},[o("img",{loading:"lazy",src:w,width:"50",height:"50","rounded-full":"","h-12":"","w-12":"",alt:`${u}'s avatar`},null,8,an)],8,on))),128))]))}},rn=d(sn,[["__scopeId","data-v-0dd780fb"]]);const m=n=>(g("data-v-7e882be9"),n=n(),f(),n),cn={class:"content"},un={class:"content-container"},ln={class:"main"},pn={class:"vp-doc",flex:"","flex-col":"","items-center":"","mt-10":""},hn=m(()=>o("h2",{id:"the-team",op50:"","font-normal":"","pt-5":"","pb-2":""}," Contributors ",-1)),dn={"text-lg":"","max-w-200":"","text-center":"","leading-7":""},mn=m(()=>o("br",null,null,-1)),_n=m(()=>o("a",{href:"https://github.com/houseform/houseform/discussions",rel:"noopener noreferrer"},"Join the community",-1)),vn={__name:"HomePage",props:["allContributors"],setup(n){const t=n;return(e,a)=>(s(),r("div",cn,[o("div",un,[o("main",ln,[o("div",pn,[hn,o("p",dn,[S(rn,{allContributors:t.allContributors},null,8,["allContributors"]),mn,_n,v(" and get involved! ")])])])])]))}},gn=d(vn,[["__scopeId","data-v-7e882be9"]]),fn=`{
  "projectName": "houseform",
  "projectOwner": "houseform",
  "repoType": "github",
  "files": [
    "README.md"
  ],
  "imageSize": 100,
  "commit": false,
  "contributorsPerLine": 7,
  "skipCi": false,
  "contributors": [
    {
      "login": "crutchcorn",
      "name": "Corbin Crutchley",
      "avatar_url": "https://avatars.githubusercontent.com/u/9100169?v=4",
      "profile": "https://crutchcorn.dev/",
      "contributions": [
        "code",
        "doc",
        "maintenance",
        "test"
      ]
    },
    {
      "login": "PrattiDev",
      "name": "Eduardo Pratti",
      "avatar_url": "https://avatars.githubusercontent.com/u/17130024?v=4",
      "profile": "http://pratti.design/",
      "contributions": [
        "design"
      ]
    },
    {
      "login": "emkay",
      "name": "Michael Matuzak",
      "avatar_url": "https://avatars.githubusercontent.com/u/1327?v=4",
      "profile": "https://github.com/emkay",
      "contributions": [
        "doc"
      ]
    },
    {
      "login": "perkinsjr",
      "name": "James Perkins",
      "avatar_url": "https://avatars.githubusercontent.com/u/45409975?v=4",
      "profile": "https://jamesperkins.dev/",
      "contributions": [
        "doc",
        "video"
      ]
    },
    {
      "login": "gitname",
      "name": "gitname",
      "avatar_url": "https://avatars.githubusercontent.com/u/7143133?v=4",
      "profile": "https://github.com/gitname",
      "contributions": [
        "doc"
      ]
    },
    {
      "login": "chasingtherain",
      "name": "ChasingRain",
      "avatar_url": "https://avatars.githubusercontent.com/u/48197694?v=4",
      "profile": "https://chasingtherain.vercel.app/",
      "contributions": [
        "code",
        "doc",
        "test"
      ]
    },
    {
      "login": "nordowl",
      "name": "Jonas D.",
      "avatar_url": "https://avatars.githubusercontent.com/u/71926058?v=4",
      "profile": "https://github.com/nordowl",
      "contributions": [
        "doc"
      ]
    },
    {
      "login": "shivan-s",
      "name": "Shivan Sivakumaran",
      "avatar_url": "https://avatars.githubusercontent.com/u/51132467?v=4",
      "profile": "http://shivan.xyz",
      "contributions": [
        "doc"
      ]
    },
    {
      "login": "charlesfig",
      "name": "Carlos",
      "avatar_url": "https://avatars.githubusercontent.com/u/39968271?v=4",
      "profile": "http://charlesfig.github.io",
      "contributions": [
        "code",
        "test"
      ]
    },
    {
      "login": "joaom00",
      "name": "João Pedro Magalhães",
      "avatar_url": "https://avatars.githubusercontent.com/u/48808846?v=4",
      "profile": "https://jpedromagalhaes.vercel.app/",
      "contributions": [
        "doc",
        "test",
        "code"
      ]
    },
    {
      "login": "caxco93",
      "name": "Orlando Benjamin",
      "avatar_url": "https://avatars.githubusercontent.com/u/3190666?v=4",
      "profile": "https://bejo.dev/",
      "contributions": [
        "test"
      ]
    },
    {
      "login": "mostafaegouda",
      "name": "Mostafa Gouda",
      "avatar_url": "https://avatars.githubusercontent.com/u/100293809?v=4",
      "profile": "https://github.com/mostafaegouda",
      "contributions": [
        "doc"
      ]
    },
    {
      "login": "ShooTeX",
      "name": "Erik Simon",
      "avatar_url": "https://avatars.githubusercontent.com/u/10850738?v=4",
      "profile": "http://eriksimon.dev",
      "contributions": [
        "code",
        "test",
        "doc"
      ]
    },
    {
      "login": "sgoodluck",
      "name": "Seth",
      "avatar_url": "https://avatars.githubusercontent.com/u/106334996?v=4",
      "profile": "https://github.com/sgoodluck",
      "contributions": [
        "bug"
      ]
    },
    {
      "login": "jschuur",
      "name": "Joost Schuur",
      "avatar_url": "https://avatars.githubusercontent.com/u/92457?v=4",
      "profile": "http://joostschuur.com",
      "contributions": [
        "code",
        "doc"
      ]
    }
  ],
  "repoHost": "https://github.com",
  "commitConvention": "none"
}
`,bn={...l,Layout(){return p(l.Layout,null,{"home-features-after":()=>p(gn,{allContributors:JSON.parse(fn)})})},enhanceApp(n){l.enhanceApp(n),n.app.component("ClickToIFrame",tn)}};function C(n){if(n.extends){const t=C(n.extends);return{...t,...n,async enhanceApp(e){t.enhanceApp&&await t.enhanceApp(e),n.enhanceApp&&await n.enhanceApp(e)}}}return n}const i=C(bn),Cn=j({name:"VitePressApp",setup(){const{site:n}=T();return E(()=>{M(()=>{document.documentElement.lang=n.value.lang,document.documentElement.dir=n.value.dir})}),R(),D(),F(),i.setup&&i.setup(),()=>p(i.Layout)}});async function yn(){const n=kn(),t=wn();t.provide(O,n);const e=N(n.route);return t.provide(V,e),t.component("Content",B),t.component("ClientOnly",H),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return e.frontmatter.value}},$params:{get(){return e.page.value.params}}}),i.enhanceApp&&await i.enhanceApp({app:t,router:n,siteData:J}),{app:t,router:n,data:e}}function wn(){return z(Cn)}function kn(){let n=h,t;return G(e=>{let a=Z(e);return n&&(t=a),(n||t===a)&&(a=a.replace(/\.js$/,".lean.js")),h&&(n=!1),K(()=>import(a),[])},i.NotFound)}h&&yn().then(({app:n,router:t,data:e})=>{t.go().then(()=>{I(t.route,e.site),n.mount("#app")})});export{yn as createApp};
