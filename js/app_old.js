function TodoCtrl($scope) {
            $scope.total = function () {
                return $scope.x + $scope.y;
            };

        }

var level_count = 0;
var present_level = 0;
var level_stack = [];
var structure = {}
var LEVEL_KEY_PREFIX = 'lvl_';
var VAR_NAME_PREFIX = 'var_';

function createVars(lid){
	present_level = lid;
	level_key = LEVEL_KEY_PREFIX+present_level
	if (structure.hasOwnProperty(level_key)){
		var_struct = {
			name: LEVEL_KEY_PREFIX+present_level+"_var_"+structure[level_key]['meta']['var_count'],
			value: 0.0,
			rels: []
		};
		structure[level_key]['vars'].push(var_struct);
		structure[level_key]['meta']['var_count'] = structure[level_key]['meta']['var_count'] + 1;
	}else{
		structure[level_key] = {};
		structure[level_key]['vars'] = [];
		structure[level_key]['meta'] = {
			var_count: 0
		};
		var_struct = {
			name: LEVEL_KEY_PREFIX+present_level+"_var_"+structure[level_key]['meta']['var_count'],
			value: 0.0,
			rels: []
		};
		structure[level_key]['vars'].push(var_struct);
		structure[level_key]['meta']['var_count'] = structure[level_key]['meta']['var_count'] + 1;
	}
	return var_struct['name'];
}

function setLevelId(lid){
	present_level = lid;
}

function setVariableOption(optObj, lid){
	if ($(optObj).val() == 'new'){ // Creating new varibles
		console.log("new");
		tbname = createVars(lid);
		$(optObj).replaceWith("<input type='text' id='"+tbname+"' />")
	}else{
		console.log('Choose existing');
		$(optObj).replaceWith("<span>"+$(optObj).val()+"<input type='hidden' value='"+$(optObj).val()+"'/></span>")
		//console.log();
	}
}


//Can be made smaller
function addVariablesAtLevel(lid){
	present_level = lid;
	level_key = LEVEL_KEY_PREFIX+present_level	
	if (present_level == 0 && jQuery.isEmptyObject(structure) == true) { //First level first variable
		createVars(lid);
		inner_html = $("#lvl_"+lid+"_vars_n_rels").html()
		final_html = inner_html + "<br /><input type='text' id='"+structure[level_key]['vars'][0]['name']+"' />" + getRelationsAtLevel(lid, 0);
		$("#lvl_"+lid+"_vars_n_rels").html(final_html);
		$("#lvl_"+lid+"_varbut").hide();
		//$("#lvl_"+lid+"_relbut").show();

	}else{
		inner_html = $("#lvl_"+lid+"_vars_n_rels").html();
		addl_html = "<select onchange='setVariableOption(this, "+present_level+");'> \
					<option value='ch'>Choose</option> \
					<option value='new'>New Variable</option>";
		x = 0;
		for (level in structure){
			//console.log(level);
			if (x >= lid){
				continue;
			}
			for (v in structure[level]['vars']){
				addl_html = addl_html + "<option value='"+structure[level]['vars'][v]['value']+"'>"+structure[level]['vars'][v]['name']+"</option>";
			}
			x++;
		}
		try{
			vid = (	structure[level_key]['vars'].length) ? (structure[level_key]['vars'].length) : 0;
		}catch(e){
			vid = 0
		}
		addl_html = addl_html + "</select>" + getRelationsAtLevel(lid, vid);
		//final_html = inner_html + addl_html;
		$("#lvl_"+lid+"_vars_n_rels").append(addl_html);
		$("#lvl_"+lid+"_varbut").hide();
	}
}

function setRelation(rel_drp_obj, lid, vid){
	$(rel_drp_obj).replaceWith("<span>"+$(rel_drp_obj).val()+"</span>")
	$("#lvl_"+lid+"_varbut").show();
	//$("#lvl_"+lid+"_relafter_"+vid).hide();
}

function getRelationsAtLevel(lid, vid){
	present_level = lid;
	html = "<select id='lvl_"+lid+"_relafter_"+vid+"' onchange='setRelation(this, "+lid+", "+vid+")'> \
			<option value=''>Choose</option> \
			<option value='+'>+</option> \
			<option value='-'>-</option> \
			<option value='/'>/</option> \
			<option value='*'>*</option> </select>";
	return html;
}

function addLevel(){
	//existing_html = $("#main-container").html();
	html = '<br /><div id="lvl_'+level_count+'" class="border-class" onclick="setLevelId('+level_count+')"> \
				Create variables here \
				<button class="btn btn-primary btn-mini" id="lvl_'+level_count+'_varbut" onclick="addVariablesAtLevel('+level_count+')">Add Variables</button> \
				<button class="btn btn-primary btn-mini" id="lvl_'+level_count+'_relbut" style="display:none;" onclick="addRelationsAtLevel('+level_count+')">Add Relations</button> \
				<div id="lvl_'+level_count+'_vars_n_rels"></div> \
				</div>'
	level_count = level_count + 1;
	level_stack.push(html)
	//final_html = level_stack.join("\n");
	$("#main-container").append(html)
}

function removeLevel(){
	// level_stack.pop()
	// level_count = level_count - 1;
	// level_key = LEVEL_KEY_PREFIX+level_count
	// if (structure.hasOwnProperty(level_key)){
	// 	delete structure[level_key]
	// }
	// final_html = level_stack.join("\n");
	// $("#main-container").html(final_html)
}