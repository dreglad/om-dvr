webpackJsonp([1],{"2Uvd":function(t,e,s){"use strict";var n=s("ixJO"),r=s("XpZF"),a=s("VU/8"),o=a(n.a,r.a,!1,null,null,null);e.a=o.exports},"3X7e":function(t,e,s){"use strict";var n=s("Dd8w"),r=s.n(n),a=s("NYxO");e.a={name:"StreamSelector",computed:r()({},Object(a.c)(["streams"]),{selectedStream:{get:function(){return this.$store.state.stream},set:function(t){this.$store.dispatch("selectStream",t)}}}),methods:r()({},Object(a.b)(["selectStream"]))}},"5XVX":function(t,e,s){"use strict";function n(t){console.log(t)}var r=s("fZjL"),a=s.n(r),o=s("mtWM"),i=s.n(o),c=s("M4fF"),l=s.n(c),u=s("PJh5"),d=s.n(u),p=s("l5j/"),v=(s.n(p),Object(p.extendMoment)(d.a)),f={scheme:"http",host:"captura-saro.openmultimedia.biz",apiPort:8087,streamingPort:1935,server:"_defaultServer_",vhost:"_defaultVHost_",application:"live",instance:"_definst_"},m=f.scheme+"://"+f.host+":"+f.streamingPort,h=f.scheme+"://"+f.host+":"+f.apiPort+"/v2",j=h+"/servers/"+f.server,g=j+"/vhosts/"+f.vhost,S=g+"/applications/"+f.application,w=S+"/instances/"+f.instance,D=w+"/dvrstores";e.a={getStores:function(t){return i.a.get(D).then(function(e){var s=e.data,n=l.a.chain(s.dvrconverterstoresummary).map(function(t){return t.name}).filter(function(t){return-1!==t.indexOf("_240p")}).sortBy(function(t){return parseInt(t.split(".").pop())}).groupBy(function(t){return l.a.dropRight(t.replace("_240p","").split(".")).join(".")}).value();t(n)}).catch(function(t){return n(t)})},getStoreDetails:function(t,e){return i.a.get(D+"/"+t).then(function(t){var s=t.data,n=s.DvrConverterStore;n.utcEnd-n.utcStart>0&&(n.utcRange=v.range(v.utc(n.utcStart,"x"),v.utc(n.utcEnd)),e(n))}).catch(function(t){return n(t)})},getInstance:function(t){return i.a.get(w).then(function(e){return t(e.data)}).catch(function(t){return console.log(t)})},getPlaylistUrl:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=e.ngrp,n=void 0===s?"_all":s,r=e.params,o=void 0===r?{}:r,i=a()(o).map(function(t){return encodeURIComponent(t)+"="+encodeURIComponent(o[t])}).join("&");return o.wowzadvrplayliststart?(i="DVR&"+i,m+"/"+f.application+"/"+t+"/playlist.m3u8"+(i?"?"+i:"")):m+"/"+f.application+"/ngrp:"+t+n+"/playlist.m3u8"+(i?"?"+i:"")}}},"7Otq":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAoCAYAAACB4MgqAAABp3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjanVTZbcMwDP3XFB2Bl65xHFsCukHH76MsJ3aQFEFJSGRIircT2s93D18OSUqwmEuqKRHAqlVZwBTawfkbjuBsu6gkOoCpjntAkHYXXxQynbFc5Qfl5cmRHQ9uV8Uhh8OrI9mJegDwbNNRnQwrxC8ip1oy2eP3MgP0WWLK0VLJMaQtiZCqNDUc3aMpKWvWBTePO8pDorijuvPhDNEzMqKZkfpzUXSqsisO+ShAZ+dP8hHKFWiW+wrPpZDsinvTj2Hok7zQBcJIT6HWk7P0ejJ/DSb8NZlR1qnRZpOTq1wqcTin1/tWem/DwhZLWNA0N+wonqcd1tS8hohKzDGAiTsL6pjQ0hW7nSd27PYN+a7M1FmATh2UE6+cQY2XwHEIC/SFF96AfaByFhET4SaGBw2yds+FZ9g8AjcqAbEbjAzOjNv/MXxq2PvqLWL/oH30WAvkJT4WLxbNVicwwxQ4nlr7Hsq0Nn7MmcI768P4A8fDNgzPHxlv/u+0juXdy/FaSDtSXMv7jCjjqX9Dv9ilEH5OPSd5AAAABHNCSVQICAgIfAhkiAAAA7ZJREFUWMPNmUuoTVEYx3973XuRvPLmFiXlVdyMDRRFEVGKgURKRPcKmTEg3Sl5jjAxIJmIRDIxkAnqesSNgecNA3TJPWdvk+/TZ7XOvvvss8/dVq32Oeusvdb/+3+v9a0TUX+LgBagYsZGAfOABcBsYKqMAXwHPgAvgR7gOdBv3m0FqkBCk5oC1jYW2AhcAl6bzdN6BXgFXATWG+Hw1i6sOfO5HTgGvAsAqwq4UA8J9gY4BEw25LiiQLfKsw04CHz2GKxkZDsknI69B/YI8ELYV9CLgAdmowEgrgNsmhAD5vs9YI63d27Qm4AfBQP2e2wE+AqsyQteX9jrmUXS5G732F4veJ3YZRaLhwC0NR/1mW1ZwatTbGiyaWQxHWV/xWAOq2Forth0tc5o0QzmY+ALMKNWqNTk0mKiR6VE0L7N36nFug50GhNJ/pOuWLb44CPpE0Ut1ZLsOqmxt469BUYrXicSJMAuYLxMiiinucDeTsC3A1sFa4syPlLOHnFJDql73gWeBHAo6y/k6PFXuLUlOmRszi4zJfyFsKggS606LnpptwznO2N87m4AvOaUEwp6BNDrSTWUbFclKEwycbojcIJUbI91XkeJMVv37TSpXcPdOW+ORpt+YBbA5pLYVofrEYdzJjs6YIqcFG2I1OdqJzUizaz5arREgO4X+40MOAd8Ao7K51je0edsB0wvIV5XxSRuADflc9X73QEnpbi24AGmOclGZTD9W9iOAtq2cw4E5ox2DWbJxGMqS1NTOA08C7Dpa+U6cMvTinPeHUfeK4ukDtAR0AccSQHt77FP/EDDZb+TRfIwnQDf5F4lygg+kc0PS8Rwg7yntt4DnDWVUB/AjhzpXrPdKVmoN8M5R9d/ZM7+WcxUw+MEiTSxVGgsaSDbaURal0F4/W1ZjrsTZXq3rDEfYBzw0QvwWbJdlyw2TJ63U8Dr2LWcFz5aMwwHrsrxG8Rz4wzmolnsqQB2BsRCMSG/GFAN/ZRk1+g12xgr+I6MJZsKtspjTp+na5zqEqC70RuqkE9Mkco+TjEXBXMzoG51oEmm/Ksa9t/J7W6jeeMf8ArgfArrqu7f4hghdbd6Bbc9lm4tgO3gJVAkgAZqFKwK4HiKc6kwbRJ3dY2Hni9QNHgkyPusq8r7xJvT1K3rrDTvL2n2xb2TK4pPXjJRtndmVLcCvF/DH5rG+lrDesWUS60Zs51qZF5B4a+uDNUtgH/Jc/lQMFfUH1QXBPTlnKCLCH11g1ebvwIsDvzjVnr7AwTWWSfD5rgfAAAAAElFTkSuQmCC"},"8kuQ":function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.liveUrl?s("video-player",{attrs:{sources:[{src:t.liveUrl,type:"application/x-mpegURL"}],brand:"jwplayer",autoplay:!0,height:"auto",width:"90%",controls:!0}}):t._e()},r=[],a={render:n,staticRenderFns:r};e.a=a},"8ohe":function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",[t._v("Nada aquí todavía")])},r=[],a={render:n,staticRenderFns:r};e.a=a},Aarg:function(t,e,s){"use strict";var n=s("Zggn"),r=s("8kuQ"),a=s("VU/8"),o=a(n.a,r.a,!1,null,null,null);e.a=o.exports},BeOZ:function(t,e,s){"use strict";function n(t){s("v8+q")}var r=s("uaJh"),a=s("OQSc"),o=s("VU/8"),i=n,c=o(r.a,a.a,!1,i,null,null);e.a=c.exports},IcnI:function(t,e,s){"use strict";var n=s("7+uW"),r=s("NYxO"),a=s("mUbh"),o=s("UjVw"),i=s("ukYY");n.a.use(r.a);var c={stream:null,dvrStores:{},dvrStoreDetails:{},dvrAllStoreDetailsReceived:!1,dvrDuration:3600,dvrStart:null};e.a=new r.a.Store({state:c,getters:o.a,actions:a.a,mutations:i.a,strict:!1})},Ig8B:function(t,e,s){"use strict";e.a={created:function(){var t=this;"html5"===this.brand&&(this.dependenciesLoaded={hlsjs:!1},this.injectJs("https://cdn.jsdelivr.net/npm/hls.js@latest",function(){t.dependenciesLoaded.hlsjs=!0}))},mounted:function(){var t=this;"html5"===this.brand&&(this.$watch("allDependenciesLoaded",function(e){e&&t.$nextTick(function(){!t.hls&&window.Hls.isSupported()&&(t.hls=new window.Hls,t.hls.loadSource(t.hlsSource.src),t.hls.attachMedia(t.$refs.player),t.hls.on(window.Hls.Events.MANIFEST_PARSED,function(){t.autoplay&&t.$refs.player.play()}))})}),this.$watch("hlsSource",function(e){console.log(e),t.hls&&e.src&&(t.hls.detachMedia(),t.hls.attachMedia(t.$refs.player),t.hls.loadSource(e.src))}))}}},JiXA:function(t,e,s){"use strict";e.a={created:function(){var t=this;"flowplayer"===this.brand&&(this.dependenciesLoaded={flowplayer:!1,flowplayerhls:!1},this.noVideoTag=!0,this.injectCss("//releases.flowplayer.org/7.2.1/skin/skin.css"),this.injectJs("//releases.flowplayer.org/7.2.1/flowplayer.js",function(){t.dependenciesLoaded.flowplayer=!0,t.injectJs("//releases.flowplayer.org/hlsjs/flowplayer.hlsjs.light.min.js",function(){t.dependenciesLoaded.flowplayerhls=!0})}))},mounted:function(){var t=this;"flowplayer"===this.brand&&(this.$watch("allDependenciesLoaded",function(e){e&&window.flowplayer(t.$refs.playerWrapper,{clip:{sources:t.sources},aspect:"16:9",responsive:!1,autoplay:t.autoplay})},{deep:!0}),this.$watch("sources",function(e){window.flowplayer(t.$refs.playerWrapper).load(t.sources)}))}}},M93x:function(t,e,s){"use strict";function n(t){s("hOVq")}var r=s("xJD8"),a=s("x0Ld"),o=s("VU/8"),i=n,c=o(r.a,a.a,!1,i,null,null);e.a=c.exports},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s("7+uW"),r=s("NYxO"),a=s("YaEn"),o=s("3EgV"),i=s.n(o),c=s("M93x"),l=s("IcnI");n.a.config.productionTip=!1,n.a.use(i.a),n.a.use(r.a),new n.a({el:"#app",router:a.a,store:l.a,template:"<App/>",components:{App:c.a}})},OQSc:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{lg6:""}},[t.$store.state.stream?s("v-card",{attrs:{height:"397"}},[s("video-player",{attrs:{sources:[{src:t.recordingUrl,type:"application/x-mpegURL"}],brand:"jwplayer",autoplay:!0,controls:!0,height:360}})],1):s("v-progress-circular",{attrs:{indeterminate:""}})],1),t._v(" "),s("v-flex",{attrs:{lg3:""}},[s("v-time-picker",{attrs:{"allowed-hours":t.allowedHours,"allowed-minutes":t.allowedMinutes,format:"24hr"},model:{value:t.selectedTime,callback:function(e){t.selectedTime=e},expression:"selectedTime"}})],1),t._v(" "),s("v-flex",{attrs:{lg3:""}},[s("v-date-picker",{attrs:{"allowed-dates":t.allowedDates,locale:"es"},model:{value:t.selectedDate,callback:function(e){t.selectedDate=e},expression:"selectedDate"}})],1),t._v(" "),s("v-flex",{attrs:{lg6:""}},[s("v-slider",{attrs:{label:"Segundero",max:59},model:{value:t.currentSeconds,callback:function(e){t.currentSeconds=e},expression:"currentSeconds"}})],1),t._v(" "),s("v-flex",{attrs:{lg1:""}},[s("v-text-field",{attrs:{prefix:t.secondsDisplay,type:"number"},model:{value:t.currentSeconds,callback:function(e){t.currentSeconds=e},expression:"currentSeconds"}})],1),t._v(" "),s("v-flex",{attrs:{lg6:""}},[s("v-slider",{attrs:{label:"Duración",max:10800,min:10},model:{value:t.duration,callback:function(e){t.duration=e},expression:"duration"}})],1),t._v(" "),s("v-flex",{attrs:{lg3:""}},[s("v-text-field",{attrs:{suffix:t.durationDisplay,type:"number"},model:{value:t.duration,callback:function(e){t.duration=e},expression:"duration"}})],1),t._v(" "),s("v-flex",{attrs:{lg6:""}},[s("v-btn",{attrs:{color:"primary"},nativeOn:{click:function(e){t.convert(e)}}},[t._v("Convertir")])],1)],1)},r=[],a={render:n,staticRenderFns:r};e.a=a},SkhJ:function(t,e,s){"use strict";e.a={created:function(){var t=this;"jwplayer"===this.brand&&(this.dependenciesLoaded={jwplayer:!1},this.injectJs("https://content.jwplatform.com/libraries/oSS05BCQ.js",function(){t.dependenciesLoaded.jwplayer=!0}))},mounted:function(){var t=this;"jwplayer"===this.brand&&this.$watch("allDependenciesLoaded",function(e){e&&(console.log(t.$refs.player),console.log(t.sources),window.jwplayer(t.$refs.player).setup({sources:t.sources.map(function(t){return{file:t.src}}),width:t.width,height:t.height,controls:t.controls,autostart:t.autoplay}),t.$watch("sources",function(e){window.jwplayer(t.$refs.player).load(e.map(function(t){return{file:t.src}}))}))},{deep:!0})}}},"TjX/":function(t,e,s){"use strict";var n=s("3X7e"),r=s("oeqe"),a=s("VU/8"),o=a(n.a,r.a,!1,null,null,null);e.a=o.exports},UjVw:function(t,e,s){"use strict";var n=s("gRE1"),r=s.n(n),a=s("Gu7T"),o=s.n(a),i=s("fZjL"),c=s.n(i),l=s("5XVX"),u=s("M4fF"),d=s.n(u),p=s("PJh5"),v=s.n(p),f=s("l5j/"),m=(s.n(f),Object(f.extendMoment)(v.a));e.a={dvrStores:function(t){return t.dvrStores},streams:function(t){return c()(t.dvrStores)},stream:function(t){return t.stream},liveUrl:function(t){if(t.stream)return l.a.getPlaylistUrl(t.stream)},dvrAvailableMin:function(t,e){return Math.min.apply(Math,o()(d.a.values(t.dvrStoreDetails).map(function(t){return t.utcRange.start})))},dvrAvailableMax:function(t,e){return Math.max.apply(Math,o()(d.a.values(t.dvrStoreDetails).map(function(t){return t.utcRange.end})))},dvrPlaylistUrl:function(t,e){l.a.getPlaylistUrl(t.stream,{params:{}})},recordingUrl:function(t,e){if(t.dvrStart){var s=r()(t.dvrStoreDetails).find(function(e){return e.utcRange.contains(m(t.dvrStart))});if(s)return l.a.getPlaylistUrl(s.dvrStoreName,{params:{wowzadvrplayliststart:m.utc(t.dvrStart).format("YYYYMMDDHHmmss"),wowzadvrplaylistduration:1e3*t.dvrDuration}})}}}},WXLC:function(t,e,s){"use strict";var n=s("jZy5"),r=s("8ohe"),a=s("VU/8"),o=a(n.a,r.a,!1,null,null,null);e.a=o.exports},XpZF:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticStyle:{height:"200px",width:"100%"}},[t.allDependenciesLoaded&&!t.noVideoTag?s("video",{ref:"player",class:t.classObject,style:{width:t.width,height:t.height},attrs:{controls:!!t.controls,poster:t.poster,autoplay:t.autoplay}},[t._l(t.sources,function(e){return s("source",{attrs:{type:t.getSrcType(e),src:e.src||e}})}),t._v("\n  {{ $t('Video format not supported\n  ")],2):t.noVideoTag?s("div",{ref:"playerWrapper",style:{width:t.width,height:t.height}}):t._e()])},r=[],a={render:n,staticRenderFns:r};e.a=a},YaEn:function(t,e,s){"use strict";var n=s("7+uW"),r=s("/ocq"),a=s("WXLC"),o=s("pLWX"),i=s("Aarg");n.a.use(r.a),e.a=new r.a({routes:[{path:"/recorder",name:"Recorder",component:o.a},{path:"/conversions",name:"Conversions",component:a.a},{path:"/live",name:"Live",component:i.a},{path:"/distribution",name:"Distribution",component:a.a},{path:"/",redirect:{name:"Recorder"}}]})},Zggn:function(t,e,s){"use strict";var n=s("Dd8w"),r=s.n(n),a=s("2Uvd"),o=s("PJh5"),i=s.n(o),c=s("NYxO");i.a.locale("es"),e.a={name:"AppLive",computed:r()({},Object(c.c)(["liveUrl"])),methods:r()({},Object(c.b)(["getDvrStores"])),mounted:function(){},created:function(){this.getDvrStores()},components:{VideoPlayer:a.a}}},gDtw:function(t,e,s){"use strict";var n=s("Dd8w"),r=s.n(n),a=s("BeOZ"),o=s("PJh5"),i=s.n(o),c=s("NYxO");i.a.locale("es"),e.a={name:"AppRecorder",computed:r()({},Object(c.c)(["streams","dvrStores"])),methods:r()({},Object(c.b)(["getDvrStores"])),created:function(){this.getDvrStores()},components:{StreamNavigator:a.a}}},hOVq:function(t,e){},ixJO:function(t,e,s){"use strict";var n=s("c/Tr"),r=s.n(n),a=s("gRE1"),o=s.n(a),i=s("SkhJ"),c=s("o3Ms"),l=s("Ig8B"),u=s("JiXA");e.a={name:"video-player",data:function(){return{dependenciesLoaded:{},time:null,noVideoTag:!1,classObject:{}}},props:{brand:{type:String,default:"html5",validator:function(t){return["jwplayer","videojs","html5","flowplayer"].includes(t)}},sources:{type:Array,required:!0},autoplay:{type:Boolean,default:!1},poster:{type:String},controls:{type:Boolean,default:!0},width:{type:[Number,String],default:"640px"},height:{type:[Number,String],default:"480px"}},computed:{allDependenciesLoaded:function(){return o()(this.dependenciesLoaded).every(function(t){return t})},hlsSource:function(){var t=this;return this.sources.find(function(e){return"application/x-mpegURL"===t.getSrcType(e)})}},methods:{getSrcType:function(t){return t.type||{m3u8:"application/x-mpegURL",mp4:"video/mp4",webm:"video/webm",ogg:"video/ogg"}[t.split(".").pop()]||"video"},injectJs:function(t,e){if(r()(document.body.querySelectorAll("script")).map(function(t){return t.src}).find(function(e){return e===t}))setTimeout(e,0);else{var s=document.createElement("script");s.type="text/javascript",s.src=t,s.addEventListener("load",e),document.body.appendChild(s)}},injectCss:function(t,e){var s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("type","text/css"),s.setAttribute("href",t),document.getElementsByTagName("head")[0].appendChild(s)}},watch:{sources:function(t){console.log(t)}},mixins:[l.a,i.a,c.a,u.a]}},jZy5:function(t,e,s){"use strict";e.a={name:"AppConversions",data:function(){return{source:""}},computed:{availableDates:function(){return[new Date]}}}},jxmE:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-layout",[s("StreamNavigator")],1)},r=[],a={render:n,staticRenderFns:r};e.a=a},mUbh:function(t,e,s){"use strict";var n=s("//Fk"),r=s.n(n),a=s("5XVX"),o=s("PJh5"),i=s.n(o),c=s("l5j/"),l=(s.n(c),Object(c.extendMoment)(i.a));e.a={getDvrStores:function(t){var e=t.commit,s=t.state,n=t.getters,r=t.dispatch;a.a.getStores(function(t){e("RECEIVE_DVRSTORES",t),null==s.stream&&n.streams.length&&r("selectStream",n.streams[0])})},selectStream:function(t,e){var s=t.commit,n=t.state,a=t.getters,o=t.dispatch;s("SELECT_STREAM",e),s("RESET_DVRSORE_DETAILS"),r.a.all(n.dvrStores[e].map(function(t){return o("getDvrStoreDetails",t)})).then(function(){s("COMPLETE_DVRSORE_DETAILS"),n.dvrStart||s("SET_DVRSTART",l(a.dvrAvailableMax).subtract(5,"minutes").seconds(0))})},getDvrStoreDetails:function(t,e){var s=t.commit;return a.a.getStoreDetails(e,function(t){s("RECEIVE_DVRSTORE_DETAILS",{dvrStore:e,details:t})})}}},o3Ms:function(t,e,s){"use strict";e.a={data:function(){return{classObject:{"video-js":!0,"vjs-default-skin":!0}}},created:function(){var t=this;"videojs"===this.brand&&(this.dependenciesLoaded={videojs:!1,videojshls:!1},this.injectCss("http://vjs.zencdn.net/6.2.8/video-js.css"),this.injectJs("http://vjs.zencdn.net/6.2.8/video.js",function(){t.dependenciesLoaded.videojs=!0,t.injectJs("https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.12.2/videojs-contrib-hls.min.js",function(){t.dependenciesLoaded.videojshls=!0})}))},mounted:function(){var t=this;"videojs"===this.brand&&(this.$watch("allDependenciesLoaded",function(e){e&&window.videojs(t.$refs.player)},{deep:!0}),this.$watch("sources",function(e){window.videojs(t.$refs.player).src(e)}))}}},oeqe:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticStyle:{width:"350px"}},[t.streams?s("v-select",{attrs:{label:"Stream",items:t.streams,"prepend-icon":"videocam",solo:""},model:{value:t.selectedStream,callback:function(e){t.selectedStream=e},expression:"selectedStream"}}):s("v-progress-circular",{attrs:{indeterminate:""}})],1)},r=[],a={render:n,staticRenderFns:r};e.a=a},pLWX:function(t,e,s){"use strict";var n=s("gDtw"),r=s("jxmE"),a=s("VU/8"),o=a(n.a,r.a,!1,null,null,null);e.a=o.exports},uaJh:function(t,e,s){"use strict";var n=s("d7EF"),r=s.n(n),a=s("gRE1"),o=s.n(a),i=s("Dd8w"),c=s.n(i),l=s("2Uvd"),u=s("NYxO"),d=s("PJh5"),p=s.n(d),v=s("l5j/"),f=(s.n(v),Object(v.extendMoment)(p.a));e.a={name:"StreamNavigator",data:function(){return{seconds:0}},computed:c()({},Object(u.c)(["recordingUrl"]),{durationDisplay:function(){return"segundos ("+f.duration(this.$store.state.dvrDuration,"seconds").humanize()+")"},secondsDisplay:function(){return this.$store.state.dvrStart.format("HH:mm:")},selectedDate:{get:function(){if(this.$store.state.dvrStart)return this.$store.state.dvrStart.format("YYYY-MM-DD")},set:function(t){this.$store.commit("SET_DVRSTART",f(t+" "+this.selectedTime+":"+this.currentSeconds,"YYYY-MM-DD HH:mm:s"))}},currentSeconds:{get:function(){return this.$store.state.dvrStart.format("s")},set:function(t){this.$store.commit("SET_DVRSTART",f(this.selectedDate+" "+this.selectedTime+":"+t,"YYYY-MM-DD HH:mm:s"))}},duration:{get:function(){return this.$store.state.dvrDuration},set:function(t){this.$store.commit("SET_DVRDURATION",t)}},selectedTime:{get:function(){if(this.$store.state.dvrStart)return this.$store.state.dvrStart.format("HH:mm")},set:function(t){this.$store.commit("SET_DVRSTART",f(this.selectedDate+" "+t+":"+this.seconds,"YYYY-MM-DD HH:mm:s")),console.log(this.$store.state.dvrStart)}}}),methods:{allowedDates:function(t){return o()(this.$store.state.dvrStoreDetails).some(function(e){return f(t,"YYYY-MM-DD").range("day").overlaps(e.utcRange)})},allowedHours:function(t){var e=this;return o()(this.$store.state.dvrStoreDetails).some(function(s){return f(e.selectedDate+" "+t+":0","YYYY-MM-DD H:m").range("hour").overlaps(s.utcRange)})},allowedMinutes:function(t){var e=this;if(this.selectedDate&&this.selectedTime){var s=this.selectedTime.split(":"),n=r()(s,2),a=n[0];return o()(this.$store.state.dvrStoreDetails).some(function(s){return s.utcRange.contains(f(e.selectedDate+" "+a+":"+t,"YYYY-MM-DD HH:m"))})}return!0},convert:function(){console.log("connn")}},created:function(){var t=this;setTimeout(function(){t.currentDate=f(new Date),t.maxHour=t.currentDate.hours(),t.maxMinute=t.currentDate.minutes()},1e3)},watch:{},components:{videoPlayer:l.a}}},ukYY:function(t,e,s){"use strict";var n=s("7+uW");e.a={SELECT_STREAM:function(t,e){t.stream=e},RECEIVE_DVRSTORES:function(t,e){t.dvrStores=e},RECEIVE_DVRSTORE_DETAILS:function(t,e){var s=e.dvrStore,r=e.details;n.a.set(t.dvrStoreDetails,s,r)},COMPLETE_DVRSORE_DETAILS:function(t){t.dvrAllStoreDetailsReceived=!0},RESET_DVRSORE_DETAILS:function(t){t.dvrAllStoreDetailsReceived=!1,t.dvrStoreDetails={}},SET_DVRSTART:function(t,e){t.dvrStart=e},SET_DVRDURATION:function(t,e){t.dvrDuration=e}}},uslO:function(t,e,s){function n(t){return s(r(t))}function r(t){var e=a[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var a={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bm":"hng5","./bm.js":"hng5","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es-us":"INcR","./es-us.js":"INcR","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./gu":"rtsW","./gu.js":"rtsW","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};n.keys=function(){return Object.keys(a)},n.resolve=r,t.exports=n,n.id="uslO"},"v8+q":function(t,e){},x0Ld:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{id:"app",light:""}},[n("v-navigation-drawer",{attrs:{app:"",fixed:"",clipped:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[n("v-list",t._l(t.menu,function(e){return n("v-list-tile",{key:e.route,attrs:{to:{name:e.route},exact:e.exact}},[n("v-list-tile-action",[n("v-icon",[t._v(t._s(e.icon))])],1),t._v(" "),n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e.title||e.route))])],1)],1)}))],1),t._v(" "),n("v-toolbar",{attrs:{app:"","clipped-left":"",fixed:""}},[n("v-toolbar-title",{staticClass:"ml-0 pl-3"},[n("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v("\n      Open Multimedia\n    ")],1),t._v(" "),n("v-spacer"),t._v(" "),n("stream-selector"),t._v(" "),n("v-btn",{attrs:{icon:"",large:""}},[n("v-avatar",{attrs:{size:"32px",tile:""}},[n("img",{attrs:{src:s("7Otq"),alt:"OpenMultimedia"}})])],1)],1),t._v(" "),n("v-content",[n("v-container",{attrs:{fluid:"","full-height":""}},[n("router-view",[n("v-container",{attrs:{fluid:""}})],1)],1)],1),t._v(" "),n("v-footer",{attrs:{app:""}})],1)},r=[],a={render:n,staticRenderFns:r};e.a=a},xJD8:function(t,e,s){"use strict";var n=s("TjX/");e.a={name:"app",data:function(){return{drawer:!0,menu:[{route:"Recorder",title:"Grabadora",icon:"av_timer"},{route:"Conversions",title:"Conversiones",icon:"subscriptions"},{route:"Distribution",title:"Distribución",icon:"device_hub"}]}},components:{StreamSelector:n.a}}}},["NHnr"]);
//# sourceMappingURL=app.95b5f2f5441693c4bff1.js.map