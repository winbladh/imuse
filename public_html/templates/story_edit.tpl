{assign var="is_story_create" value="1"}
{include file="header.tpl" include_imuse=1 protomenu=1}

<style>
{literal}
#page-body, #content { overflow: visible; } 
{/literal}

</style>

<h1>Edit Story: {$story_name}</h1>
<br/>
<br/>

<form action="story_edit.php?storyid={$smarty.get.storyid}" method="post" id="storyform">
<input type="hidden" name="action" value="create" />
<input type="hidden" id="storyjson" name="storyjson" value="NONE"/>
<input type = "hidden" id="submitType" name = "submitType" value = "Submit" /> 

<br/>
<br/>

<fieldset>
<legend>Story Information
</legend>

<dl>
	<dt><label>Story Name</label></dt>
	<dd><input type="text" name="name" value="{$story_name|escape}" size="40" /></dd>
</dl>

</fieldset>

<code id="sc_selection" class="storyConstruct" constructname="doInOrder">doInOrder</code>
<code id="sc_ifElse" class="storyConstruct" constructname="ifElse">checkCondition</code>
<code id="sc_while" class="storyConstruct" constructname="while">while</code>
<code id="sc_selection" class="storyConstruct" constructname="selection">selection</code>
<!--
<code id="sc_selection" class="storyConstruct" constructname="doInOrder">doInOrder</code>
<code id="sc_ifElse" class="storyConstruct" constructname="ifElse">ifElse</code>
<code id="sc_while" class="storyConstruct" constructname="while">while</code>
<code id="sc_selection" class="storyConstruct" constructname="selection">selection</code>
-->

<div id="storyboard">

</div>

<fieldset class="submit-buttons">

<input type = "submit" class = "button1" value = "Save" id = "story_save" /> 
<input type = "submit" class = "button1" value = "Submit" id = "story_submit" /> 
</fieldset>

</form>

<script>
$('storyjson').value = Object.toJSON({$story_json});
var imusestory = new iMuseStoryCreate({$condlist_json});

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
		if(cmobj.target.hasClassName("dragEvent"))
		{
			alert("Sorry, you can't add an event to an event.");
		}
		else
		{
			document.constructinfo=cmobj;
			document.storyobj=imusestory;
			var popup = window.open('/'+g_projecturl+'/story_event_create_popup.php', "story_event", 'width=400, height=500, resizable=yes,scrollbars=yes');
		}
	}
},
,
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
callback: function() {
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
