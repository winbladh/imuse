<html>
<head>
<link href="/static/css/admin.css" rel="stylesheet" type="text/css" media="screen" />
<script src="http://www.google.com/jsapi"></script>
<script>
	var g_projecturl = '{$PROJECTURL}';
	google.load("prototype", "1");
</script>

<script type = "text/javascript" src="/static/js/quickAdd.js"></script>

<script> 
	var opener = window.opener; 
	//console.log(opener.document.constructinfo); 
</script>

<title>Quick Add Event</title>
</head>
<body>

<p align = "center">Quick Add Event</center>

<fieldset>
<dl>
	<dt><label>Name</label></dt><br/>
	<dd><input id="quickEventName" type="text" name="name" value=""/></dd>
</dl>
<br/>
<dl>
	<dt><label>Description</label></dt>
	<dd><textarea id="quickEventInfo" name="info" cols="25" rows="4" align="left"></textarea></dd>	
</dl>
<br>
<br>
<dl> 
	<input type = "button" value = "Save" id = "save_button"/> 
	<input type = "button" value = "Cancel" onclick="window.close() ;" /> 
</dl> 
</fieldset>

<script>
	var quickAddObj = new quickAdd(window.opener.document.constructinfo, window.opener.document.storyobj); 
</script>

</body>
</html>