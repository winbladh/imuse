var iMuseDrag = Class.create({},{

	initialize: function(){
		this.eventlist = null;
		
		this.storyConstructs = new Hash();
		
		this.storyboard = $('storyboard');
		
		
		
		this.droppables = new Array();
		
		this.eventhash = new Hash();
		
		this.loadStoryConstructs();
		this.loadEvents();
		
		$('story_submit').observe('click',this.generateStoryJson.bindAsEventListener(this));
		
	},
	
	loadStory: function(storyid){
		new Ajax.Request('/ajax_getstory.php?sid='+storyid,{
			method:'get',
			onSuccess: this.loadStoryCallback.bind(this)
		});
	},
	loadStoryCallback: function(resp){
		this.loadStoryFromObject(resp.responseJSON);
	},
	
	loadStoryFromObject: function(obj){
		//console.log(obj);
		this.storyboard.update(this.setupStoryArray(obj));
	},
	
	setupStoryArray: function(sobj){
		console.log("test", sobj);
		
		var field = new Element('fieldset');
		field.writeAttribute("constructname", sobj.name);
		field.insert(new Element('legend').update(sobj.name));
		
		console.log(sobj.childElms);
		for(var i=0;i<sobj.childElms.length;i++)
		{
			console.log(sobj.childElms[i]);
			if(Object.isNumber(sobj.childElms[i]) || Object.isString(sobj.childElms[i]))
			{
				//console.log("IS NUM", sobj.childElms[i], this.eventhash.get(""+sobj.childElms[i]));
				var eventdata = this.eventhash.get(""+sobj.childElms[i]);
				var temp = new Element('code').update(eventdata.name);
				temp.writeAttribute("eventid", eventdata.id);
				temp.writeAttribute("eventinfo", eventdata.info);
				temp.addClassName("dragEvent");

				
				field.insert(temp);
			}
			else
			{
				//console.log("IS OBJECT");
				field.insert(this.setupStoryArray(sobj.childElms[i]));
			}
		}
		
		
		this.droppables.push(field);
		Droppables.add(field,{
			accept:["dragEvent","storyConstruct"],
			hoverclass: "hover"
		});
		
		return field;
		
	},
	
	
	
	loadStoryConstructs: function(){
		$$('.storyConstruct').each(this.loadStoryConstruct.bind(this));
	},
	
	loadStoryConstruct: function(storyCon){
	
		var temp = new Draggable(storyCon,{
			revert: true,
			ghosting: true
		});
	
		this.storyConstructs.set(storyCon.readAttribute("constructname"), temp );
		console.log(storyCon);
	},
	
	loadEvents: function(){
		new Ajax.Request('/ajax_getevents.php',{
			method:'get',
			onSuccess: this.loadEventsCallback.bind(this)
		});
	},
	loadEventsCallback: function(resp){
		this.eventlist = resp.responseJSON;
		
		var sidebar = $('sidenavbar');
		
		for(var i=0;i<this.eventlist.length;i++)
		{
			this.eventhash.set(""+this.eventlist[i].id, this.eventlist[i]);
		
			var temp = new Element('code').update(this.eventlist[i].name);
			temp.writeAttribute("eventid", this.eventlist[i].id);
			temp.writeAttribute("eventinfo", this.eventlist[i].info);
			temp.addClassName("dragEvent");
			
			sidebar.insert(new Element('li').update(
				new Element('span').update(temp)
			));
			new Draggable(temp,{
				revert: true,
				ghosting: true
			});
		}
		
		console.log(this.eventlist);
		
		this.loadStory(1);
	},
	
	generateStoryJson: function(){
		var obj = this.generateStoryJsonFieldset(this.storyboard.childElements()[0]);
		console.log(obj);
	},
	
	generateStoryJsonFieldset: function(fsobj){
		var tempObj = new Object();
		tempObj.name = fsobj.readAttribute("constructname");
		tempObj.childElms = Array();
		
		var childs = fsobj.childElements();
		
		for(var i=0;i<childs.length;i++)
		{
			if(childs[i].tagName=="FIELDSET")
			{
				tempObj.childElms.push( this.generateStoryJsonFieldset(childs[i]) );
			}
			else if(childs[i].tagName=="CODE")
			{
				tempObj.childElms.push( childs[i].readAttribute("eventid") );
			}
		}
		
		return tempObj;
		
	}

});