{include file="header.tpl"}

<h1>Event: {$event_name}</h1>

<form action="event_edit.php" method="get">
<input type="hidden" name="eventid" value="{$smarty.get.eventid}" />

<fieldset>

<dl>
	<dt><label>Name</label></dt>
	<dd>{$event_name}</dd>
</dl>

<dl>
	<dt><label>Description</label></dt>
	<dd>{$event_info}</textarea>
	</dd>
</dl>

{if $event_hasimage==1}
<dl>
	<dt><label>Picture</label></dt>
	<dd>
	<img src = "/image_uploads/event_{$smarty.get.eventid}.jpg" style = "max-width: 300px;" />
	</dd>
</dl>

<td>
<p align = center>
<a href="event_edit.php?eventid={$smarty.get.eventid}">Edit</a>
</p>
</td>

{else}
<dl>
	<dt><label>Picture</label></dt>
	<dd>No picture has been associated with this event yet.</dd>
</dl>

<td>
<p align = center>
<a href="event_edit.php?eventid={$smarty.get.eventid}">Edit</a>
</p>
</td>

{/if}

</fieldset>

{submit_buttons}
</form>

{include file="footer.tpl"}
