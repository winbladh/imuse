var iMuseStoryView = Class.create({}, {

	initialize: function(storyObject)
	{
		this.eventlist = null; 
		this.storyConstructs = new Hash(); 
		this.droppables = new Array(); 
		this.eventhash = new Hash(); 
		
		this.loadStoryConstructs(); 
		this.loadEvents(); 
		
		this.storyboard = $('storyboard'); 	
		
		this.eventLinks = new iMuseEventLinks(); 
			
		this.storyData = storyObject; 
		
		this.loadStoryFromObject(storyObject); 
		
		$('next_button').observe('click', this.stepThroughStory.bindAsEventListener(this)); 
		
		this.currentElement = this.storyboard.down('code.dragEvent, fieldset'); 
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
	
	loadStoryCallback: function(resp)
	{
		this.storyData = resp.responseJSON; 
		this.loadStoryFromObject(resp.responseJSON); 
	},
	
	loadStoryFromObject: function(obj)
	{
		this.storyboard.update(this.setupStoryArray(obj)); 
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
		var idname = "fieldset_"+Math.floor(Math.random()*110);
		
		var temp = new Element ('fieldset'); 
		temp.writeAttribute("constructname", obj.name);
		
		var legend = new Element('legend').update(obj.name);  
		
		if (obj.name == "ifConditionTrue")
		{
			temp.addClassName("conditionTrue"); 
		}
		else if (obj.name == "ifConditionFalse")
		{
			temp.addClassName("conditionFalse"); 
		}
		
		legend.insert(" "); 
		var legendspan = new Element('span'); 
	
		if(obj.name != "ifConditionTrue" && obj.name != "ifConditionFalse")
		{ 
			if(obj.condition!=undefined && obj.condition!="")
			{
				legendspan.insert(new Element('code').addClassName("constructcondition").update(obj.condition));
				temp.writeAttribute("constructcondition", obj.condition); 
			}
		}
		
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
			ghosting: true
			}); 
			
	}, 
	
	loadEvents: function()
	{
		new Ajax.Request('/ajax_getevents.php',{
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
	
	stepThroughStory: function(){
		var nextelm = this.currentElement.next('fieldset, code.dragEvent'); 
		nextelm.
		this.currentElement.addClassName("currentelm"); 
		
	},
	
	lazything: function(){}
}); 