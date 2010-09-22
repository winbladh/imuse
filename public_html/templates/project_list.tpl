{include file="header.tpl" }

<div id = "popup_domain" style = "position: absolute; display:none;"></div>
<table>
<tr>
	<th>Name</th>
	<th>Info</th>
	<th>Options</th>

</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td>
		<a href="/{$results[dcs].domainname}/">{$results[dcs].name}
	</td>
	<td>{$results[dcs].info|nl2br}</td>
	<td>
		<a href="project_edit.php?projectid={$results[dcs].id}">Edit</a>
		|
		<a href="project_delete.php?projectid={$results[dcs].id}" onclick="return confirm('Are you sure you want to delete this?');">Delete</a>
	</td>
</tr> 
{/section}

</table>



{include file="footer.tpl"}