var iMuseStoryView = Class.create({}, {

	initialize: function(storyObject)
	{
		this.options = Object.extend({
			conditions: []
		}, arguments[1] || { }); 
		
		//console.log(imusefuncs.uniqid());
		
		//console.log(this.options.conditions); 
		
		this.eventlist = null; 
		this.storyConstructs = new Hash(); 
		this.droppables = new Array(); 
		this.eventhash = new Hash(); 
				
		this.elementsHash = new Hash(); 
		
		this.loadStoryConstructs(); 
		this.loadEvents(); 
		
		this.storyboard = $('storyboard'); 	
			
		this.storyData = storyObject; 
		
		this.loadStoryFromObject(storyObject); 
		
		$('next_button').observe('click', this.stepThroughStory.bindAsEventListener(this)); 
		$('prev_button').observe('click', this.stepBackThroughStory.bindAsEventListener(this)); 
		$('play_button').observe('click', this.playThroughStory.bindAsEventListener(this)); 

		//this.currentElement = this.storyboard.down('code.dragEvent, fieldset'); 
		
		this.thingIveSeenNext = new Array(); 

		this.tempLastCond = "";
		
		this.playStoryTimer = null; 
	}, 
	
	playThroughStory: function(event){
		event.stop(); 
		
		$('play_button').value = "Playing..."; 
		$('play_button').disabled = 1; 
		this.playStoryTimer = new PeriodicalExecuter(this.stepThroughStory.bind(this), 
			parseFloat($F('play_delay'))
			); 
	},
	
	updateStoryboard: function()
	{
		var temp = this.generateStoryJSON(); 
		this.storyboard.update(); 
		this.loadStoryFromObject(temp); 
	},
	
	loadStory: function()
	{
		//this.storyData = eval('(' + $('storyjson').value + ')'); 
		this.loadStoryFromObject(this.storyData); 
		/*
		new Ajax.Request('/ajax_getstories.php', {
			method: 'get', 
			onSuccess: this.loadStoryCallback.bind(this)
		}); 
		*/
	},
	
	evalCondition: function(condition){
	
		condition = condition.toUpperCase(); 
		condition = condition.gsub("AND", "&&"); 
		condition = condition.gsub("OR", "||"); 
		if(this.options.conditions.length>0)
		{
			for(var i = 0; i<this.options.conditions.length; i++)
			{
				condition = condition.gsub("/\bC"+this.options.conditions[i].id+"\b/", this.options.conditions[i].value+''); 
			}
		}
		
		try
		{
			var temp = eval(condition); 
			return temp; 
		}
		catch(e)
		{
			console.error(e); 
			return false; 
		}
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
		this.eventLinks = new iMuseEventLinks(); 
		
		this.currentElement = this.storyboard.down('fieldset'); 
		this.currentElement = this.storyboard.down('.storyelement'); 
	},
	
	setupStoryArray: function(sobj)
	{
		var field = this.makeFieldset(sobj); 
		if(field == null)
		{
			return null; 
		}
		for(var i = 0; i<sobj.children.length; i++)
		{
			if(Object.isString(sobj.children[i]) || Object.isNumber(sobj.children[i]))
			{
				field.insert(this.makeEventElement(this.eventhash.get(sobj.children[i]), true)); 
			}
			else
			{
				var fstemp = this.setupStoryArray(sobj.children[i]); 
				if(fstemp!=null)
				{
					field.insert(fstemp); 
				}
			}
		}

		return field; 
	},
	
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
		
	makeFieldset: function(obj)
	{
		var idname = "fieldset_"+imusefuncs.uniqid(); // Math.floor(Math.random()*110);
		
		var temp = new Element ('fieldset', {
			'id':idname
		}); 
		
		temp.writeAttribute("constructname", obj.name);
		
		try
		{
			if(obj.condition!=null && obj.condition!="" && obj.name!="ifElse")
			{
				var fscond = this.evalCondition(obj.condition); 
				if(fscond && obj.name=="ifConditionFalse")
				{
					return null; 
				}
				else if (!fscond && obj.name!="ifConditionFalse")
				{
					return null; 
				}
			}
		}
		catch(e){console.error(e)}
		
		temp.addClassName("storyelement"); 
		temp.store("doneMoveDown", 0); 
		
		this.elementsHash.set(idname, {
			object: obj, 
			element: temp
		}); 
		
		var legend = new Element('legend');//.update(obj.name);  

		if( obj.name=="ifElse")
		{
			legend.update("checkCondition");
			temp.addClassName("ifElse");
		}
		else
		{
			legend.update(obj.name);
		}
		
		if (obj.name == "ifConditionTrue")
		{
			temp.addClassName("conditionTrue"); 
			legend.update("if ");
			legend.insert(" is true");
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
			
			if(obj.condition!=undefined && obj.condition!="")
			{
				//console.log(obj);
				this.tempLastCond = obj.condition;

				var conditionTemp = this.prettyCondition(obj.condition);

				// MARKER

				legendspan.insert(new Element('code').addClassName("constructcondition").update(conditionTemp));//obj.condition));
				temp.writeAttribute("constructcondition", obj.condition); 

			}

		}
		
		legend.insert(legendspan); 
		
		temp.insert(legend); 
		temp.addClassName("storyConstruct"); 
		
		return temp; 
	},
	
	prettyCondition: function(conditionTemp){ //EDIT CONDITION STUFF HERE 
		if(conditionTemp == null)
		{
			//onclick = return confirm("You cannot view the story because a condition is null."); 
		}
		else
		{
			conditionTemp = conditionTemp.toUpperCase(); 
			for(var i = 0; i < this.options.conditions.size(); i++)
			{
				conditionTemp = conditionTemp.gsub("C"+this.options.conditions[i].id, 
											this.options.conditions[i].text); 
			}
		return conditionTemp;
		}
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
			ghosting: true
			}); 
			
	}, 
	
	loadEvents: function()
	{
		new Ajax.Request('/'+g_projecturl+'/ajax_getevents.php',{
		method: 'get', 
		onSuccess: this.loadEventsCallback.bind(this)
		}); 
	},
	
	loadEventsCallback: function(resp)
	{
		this.eventslist = resp.responseJSON; 
			
		for(var i=0; i<this.eventslist.length; i++)
		{
			this.eventhash.set(""+this.eventslist[i].eventid, this.eventslist[i]); 			
		}
		
		this.loadStory(); 

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
		if(eventinfo == undefined)
		{
			return; 
		}
		
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
			.addClassName("storyelement")
			.addClassName("dragEvent"); 
		
		eventelm.insert(textelm); 
		return eventelm; 
	}, 
	
	submitStory: function(event)
	{
		event.stop(); 
		var temp = this.generateStoryJSON(); 
		$('storyjson').value = Object.toJSON(temp); 
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
		tempObj.condition = fsobj.readAttribute("constructcondition"); 
		
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
	
	evalFieldsetCondition: function(elm)
	{
		return this.evalCondition(elm.down('legent').down('code').innerHTML); 
	},
	
	stepThroughStory: function(){
		var nextelm = null; 
		
		this.currentElement.removeClassName("currentelm"); 

		if(this.currentElement.tagName=="FIELDSET")
		{
			if(this.thingIveSeenNext.include(this.currentElement))
			{
				nextelm = this.currentElement.next('.storyelement'); 
				if(nextelm == undefined)
				{
					nextelm = this.currentElement.up('.storyelement'); 
				}
			}
			else
			{
				nextelm = this.currentElement.down('.storyelement'); 
			}
		}
		else if(this.currentElement.tagName=="CODE")
		{
			var eventImage = this.currentElement.down("img"); 
			if(eventImage != undefined)
			{
				eventImage.remove();
			}
			
			nextelm = this.currentElement.next('.storyelement'); 
			
			if(nextelm==undefined)
			{
				nextelm = this.currentElement.up('.storyelement'); 
				nextelm.store("dontMoveDown", 1); 
			}
		}
		//var nextelm = this.currentElement.next('fieldset, code.dragEvent'); 
		
		if(nextelm == undefined)
		{
			if(this.playStoryTimer!=null)
			{
				this.playStoryTimer.stop(); 
				$('play_button').value = "Play"; 
				$('play_button').disabled = 0; 
			}
			else
			{
				alert("Finished"); 
			}
			this.currentElement = this.storyboard.down('.storyelement'); 
			this.thingIveSeenNext = new Array(); 
			return; 

		}
		/*
		if(nextelm.tagName == "FIELDSET")
		{
			try
			{
				var fscond = this.evalCondition(nextelm.down('legend').down('code').innerHTML); 	
				console.log(nextelm.down('legend').down('code').innerHTML+" = "+fscond);	
			}
			catch(e)
			{
			
			}
		
		}
		*/
		if(this.thingIveSeenNext.include(nextelm))
		{
			this.currentElement = nextelm; 
			this.stepThroughStory(); 
			return; 
		}
		
		this.thingIveSeenNext.push(this.currentElement); 
		this.currentElement = nextelm; 
		this.currentElement.addClassName("currentelm"); 
		
		if(this.currentElement.tagName=="CODE")
		{
			var elementID = this.currentElement.readAttribute("eventid"); 
			var event = this.eventhash.get(elementID); 
			if(event.hasimage == 1)
			{
				this.currentElement.insert(new Element("br")); 
				this.currentElement.insert(new Element("img", {"src": event.url, "height": "300 px"})); 
			}
		}

	},
	
	evalCondition: function(condition){ // EDIT CONDITION STUFF HERE 
		if (condition == null)
		{
		
		}
		else
		{
		try
		{
			condition = condition.toUpperCase(); 
			condition = condition.gsub("AND", "&&"); 
			condition = condition.gsub("OR", "||"); 
			for(var i = 0; i < this.options.conditions.size(); i++)
			{
				condition = condition.gsub("C"+this.options.conditions[i].id, 
											this.options.conditions[i].value); 
			}
			return eval(condition); 
		}
		catch(e)
		{
			console.error(e); 
			return false; 
		}
		}
	},

	stepBackThroughStory: function(){
		var nextelm = null; 
		
		this.currentElement.removeClassName("currentelm"); 
		
		this.currentElement = this.thingIveSeenNext.pop();
		
		if(this.currentElement==undefined)
		{
			this.currentElement = this.storyboard.down('.storyelement'); 
			alert("No More"); 
			return; 
		}
		 
		this.currentElement.addClassName("currentelm"); 	
	},


	fixConditionFS: function(obj){
		//console.log(obj);
		var cond = obj.up('fieldset').readAttribute('constructcondition');		
		var fscond = this.evalCondition(cond); 
		var testCond = this.prettyCondition(cond); 

		if(obj.hasClassName("conditionTrue"))
		{

			obj.down('legend').update("<code>"+this.prettyCondition(cond)+"</code> is true");

		//	obj.down('legend').update("if <code>"+testCond+"</code> is true");

		}
		else if(obj.hasClassName("conditionFalse"))
		{

			obj.down('legend').update("<code>"+this.prettyCondition(cond)+"</code> is false");

		//	obj.down('legend').update("else if <code>"+testCond+"</code> is false");

		}
		
		if(obj.hasClassName("conditionTrue") && !fscond)
		{
			obj.remove(); 
		}
		else if (obj.hasClassName("conditionFalse") && fscond)
		{
			obj.remove(); 
		}
	},
	

	fixEmptyFieldsets: function(obj){
		if(obj.down('fieldset')==undefined && obj.down('code.dragEvent')==undefined)
		{
			obj.remove();
		}
	},
	fixConditions: function(){


		
			var fieldsets = $$('fieldset.conditionTrue', 'fieldset.conditionFalse');
			fieldsets.each(this.fixConditionFS.bind(this));
			
			var fieldsets2 = $$('fieldset.storyConstruct');

			fieldsets2.each(this.fixEmptyFieldsets.bind(this));
	
		

	},

	lazything: function(){}
}); 
