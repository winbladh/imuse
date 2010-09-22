{include file="header.tpl"}

<h1>Choose Your Project:</h1>


<div id = "popup_domain" style = "position: absolute; display:none;"></div>
<table>
<tr>
	<th>Name</th>
	<th>Info</th>
</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td>
		<a href="/{$results[dcs].domainname}/">{$results[dcs].name}
	</td>
	<td>{$results[dcs].info|nl2br}</td>
</tr> 
{/section}

</table>

{*Hides the side-menu*}
<script>
switch_menu();
</script>

{include file="footer.tpl"}