{include file="header.tpl"}

<h1>Create Condition</h1>

<form action="create_condition.php" method="post">  

<fieldset>
<legend>Create New Condition</legend>

<dl>
	<dt><label>Condition</label></dt>
	<dd><textarea name="conditiontext" cols="30" rows="3"></textarea>
</dl>

</fieldset>



{submit_buttons}
</form>

{include file="footer.tpl"}