<?php


// Config Files


// Included Files
include_once "/phplib/mysql.php";

include_once "../classes/functions.php";

//$dbname = "imuseweb_".str_ireplace(".imuseweb.ucicalico.com","",$_SERVER['HTTP_HOST']);
$dbname = "imuseweb_dev";//.str_ireplace(".imuseweb.ucicalico.com","",$_SERVER['HTTP_HOST']);

if($_SERVER['HTTP_HOST']=="imuse.ece.udel.edu/imuse-home")
{
	$dbname = "imuseweb_live";
}

$DB = new DBMySQL($dbname, "reqeng", "iMuseWebRE10");

// Smarty Setup
include_once "/phplib/Smarty/Smarty.class.php";
//include_once "/phplib/Smarty-3dev/Smarty.class.php";

$TPL = new Smarty();
$TPL->caching = 0;
$TPL->force_compile = 1;
$TPL->template_dir = $_SERVER['DOCUMENT_ROOT']."/templates/";
$TPL->compile_dir = $_SERVER['HOME']."/smarty_imuse/templates_c/";
$TPL->config_dir = $_SERVER['HOME']."/smarty_imuse/config/";
$TPL->cache_dir = $_SERVER['HOME']."/smarty_imuse/cache/";
$TPL->plugins_dir[] = $_SERVER['HOME']."/imuseweb/plugins/";

$TPL->assign("tpldir", $_SERVER['DOCUMENT_ROOT']."/templates/");



$TPL->assign("g_datefmt",array(
	'mdY'=>"%m/%d/%Y",
	'full'=>"%b %e %Y at %l:%M %p",
));


$domain = $_GET['projecturl'];//$_SERVER['HTTP_HOST'];
$DB->query("SELECT projectid,name,domainname FROM projects WHERE domainname='$domain' LIMIT 0,1");
if(!$DB->get_num_rows())
{
	//Wrong project
	//header("Location: landing_page.php"); 
	//die();
	
	$DB->query("SELECT projectid,name,info,domainname 
			FROM projects
			ORDER BY name ASC"); 

if ($DB->get_num_rows())
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	
	foreach($data as $row)
	{
		list($id, $name, $info, $domain) = $row; 
		$results[] = array(
		'id'=>$id,
		'name'=>$name,
		'info'=>$info,
		'domainname'=>$domain
		);
	}
	
	$TPL->assign("results", $results); 
}
	$TPL->display("landing_page.tpl"); 
	die();

}
list($PROJECTID,$PROJECTNAME,$PROJECTURL) = $DB->fetch_row();

global $PROJECTID;
global $PROJECTURL;

$TPL->assign("PROJECTURL",$PROJECTURL);
$TPL->assign("PROJECTNAME",$PROJECTNAME);

// Global Settings
$DB->query("SELECT domainid,name,info
            FROM domain_concept
			WHERE projectid='$PROJECTID'
            ORDER BY name ASC");

if ($DB->get_num_rows())
{
    $data = $DB->fetch_assoc();
    $domainResults = array();

    foreach($data as $row)
    {
        list($id, $name, $info) = $row;
        $domainResults[] = array(
        'id'=>$id,
        'name'=>$name,
        'info'=>$info,
        );
    }

    $TPL->assign("domainResults", $domainResults);
}

$DB->query("SELECT eventid,info,name
            FROM events
			WHERE projectid='$PROJECTID'
            ORDER BY name ASC");

if ($DB->get_num_rows())
{
    $data1 = $DB->fetch_assoc();
    $sb_events = array();

    foreach($data1 as $row)
    {
        list($id, $info, $name) = $row;
        $sb_events[] = array(
        'id'=>$id,
        'info'=>$info,
        'name'=>$name,
        );
    }

    $TPL->assign("sb_events", $sb_events);
}

$DB->query("SELECT storyid,name
            FROM stories
			WHERE projectid='$PROJECTID'
            ORDER BY name ASC");

if ($DB->get_num_rows())
{
    $storiesData = $DB->fetch_assoc();
    $storiesArray = array();

    foreach($storiesData as $row)
    {
        list($id, $name) = $row;
        $storiesArray[] = array(
        'id'=>$id,
        'name'=>$name,
        );
    }

    $TPL->assign("storiesArray", $storiesArray);
}

$DB->query("SELECT conditionid,conditiontext
            FROM conditions
			WHERE projectid='$PROJECTID'
            ORDER BY conditiontext ASC");

if ($DB->get_num_rows())
{
   	$conditionData = $DB->fetch_assoc();
    $conditionArray = array();

    foreach($conditionData as $row)
    {
        list($id, $text) = $row;
        $conditionArray[] = array(
        'id'=>$id,
        'text'=>$text
        );
    }

    $TPL->assign("conditionArray", $conditionArray);
}

?>
