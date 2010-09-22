
var iMuseStoryCreate = Class.create({},{
	
	initialize: function(){
		this.eventlist = null;
		this.storyConstructs = new Hash();
		this.droppables = new Array();
		this.eventhash = new Hash();
		
		$('story_submit').observe('click', this.submitStory.bindAsEventListener(this));

		this.loadStoryConstructs();
		this.loadEvents();

		this.storyboard = $('storyboard');
	
		this.eventLinks = new iMuseEventLinks();
		
		this.storyData = null;
	},

	updateStoryboard: function(){
		var temp = this.generateStoryJSON();
		this.storyboard.update();
		this.loadStoryFromObject( temp );	
	},
	

	loadStory: function(){
		this.storyData = eval('(' + $('storyjson').value + ')');
		this.loadStoryFromObject(this.storyData);
		/*
		new Ajax.Request('/ajax_getstory.php',{
			method:'get',
			onSuccess: this.loadStoryCallback.bind(this)
		});
		*/
	},
	loadStoryCallback: function(resp){
		this.storyData = resp.responseJSON;
		this.loadStoryFromObject(resp.responseJSON);
	},

	loadStoryFromObject: function(obj){
		this.storyboard.update( this.setupStoryArray(obj) );
	},

	setupStoryArray: function(sobj){
		//console.log(sobj);
		var field = this.makeFieldset(sobj);

		for(var i=0; i<sobj.children.length;i++)
		{
			if( Object.isString(sobj.children[i]) || Object.isNumber(sobj.children[i]) )
			{
				field.insert( this.makeEventElement( this.eventhash.get(sobj.children[i]),true ) );
			}
			else
			{
				field.insert( this.setupStoryArray(sobj.children[i]) );
			}
		}

		this.droppables.push(field);
		Droppables.add(field,{
			accept:['dragEvent','storyConstruct'],
			hoverclass: 'hover',
			onDrop: this.dropInFieldset.bind(this)
		});
		
		return field;
	},


	dropInFieldset: function(elm, fs, event){
		if(elm.hasClassName("storyConstruct"))
		{

			var temp = {};
			temp.name = elm.readAttribute("constructname");
			temp.condition = "";
			temp.children = [];
			temp.isConditionTrue = elm.hasClassName("conditionTrue");
			temp.isConditionFalse = elm.hasClassName("conditionFalse");
			console.log(temp);
			fs.insert( this.makeFieldset( temp ) );

			this.updateStoryboard();

		}
		else if(elm.hasClassName("dragEvent"))
		{
			fs.insert( this.makeEventElement( this.eventhash.get( elm.readAttribute("eventid") ), true ) );
			this.eventLinks.elinks = $$('.dclink');
			this.eventLinks.setupLinks();

		}
	},
	moveConstructUp: function(event){
		event.stop();
		
		console.info("MOVE UP");
		
		var elm = Event.element(event);
		var parent = elm.up('fieldset');
		var above = parent.previous('fieldset,code');
		
		if(above==undefined)
		{
			console.error("CANT MOVE UP");
			return;
		}
		var newelm = parent.remove();
		above.insert({before:newelm});
	},
	moveConstructDown: function(event){
		event.stop();
		
		console.info("MOVE DOWN");
		
		var elm = Event.element(event);
		var parent = elm.up('fieldset');
		var above = parent.next('fieldset,code');
	
		if(above==undefined)
		{
			console.error("CANT MOVE DOWN");
			return;
		}
		var newelm = parent.remove();
		above.insert({after:newelm});
	},
	
	setCondition: function(event){
		event.stop();
		//constructcondition
		var test = prompt("What is the condition?", Event.element(event).up('fieldset').readAttribute("constructcondition"));
		Event.element(event).up('fieldset').writeAttribute("constructcondition", test);
		Event.element(event).next('code').update(test);
		console.log(test);
	},
	
	deleteConstruct: function(event){
		event.stop();
		if(confirm("Remove this construct and ALL CHILDREN?"))
		{
			Event.element(event).up('fieldset').remove();
		}
	},

	makeFieldset: function(obj){
		console.log("MF:", obj);
		var temp = new Element('fieldset');
		temp.writeAttribute("constructname", obj.name);
		
		var legend = new Element('legend').update(obj.name);
		
		if( obj.name=="ifElse")
		{
			legend.update("checkCondition");
			temp.addClassName("ifElse");
		}
		else
		{
			legend.update(obj.name);
		}
		if(obj.name=="ifConditionTrue")
		{
			temp.addClassName("conditionTrue");
		}
		else if(obj.name=="ifConditionFalse")
		{
			temp.addClassName("conditionFalse");
		}
		else if (obj.name == "doInOrder"){
			temp.addClassName("doInOrder");
		}
		else if (obj.name == "while"){
			temp.addClassName("while");
		}
		
		
		legend.insert(" ");
		var legendspan = new Element('span');
		legendspan.insert(new Element('a',{'href':'#moveup'}).update("Up").observe('click',this.moveConstructUp.bindAsEventListener(this)));
		legendspan.insert(new Element('a',{'href':'#movedown'}).update("Down").observe('click',this.moveConstructDown.bindAsEventListener(this)));
		legendspan.insert(new Element('a',{'href':'#delete'}).update("Delete").observe('click',this.deleteConstruct.bindAsEventListener(this)));
		
		if(obj.name!="ifConditionTrue" && obj.name!="ifConditionFalse")
		{
		legendspan.insert(new Element('a',{'href':'#setcondition'}).update("Condition").observe('click',this.setCondition.bindAsEventListener(this)));
		legendspan.insert(new Element('code').addClassName("constructcondition").update(obj.condition));
		
		temp.writeAttribute("constructcondition", obj.condition);
		}
		
		legend.insert(legendspan);
		
		
		temp.insert(legend);
		temp.addClassName("storyConstruct");
		return temp;
	},

	dropStoryboard: function(elem,dropon,event){
		
		var temp = new Element('fieldset');
		
		temp.insert(new Element('legend').update(elem.readAttribute('constructname')));
		temp.insert("aksjdlkasjdkas");
		this.storyboard.insert(temp);
	},

	loadStoryConstructs: function(){
		$$('.storyConstruct').each(
		this.loadStoryConstruct.bind(this)
		);
	},

	loadStoryConstruct: function(sc){
		var temp = new Draggable(sc, {
			revert: true,
			ghosting: true
		});

	//	console.log(sc);
	},

	loadEvents: function(){
		new Ajax.Request('/ajax_getevents.php',{
			method:'get',
			onSuccess: this.loadEventsCallback.bind(this)
		});
	},
	loadEventsCallback: function(resp){
		this.eventslist = resp.responseJSON;
		var sidebar = $('sidebarnav');
		sidebar.insert( new Element('li').addClassName("header").update("Events to Drag"));
		for(var i=0;i<this.eventslist.length;i++)
		{
			this.eventhash.set(this.eventslist[i].eventid, this.eventslist[i]);
			
			var temp = this.makeEventElement( this.eventslist[i], false );
			sidebar.insert(new Element('li').update(
				new Element('span').update( temp )
			));

			new Draggable(temp,{
				revert:true,
				ghosting:true
			});
		}

		this.loadStory();
	},

	moveEventUp: function(event){
		event.stop();
		var elm = Event.element(event).up('code');
		
		var upelm = elm.previous('fieldset,code');
		
		if(upelm==undefined)
		{
			console.error("cant move up");
			return;
		}
		
		var temp = elm.remove();
		
		upelm.insert({before:temp});
	},
	moveEventDown: function(event){
		event.stop();
		var elm = Event.element(event).up('code');
		
		var upelm = elm.next('fieldset,code');
		
		if(upelm==undefined)
		{
			console.error("cant move down");
			return;
		}
		
		var temp = elm.remove();
		
		upelm.insert({after:temp});
	},
	removeEvent: function(event){
		event.stop();
		
		Event.element(event).up('code').remove();
	},

	makeEventElement: function(eventinfo,showInfo){	
		var textelm = eventinfo.name;
		if(showInfo)
		{
			textelm = eventinfo.infolinked;
		}

		var evElm = new Element('code',{'id':'event_'+eventinfo.eventid})
			.update("")
			.writeAttribute("eventid", eventinfo.eventid)
			.writeAttribute("eventinfo", eventinfo.info)
			.writeAttribute("eventname", eventinfo.name)
			.addClassName("dragEvent");
		
		if(showInfo)
		{
			var poslinks = new Element('span').addClassName("poslinks");
			poslinks.insert(new Element('a',{'href':'#up'}).update("Up").observe('click', this.moveEventUp.bindAsEventListener(this)));
			//poslinks.insert(" | ");
			poslinks.insert(new Element('a',{'href':'#down'}).update("Down").observe('click', this.moveEventDown.bindAsEventListener(this)));
			//poslinks.insert(" | ");
			poslinks.insert(new Element('a',{'href':'#delete'}).update("Delete").observe('click', this.removeEvent.bindAsEventListener(this)));
			
			evElm.insert(poslinks);
		}
		evElm.insert(textelm);
		
		return evElm;
	},

	submitStory: function(event){
		event.stop();

		var temp = this.generateStoryJSON();

		$('storyjson').value = Object.toJSON(temp);
		
		$('storyform').submit();


		//console.log("YOU SUBMITTED");
	},

	generateStoryJSON: function(){
		var obj = this.generateStoryJSONFieldset( this.storyboard.childElements()[0]);
		console.log(obj);
		return obj;
	},

	generateStoryJSONFieldset: function(fsobj){
		var tempObj = new Object();
		tempObj.name = fsobj.readAttribute("constructname");
		tempObj.condition = fsobj.readAttribute("constructcondition");
		tempObj.children = new Array();

		var childs = fsobj.childElements();

		for(var i=0;i<childs.length;i++)
		{
			if(childs[i].tagName=="FIELDSET")
			{
				tempObj.children.push( this.generateStoryJSONFieldset( childs[i]) );
			}
			else if(childs[i].tagName=="CODE")
			{
				tempObj.children.push( childs[i].readAttribute("eventid") );
			}
		}

		return tempObj;

	},

	lazything: function(){}
	
});
