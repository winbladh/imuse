<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-gb" xml:lang="en-gb">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<meta http-equiv="Content-Language" content="en-gb" />
<meta http-equiv="imagetoolbar" content="no" />

{*
<link rel="icon" type="image/vnd.microsoft.icon" href="favicon.ico" />
<link rel="SHORTCUT ICON" href="favicon.ico"/>
*}

<title>{$g_page_title|default:'iMuse Web'}</title>

<link href="/static/css/admin.css" rel="stylesheet" type="text/css" media="screen" />
<script src="http://www.google.com/jsapi"></script>
<script>

var g_projecturl = '{$PROJECTURL}';

google.load("prototype", "1");
google.load("scriptaculous", "1");
google.load("swfobject", "2.2");
</script>


	<script src="/static/js/imuse.js?yar=1" type="text/javascript"></script>



{if $is_story_create=="1"}
	<script src="/static/js/imuse_story_create.js?yar=1" type="text/javascript"></script>
{/if}

{if $is_story_view=="1"}
	<script src="/static/js/imuse_story_view.js?yar=1" type="text/javascript"></script>
{/if}

{if $protomenu=="1"}
	<script src="/static/js/proto.menu.0.6.js?yar=1" type="text/javascript"></script>
<link href="/static/css/proto.menu.0.6.css" rel="stylesheet" type="text/css" media="screen" />
{/if}


{literal}
<script type="text/javascript">
// <![CDATA[
var jump_page = 'Enter the page number you wish to go to:';
var on_page = '';
var per_page = '';
var base_url = '';

var menu_state = 'shown';


/**
* Jump to page
*/
function jumpto()
{
	var page = prompt(jump_page, on_page);

	if (page !== null && !isNaN(page) && page == Math.floor(page) && page > 0)
	{
		if (base_url.indexOf('?') == -1)
		{
			document.location.href = base_url + '?start=' + ((page - 1) * per_page);
		}
		else
		{
			document.location.href = base_url.replace(/&amp;/g, '&') + '&start=' + ((page - 1) * per_page);
		}
	}
}

/**
* Set display of page element
* s[-1,0,1] = hide,toggle display,show
*/
function dE(n, s, type)
{
	if (!type)
	{
		type = 'block';
	}

	var e = document.getElementById(n);
	if (!s)
	{
		s = (e.style.display == '') ? -1 : 1;
	}
	e.style.display = (s == 1) ? type : 'none';
}

/**
* Mark/unmark checkboxes
* id = ID of parent container, name = name prefix, state = state [true/false]
*/
function marklist(id, name, state)
{
	var parent = document.getElementById(id);
	if (!parent)
	{
		eval('parent = document.' + id);
	}

	if (!parent)
	{
		return;
	}

	var rb = parent.getElementsByTagName('input');
	
	for (var r = 0; r < rb.length; r++)
	{
		if (rb[r].name.substr(0, name.length) == name)
		{
			rb[r].checked = state;
		}
	}
}

/**
* Find a member
*/
function find_username(url)
{
	popup(url, 760, 570, '_usersearch');
	return false;
}

/**
* Window popup
*/
function popup(url, width, height, name)
{
	if (!name)
	{
		name = '_popup';
	}

	window.open(url.replace(/&amp;/g, '&'), name, 'height=' + height + ',resizable=yes,scrollbars=yes, width=' + width);
	return false;
}

/**
* Hiding/Showing the side menu
*/
function switch_menu()
{
	var menu = document.getElementById('menu');
	var main = document.getElementById('main');
	var toggle = document.getElementById('toggle');
	var handle = document.getElementById('toggle-handle');

	switch (menu_state)
	{
		// hide
		case 'shown':
			main.style.width = '93%';
			menu_state = 'hidden';
			menu.style.display = 'none';
			toggle.style.width = '20px';
			handle.style.backgroundImage = 'url(/static/images/toggle.gif)';
			handle.style.backgroundRepeat = 'no-repeat';
			handle.style.backgroundPosition = '100% 50%';
			toggle.style.left = '0';
			break;

		// show
		case 'hidden':
			main.style.width = '76%';
			menu_state = 'shown';
			menu.style.display = 'block';
			toggle.style.width = '5%';
			handle.style.backgroundImage = 'url(/static/images/toggle.gif)';
			handle.style.backgroundRepeat = 'no-repeat';
			handle.style.backgroundPosition = '0% 50%';
			toggle.style.left = '15%';
			break;
	}
}


function showhide_events()
{
	var evdiv = $('sb_events');

	evdiv.toggle();
	
	if(evdiv.visible())
	{
		evdiv.setStyle({
			'position':'fixed',
			'top':'20px',
			'left':'20px',
			'width':'200px',
			'backgroundColor':'#fff',
			'zIndex':'9999'
		});
	}
}



// ]]>
</script>
<style>
div#sb_events {
	border:1px solid #000;
}
div#sb_events ul {
	margin-left:1px;
}
div#sb_events li {
	list-style-type:none;
	margin-left:0px;
}
div#sb_events a.closebutton {
	float:right;
	clear:left;
	font-size:10px;
}
</style>

{/literal}

{if $smarty.server.HTTP_HOST=="imuse.ucicalico.com"}
<script type="text/javascript">
document.write(unescape("%3C")+"script src='"+(document.location.protocol=="https:"?"https://":"http://")+"clixpy.com/clixpy.js?user=5594"+unescape("%26")+"r="+Math.round(Math.random()*10000)+"' type='text/javascript'"+unescape("%3E%3C")+"/script"+unescape("%3E"));
</script>
{/if}
</head>

<body class="ltr">
{if $include_imuse == "1"}
<div id = "popup_domain" style = "position:absolute; display: none;"></div>
{/if}

<div id="sb_events" style="display:none; height:300px; overflow:scroll;">
<a href="#" class="closebutton" onclick="showhide_events();return false;">Close</a><br/>
<ul>
{section name=sb_events loop=$sb_events}
<li>
<a href="view_event_info.php?eventid={$sb_events[sb_events].id}" 
onmouseover="helpLinks.showHelp(event, '{$sb_events[sb_events].info}');"
onmouseout="helpLinks.hideHelp();"
onclick="return false;"><span class="dragEvent" eventid="{$sb_events[sb_events].id}">{$sb_events[sb_events].name}</span></a>



</li>
{/section}
</ul>
</div>


<div id="wrap">
	<div id="page-header">
			<h1>iMuse Website({$PROJECTNAME})
			</h1>
		<p>
		{*<a href="./index.php?sid=5108c7db6b4a749bb66f144194c52fa9">Admin index</a> &bull; <a href="#">Some Link</a></p>*}
		<p id="skip"><a href="#acp">Skip to content</a></p>
	</div>
	
	<div id="page-body">
		<div id="tabs">
			<ul>
				<li id="activetab"><a href=""><span>Home</span></a></li>
				{*<li><a href=""><span>Another Tab</span></a></li>*}
				{* This is the top header navbar buttons *}
				{section name=g_navtabs loop=$g_navtabs}
				{if $g_navtabs[g_navtabs].name==$g_params.g_active_tab}<li id="activetab">{else}<li>{/if}
				<a href="{$g_navtabs[g_navtabs].url}"><span>{$g_navtabs[g_navtabs].name}</span></a>
				</li>
				{/section}
			</ul>
		</div>

		<div id="acp">
		<div class="panel">
			<span class="corners-top"><span></span></span>
				<div id="content">
					 
					<div id="toggle">
						<a id="toggle-handle" accesskey="m" title="Hide or display the side menu" onclick="switch_menu(); return false;" href="#"></a></div>
						<div id="menu">
						<p>You are logged in as:<br />
						<strong>root</strong><br/>
						[&nbsp;<a href="#" onclick="alert('We\'ll bother with authentication later on');">Logout</a>&nbsp;]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
						
						<ul id = "sidebarnav">
<li class="header">Projects</li>
<li><a href="project_create.php"><span>Create Project</span></a></li>
<li><a href="project_list.php"><span>Manage Projects</span></a></li>

<li class="header">Domains</li>
<li><a href="create.php"><span>Create Domain Concept</span></a></li>
<li><a href="view_domain_concepts.php"><span>Manage Domain Concepts</span></a></li>
<li><a href="#" onclick="$('domainmenu').toggle();return false;"><span>View Domain Concepts</span></a>


<ol id="domainmenu" style="display:none; height:200px; overflow:scroll;">
{section name=domainSection loop=$domainResults}
<li>
<a href="view_domain_info.php?domainid={$domainResults[domainSection].id}"><span>{$domainResults[domainSection].name}</span></a>
</li>
{/section}
</ol>
</li>

<li class="header">Events</li>
<li><a href="create_event.php"><span>Create Event</span></a></li>
<li><a href="event_list.php"><span>Manage Events</span></a></li>
<li><a href="#" onclick="showhide_events();return false;"><span>View Events</span></a></li>


<li class="header">Stories</li>
<li><a href="story_create.php"><span>Create Story</span></a></li>
<li><a href="story_list.php"><span>Manage Stories</span></a></li>
<li><a href="#" onclick="$('storiesmenu').toggle();return false;"><span>View Stories</span></a>

<ul id="storiesmenu" style="display:none; height:200px; overflow:scroll;">
{section name=storiesSection loop=$storiesArray}
<li>
<a href="story_view.php?storyid={$storiesArray[storiesSection].id}"><span>{$storiesArray[storiesSection].name}</span></a>
</li>
{/section}
</ul>
</li>

<li class="header">Conditions</li>
<li><a href="create_condition.php"><span>Create Condition</span></li>
<li><a href="condition_list.php"><span>Manage Conditions</span></a></li>
<li><a href="#" onclick="$('conditionmenu').toggle();return false;"><span>View Conditions</span></a>

<ul id="conditionmenu" style="display:none; height:200px; overflow:scroll;">
{section name=conditionSection loop=$conditionArray}
<li>
<span>{$conditionArray[conditionSection].text}</span>
</li>
{/section}
</ul>
</li>

	
{foreach from=$g_sidenav item=gsn}
{if is_array($gsn)}
<li{if $gsn.2 || $gsn.1==$smarty.server.REQUEST_URI} id="activemenu"{/if}><a href="{$gsn.1}"><span>{$gsn.0}</span></a></li>
{else}
<li class="header">{$gsn}</li>
{/if}
{/foreach}
</ul>

					</div>
	
					<div id="main">
<a name="maincontent"></a>

