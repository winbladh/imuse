<?php
include "includes.php"; 

function redirect($url)
{
	header("Location: $url"); 
	die("Redirecting..."); 
}

function parse_event_info($info)
{
	if(preg_match_all("/\[(.+?)\|(.+?)\]/m", $info, $matches)>0)
	{
		foreach($matches[1] as $key=>$value)
		{
			$domainconcept = $matches[2][$key]; 
			$text = $value; 
			$domainid = find_domain_concept($domainconcept); 
			if($domainid)
			{
			if($domainid > 0)
			{
				$replace = "<a dcname=\"$domainconcept\" dcid=\"$domainid\" class=\"dclink\" href=\"view_domain_info.php?domainid=$domainid\">$text</a>"; 
				$info = str_replace("[$text|$domainconcept]", $replace, $info);
			}
			}
			else
			{
				$replace = "<a style = \"color:red\" href=\"create.php?name=".urlencode($domainconcept)."\">$text</a>"; 
				
				$info = str_replace("[$text|$domainconcept]", $replace, $info); 
			}
		}
	}
	
	return $info;
}

function find_domain_concept($text)
{
	global $DB, $PROJECTID; 
	
	/*$DB->query("SELECT domainid FROM domain_concept WHERE name='$text' LIMIT 0, 1"); */
	$DB->query("SELECT domainid FROM domain_concept WHERE name='$text' AND projectid='$PROJECTID' LIMIT 0, 1");
	if ($DB->get_num_rows())
	{
		list($domainid) = $DB->fetch_row(); 
		return $domainid; 
	}
	else 
	{
		return 0; 
	}
}

?>
