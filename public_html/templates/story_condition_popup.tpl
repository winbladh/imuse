<html>

<head>
<link href="/static/css/admin.css" rel="stylesheet" type="text/css" media="screen" />
<link href="/static/css/editcondition.css" rel = "stylesheet" type = "text/css" media = "screen" />

<script src="http://www.google.com/jsapi"></script>
<script>
var g_projecturl = '{$PROJECTURL}';
google.load("prototype", "1");
</script>

<script type = "text/javascript" src="/static/js/edit_condition.js"></script>

<script> 
var opener = window.opener; 
</script>
<title>Edit Story Condition</title>
</head>
<body>

<div style="text-align: center">
<h1>Edit Conditions</h1>
	
</div>

<table cellspacing="0" cellpadding="4">
<tr>
	<td valign="top" width="400" style="border-right: 2px solid #000;">
<!--			Quick Add
	<br>
	<input type="text" id="quickadd" size="40" />
	
	<input type = "button" value = "Add To Story" id = "quicksubmit" />
	<br><br><br>
-->	
	

	
	Enter the ID of the condition(s) you wish to use (separate multiple conditions with AND or OR):
	<br>
	<textarea id = "conditionentry" rows = "10" cols = "50"></textarea>
	
	
	<div id = "conditionparsed"></div>

	<br>
	<input type = "button" value = "Add To Story" id = "save_button" /> 
	<input type = "button" value = "Cancel" onclick="window.close() ;" /> 

</div> 


	</td>

<td>



Condition List:
<div style="float:right"><input type = "button" id = "editbutton" value = "Edit Conditions" /> </div>
<div id="conditiondiv" style="height: 300px; overflow-y: scroll; margin-top: 1em; margin-bottom: 1em;">
Loading...
</div>


<div id = "formextras"> 
New condition: <input type="text" id="new_condition" size="40" /><input type="button" value="Add to list" id = "addcbutton" />
<br>
</div>
<br></br></br>


<div id = "editextras" style = "display:none;">
	<input type = "button" value = "Cancel" id = "editc_cancel" /> 
	<input type = "button" value = "Save Changes" id = "editc_save" /> 
</div>

</td>
</tr>
</table>

<script>
	var editcond = new EditCondition(window.opener.document.constructinfo); 
</script>

</body>
</html> 
