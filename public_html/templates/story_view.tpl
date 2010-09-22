{assign var = "is_story_view" value="1"}
{include file="header.tpl" include_imuse=1}

<h1>View Story: {$story_name}</h1>
<br>

{if $submitted_conditions=="1"}

<div style = "position:fixed; top:0; left:0; background-color: #fff; padding:4px;right:0;z-index:9999999;border-bottom:1px solid #000;">
<input type = "button" id = "prev_button" value = "Previous" />
<input type = "button" id = "next_button" value = "Next" />


<input type = "text" size = "3" id = "play_delay" style = "margin-left:5em;" value="3" />
<input type = "button" id = "play_button" value = "Play" />
</div>

<div id = "storyboard">

</div>


<script> 
try
{ldelim}
var imusestory = new iMuseStoryView({$story_json}, {ldelim}
	conditions: {$conditions}
	{rdelim}); 
{rdelim}
catch(e)
{ldelim}
alert("One or more conditions are missing, the story cannot be played or stepped through."); 

{rdelim}
</script> 

{else}
<form action = "story_view.php?storyid={$smarty.get.storyid}" method = "post">
<input type = "hidden" name = "submitted_conditions" value = "1" /> 
<fieldset>
<legend>Conditional Settings</legend>

{section name = "cond" loop = $condlist}

<dl>
	<dt><label>{$condlist[cond]->text}</label></dt>
	<dd>
		<label><input type = "radio" value = "true" checked = "checked" name = "cond[{$condlist[cond]->id}]" />True</label>
		<label><input type = "radio" value = "false" name = "cond[{$condlist[cond]->id}]" />False</label>
	</dd>
</dl>
{/section}
</fieldset>

{submit_buttons}
</form> 


<div id="storyboard">
{$story_html}
</div>


<script>
new iMuseEventLinks();
</script>

{/if}

<td>
<p align = center>
<a href="story_edit.php?storyid={$smarty.get.storyid}">Edit</a>
</p>
</td>

{include file="footer.tpl"}
