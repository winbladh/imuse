{include file="header.tpl"}

<h1>Project Info</h1>

{if $smarty.get.edit=="1"}
<form action="index.php" method="post">
<textarea name="projectinfo" rows=8 cols=50>{$projectinfo}</textarea>

{submit_buttons}

</form>
{else}
<p>
{$projectinfo|nl2br}
</p>

<!--p><a href="?edit=1">edit this page</a></p-->
{/if}


{include file="footer.tpl"}
