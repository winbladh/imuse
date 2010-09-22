{include file="header.tpl"}

<h1>Edit Condition</h1>

<form action="edit_condition.php?conditionid={$smarty.get.conditionid}" method="post">

<fieldset>
<legend>Edit Condition</legend>

<dl>
	<dt><label>Condition</label></dt>
	<dd><textarea name="conditiontext" cols="30" rows="3">{$condition_conditiontext}</textarea></dd>
</dl>

</fieldset>

{submit_buttons}
</form>

{include file="footer.tpl"}