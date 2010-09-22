<?php
include "includes.php"; 


$event_frequency = array();
$domain_frequency = array();

function look_for_event($story, $eventids)
{
	global $frequency;
	

	foreach($story->children as $child)
	{
		if(is_object($child))
		{
			return look_for_event($child, $eventids);
		}
		else if($child == $eventids)
		{
			$event_frequency[$child]++;
			return true;
		}
		else
		{
			$event_frequency[$child]++;
		}
	}

	return false;	

}

// list contents of the database
$DB->query("SELECT domainid,name,info 
	FROM domain_concept
	WHERE projectid='$PROJECTID'
	ORDER BY name ASC"); 
	
	$results = array();
 
	
	
if ($DB->get_num_rows())
{

	$data = $DB->fetch_assoc(); 
	
	foreach($data as $row)
	{
		list($id, $name, $info) = $row; 
		
		$DB->query("SELECT r.related_domainid, d.name
		FROM domain_concept_relations r 
		LEFT JOIN domain_concept d ON (d.domainid=r.related_domainid)
		WHERE r.domainid='$id'
		ORDER BY d.name ASC"); 
		 
		$related_domain = array();
		
		if($DB->get_num_rows())
		{
			$data2 = $DB->fetch_assoc(); 
			
			foreach($data2 as $Drow)
			{
				list($Did, $Dname) = $Drow; 
				$related_domain[] = array(
				'id'=>$Did,
				'name'=>$Dname,
				);
			}
			
		}
		
		$DB->query("SELECT eventid, name
		FROM events
		WHERE projectid = '$PROJECTID'
		AND info LIKE '%|$name]%'
		ORDER BY name ASC"); 
		
		$related_events = array(); 
		
		if($DB->get_num_rows())
		{
			$data2 = $DB->fetch_assoc(); 
			
			
			
			foreach($data2 as $Drow)
			{
				list($Did, $Dname) = $Drow; 
				
				$domain_frequency[$id]++;
				
				$related_events[] = array(
				'id'=>$Did,
				'name'=>$Dname,
				);
			}
			
		}	
				
		$related_stories = array();
		$related_storyid_list = array();
		
		if(count($related_events) > 0)
		{
		
		$DB->query("SELECT storyid, storyjson, name
		FROM stories 
		WHERE projectid = '$PROJECTID'"); 
		
		
		if($DB->get_num_rows())
		{
			$data2 = $DB->fetch_assoc(); 
			
			foreach($data2 as $Drow)
			{
				list($Did, $storyJSON, $Dname) = $Drow; 
				
				$story = json_decode(base64_decode($storyJSON));
				
				
				foreach($related_events as $relevents)
				{
					if(look_for_event($story, $relevents['id']))
					{
						if(!in_array($Did, $related_storyid_list))
						{
						$related_stories[] = array(
						'id'=>$Did,
						'name'=>$Dname,
						);
						$related_storyid_list[] = $Did;					
					}
					}
				}
			
			}
			
		}	
		
		
		}
		
		$results[] = array(
		'id'=>$id,
		'frequency'=>count($related_stories),
		'name'=>$name,
		'info'=>$info,
		'related_domain'=>$related_domain,
		'related_events'=>$related_events,
		'related_stories'=>$related_stories
		);
		
		$frequency_sort[] = count($related_stories);
		
		
	}
	
	if($_GET["sortby"]=="frequency")
		{
			array_multisort($frequency_sort, SORT_DESC, $results);
		}
	
	$TPL->assign("results", $results); 
}

$TPL->display("view_domain_concepts.tpl"); 
?>

