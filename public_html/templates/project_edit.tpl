{include file="header.tpl"}

<h1>Edit Project: {$project_name}</h1>

<form action="project_edit.php?projectid={$smarty.get.projectid}" method="post">

<fieldset>

<dl>
	<dt><label>Name</label></dt>
	<dd><input type="text" name="name" value="{$project_name}"</dd>
</dl>

<dl>
	<dt><label>Description</label></dt>
	<dd><textarea name="info" cols="50" rows="4">{$project_info}</textarea>
	</dd>
</dl>

<dl>
	<dt><label>Folder Name</label></dt>
	<dd><input type="text" name="domainname" value="{$project_domainname}"</dd>
</dl>


</fieldset>

{submit_buttons}
</form>

{include file="footer.tpl"}