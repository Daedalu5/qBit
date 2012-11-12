/** La surcouche ultime :P **/
(function(window, jQuery) {

	/**
	 * Pattern de capture des sequences complexe avec utilisation d'appui long
	 */
	var durationPattern = /^([^-]+)->([\d]+)\|(\d+)$/g, componentData = /(?:\$data\.)(\w+)/g;

	var qBit = (function(window, jQuery) {
		/**
		 * QBIT
		 */
		var qBit = function(selector, context) {
			return new qBit.c.init(selector, context);
		};

		/**
		 * Le coeur de qBit;
		 */
		qBit.c = qBit.prototype = {
			"name" : "core",
			/**
			 * La version du qBit core
			 */
			version : "0.1.0a",
			constructor : qBit,
			/**
			 * Méthode de selection
			 */
			init : function(selector, context) {
				// retourne l'instance qBit courante
				if (!selector) {
					return qBit;
				} else {
					if(typeof selector === 'string' && selector.indexOf('&')==0){
						// si &(w+), retourne la reference de l'objet
						return qBit.s.getComponentByReference(selector.substring(1));
					}else{
						// si ^[^&](w+), on recherche par selector sizzle
						return jQuery.extend(jQuery(selector, context), qBit);
					}
				}
			},
			/**
			 * Permet le passage en mode debug si une console output est accessible
			 */
			debugAllowed : console && console.log('qBit::Browser console output available...'),
			/**
			 * Permet l'acquisition d'un guid
			 */
			getGUID : function() {
				var S4 = function() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			},
			browser : jQuery.browser,
			/**
			 * Permet d'obtenir une string clé aléatoire
			 * @param le longueur de la clé
			 */
			randomKey : function(length) {
				var i = 0, retString = "";
				while (i < length) {
					retString = retString + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1, 2);
					i++;
				}
				return retString;
			},
			/**
			 * L'internationale fonction vide
			 */
			noop : function() {
				//n00p
			},
			collections : {
				is_array : function(input){
					return typeof(input)==="object" && (input instanceof Array);
				},
				is_object : function(input){
					return typeof(input)==='object' && input.length === undefined;
				}
			},
			/**
			 * Module d'operation sur tableaux
			 */
			array : {
				/**
				 * Retourne le tableau renverser
				 */
				reverse : function(array){
					var ret = [],i = array.length;
					while(i--){
						ret.push(array[i]);
					}
					return ret;
				},
				/**
				 * Retourne l'index de elem in array (-1 si non present)
				 */
				contains : function(elem,array){
					return (array.indexOf(elem)>-1);
				},
				/**
				 * Retourne l'intersection de array1 et array2
				 */
				intersection : function(array1,array2){
					var result = [], i = array1.length;
					while (i--) {
						if (qBit.c.array.contains(array1[i],array2) && !qBit.c.array.contains(array1[i],result) )
							result.push( array1[i] );
					}
					return result;
				},
				/**
				 * Retourne l'union de array1 et array2
				 */
				union : function(array1,array2){
					var result = [],
					i = array1.length,
					j = array2.length;
					while (i--) {
						if (!qBit.c.array.contains(array1[i],result)) {
							result.push(array1[i]);
						}
					}
					while (j--) {
						if (!qBit.c.array.contains(array2[j],result)) {
							result.push(array2[j]);
						}
					}
					return result;
				},
				/**
				 * Retourne l'inverse de l'intersection de array1 et array2 (= U(a,b) - I(a,b))
				 */
				invertIntersection : function(array1,array2){
					var result = [],
					i = array1.length,
					j = array2.length;
					while (i--) {
						if (!qBit.c.array.contains(array1[i],result) && !qBit.c.array.contains(array1[i],array2)) {
							result.push(array1[i]);
						}
					}
					while (j--) {
						if (!qBit.c.array.contains(array2[j],result) && !qBit.c.array.contains(array2[j],array1)) {
							result.push(array2[j]);
						}
					}
					return result;
				}
			},
			/**
			 * Les informations sur l'instance qBit
			 */
			nfo : function() {
				if (console.log) {
					console.log("_____________qBit___________");
					console.log("_v." + qBit.c.version + "_by_Daedalus");
					console.log("_core : ");
					console.log("   _modules : ");
					qBit.c.collections.each(qBit,function(name,value){
						console.log("		+"+value.name+" v."+value.version);
					});
					return "Status : OK";
				} else {
					alert("No browser console output available!");
				}
				return "Status : KO";
			},
			/**
			 * Une méthode de retour d'index avec expression régulière
			 */
			regexIndexOf : function(string,regex,pos){
				var indexOf = string.substring(pos || 0).search(regex);
    			return (indexOf >= 0) ? (indexOf + (pos || 0)) : indexOf;
			},
			/**
			 * La gestion des modules qBit
			 */
			modules : {
				// les modules deja importes
				imported : {"core":""},
				// rend publiques les methodes enonces dans l'entete de module
				makePublic : function(module){
					if(module['public'])
					jQuery.each(module['public'],function(index,entry){
						var obj = {};
						obj[entry] = module[entry];
						jQuery.extend(qBit,obj);
					});
				},
				/**
				 * DSL
				 */
				dependencies : function(moduleName,source,varIn){
					var checkDependencies = function(module){
						var error = 0;
						if(module.dependencies)
						jQuery.each(module.dependencies,function(name,value){
							if(name,qBit.c.modules.imported[name]){
								if(value != 'X'){
									var splitter = value.split('.'),splitter2 = qBit.c.modules.imported[name].split('.'), flag = false;
									for(var i = 0;i<splitter.length;i++){
										if(splitter[i]!='X' && parseInt(splitter[i],10)>parseInt(splitter2[i],10)){
											flag = true;
											error++;
											break;
										}
									}
									if(flag){
										console.log('qBit::Incorrect version of '+name+' imported (needed : '+value+'/actual : '+qBit.c.modules.imported[name]+')');
									}else{
										// dependances en cascades ? -> need a repo
									}
								}
							}else{
								console.log('qBit::'+name+' not imported');
								error++;
							}
						});
						return !error;
					};
					console.log('-------------------------');
					console.log(moduleName+' module import begin');
					if(typeof source === 'string' && varIn){
						var scriptElement = document.createElement('script');
						scriptElement.src = source;
						source = varIn;
					}
					if(checkDependencies(source)){
						qBit.c.modules.imported[moduleName] = source.version;
						if(source.namespace){
							moduleName = source.namespace;
						}
						qBit[moduleName] = source;
						qBit.c.modules.makePublic(qBit[moduleName]);
						console.log('qBit::'+moduleName+' imported');
					}else{
						console.log('qBit::Unable to import '+moduleName+' see log');
					}
					console.log('-------------------------');
					return qBit;
				}
			}
		};
		
		qBit.c.init.prototype = qBit;
		qBit.c.modules.imported.core = qBit.c.version;

		return qBit;
	})(window, jQuery);

	/**
	 * L'api de gestion des événements de souris pour qBit /!\  /!\
	 */
	var mBit = {
		"name" : "mouse",
		"version" : "0.2.0a",
		"dependencies" : {
			"core" : "0.1.X"
		},
		/**
		 * Object representatif d'un context de selection
		 */
		context : function($ctx,selector,UIOptions){
			var proxy = this;
			/**
			 * Object representatif d'un composant de contexte
		     */
			this._component = function(element){
				/**
				 * Active le composant
				 */
				this.active = function(){
					if(!this.isActive){
						this.isActive = true;
						jQuery(this._element).addClass('qBit_selected');
					}
				}
				/**
				 * Desactive le composant
				 */
				this.desactive = function(){
					if(this.isActive){
						this.isActive = false;
						jQuery(this._element).removeClass('qBit_selected');
					}
				}
				/**
				 * Pseudo-contructeur du composant
				 */
				this._init = function(element){
					this._element = element;
					this.isActive = false;
					element.qBit = {};
					element.qBit._component = this;
					element.qBit._context = proxy;
				}
				this._init(element);
			};
			this.process = function(array){
				this._selected = array;
				qBit.c.array.intersect
				for(var i = 0; i<this._components.length;i++){
					var flag = false;
					for(var j = 0; j<this._selected.length;j++){
						if(this._components[i] == this._selected[j]){
							this._components[i].active();
							flag = !flag;
						}
					}
					if(!flag){
						this._components[i].desactive();
					}
				}
			};
			this._init = function(ctx,selector,UIOptions){
				this._context = ctx;
				this._selector = selector;
				this._selected = [];
				this._components = [];
				jQuery(selector,ctx).each(function(index,element){
					proxy._components.push(new proxy._component(element));
				});
				ctx.qBit = {};
				ctx.qBit._context = this;
			};
			if(typeof $ctx.get === 'function') $ctx = $ctx.get(0);
			this._init($ctx,selector,UIOptions);
		},
		checkCollisions : function(event,mContext){
			var $box = jQuery(this), pos = $box.position(), rw = $box.width(), rh = $box.height(), ctx = mContext || qBit.m.contexts, ret;
			for(var j = 0; j<ctx.length;j++){
				var matrix = [], context = ctx[j];
				for(var i = 0; i < context._components.length;i++){
					var element = context._components[i]._element, tw = jQuery(element).width(), th = jQuery(element).height(), posi = jQuery(element).position(), rw2 = rw, rh2 = rh;
					if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
						return;
					}
					var tx = posi.left, ty = posi.top, rx = pos.left, ry = pos.top;
					rw2 += rx;
					rh2 += ry;
					tw += tx;
					th += ty;
					var t = (rw2 < rx || rw2 > tx) && (rh2 < ry || rh2 > ty) && (tw < tx || tw > rx) && (th < ty || th > ry);
					if(t){
						matrix.push(context._components[i]);
						ret = context;
					}
				}
				context.process(matrix);
				if(ret!=undefined){return (false);}
			}
			return ret;
		}, 
		selectContext : function(context,selector){
			var ctx = new qBit.m.context(context,selector);
			qBit.m.contexts.push(ctx);				
			return ctx;
		},
		contexts : [],
		/** 
		 * Permet l'utilisation de sélection à la souris
		 * (vérifie les collisions sur les différentes contextes)
		 */
		selectUI : function(){
			jQuery(document).bind('mousedown',function(event){
				var position = {"x":event.pageX,"y":event.pageY}, $box = jQuery('<div></div>').appendTo('body').css({"position":"absolute","top":position.y,"left":position.x,"border":"1px dashed #2d8cf8","background-color":"rgba(0,0,255,0.01)","z-index":9999,"cursor":"default"}), pos = $box.position(), currentContext;
				jQuery(this).bind('mousemove',function(event1){
					if(event1.which == 1){
						var obj = {};
						if(event1.pageX > position.x){
							obj["width"] = event1.pageX-position.x;
						}else{
							obj["left"] = event1.pageX
							obj["width"] = position.x-event1.pageX;
						}
						if(event1.pageY > position.y){
							obj["height"] = event1.pageY-position.y;
						}else{
							obj["top"] = event1.pageY;
							obj["height"] = position.y-event1.pageY;
						}
						if(Object.keys(obj).length != 0){
							$box.css(obj);
							if(currentContext == undefined){
								currentContext = qBit.m.checkCollisions.apply($box.get(0),[event1]);
							}else{
								qBit.m.checkCollisions.apply($box.get(0),[event1,currentContext]);
							}
						}
					}else if(event1.which !=1){
						jQuery(this).unbind('mousemove');
						$box.remove();
						return (false);
					}
					return (false);
				}).bind('mouseup',function(){
					jQuery(this).unbind('mousemove');
					$box.remove();
					return (false);
				});
			});
			return this;
		}
	};
	qBit.c.modules.dependencies('mouse',mBit);

	/**
	 * L'api de gestion des événements clavier pour qBit
	 */
	var hkBit = {
		"name" : "hokey",
		"version" : "0.1.1a",
		"dependencies" : {
			"core" : "0.1.X"
		},
		/** 
		 * Previent la propagation de l'evenement de DOM lors de la phase 2 (XBrowser)
		 * A passer absolument dans un autre module
		 */
		preventEvent : function(event){
			event.cancelBubble = true;
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
			event.returnValue = false;
			return;
		},
		/**
		 * La methode de capture appui touche
		 * @param this l'élement de capture
		 * @param evt l'événement de capture
		 * @param handler la fonction à executer en cas d'appui correspondant
		 * @param condition la condition nécessaire pour l'éxecution de la fonction
		 */
		hotkey : function(evt, key, handler, condition, prevented) {
			var $elem = jQuery(this), cond = condition || true;
			if ($elem.not(":visible")) {
				$elem = jQuery(document);
			}
			$elem.bind(evt + ".hk." + key, key, function(event) {
				var c;
				try {
					c = cond.apply($elem, [event]);
				} catch(err) {
					c = cond;
				}
				if (c) {
					if (prevented == undefined || (prevented != undefined && prevented)) {
						preventEvent(event);
					}
					handler.apply($elem, [event]);
				}
			});
		},
		/**
		 * Stockage des séquences pour multiplicité des amorces
		 */
		sequences : {},
		/**
		 * Méthode de stockage de séquence sous forme d'arbre
		 */
		storeInSequences : function(sequence) {
			var structure = {};

			var createStructure = function(array, structure, handler) {
				var i = 0, cursor = structure;
				do {
					if (array[i + 1] != undefined) {
						cursor[array[i]] = {};
						cursor = cursor[array[i]];
						i++;
					} else {
						cursor[array[i]] = handler;
						i++;
					}
				} while(i < array.length);
			};

			createStructure(sequence.seq, structure, sequence.handler);
			jQuery.extend(true, qBit.hk.sequences, structure);
		},
		/**
		 * La methode pour la capture d'appui touche séquentiel
		 * @param seqString la séquence de touches à capturer ("exemple : a shift+b c->500")
		 * @param handler la fonction à executer en cas de séquence conforme
		 */
		sequence : function(seqString, handler, tTimeout) {
			var seq = seqString.split(/ /g), secateDuration = /->/g, seqNamespace = "keydown.seq", timeout, timeTimeout = tTimeout || 1000;
			var sSeq = {
				"seq" : seq,
				"namespace" : seqNamespace,
				"timeout" : timeTimeout,
				"handler" : handler
			};

			qBit.hk.storeInSequences(sSeq);

			var seqNext = function(sequence, localTimeout) {
				jQuery(document).unbind(".seq");
				clearTimeout(localTimeout);
				localTimeout = setTimeout(function() {
					jQuery(document).trigger("qbit.refresh.sequence");
				}, sSeq.timeout);
				jQuery.each(sequence, function(index, subSeq) {
					if ( typeof subSeq === 'function') {
						return qBit.hk.hotkey.apply(document, [seqNamespace, index,
						function(event) {
							clearTimeout(localTimeout);
							subSeq.apply(document, [event]);
							jQuery(document).trigger("qbit.refresh.sequence");
							return (false);
						},
						function() {
							return (true);
						}, false]);
					} else {
						var array = null/* durationPattern.exec(index)*/;
						if (array != null) {
							return qBit.hk.pressDuration.apply(document, [seqNamespace, array[1], array[2],
							function(event) {
								seqNext(subSeq, localTimeout);
							}, array[3], {
								"timeout" : {
									"variable" : localTimeout,
									"duration" : sSeq.timeout,
									"callback" : function() {
										jQuery(document).trigger("qbit.refresh.sequence");
									}
								}
							}]);
						} else {
							return qBit.hk.hotkey.apply(document, [seqNamespace, index,
							function() {
								seqNext(subSeq, localTimeout);
							},
							function() {
								return true;
							}, false]);
						}
					}
				});
			}

			jQuery(document).bind("qbit.refresh.sequence", function(event) {
				jQuery(document).unbind("keydown.seq keyup.seq");
				jQuery.each(qBit.hk.sequences, function(index, fSeq) {
					var timeout = 0, array = null/* durationPattern.exec(index)*/;
					if (array != null) {
						return qBit.hk.pressDuration.apply(document, ["keydown.seq", array[1], array[2],
						function() {
							seqNext(fSeq, timeout);
						}, array[3]]);
					} else {
						return qBit.hk.hotkey.apply(document, ["keydown.seq", index,
						function() {
							seqNext(fSeq, timeout);
						}, false]);
					}
				});
			});
			
			jQuery(document).trigger("qbit.refresh");
		},
		/**
		 * La méthode pour la capture d'appui long
		 * @param key la touche à capturer
		 * @param time le temps d'appuie effectif
		 * @param handler pour executer cette fonction
		 * @param delta la différence tolérée pour la durée de l'appui touche
		 * @param options A COMPLETER (mise en commentaire du scrutineer)
		 * @important cette fonction altère l'événement pour y renseigner la précision dans l'attribut 'qbit->press->accuracy' -> event.qbit.press.accuracy || event['qbit']['press']['accuracy']
		 * 			  une valeur négative signifie un relachement plus tôt que le temps attendu, a contrario ...
		 */
		pressDuration : function(namespace, key, time, handler, delta, options) {
			var ns = namespace, oc = Infinity, cpt = 0, onFail = qBit.c.noop, onStart = qBit.c.noop, scrutineer;
			if (namespace.indexOf("keydown") > -1) {
				ns = namespace.split(/\./g);
				ns.shift();
				ns = ns.join("");
			}

			var pressed = false, timeStamp = 0, d = delta || 500;
			if (options) {
				if (options.occurence) {
					oc = options.occurence;
				}
				if (options.timeout) {
					clearTimeout(options.timeout.variable);
					options.timeout.variable = setTimeout(function() {
						options.timeout.callback();
					}, options.timeout.duration + time);
				}
				if (options.onStart) {
					onStart = options.onStart;
				}
				if (options.onFail) {
					onFail = options.onFail;
				}
				/*if (options.scrutineer) {
					scrutineer = options.scrutineer;
				}*/
			}

			var pressHandler = function() {
				return qBit.hk.hotkey.apply(document, ["keydown." + ns + ".press", key,
				function(event) {
					if (pressed) {
						return (false);
					} else {
						/*if (scrutineer) {
							scrutineer.begin({
								"event" : event
							});
						}*/
						if (onStart) {
							onStart.apply(document, [event]);
						}
						pressed = true;
						timeStamp = event.timeStamp;
						return qBit.hk.hotkey.apply(document, ["keyup." + ns + ".press", key,
						function(event) {
							/*if (scrutineer) {
								scrutineer.stop();
							}*/
							return handler.apply(document, [event]);
						},
						function(event) {
							/*if (scrutineer) {
								scrutineer.stop();
							}*/
							jQuery(document).unbind("." + ns + ".press");
							if (cpt >= oc) {
								/*if (scrutineer) {
									scrutineer.destroy();
								}*/
								return (false);
							}
							cpt++;
							var duration = event.timeStamp - timeStamp;
							pressed = false;
							jQuery.extend(event, {
								"qbit" : {
									"press" : {
										"accuracy" : duration - time,
										"delta" : d,
										"time" : time
									}
								}
							});
							pressHandler();
							var bool = duration <= (time + d) && duration >= (time - d);
							if (!bool) {
								onFail.apply(document, [event, duration]);
							}
							return bool;
						}, false]);
					}
				}]);
			};
			pressHandler();
		},
		"hotkeys" : function(key,handler,options){
			var target = ((options!=undefined)?options.target:document);
			if(key.indexOf(' ')>-1){
				var timeout = 1000;
				if(options!=undefined){
					if(options.timeout){
						timeout = options.timeout;
					}
				}
				qBit.hk.sequence.apply(target,[key,handler,timeout]);
			}else if(key.indexOf('->')>-1){
				var namespace = 'main',duration = 1000, delta = 200, opt = {}, oc = Infinity;
				if(options!=undefined){
					if(options.namespace){
						namespace = options.namespace;	
					}
					if(options.duration){
						duration = options.duration;	
					}
					if(options.delta){
						delta = options.delta;	
					}
					if(options.onStart){
						opt.onStart = options.onStart;
					}
					if(options.onFail){
						opt.onFail = options.onFail;
					}
					if(options.occurence){
						opt.occurence = options.occurence;
					}
				}
				qBit.hk.pressDuration.apply(target,[namespace,key.substring(0,key.indexOf('->')),duration,handler,delta,opt]);
			}else{
				var evt = 'keydown',condition = true,prevent = false;
				if(options!=undefined){
					if(options.evt){
						evt = options.evt;	
					}
					if(options.condition){
						condition = options.condition;	
					}
					if(options.prevent){
						prevent = options.prevent;
					}
				}
				qBit.hk.hotkey.apply(target,[evt,key,handler,condition,prevent]);
			}
			return this;
		}
	};
	qBit.c.modules.dependencies('hotkeys',hkBit);
	
	/**
	 * L'api de gestion structurelle des pages
	 */
	var sBit = {
		"name" : "structure",
		"version" : "0.3.0a",
		"namespace" : 's',
		"dependencies" : {
			"core" : "0.1.X",
			"hotkeys" : "0.1.X"
		},
		"public" : ["updateStructure","expand","component","scanStructure"],
		/**
		 * Methode centrale du module structure, update Structure
		 */
		updateStructure : function(newStructure){
			var root = this, $root = jQuery(this);;
			var options = arguments[1];
			jQuery.each(newStructure,function(name,value){
				if (name.indexOf('#') == 0) {
					var tagName = name.substring(1,qBit.c.regexIndexOf(name,/[0-9]+/g)),inputs = {};
					if(tagName == "input"){
						for(var attr in value){
							if(attr == 'type'){
								qBit.c.extend(inputs,{
									'type' : value[attr]
								});
							}
						}
					}
					var comp = $root.children(tagName).filter(function(){
						return jQuery(this).data('qBit_structCompId') == name;
					});
					
					if(comp.length==0 || typeof value.rendered != 'undefined' && value.rendered){
						comp = jQuery("<" + tagName + ">",inputs).appendTo(root).data('qBit_structCompId',name);
					}
					if(options && options.component){
						comp.get(0).component = options.component;
					}
					if(typeof value == 'function'){
						value.apply(comp,[comp.get(0)]);
					}else if(Object.keys(value).length!=0){
						qBit.s.updateStructure.apply(qBit.c.collections.is_array(comp)?comp[0]:comp, [value,options]);
					}
				} else {
					if(name.indexOf('qBit.')!=-1){
						$root.bind(name, function(event) {
							value.apply(this, [event]);
						});
					}else{
						if(options && options.component && typeof value == "string" && value.indexOf('$data.')>-1){
							var occurences = value.match(componentData);
							if(occurences!=null){
								var i=occurences.length;
								while(i--){
									value = value.replace(occurences[i],root.get(0).component._datas[occurences[i].split("$data.")[1]]);
								}
							}
						}
						switch(name) {
							case 'id' :
								$root.attr('id', value);
								break;
							case 'class' :
								$root.addClass(value);
								break;
							case 'animate' :
								if(options && !options.animations){
									$root.css(value);
								}else{
									$root.animate(value,500);
								}
								break;
							case 'style' :
								$root.css(value);
								break;
							case 'text' :
								$root.text(value);
								break;
							case 'html' : 
								$root.html(value);
								break;
							case 'expand' :
								qBit.s.expand.apply(root,[value.target,value.event,value.condition,value.states]);
								break;
							case 'component' : 
								qBit.s.component.apply(root,[value.type,value.structure,value.datas,value.functions,value.reference]);
								break;
							// liste des evenements /!\ sans les mutations de DOM /!\
							case 'click' :
							// evenement dom souris
							case 'dblclick' :
							case 'mouseup' :
							case 'mousedown' :
							case 'mouseover' :
							case 'mouseout' :
							case 'mouseenter' :
							case 'mouseleave' :
							case 'mousemove' :
							case 'keyup' :
							// evenement dom clavier
							case 'keydown' :
							case 'keypress' :
							case 'focus' :
							// evenement dom formulaire
							case 'blur' :
							case 'select' :
							case 'change' :
							case 'submit' :
							case 'reset' :
							case 'load' :
							// evenement dom HTML
							case 'unload' :
							case 'abort' :
							case 'error' :
							case 'resize' :
							case 'scroll' :
								$root.bind(name, function(event) {
									value.apply(this, [event]);
								});
								break;
							default :
								$root.attr(name, value);
						}
					}
				}
			});
		},
		/**
		 * Le principe de contraction qBit 
		 * @param typeEvent le type d'evenement a ecouter
		 * @param target le composant a ecouter
		 * @param condition la condition a valider pour passer a l'etat contracte
		 * @param la definition des differents etats :
		 * {"collapsed" : {...}, "expanded" : {...}} expanded etant la definition de l'etat de base
		 * note : l'attribut animate au lieu de css permet d'avoir des effets améliorés
		 */
		expand : function(target,typeEvent,condition,states){
			var proxy = (this.get)?this.get(0):this;
			var check = function(event,condition,options){
				var c = condition.apply(proxy,[event]);
				if(c && (proxy.isCollapsed == undefined || !proxy.isCollapsed) && jQuery(proxy).queue("fx").length==0){
					proxy.isCollapsed=true;
					qBit.s.updateStructure.apply(jQuery(proxy),[states["collapsed"],options]);
				}else if(!c && proxy.isCollapsed && jQuery(proxy).queue("fx").length==0){
					proxy.isCollapsed=false;
					qBit.s.updateStructure.apply(jQuery(proxy),[states["expanded"],options]);
				}
			};
			proxy.isCollapsed = false;
			jQuery(target).on(typeEvent,function(event){
				check(event,condition);				
			});
			check(undefined,condition,{"animations" : false});
		},
		/**
		 * Stockage pour la definition des differents composants
		 */
		components : {
			// composant de notification style FIFO
			"notification" : {
				"type" : "notification",
				"structure" : {
					"id" : "notif-"+qBit.c.getGUID(),
					"style" : {
						"position" : "fixed",
						"color" : "#FFFFFF",
						"background-color" : "black",
						"padding" : "5px 20px",
						"font-weight" : "bolder",
						"font-size" : "0.9em",
						"opacity" : 0,
						"bottom" : 65,
						"left" : 15,
						"z-index" : 9999
					},
					"#div0" : {
						"#header0" : {
							"#div0" : {
								"text" : "$data.title"
							},
							"#div1" : {
							}
						},
						"#div0" : {
							"text" : "$data.content"
						}
					}
				},
				"datas" : {
					"left_offset" : 15,
					"bottom_offset" : 65,
					"title" : "Default title",
					"content" : "Default content"
				},
				"functions" : {
					"show" : function(datas){
						var offset = 0;
						jQuery('div[id^=\'notif\']').each(function(){
							if(jQuery(this).css('opacity')!=0 || jQuery(this).queue("fx").length!=0){
								offset += jQuery(this).height()+20;
							}
						});
						jQuery(this).css({"left":datas['left_offset']-15,"bottom":offset+datas['bottom_offset']}).animate({"opacity":1,"left":datas['left_offset']},200);
					},
					"hide" : function(datas){
						var offset = jQuery(this).height()+20;
						jQuery('div[id^=\'notif\']').not(this).each(function(){
							if(jQuery(this).css('opacity')!=0){
								jQuery(this).animate({"bottom":"-="+offset},200);
							}
						});
						jQuery(this).animate({"opacity":0,"left":0},200).css({"left":datas['left_offset']});
					},
					"destroy" : function(){
						jQuery(this).remove();
					}
				}
			}
		},
		references : {},
		/**
		 * Tout est dans le nom de la methode ;)
		 */
		getComponentByReference : function(reference){
			var result;
			// et que ca boucle
			jQuery.each(qBit.s.references,function(name,value){
				if(name == reference){
					result = value;
					return (false);
				}
			});
			return result;
		},
		/**
		 * Creer un composant dans qBit : utilisation d'QX (Qbit eXpressions) pour synchroniser datas avec structure
		 */
		component : function(type,structure,datas,functions,reference){
			// on maintient toujours une reference vers this pour y acceder facilement depuis les methodes
			var proxy = (this.get)?this.get(0):this;
			// met a jour le composant suivant son structure-model et son data-model
			proxy.update = function(){
				qBit.s.updateStructure.apply(jQuery(proxy),[proxy._structure,{"component":proxy}]);
				return proxy;
			};
			// getter/setter vers le data-model
			proxy.dataModel = function(modifier){
				if(modifier){
					jQuery.extend(true,proxy._datas,modifier);
					return proxy;
				}else{
					return proxy._datas;
				}
			};
			// getter/setter vers le structure-model
			proxy.structure = function(modifier){
				if(modifier){
					jQuery.extend(true,proxy._structure,modifier);
					return proxy;
				}else{
					return proxy._structure;
				}
			};
			// constructeur de l'objet
			proxy._init = function(type,structure,datas,functions,reference){
				var extender = {};
				proxy._type = type;
				// si le type de composant est deja repertorie, on va chercher son etat par defaut
				for(var componentDef in qBit.s.components){
					if(componentDef == proxy._type){
						extender = qBit.s.components[componentDef];
					}
				}
				// on sauvegarde la structure
				proxy._structure = jQuery.extend(true,extender.structure,structure);
				// on sauvegarder le model de donnes
				proxy._datas = jQuery.extend(true,extender.datas,datas);
				// si on a des evenements particulier a binder
				var funcs = jQuery.extend(true,extender.functions,functions);
				if(funcs && typeof funcs == 'object' && Object.keys(funcs).length!=0){
					jQuery.each(funcs,function(functionName,func){
						proxy[functionName] = function(){
							return func.apply(proxy,[proxy._datas]);
						};
					});
				}
				// on cree le composant a partir des donnees presentes
				proxy.update();
				// et on sauve la reference
				if(reference){
					qBit.s.references[reference] = proxy;
				}
				return proxy;
			};
			// si on appelle ma methode qBit(...).component() sur un composant existant on retourne this
			// sinon on cree le composant
			return (type)?proxy._init.apply(proxy,arguments):proxy;
		},
		/**
		 * La fabrique de composant pour qBit, on applique les comportements par defaut
		 */
		componentFactory : function(type,structure,datas){
			var componentDef = {"type":type,"structure":structure,"datas":datas};
			qBit.s.components[type]=componentDef;
			return componentDef;
		}
	};
	qBit.c.modules.dependencies('structure',sBit);
	
	window.qBit = window.q = qBit;
	// QBIT is ready, sir
	jQuery(document).trigger("qbit.ready");
})(window, jQuery);

// preparation
jQuery(function() {
	jQuery(document).trigger("qbit.refresh");
});
