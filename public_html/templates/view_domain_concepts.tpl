{include file="header.tpl"}

<table>
<tr>
	<th><a href="view_domain_concepts.php?sortby=name">Name</a></th>
	<th><a href="view_domain_concepts.php?sortby=frequency">Frequency</a></th>
	<th>Description</th>	
	<th>Related Domains</th>
	<th>Referencing Events</th>
	<th>Referencing Stories</th>
	<th>Options</th>
</tr>

{section name=dcs loop=$results}
<tr class="{cycle values="row1, row2"}">
	<td>
		<a href="view_domain_info.php?domainid={$results[dcs].id}">{$results[dcs].name}</a>
	</td>
	<td>
		{$results[dcs].frequency}
	</td>
	<td>{$results[dcs].info}</td>
	<td nowrap=nowrap>
		{foreach from=$results[dcs].related_domain item=domain}
				<a href="view_domain_info.php?domainid={$domain.id}">{$domain.name}</a><br>

		{/foreach}
	</td>
	<td nowrap=nowrap>
		{foreach from=$results[dcs].related_events item=event}
			<a href="view_event_info.php?eventid={$event.id}">{$event.name}</a><br>
		{/foreach}
	
	</td>
	<td nowrap=nowrap>
		{foreach from=$results[dcs].related_stories item=story}
			<a href="story_view.php?storyid={$story.id}">{$story.name}</a><br>
		{/foreach}
	</td>
	<td nowrap=nowrap>
		<a href="edit_domain_concept.php?domainid={$results[dcs].id}">Edit</a>
		|
		<a href="delete_domain_concept.php?domainid={$results[dcs].id}" onclick="return confirm('Are you sure you want to delete 		this?');">Delete</a>
	</td>
</tr> 
{/section}

</table>

{include file="footer.tpl"}