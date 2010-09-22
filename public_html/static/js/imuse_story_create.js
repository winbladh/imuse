var iMuseStoryCreate = Class.create({}, {

	initialize: function(condlist)
	{
		this.condlist = condlist; 
		if(this.condlist==null)
		{
			this.condlist = []; 
		}
		
		this.eventlist = null; 
		this.storyConstructs = new Hash(); 
		this.droppables = new Array(); 
		this.eventhash = new Hash(); 
		
		$('story_submit').observe('click', this.submitStory.curry("Submit").bindAsEventListener(this)); 
		$('story_save').observe('click', this.submitStory.curry("Save").bindAsEventListener(this)); 
		
		this.loadStoryConstructs(); 
		this.loadEvents(); 
		
		this.storyboard = $('storyboard'); 	
		
		this.tempLastCond = "";		
		this.storyData = null;


	}, 
	
	addConditionToList: function(id,text)
	{
		this.condlist.unshift({
			'id': id,
			'text': text
		});
	},
	
	makePrettyCondition: function(uglyCondition){
		if(uglyCondition == null)
		{
			return ""; 
		}
		if(this.condlist.length==0)
		{
			return uglyCondition; 
		}
		uglyCondition = uglyCondition.gsub('AND', '<b>AND</b>'); 
		uglyCondition = uglyCondition.gsub('OR', '<b>OR</b>'); 
		
		for(var i = 0; i < this.condlist.length; i++)
		//for(var i = this.condlist.length-1; i >= 0; i--)
		{
			uglyCondition = uglyCondition.gsub(new RegExp("C"+this.condlist[i].id+"\\b"), this.condlist[i].text); 
		}
		return uglyCondition; 
	},
	
	updateStoryboard: function()
	{
		var temp = this.generateStoryJSON(); 
		this.storyboard.update(); 
		this.loadStoryFromObject(temp); 
	},
	
	loadStory: function()
	{
		this.storyData = eval('(' + $('storyjson').value + ')'); 
		this.loadStoryFromObject(this.storyData); 
		this.eventLinks = new iMuseEventLinks(); 
		/*
		new Ajax.Request('/ajax_getstories.php', {
			method: 'get', 
			onSuccess: this.loadStoryCallback.bind(this)
		}); 
		*/
	},
	
	loadStoryCallback: function(resp)
	{
		this.storyData = resp.responseJSON; 
		this.loadStoryFromObject(resp.responseJSON); 
	},
	
	loadStoryFromObject: function(obj)
	{
		this.storyboard.update(this.setupStoryArray(obj)); 
		this.fixConditions();
	},
	
	setupStoryArray: function(sobj)
	{
		var field = this.makeFieldset(sobj); 
		
		for(var i = 0; i<sobj.children.length; i++)
		{
			if(Object.isString(sobj.children[i]) || Object.isNumber(sobj.children[i]))
			{
				field.insert(this.makeEventElement(this.eventhash.get(sobj.children[i]), true)); 
			}
			else
			{
				field.insert(this.setupStoryArray(sobj.children[i])); 
			}
		}
		
		this.droppables.push(field); 
		Droppables.add(field, {
			accept: ['dragEvent', 'storyConstruct'],
			hoverclass: 'hover', 
			onDrop: this.dropInFieldset.bind(this)
		}); 
		return field; 
	},
	
	// WE NEED TO CALL THIS TO STORY_CREATE.tpl
	dropInFieldset: function(elm, fs, event)
	{
		if(elm.hasClassName("storyConstruct"))
		{
			var temp = {}; 
			temp.name = elm.readAttribute("constructname");
			temp.condition = "";  
			temp.children = []; 
			var field = this.makeFieldset(temp); 
			fs.insert(field); 
			
			if(temp.name == "ifElse")
			{
				field.insert(this.makeFieldset({
					name:"ifConditionTrue", 
					condition:"", 
					children:[]
				})); 
				
				field.insert(this.makeFieldset({
					name:"ifConditionFalse", 
					condition:"", 
					children:[]
				})); 
			}			
			this.updateStoryboard(); 
		}
		else if(elm.hasClassName("dragEvent"))
		{
			fs.insert(this.makeEventElement(this.eventhash.get(elm.readAttribute("eventid")), true));
			
			this.eventLinks.elinks = $$('.dclink'); 
			this.eventLinks.setupLinks(); 
		}
	},
	
	setConditionFromPopup: function(arg){
		//console.log(arg.condExpression); 
		
		arg.element.up('fieldset').writeAttribute("constructcondition", arg.condText); 
		arg.element.up('fieldset').writeAttribute("condExpression", arg.condExpression); 
		arg.element.next('code').update(arg.condText); 
		
		this.fixConditions();
	},
	
	setCondition: function(event){
		event.stop(); 
		
		//var condition = prompt("What is the condition?", Event.element(event).up('fieldset').readAttribute("constructcondition")); 
		//Event.element(event).up('fieldset').writeAttribute("constructcondition", condition); 
		//Event.element(event).next('code').update(condition); 
		//this.fixConditions();
		
		//Event.element(event).up('fieldset').down('fieldset.conditionFalse').down('legend').update(condition);
		//Event.element(event).up('fieldset').down('fieldset.conditionTrue').down('legend').update(condition);

		document.constructinfo = {
			test: "yes", 
			curCondition: Event.element(event).up('fieldset').readAttribute("condExpression"), 
			element: Event.element(event), 
			storyobj: this	
		};	
		
		var popup = window.open('/'+g_projecturl+'/story_condition_popup.php', "story_condition", 'width=850, height=475, resizable=yes, scrollbars=yes'); 

		popup.constructinfo = {
			test: "yes"
		}; 
	},
	
	deleteConstruct: function(event){
		event.stop(); 
		
		if(confirm('Remove this and all children?'))
		{
			Event.element(event).up('fieldset').remove(); 
		}
	},
	
	moveConstructUp: function(event){
		event.stop(); 
		
		var elm = Event.element(event); 
		
		var parent = elm.up('fieldset'); 
		var above = parent.previous('fieldset, code'); 
		
		if(above == undefined)
		{
			alert("Cannot move up"); 
			return; 
		}
		
		var newelm = parent.remove(); 
		above.insert({before: newelm}); 
	},
	
	moveConstructDown: function(event){
		event.stop(); 
		
		var elm = Event.element(event); 
		
		var parent = elm.up('fieldset'); 
		var above = parent.next('fieldset, code'); 
		
		if(above == undefined)
		{
			alert("Cannot move down"); 
			return; 
		}
		
		var newelm = parent.remove(); 
		above.insert({after: newelm}); 
	},
	
	makeFieldset: function(obj)
	{
		var idname = "fieldset_"+Math.floor(Math.random()*110);
		
		var temp = new Element ('fieldset'); 
		temp.writeAttribute("constructname", obj.name);
		
		var legend = new Element('legend').update(obj.name);  
		
		if(obj.name=="ifElse")
		{
			legend.update("checkCondition");
			temp.addClassName("ifElse");
		}
		if (obj.name == "ifConditionTrue")
		{
			temp.addClassName("conditionTrue"); 
		}
		else if (obj.name == "ifConditionFalse")
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
	
		if(obj.name != "ifConditionTrue" && obj.name != "ifConditionFalse")
		{
			legendspan.insert(new Element('a', {'href':'#'}).update("Condition").observe('click', this.setCondition.bindAsEventListener(this)));  
			legendspan.insert(new Element('code').addClassName("constructcondition").update(this.makePrettyCondition(obj.condition)));
			temp.writeAttribute("constructcondition", this.makePrettyCondition(obj.condition)); 
			temp.writeAttribute("condExpression", obj.condition == null ? "" : obj.condition); 
		}
		

		legendspan.insert(" ");
//		legendspan.insert(new Element('a', {'href':'#'}).update("Up").observe('click', this.moveConstructUp.bindAsEventListener(this))); 
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseUpArrow.png', 'title': 'Move Up'})).observe('click', this.moveConstructUp.bindAsEventListener(this))); 
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDownArrow.png', 'title': 'Move Down'})).observe('click', this.moveConstructDown.bindAsEventListener(this))); 
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDelete.png', 'title': 'Delete'})).observe('click', this.deleteConstruct.bindAsEventListener(this))); 
		
		
		
		legend.insert(legendspan); 
		
		temp.insert(legend); 
		temp.addClassName("storyConstruct"); 
		
		return temp; 
	},
	
	dropStoryboard: function(elem, dropon, event)
	{	
		var temp = new Element('fieldset'); 
		temp.insert(new Element('legend').update(elem.readAttribute('constructname'))); 
		temp.insert("something testing here"); 
		this.storyboard.insert(temp); 
	},
	
	loadStoryConstructs: function()
	{
		$$('.storyConstruct').each(
		this.loadStoryConstruct.bind(this)
		);
	}, 
	
	loadStoryConstruct: function(sc)
	{
		var temp = new Draggable(sc, {
			revert: true, 
			ghosting: true,
			scroll: window 
			}); 
			
	}, 
	
	loadEvents: function()
	{
		new Ajax.Request('/'+g_projecturl+'/ajax_getevents.php',{
		method: 'get', 
		onSuccess: this.loadEventsCallback.bind(this),
		
		}); 
	},
	
	loadEventsCallback: function(resp)
	{
		this.eventslist = resp.responseJSON; 
		var sidebar = $('sidebarnav'); 
		//sidebar.insert(new Element('li').addClassName("header").update("Events to Drag")); 
		
		if(this.eventslist.length == 0)
		{
			for(var i=0; i<this.eventslist.length; i++)
			{
				this.eventhash.set(""+this.eventslist[i].eventid, this.eventslist[i]); 			
				/*var temp = this.makeEventElement(this.eventslist[i], false); 
				sidebar.insert(new Element('li').update(
					new Element('span').update(temp))); 
				
				
				new Draggable(temp, {
					revert: true, 
					ghosting: true,
					scroll: window
					});
				*/
			}
			
			$$('span.dragEvent').each(function(elm){
				new Draggable(elm, {
						revert: true, 
						ghosting: true,
						scroll: window
					}); 
			});
			
			this.loadStory(); 

		}
		else
		{		
			for(var i=0; i<this.eventslist.length; i++)
			{
				this.eventhash.set(""+this.eventslist[i].eventid, this.eventslist[i]); 			
				/*var temp = this.makeEventElement(this.eventslist[i], false); 
				sidebar.insert(new Element('li').update(
					new Element('span').update(temp))); 
				
				
				new Draggable(temp, {
					revert: true, 
					ghosting: true,
					scroll: window
					});
				*/
			}
			
			$$('span.dragEvent').each(function(elm){
				new Draggable(elm, {
						revert: true, 
						ghosting: true,
						scroll: window
						}); 
			});
			this.loadStory(); 
		}
	},
	
	deleteEvent: function(event){
		event.stop(); 
		if(confirm("Are you sure you want to delete this event?"))
		{
			Event.element(event).up('code').remove(); 	
		}
	},
	
	moveEventUp: function(event){
		event.stop(); 
		
		var elm = Event.element(event); 
		
		var parent = elm.up('code'); 
		var above = parent.previous('code, fieldset'); 
		
		if(above == undefined)
		{
			alert("Cannot move up"); 
			return; 
		}
		
		var newelm = parent.remove(); 
		above.insert({before: newelm}); 
	},
	
	moveEventDown: function(event){
		event.stop(); 
		
		var elm = Event.element(event); 
		
		var parent = elm.up('code'); 
		var above = parent.next('code, fieldset'); 
		
		if(above == undefined)
		{
			alert("Cannot move down"); 
			return; 
		}
		
		var newelm = parent.remove(); 
		above.insert({after: newelm}); 
	},
	
	makeEventElement: function(eventinfo, showInfo)
	{	
		var textelm = eventinfo.name; 
		if(showInfo)
		{
			textelm = eventinfo.infolinked; 
		}
		
		var eventelm = new Element('code', {'id': 'event_'+eventinfo.eventid})
			.update("")
			.writeAttribute("eventid", eventinfo.eventid)
			.writeAttribute("eventinfo", eventinfo.info)
			.writeAttribute("eventname", eventinfo.name)
			.addClassName("dragEvent"); 
			
		if (showInfo)
		{
			var poslinks = new Element('span').addClassName("poslinks"); 
			poslinks.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseUpArrow.png'})).observe('click', this.moveEventUp.bindAsEventListener(this))); 
			poslinks.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDownArrow.png'})).observe('click', this.moveEventDown.bindAsEventListener(this))); 
			poslinks.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDelete.png'})).observe('click', this.deleteEvent.bindAsEventListener(this))); 
			eventelm.insert(poslinks); 
		}
		
		eventelm.insert(textelm); 
		return eventelm; 
	}, 
	
	submitStory: function(submitType, event)
	{
		event.stop(); 
		var temp = this.generateStoryJSON(); 
		$('storyjson').value = Object.toJSON(temp);
		$('submitType').value = submitType;  
		$('storyform').submit(); 
	}, 
	
	generateStoryJSON: function()
	{
		var obj = this.generateStoryJSONFieldset(this.storyboard.childElements()[0]); 
		//console.log(obj); 
		return obj; 
	},
	
	generateStoryJSONFieldset: function(fsobj)
	{
		var tempObj = new Object(); 
		tempObj.name = fsobj.readAttribute("constructname");
		tempObj.children = new Array(); 
		//tempObj.condition = fsobj.readAttribute("constructcondition"); 
		tempObj.condition = fsobj.readAttribute("condExpression"); 
		
		var childs = fsobj.childElements(); 
		
		for(var i = 0; i < childs.length; i++)
		{
			if (childs[i].tagName == "FIELDSET")
			{
				tempObj.children.push(this.generateStoryJSONFieldset(childs[i])); 
			}
			else if(childs[i].tagName == "CODE")
			{
				tempObj.children.push(childs[i].readAttribute("eventid")); 
			}
		}
		
		return tempObj; 
	},
	
	fixConditionFS: function(obj){
		//console.log(obj);
		var cond = obj.up('fieldset').readAttribute('constructcondition');

		var legend = obj.down('legend');

		if(obj.hasClassName("conditionTrue"))
		{
			
			legend.update("ifConditionTrue <code>"+this.makePrettyCondition(cond)+"</code> is true");
		}
		else if(obj.hasClassName("conditionFalse"))
		{
			legend.update("ifConditionFalse <code>"+this.makePrettyCondition(cond)+"</code> is false");
		}

		var legendspan = new Element('span'); 

		legendspan.insert(" ");
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseUpArrow.png'})).observe('click', this.moveConstructUp.bindAsEventListener(this))); 
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDownArrow.png'})).observe('click', this.moveConstructDown.bindAsEventListener(this))); 
		legendspan.insert(new Element('a', {'href':'#'}).update(new Element('img', {'src': '/static/images/imuseDelete.png'})).observe('click', this.deleteConstruct.bindAsEventListener(this))); 
		
		legend.insert(legendspan);

		//
	},
	fixConditions: function(){
		var fieldsets = $$('fieldset.conditionTrue', 'fieldset.conditionFalse');

		fieldsets.each(this.fixConditionFS.bind(this));

		//console.log(fieldsets);
	},

	lazything: function(){}
}); 
