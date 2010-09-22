{include file="header.tpl" include_imuse="1"}

<h1>List of Stories</h1>

<table>
<tr>
	<th>Name</th>
	<th>Options</th>
</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td><a href="story_view.php?storyid={$results[dcs].id}">{$results[dcs].name}</a></td>
	<td>
		<a href="story_edit.php?storyid={$results[dcs].id}">Edit</a>
		|
		<a href="delete_story.php?storyid={$results[dcs].id}" onclick="return confirm('Are you sure you want to delete this?');">Delete</a>
	</td>
</tr> 
{/section}

</table>

<script>
new iMuseEventLinks(); 
</script>

{include file="footer.tpl"}