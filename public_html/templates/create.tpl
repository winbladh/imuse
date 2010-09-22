{include file="header.tpl" include_imuse = 1}

<h1>Create Domain Concept</h1>
<br>
{if $smarty.post.name}
Username is: {$username}
{/if}

{if $smarty.get.domain=="true"}
<h3>Hooray</h3>
{/if}

<form action="create.php" method="post">
<fieldset>


{if $smarty.get.name}
<dl style="height:4em;">
	<dt><label>Name <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'The name of the domain concept. For example: \'User\'.');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><input type="text" name="name" style="width:400px" value="{$smarty.get.name}"/></dd>
</dl>

{else}

<dl style="height:4em;">
	<dt><label>Name <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'The name of the domain concept. For example: \'User\'.');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><input type="text" name="name" style="width:400px"/></dd>
</dl>

{/if}

<dl>
	<dt><label>Description <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'A description of the domain concept. For example: \'A registered user of the bank\'.');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd><textarea name = "info" style="width:400px" cols="60" rows="5"></textarea></dd>
</dl>
<dl style="height:8em;">	
	<dt><label>Related Domain Concepts <a href="#" 
		onmouseover="helpLinks.showHelp(event, 'A domain concept can be specified to have related domain concepts. For example, the domain concept \'User		\' can be related to \'ATM Card\' and \'Account Number\'.');" 
		onmouseout="helpLinks.hideHelp();">(?)</a></label><br/></dt>
	<dd>
	<select name="add_domainid[]" style="max-height:60px; min-width:200px;" size="4" multiple>{html_options options=$other_domains default=0}
	</select>
	</dd>
</dl>

</fieldset>

{submit_buttons}

</form>

{*<form action="create.php?name={$smarty.get.name}" method="post">*}

<table>
{section name=results loop=$results}
<tr>
<td>{$results[results].id}</td>
<td>{$results[results].name}</td>
</tr>

{sectionelse}

{/section} 

</table>

{include file="footer.tpl"}
