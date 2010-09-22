{assign var="is_story_create" value="1"}
{include file="header.tpl"}

<style>
{literal}

fieldset.dropon {

}
div#storyboard fieldset.hover {
	border:1px solid #f00;
}
div#storyboard fieldset code {
	display:block;
	margin-top:3px;
	font-size:11px;
}

{/literal}
</style>

Add:
<code class="storyConstruct" constructname="doInOrder">doInOrder</code>
<code class="storyConstruct" constructname="ifElse">ifElse</code>
<code class="storyConstruct" constructname="while">while</code>
<code class="storyConstruct" constructname="selection">selection</code>


<div id="storyboard">
</div>


<fieldset class="submit-buttons">
<legend>Submit</legend>
<input type="submit" class="button1" value="Submit" id="story_submit" />
</fieldset>

<script>
{literal}
var imusedrag = new iMuseDrag();
{/literal}
</script>


{include file="footer.tpl"}
