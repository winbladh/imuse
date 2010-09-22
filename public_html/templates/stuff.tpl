<form action="editgroup.php?g={$smarty.get.g}" method="post">
<input type="hidden" name="action" value="addusers" />
<input type="hidden" name="update" value="Submit" />
<fieldset>
<legend>Add Users</legend>
<dl>
	<dt><label>Usernames:</label><br/>Add one per line</dt>
	<dd><textarea name="userlist" cols="40" rows="5"></textarea></dd>
</dl>
</fieldset>
{submit_buttons}

</form>


