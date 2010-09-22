{include file="header.tpl"}

<form action="edit_domain_concept.php" method="post">
<input type="hidden" name="action" value="submit" />
<input type="hidden" name="domainid" value="{$domain_id}" />

<h1>Edit Domain Concept: {$domain_name}</h1>

<fieldset>

<dl style="height:4em;">
	<dt><label>Name <a href="#" onmouseover="$('nametext').toggle();return false;" onmouseout="$('nametext').toggle();return false;">(?)</a></label><br/><span id="nametext" style="display:none;">The name of the domain concept. For example: 'User'.</span></dt>
	<dd><input type="text" name="name" style="width:400px" value="{$domain_name}"/></dd>
</dl>
	
<dl>
	<dt><label>Description <a href="#" onmouseover="$('infotext').toggle();return false;" onmouseout="$('infotext').toggle();return false;">(?)</a></label><br/><span id="infotext" style="display:none;">A description of the domain concept. For example: 'A registered user of the bank.'</span></dt>
	<dd><textarea name = "info" style="width:400px" cols="60" rows="5">{$domain_info}</textarea></dd>
</dl>

<dl style="height:8em;">
<dt><label>Related Domain Concepts <a href="#" onmouseover="$('reltext').toggle();return false;" onmouseout="$('reltext').toggle();return false;">(?)</a></label><br/><span id="reltext" style="display:none;">A domain concept can be specified to have related domain concepts. For example, the domain concept 'User' can be related to 'ATM Card' and 'Account Number'.</span></dt>
	<dd>
		{section name=related loop=$related_domains}
		
		{$related_domains[related].name}
		(<input type="checkbox" name="delrel[]" value="{$related_domains[related].id}" />Delete)
		<br/>
		
		{sectionelse}
		No related domains
		<br>
		{/section}
		
		<b>Add RelationID:</b> {html_options name="add_domainid" options=$other_domains default=0}
	
	</dd>
</dl>

</fieldset>

{submit_buttons}

</form>

{include file="footer.tpl"}
