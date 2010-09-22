{assign var = "is_story_create" value="1"}
{include file="header.tpl" include_imuse=1 protomenu=1}

<style>
<h1>Create a new Story</h1>

{literal}
div#storyboard.sbhover 
{
	border: 1px solid #f00; 
}

fieldset.hover
{
	border: 1px solid #f00; 
}
#content, #page-body {overflow:visible;}
{/literal}
</style>

<form action="story_create.php" method = "post" id = "storyform">
<input type = "hidden" name = "action" value = "create" />
<input type = "hidden" id="storyjson" name = "storyjson" value = "NONE" /> 
<input type = "hidden" id="submitType" name = "submitType" value = "Submit" /> 

<fieldset>
	<legend>Story Information</legend>
		<dl>
			<dt><label>Story Name</label></dt>
			<dd><input type = "text" name = "name" value = "" size = "40" /></dd>
		</dl>
</fieldset>

<fieldset>
<legend>Draggable Control Structures</legend>
<!-- the draggable labels above story area-->
<!--
<code class = "storyConstruct" constructname = "doInOrder">doInOrder</code>
<code class = "storyConstruct" constructname = "ifElse">checkCondition</code>
<code class = "storyConstruct" constructname = "while">while</code>
<code class = "storyConstruct" constructname = "selection">selection</code>
-->
<code id="sc_doInOrder" class = "storyConstruct" constructname = "doInOrder">doInOrder</code>
<code id="sc_ifElse" class = "storyConstruct" constructname = "ifElse">checkCondition</code>
<code id="sc_while" class = "storyConstruct" constructname = "while">while</code>
<code id="sc_selection" class = "storyConstruct" constructname = "selection">selection</code>


</fieldset>

<br>

<fieldset>
<legend>Story</legend>
<div id = "storyboard">

</div>
</fieldset>

<fieldset class = "submit-buttons"> 

<input type = "submit" class = "button1" value = "Save" id = "story_save" /> 
<input type = "submit" class = "button1" value = "Submit" id = "story_submit" /> 

</fieldset>


</form>

<script>
$('storyjson').value = Object.toJSON({$default_story_json}); 
var imusestory = new iMuseStoryCreate(); 

{literal}
//dropInFieldset: function(elm, fs, event)
var myMenuItems = [
{
	name: 'add doInOrder',
	className: 'edit', 
	callback: function(cmobj){imusestory.dropInFieldset($('sc_doInOrder'),cmobj.target,null);}
},
{
	name: 'add ifElse',
	className: 'edit', 
	callback: function(cmobj){imusestory.dropInFieldset($('sc_ifElse'),cmobj.target,null);}
},
{
	name: 'add while',
	className: 'edit', 
	callback: function(cmobj){imusestory.dropInFieldset($('sc_while'),cmobj.target,null);}
},
{
	name: 'add selection',
	className: 'edit', 
	callback: function(cmobj){imusestory.dropInFieldset($('sc_selection'),cmobj.target,null);}
},
{
	name: 'add event',
	className: 'quickAddEvent', 
	callback: function(cmobj){
		document.constructinfo=cmobj;
		
		document.storyobj=imusestory;
			
		var popup = window.open('/'+g_projecturl+'/story_event_create_popup.php', "story_event", 'width=400, height=500, resizable=yes, 		scrollbars=yes');}
},
{
	name: 'Copy',
	className: 'copy', 
	callback: function() {
	alert('Copy function called');
}
},
{
	name: 'Delete', 
	disabled: true,
	className: 'delete'
},
{
	separator: true
},
{
	name: 'Save',
	className: 'save',
	callback: function() 
	{
	alert('Saving...');
	}
}
];
new Proto.Menu({
  selector: '#storyboard', // context menu will be shown when element with id of "contextArea" is clicked
  className: 'menu desktop', // this is a class which will be attached to menu container (used for css styling)
  menuItems: myMenuItems // array of menu items
});
{/literal}


</script> 

{include file="footer.tpl"}
