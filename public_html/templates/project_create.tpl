{include file="header.tpl"}

<h1>Create Project</h1>

<form action="project_create.php" method="post">

<fieldset>
<!--legend>Create New Project</legend-->

<dl>
	<dt><label>Name</label></dt>
	<dd><input type="text" name="name" value="" /></dd>
</dl>

<dl>
	<dt><label>Description</label></dt>
	<dd><textarea name="info" cols="50" rows="4"></textarea>
	</dd>
</dl>

<dl>
	<dt><label>Folder Name</label></dt>
	<dd><input type="text" name="domainname" value="" /></dd>
	</dd>
</dl>

</fieldset>

{submit_buttons}
</form>

{include file="footer.tpl"}
