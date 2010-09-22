<?php
include "includes.php";

function look_for_event($story, $eventids)
{
	foreach($story->children as $child)
	{
		if(is_object($child))
		{
			return look_for_event($child, $eventids);
		}
		else if($child == $eventids)
		{
			return true;
		}
	}

	return false;	

}

$DB->query("SELECT eventid,name,info 
			FROM events
			WHERE projectid='$PROJECTID'
			ORDER BY name ASC"); 

if ($DB->get_num_rows())
{
	$data = $DB->fetch_assoc(); 
	$results = array(); 
	
	foreach($data as $row)
	{
		list($id, $name, $info) = $row; 
		
			
		$DB->query("SELECT storyid, storyjson, name
		FROM stories 
		WHERE projectid = '$PROJECTID'"); 
		
		$related_stories = array();
		
		if($DB->get_num_rows())
		{
			$data2 = $DB->fetch_assoc();
			
			foreach($data2 as $row2)
			{
				list($story_id, $storyJSON, $story_name) = $row2;
				
				$story = json_decode(base64_decode($storyJSON));
				
				
					if(look_for_event($story, $id))
					{
						$related_stories[] = array(
						'story_id'=>$story_id,
						'story_name'=>$story_name
						);
					}

			}

		}
		
		$results[] = array(
		'id'=>$id,
		'frequency'=>count($related_stories),
		'name'=>$name,
		'info'=>parse_event_info($info),
		'story_id'=>$story_id,
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

$TPL->display("event_list.tpl"); 
?>
