{include file="header.tpl"}

<form action="view_domain_info.php" method="post">
<input type="hidden" name="domainid" value="{$domain_id}" />

<h1>Domain Concept: {$domain_name}</h1>

<fieldset>

<dl style="height:4em;">
	<dt><label>Name <a href="#" onmouseover="$('nametext').toggle();return false;" onmouseout="$('nametext').toggle();return false;">(?)</a></label><br/><span id="nametext" style="display:none;">The name of the domain concept. For example: 'User'.</span></dt>
	<dd>{$domain_name}</dd>
</dl>
	
<dl>
	<dt><label>Description <a href="#" onmouseover="$('infotext').toggle();return false;" onmouseout="$('infotext').toggle();return false;">(?)</a></label><br/><span id="infotext" style="display:none;">A description of the domain concept. For example: 'A registered user of the bank.'</span></dt>
	<dd>{$domain_info}</dd>
</dl>
<dl style="height:8em;">	
	<dt><label>Related Domain Concepts <a href="#" onmouseover="$('reltext').toggle();return false;" onmouseout="$('reltext').toggle();return false;">(?)</a></label><br/><span id="reltext" style="display:none;">A domain concept can be specified to have related domain concepts. For example, the domain concept 'User' can be related to 'ATM Card' and 'Account Number'.</span></dt>	<dd>
		{section name=related loop=$related_domains}
		
		<a href="view_domain_info.php?domainid={$related_domains[related].id}">{$related_domains[related].name}</a>
		<br/>
		
		{sectionelse}
		No related domains
		<br>
		{/section}	
	</dd>
	<br>

</dl>

</fieldset>

<p align = center>
<a href="edit_domain_concept.php?domainid={$domain_id}">Edit</a>
</p>

</form>

{include file="footer.tpl"}