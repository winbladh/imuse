<?php

include "includes.php";

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
?>
