var quickAdd = Class.create({},{

	initialize: function(openerthings, storyobj){
		this.opener = openerthings; 
		this.story = storyobj;
		
		this.eventName = $('quickEventName'); 
		this.eventInfo = $('quickEventInfo'); 
					
		$('save_button').observe('click', this.clickSaveButton.bindAsEventListener(this)); 
		
	},
	
	clickSaveButton: function(){
	
		if(this.eventName.value.length == 0)
		{
			alert("NEED A NAME FIX IT");
			
			return;
		}
		
		if(this.eventInfo.value.length == 0)
		{
			alert("NEED INFO FIX IT");
			
			return;
		}
		
		new Ajax.Request('/' + g_projecturl + '/create_event.php', {
			method: 'post',
			postBody: 'ajax=1&name='+encodeURIComponent(this.eventName.value) + '&info='+encodeURIComponent(this.eventInfo.value),
			onSuccess: this.saveCallback.bind(this)
		});		
	},
	
	saveCallback: function(resp){
		var eventobj = resp.responseJSON;
	
		this.story.eventhash.set(""+eventobj.eventid, eventobj);
		
		var eventObj = new Element('code').writeAttribute('eventid', eventobj.eventid).addClassName('dragEvent');
		
		this.story.dropInFieldset(eventObj,this.opener.target,null);
		
		window.close();
	},
			
	imLazy: function(){
	}

}); 