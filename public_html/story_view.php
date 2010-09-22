<?php
include "includes.php"; 

$storyid = $_GET['storyid']; 

$DB->query("SELECT name, storyjson FROM stories WHERE storyid = '$storyid' AND projectid = '$PROJECTID' LIMIT 0, 1"); 
if(!$DB->get_num_rows())
{
	die("FAILURE"); 
}

list($sname, $sjson) = $DB->fetch_row(); 

$TPL->assign("story_name", $sname); 
$TPL->assign("story_json", base64_decode($sjson)); 

if($_POST['submitted_conditions']==1 || $_GET['bypass'] == 1)
{

	$TPL->assign("submitted_conditions", "1");
	
	$conditions = array(); 
	
	$DB->query("SELECT conditionid, conditiontext 
				FROM conditions 
				WHERE projectid = '$PROJECTID'
				ORDER BY conditionid DESC"); 

	if($DB->get_num_rows())
	{
		$fcond = array(); 
		$rows = $DB->fetch_assoc(); 
		foreach($rows as $res)
		{
			$obj = new stdClass(); 
			list($obj->id, $obj->text) = $res; 
			$obj->value = "false"; 
			if(isset($_POST['cond'][$obj->id]) && $_POST['cond'][$obj->id]=="true")
			{
				$obj->value = "true"; 
			}
			$conditions[] = $obj; 
		}
	}

	$TPL->assign("conditions", json_encode($conditions)); 
}
else
{
	$conditions = array(); 

	function get_conditions($obj)
	{
		global $conditions; 
	
		if(isset($obj->condition) && $obj->condition)
		{
			$conditions[] = $obj->condition; 
		}
	
		if(isset($obj->children))
		{	
			foreach($obj->children as $child)
			{
				if(is_object($child))
				{
					get_conditions($child); 
				}
			}
		}
	}

	get_conditions(json_decode(base64_decode($sjson))); 

	$condlist = array(); 

	foreach($conditions as $cond)
	{
		if(preg_match_all("/\bC([0-9]+)\b/", $cond, $match) > 0)
		{
			foreach($match[1] as $m) 
			{
				$condlist[] = $m; 
			}
		}
	}

	$condlist = array_unique($condlist); 
	//print_r($condlist); 
	$where = "0"; 
	
	if(count($condlist)>0)
	{
		$where = "conditionid IN (".implode(",",$condlist).")"; 
	}
	else
	{
		redirect("story_view.php?storyid=$storyid&bypass=1");
	}
	
	$condreplace = array(array(),array());

	$DB->query("SELECT conditionid, conditiontext 
				FROM conditions 
				WHERE $where AND
				projectid = '$PROJECTID'
				ORDER BY conditionid ASC"); 

	if($DB->get_num_rows())
	{
		$fcond = array(); 
		$rows = $DB->fetch_assoc(); 
		foreach($rows as $res)
		{
			$obj = new stdClass(); 
			list($obj->id, $obj->text) = $res; 
			$fcond[] = $obj; 
			
			$condreplace[0][] = "C".$obj->id;
			$condreplace[1][] = $obj->text;

		}
		$TPL->assign("condlist", $fcond); 
	}	


	$events = array();
	$DB->query("SELECT eventid, info FROM events");
	if($DB->get_num_rows())
	{
		$rows = $DB->fetch_assoc();
		foreach($rows as $res)
		{
			list($eid,$einfo) = $res;
			$events[$eid] = $einfo;
		}
	}

	$storyjson = json_decode(base64_decode($sjson));

	function recurse_story($obj)
	{
		global $condreplace, $events;
		$class = "";
		if($obj->name=="ifConditionTrue"){$class="conditionTrue storyConstruct";$constructname="ifConditionTrue";}
		elseif($obj->name=="ifConditionFalse"){$class="conditionFalse";}
		elseif($obj->name=="doInOrder"){$class="doInOrder";}
		elseif($obj->name=="while"){$class="while";}
/*		elseif($obj->name=="ifElse"){$class="ifElse";}*/
		elseif($obj->name=="ifElse"){$class="ifElse";$obj->name="checkCondition";}
		
		echo "<fieldset class=\"storyConstruct $class\">";
		echo "<legend>{$obj->name}";
		if(strlen($obj->condition)>0)
		{
			$condition = str_replace($condreplace[0], $condreplace[1], $obj->condition);
			if($obj->name=="ifConditionTrue"){
			
			echo "<span><code class\"constructcondition\">{$condition}</code></span> is true";
			}
			else if($obj->name=="ifConditionFalse"){
			echo "<span><code class\"constructcondition\">{$condition}</code></span> is false";
			}
			else{
				echo "<span><code class=\"constructcondition\">{$condition}</code></span>";
			}
		}
		echo "</legend>";

		if(isset($obj->children) && count($obj->children)>0)
		{
			foreach($obj->children as $child)
			{
				if(is_object($child))
				{
					if($obj->name=="checkCondition"){
						$child->condition = $obj->condition;
					}
					recurse_story($child);
				}
				else
				{
					echo "<code class=\"dragEvent\">".parse_event_info($events[$child])."</code>";
				}
			}
		}

		echo "</fieldset>";
	}


	ob_start();

	recurse_story($storyjson);
	
	$story_html = ob_get_clean();


	$TPL->assign("story_html", $story_html);


}

//$TPL->assign("submitted_conditions", "1"); 

$TPL->display("story_view.tpl"); 

?>
