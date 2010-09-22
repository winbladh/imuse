{include file="header.tpl" include_imuse="1"}

<div id = "popup_domain" style = "position: absolute; display:none;"></div>
<table>
<tr>
	<th><a href="event_list.php?">Name</a></th>
	<th><a href="event_list.php?sortby=frequency">Frequency</a></th>
	<th>Description</th>
	<th>Related Stories</th>
	<th>Options</th>
</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td>
		<a href="view_event_info.php?eventid={$results[dcs].id}">{$results[dcs].name}</a>
	</td>
	<td>
		{$results[dcs].frequency}
	</td>
	<td>{$results[dcs].info|nl2br}</td>
	<td nowrap=nowrap>
		{foreach from=$results[dcs].related_stories item=story}
			<a href="story_view.php?storyid={$story.story_id}">{$story.story_name}</a><br>
		{/foreach}
	</td>
	<td nowrap = nowrap>
		<a href="event_edit.php?eventid={$results[dcs].id}">Edit</a>
		|
		<a href="delete_event.php?eventid={$results[dcs].id}" onclick="return confirm('Are you sure you want to delete this?');">Delete</a>
	</td>
</tr> 
{/section}

</table>

<script>
new iMuseEventLinks(); 
</script>

{include file="footer.tpl"}