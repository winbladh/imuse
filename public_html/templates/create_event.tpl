{include file="header.tpl" include_imuse = 1}

<h1>Create Event</h1>

<form action="create_event.php" method="post" enctype = "multipart/form-data">

<fieldset>
<!--legend>Create Event</legend-->

<dl>
	<dt><label>Name <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'The short name of the event that can be used to reference the event in stories. For example: \'Login\'');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><input type="text" name="name" style="width:400px"/></dd>
</dl>

<dl>
	<dt><label>Description <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'The sentence describing the event. This is the text that will show up in a story when an event is being used. For example: \'The user enters login information\'. You can associate a word in the sentence with a domain concept so that it appears highlighted in the event text. Hovering over a highlighted word will show a description of the word. Associations are specified as follows: [user|User]. The first word \'user\' is a word that will appear highlighted, and the second word \'User\' is a specified domain concept. To get a reminder of defined domain concepts click the link \'View Domain Concepts\' on the left panel. ');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><textarea name="info" cols="50" rows="12"></textarea></dd>
</dl>

<dl>
	<dt><label>Picture <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'A file, such as a diagram or screenshot can be associated with the event. This diagram can show up with the event during playback of the stories that contain the event.');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><input type="file" name="file"/></dd>
</dl>

</fieldset>

{submit_buttons}
</form>

{include file="footer.tpl"}