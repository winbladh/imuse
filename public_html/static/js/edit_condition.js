var EditCondition = Class.create({

	initialize: function(openerthings){
		this.opener = openerthings; 
		
		this.conddiv = $('conditiondiv'); 
		
		this.conditionlist = [
		
			]; 
		
		this.condparse = $('conditionparsed'); 
		this.condtext = $('conditionentry'); 
		
		this.condtext.observe('keyup', this.onEntryKeyUp.bindAsEventListener(this)); 
		
		$('addcbutton').observe('click', this.addCondition.bindAsEventListener(this)); 
		
		this.loadConditions(); 
		
		this.isEditMode = false; 
		this.isFirstLoad = true; 
		
		$('editbutton').observe('click', this.editConditionsEvent.bindAsEventListener(this)); 
		
		$('editc_cancel').observe('click', this.editConditionsEvent.bindAsEventListener(this)); 
		$('editc_save').observe('click', this.saveConditionChanges.bindAsEventListener(this)); 
		
		$('save_button').observe('click', this.clickSaveButton.bindAsEventListener(this)); 
		
		//$('quicksubmit').observe('click', this.quickAdd.bindAsEventListener(this)); 

	},
	
	clickSaveButton: function(){
		
		var temptext = this.condtext.value.toUpperCase();
		var temptext2 = this.condtext.value.toUpperCase(); 
		
		var condtemp = this.condtext.value.toUpperCase(); 
		
		temptext = temptext.gsub('AND','<b>AND</b>'); 
		temptext = temptext.gsub('OR','<b>OR</b>'); 
		
		condtemp = condtemp.gsub('AND', '&&'); 
		condtemp = condtemp.gsub('OR', '||'); 
		
		
		for(var i = this.conditionlist.length-1; i>=0; i--)
		{
			temptext = temptext.gsub('C'+this.conditionlist[i].id, this.conditionlist[i].text); 
			condtemp = condtemp.gsub('C'+this.conditionlist[i].id, 'true'); 
		}
		
		try
		{
			var temp = eval(condtemp); 
			this.opener.storyobj.setConditionFromPopup({
				'condExpression':temptext2, 
				'condText':temptext, 
				'element':this.opener.element 
			}); 
			window.close();
		}
		catch(excep)
		{
			alert("There are still errors in your condition."); 
		}
	},
	
	saveCondCallback: function(resp){
		this.editConditionsEvent(); 
		this.loadConditions(); 	
	},
	
	saveCondFailure: function(resp){
		alert(resp.responseText); 
	},
	
	saveConditionChanges: function(){
		var newConds = new Hash(); 
		var tlist = []; 
		
		var cblist = $$('input.condtb'); 
		if(cblist.length>0)
		{
			for(var i = 0; i < cblist.length; i++)
			{
				var delcond = $('condcb'+cblist[i].readAttribute("condid")).checked ? 1 : 0; 
				tlist.push({
					id: cblist[i].readAttribute("condid"), 
					text: cblist[i].value, 
					delete: delcond
				});
				//console.log("delete "+cblist[i].readAttribute("condid")+" = "+delcond); 
			}
			
			new Ajax.Request('/'+g_projecturl+'/ajax_save_conditions.php', {
				method: 'post', 
				postBody: 'condlist='+encodeURIComponent(tlist.toJSON()),
				onSuccess: this.saveCondCallback.bind(this), 
				onFailure: this.saveCondFailure.bind(this) 
			});
		}
		
		//console.log("condlist=" + encodeURIComponent(tlist.toJSON())); 
	},
	
	editConditionsEvent: function(){
		this.isEditMode = !this.isEditMode; 
		
		if(this.isEditMode)
		{
			$('formextras').hide(); 
			$('editextras').show(); 
		}
		else
		{
			$('formextras').show(); 
			$('editextras').hide(); 
		}
		this.setupConditionDiv(); 
	},
	
	loadConditions: function(){
		new Ajax.Request('/'+g_projecturl+'/ajax_conditions.php',{
		method: 'get', 
		onSuccess: this.loadConditionsCallback.bind(this)
		}); 
		
	},
	
	loadConditionsCallback: function(resp){
		this.conditionlist = resp.responseJSON.conditions;
		this.opener.storyobj.condlist = this.conditionlist;
		this.setupConditionDiv(); 
		
		if(this.isFirstLoad)
		{
			this.isFirstLoad = false; 
			this.condtext.value = this.opener.curCondition; 
			this.onEntryKeyUp(null); 
		}
	},
	
	onEntryKeyUp: function(event){
	
		if(this.isEditMode)
		{
			return; 
		}
		var temptext = this.condtext.value.toUpperCase(); 
		
		var condtemp = this.condtext.value.toUpperCase(); 
		
		temptext = temptext.gsub('AND','<b>AND</b>'); 
		temptext = temptext.gsub('OR','<b>OR</b>'); 
		
		condtemp = condtemp.gsub('AND', '&&'); 
		condtemp = condtemp.gsub('OR', '||'); 
		
		
		for(var i = this.conditionlist.length-1; i>=0; i--)
		{
			temptext = temptext.gsub('C'+this.conditionlist[i].id, this.conditionlist[i].text); 
			condtemp = condtemp.gsub('C'+this.conditionlist[i].id, 'true'); 
		}
		
		this.condparse.update(temptext); 
		this.condparse.insert(new Element('br')); 
		this.condparse.insert(new Element('br')); 
		
		try
		{
			var temp = eval(condtemp);  
			
			//this.condparse.insert(condtemp+" = <b>"+temp+"</b>"); 
		}
		catch(excep)
		{
			this.condparse.insert(new Element('b').update("ERROR: " + excep)); 
		}
	},
	
	addConditionCallback: function(resp){
		$('new_condition').value = ""; 
		this.loadConditions(); 
	},
	
	addConditionFailure: function(resp){
		if($('new_condition').value =="Adding...")
		{
			$('new_condition').value = ""; 
		}
		alert(resp.responseText); 
	},
	
	addCondition: function(event){
		var condtext = $('new_condition').value; 
		$('new_condition').value = "Adding..."; 
	
		new Ajax.Request('/'+g_projecturl+'/ajax_add_condition.php?condtext='+encodeURIComponent(condtext), {
			method: 'get', 
			onSuccess: this.addConditionCallback.bind(this), 
			onFailure: this.addConditionFailure.bind(this)
		});
	},
	
	quickAdd: function(event){
		var condtext = $('quickadd').value; 
		$('quickadd').value = "Adding..."; 
	
		new Ajax.Request('/'+g_projecturl+'/ajax_add_condition.php?condtext='+encodeURIComponent(condtext), {
			method: 'get', 
			onSuccess: this.quickAddCallback.bind(this), 
			onFailure: this.addConditionFailure.bind(this)
		}); 
	},
	
	quickAddCallback: function(resp){
	
		var condition = resp.responseJSON;
		

		var temp = {
				'condExpression':"C"+condition.conditionid, 
				'condText':condition.conditiontext, 
				'element':this.opener.element 
			};
			this.opener.storyobj.setConditionFromPopup(temp); 
			window.close();
	
	},
	
	makeConditionSelect: function(){
		var elm = new Element('select', {'name':"condition[]"}); 
		
		for(var i = 0; i<this.conditionlist.length; i++)
		{
			elm.insert(new Element('option', {'value':this.conditionlist[i].id}).update(this.conditionlist[i].text)); 
		}
		return elm; 
	},
	
	makeOperands: function(){
		var elm = new Element('select', {}); 
		elm.insert(new Element('option', {value: "AND"}).update("AND")); 
		elm.insert(new Element('option', {value: "OR"}).update("OR")); 
		
		return elm; 
	},
	
	clickOnAnd: function(event){
		event.stop(); 
		
	},
	
	clickAddNew: function(event){
		event.stop(); 
		
		Event.element(event).remove(); 
		
		this.makeConditionSelection(); 
	},
	
	makeConditionSelection: function(){
	
		var div = new Element('div'); 
		div.setStyle({
			'whiteSpace':"nowrap"
		});
		
		div.insert(this.makeConditionSelect()); 
		div.insert(this.makeOperands()); 
		
		var button = new Element('input', {'type':'button', 'value':"New"}); 
		button.observe('click', this.clickAddNew.bindAsEventListener(this)); 
		div.insert(button); 
		
		this.conddiv.insert(div); 
	},
	
	changeConditionValue: function(event){
		this.onEntryKeyUp(event); 
	},
	
	makeConditionValueSelect: function(conditionid){
		var temp = new Element('select', {'id':'condval'+conditionid}); 
		
		temp.insert(new Element('option', {'value':'true'}).update('true')); 
		temp.insert(new Element('option', {'value':'false'}).update('false')); 	
		
		temp.observe('change', this.changeConditionValue.bindAsEventListener(this)); 
		
		return temp; 
	},
	
	setupConditionDiv: function(){
		this.conddiv.update(); 
		
		var table = new Element('table').addClassName("condlist"); 
	
		var trow = new Element('tr'); 
		trow.insert(new Element('th').update("ID"))
		trow.insert(new Element('th').update("Condition"))
		if(this.isEditMode)
		{
			trow.insert(new Element('th').update("Delete")); 
		}
		table.insert(trow); 

		
		for(var i = 0; i < this.conditionlist.length; i++)
		{	
			var temprow = new Element('tr'); 
			temprow.insert(new Element('th').addClassName("condth").update("C" + this.conditionlist[i].id)); 
			
			if(this.isEditMode)
			{
			 	temprow.insert(new Element('td').update(
			 		new Element('input', {
			 			'type':'text', 
			 			'size' : '50', 
			 			'value':this.conditionlist[i].text
			 		}).addClassName("condtb").writeAttribute("condid", this.conditionlist[i].id)
			 	));
			 	
			 	temprow.insert(new Element('td').update(
			 		new Element('input', {
			 			'type':'checkbox', 
			 			'id':'condcb'+this.conditionlist[i].id, 
			 			'value':'1'
			 		}) 
			 	)); 
			}
			else
			{
			 	temprow.insert(new Element('td').update(this.conditionlist[i].text)); 
			}
			 
			 table.insert(temprow); 
		}
		
		this.conddiv.update(table); 
		//this.makeConditionSelection();
	},
	
	imLazy: function(){}

},{}); 
