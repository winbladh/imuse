{assign var="is_story_create" value="1"}
{include file="header.tpl" include_imuse=1}

<style>
{literal}
div#storyboard.sbhover {
	border:1px solid #f00;
}
fieldset.hover {
	border:1px solid #f00;
}

fieldset#test ul {
	margin:0;
	padding:0;
}
fieldset#test ul li {
	margin:0;
	padding:0;
	list-style-type:none;
}

legend span,
legend span a,
legend span a:link,
legend span a:visited {
	color:#666;
	font-weight:normal;
}
legend span {
	padding-left:10px;
}
legend span a {
	margin-right:8px;
}

code.dragEvent span.poslinks {
	float:right;
	display:none;
	font-size:11px;
}
code.dragEvent span.poslinks a {
	margin-right:8px;
}

code.dragEvent:hover span.poslinks {
	display:block;
}

fieldset.conditionTrue,
code.conditionTrue {
	background-color:#33CC66;
}
fieldset.conditionFalse,
code.conditionFalse {
	background-color:#FF6600;
}
fieldset.conditionFalse legend,
fieldset.conditionTrue legend {
	margin-bottom:1em;
}

code.conditionFalse,
code.conditionTrue {
	color:#000;
}

code a {
	font-weight:bold;
}

/* IN THE ADMIN.CSS CHANGE THE LAST LINE TO
div#storyboard fieldset code.dragEvent {
*/
{/literal}
</style>

<h1>Edit Story: {$story_name}</h1>

<form action="story_edit.php?storyid={$smarty.get.storyid}" method="post" id="storyform">
<input type="hidden" name="action" value="create" />
<input type="hidden" id="storyjson" name="storyjson" value="NONE" />

<fieldset>
<legend>Story Information</legend>
<dl>
	<dt><label>Story Name</label></dt>
	<dd><input type="text" name="name" value="{$story_name|escape}" size="40" /></dd>
</dl>
</fieldset>


<code class="storyConstruct" constructname="doInOrder">doInOrder</code>
<code class="storyConstruct" constructname="ifElse">ifElse</code>
<code class="storyConstruct" constructname="while">while</code>
<code class="storyConstruct" constructname="selection">selection</code>
<code class="storyConstruct conditionTrue" constructname="ifConditionTrue">ifConditionTrue</code>
<code class="storyConstruct conditionFalse" constructname="ifConditionFalse">ifConditionFalse</code>
<br/>
<br/>



<div id="storyboard">

</div>


{*
<fieldset id="test">
<legend>BLAH</legend>
<ul id="sortlist">

<li><fieldset><legend class="handle">BLAH2</legend></fieldset></li>
<li><fieldset><legend class="handle">BLAH2</legend>
<ul id="sortlist2">

<li><fieldset><legend class="handle">BLAH2</legend></fieldset></li>
<li><fieldset><legend class="handle">BLAH2</legend></fieldset></li>
<li><code class="handle">BLAH</code></li>


</ul>

</fieldset></li>
<li><code class="handle">BLAH</code></li>


</ul>
</fieldset>*}


<fieldset class="submit-buttons">
<legend>Submit</legend>
<input type="submit" class="button1" value="Submit" id="story_submit" />
</fieldset>

</form>

<script>
$('storyjson').value = Object.toJSON( {$story_json} );
var imusestory = new iMuseStoryCreate();
{*
{literal}
var varslist = {
	tag:'li',
	containment:['sortlist','sortlist2'],
	handle:"handle"
};

Sortable.create('sortlist2',varslist);
Sortable.create('sortlist',varslist);
{/literal}
*}
</script>

{include file="footer.tpl"}

