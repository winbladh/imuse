{include file="header.tpl"}

<div id = "popup_domain" style = "position: absolute; display:none;"></div>
<table>
<tr>
	<th>Condition</th>
	<th>Options</th>
</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td>
		{$results[dcs].conditiontext}
	</td>
	<td>
		<a href="edit_condition.php?conditionid={$results[dcs].conditionid}">Edit</a>
		|
		<a href="delete_condition.php?conditionid={$results[dcs].conditionid}" onclick="return confirm('Are you sure you want to delete this?');">Delete</a>
	</td>
</tr> 
{/section}

</table>

{include file="footer.tpl"}