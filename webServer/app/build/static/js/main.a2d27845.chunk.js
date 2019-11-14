(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{14:function(e,t,n){e.exports=n(27)},19:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(9),o=n.n(c),u=(n(19),n(8)),i=function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],c=t[1];Object(a.useEffect)((function(){fetch("/api/info").then((function(e){return e.json()})).then((function(e){c(e)}));var e=setInterval((function(){fetch("/api/info").then((function(e){return e.json()})).then((function(e){c(e)}))}),2e3);return function(){return clearInterval(e)}}),[]);return r.a.createElement("div",{className:"TitleBar"},r.a.createElement("div",{style:{display:"grid",alignItems:"center",gap:"10px",gridTemplateColumns:"auto auto"}},r.a.createElement("img",{src:n?"https://cdn.discordapp.com/avatars/".concat(n.id,"/").concat(n.avatarId,".png"):"",alt:"..",style:{width:"48px",height:"48px"}}),r.a.createElement("span",null,n?"".concat(n.username," - ").concat(function(e){switch(e){case 0:return"Playing";case 1:return"Streaming";case 2:return"Listening";case 3:return"Watching"}}(n.presence.type)," ").concat(n.presence.name):"..")),r.a.createElement("div",{style:{display:"grid",alignItems:"center",gap:"10px",gridTemplateColumns:"auto auto"}},r.a.createElement("span",null,n?function(e){switch(e){case 0:return"Ready";case 1:return"Connecting";case 2:return"Reconnecting";case 3:return"Idle";case 4:return"Nearly";case 5:return"Disconnected"}}(n.status):".."),r.a.createElement("span",null,n?n.upTime:"..")))},s=n(5),l=n.n(s),p=n(7),m=n(11),d=n(12),f=(n(24),function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],c=t[1];Object(a.useEffect)((function(){fetch("/ui/db").then((function(e){return e.json()})).then((function(e){c(e.uiButtons)}))}),[]);var o=function(e){return Object(d.c)(e,{position:"bottom-center",autoClose:2e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,className:"toast",transition:d.a})},i=function(){var e=Object(p.a)(l.a.mark((function e(t){var n,a,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={apiKey:284695,command:t},e.prev=1,e.next=4,fetch("/api/commands",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 4:return a=e.sent,e.next=7,a.json();case 7:return r=e.sent,e.abrupt("return",o((c=r.response).charAt(0).toUpperCase()+c.slice(1).toLowerCase()));case 11:return e.prev=11,e.t0=e.catch(1),e.abrupt("return",o("There was an error connecting."));case 14:case"end":return e.stop()}var c}),e,null,[[1,11]])})));return function(t){return e.apply(this,arguments)}}(),s=function(){var e=Object(p.a)(l.a.mark((function e(t){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("http://127.0.0.1:5700/ui/db/rm/".concat(t),{method:"POST",headers:{"Content-Type":"application/json"}});case 2:c(null);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=n?n.map((function(e,t){var n=e.id,a=e.name,c=e.command;return r.a.createElement("div",{key:t},r.a.createElement(m.b,{id:n},r.a.createElement("button",{className:"apiButton",onClick:Object(p.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i(c);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))},a)),r.a.createElement(m.a,{id:n},r.a.createElement(m.c,{data:{foo:"bar"},onClick:Object(p.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s(n);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))},"Delete")))})):"No shortcut commands set. Please add one above.";return r.a.createElement("div",{className:"apiButtons"},f,r.a.createElement(d.b,null))}),h=function(){var e=Object(a.useState)(),t=Object(u.a)(e,2),n=t[0],c=t[1],o=Object(a.useState)(),i=Object(u.a)(o,2),s=i[0],m=i[1],d=function(){var e=Object(p.a)(l.a.mark((function e(t){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),fetch("/ui/db",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([n,s])});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return r.a.createElement("form",{onSubmit:d,style:{display:"grid",padding:"10px",gap:"5px",gridTemplateColumns:"200px 200px 50px"}},r.a.createElement("input",{type:"text",style:{width:"200px",border:"none",fontSize:"0.7rem",backgroundColor:"#3E4245",color:"#757163",textAlign:"center",height:"20px"},placeholder:"Name",name:"commandName",value:n,required:!0,onChange:function(e){return c(e.target.value)}}),r.a.createElement("input",{type:"text",style:{width:"200px",border:"none",fontSize:"0.7rem",backgroundColor:"#3E4245",color:"#757163",textAlign:"center",height:"20px"},placeholder:"Command",name:"command",value:s,required:!0,onChange:function(e){return m(e.target.value)}}),r.a.createElement("input",{type:"submit",style:{border:"none",fontSize:"0.7rem",padding:"0px 5px",backgroundColor:"#3E4245",color:"#757163",height:"20px"},value:"Add"}))},b=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(i,null),r.a.createElement(h,null),r.a.createElement(f,null))};o.a.render(r.a.createElement(b,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.a2d27845.chunk.js.map