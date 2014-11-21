var myApp = angular.module('myApp', []);

myApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

myApp.directive('ngModelOnblur',function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});

myApp.directive('numbersOnly', function(){
    return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input.
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return ''
           var transformedInput = inputValue.replace(/[^0-9+.]/g, '');
           if (transformedInput!=inputValue) {
              $(element).val(transformedInput);
           }

           return transformedInput;
       });
     }
   };
});

var ordered_node_val_map = {}

myApp.factory('Network', function(){
	var Network = {};
	Network.vars = network_vars;
    Network.img_file = network_img_file;
  	Network.name = network_name;
  	Network.generalInfo = network_general_info;

	for (i in Network.vars){
		ordered_node_val_map[Network.vars[i]['viewname']] = Network.vars[i]['value'];
	}
	//console.log(ordered_node_val_map);
	return Network;
})

function inputsBeforeNode(inputs, topology, present_node){
	var inp1_before = false
	var inp2_before = false
	for (node_name in topology){
		if (node_name == inputs[0]){
			inp1_before = true;
		}
		if (node_name == inputs[1]){
			inp2_before = true;
		}
		if (node_name == present_node){
			if(inp1_before == false || inp2_before == false){
				return false;
			}else{
				return true;
			}
		}
	}
	return true
}

// function that returns the array of node values for the kth link of the node named node_name
function getLinkInputValsArray(network_vars, node_name, k) {
    var links_list = network_vars[node_name]['links'][k]['inputs']
    var input_vals = []
    for (ll in links_list) {
        input_vals[ll] = parseFloat(network_vars[links_list[ll]]['value'])
    }
    return input_vals
}

// Function taking care of changing a node_name's value in the right places
// in network vars, slider, textbox, ordered_node_val_map, (etc.?)
function changeNodeValue($scope, node_name, new_value) {
    var node_vars = $scope.netwrkVars.vars[node_name]
    var node_obj = $('[name="' + node_vars['viewname'] + '"]')
    node_vars['value'] = new_value  // to the netwrkVars
    ordered_node_val_map[node_name] = new_value;  // changing the value in the original js object
    $("#node"+(node_obj.attr('id')).slice(1)).slider("value", node_vars['value']);  // changing the value in the slider
    node_obj.val(new_value);  //  changing the value of the text box
}

function networkCtrl($scope, Network) {
    $scope.netwrkVars = Network;

    $scope.$on('test', function(ngRepeatFinishedEvent) {
        // n 1
    var cnt = 1;
    for(i in Network.vars){
    	 $("#node"+cnt).slider({
	        range: "min",
			step: Network.vars[i]['step'],
	        value: Network.vars[i]['value'],
	        min: Network.vars[i]['minvalue'],
	        max: Network.vars[i]['maxvalue'],
	        slide: function (event, ui) {
                //console.log(ui.value);
	            idtemp = $(this).attr('id');
	            node_name = $(this).data('role');
                //console.log(node_name);
	            $scope.netwrkVars.vars[node_name]['value'] = ui.value;
	            id_suffix = idtemp.slice(4);
	            //console.log(id_suffix);
                //console.log($scope.netwrkVars.vars);
				$("#n"+id_suffix).val(ui.value);
				$scope.calculateNetworkValue();
	        }
    	});
	$("#n"+cnt).val($("#node"+cnt).slider("value"));
		cnt = cnt + 1;
	}

	$( "#sortable" ).sortable({
  			stop: function( event, ui ) {
  			   var sortedIDs = $( this ).sortable( "toArray" );
  			   new_ordered_obj = {}
			   for (i in sortedIDs){
			   		new_ordered_obj[sortedIDs[i]] = Network.vars[sortedIDs[i]]
			   }
			   Network.vars = new_ordered_obj;
			   $scope.netwrkVars.vars = new_ordered_obj;
               //console.log($scope.netwrkVars.vars);
			  //  //$scope.calculateNetworkValue();
			  tmep_node_val = {};
			   for (i in Network.vars){
					tmep_node_val[Network.vars[i]['viewname']] = Network.vars[i]['value'];
					//console.log(Network.vars[i]['viewname'])
			    }
			    ordered_node_val_map = tmep_node_val;
			    //console.log(ordered_node_val_map);
			    $scope.recalculateWholeNetwork();
  			}
	});
	for (i in Network.vars){
		$scope.setModal(Network.vars[i]['viewname']);
	}

    });

    $scope.setModal = function(modal_inden){
    	if(modal_inden == 'settings'){
    		$("#modal-heading").html('Settings');
    		$("#modal-body").html("<p>" + network_general_info + "&hellip;</p>");
    	}else{
    		$("#modal-heading").html(modal_inden+" Relations -- ");
    		inner = "";
    		console.log(modal_inden);
    		for(link in $scope.netwrkVars.vars[modal_inden]['links']){
                //console.log($scope.netwrkVars.vars[modal_inden]['links'][link]);
    			inner = inner +"<p>"+$scope.netwrkVars.vars[modal_inden]['links'][link]['inputs'][0] +" "+ $scope.netwrkVars.vars[modal_inden]['links'][link]['relation'] +" "+ $scope.netwrkVars.vars[modal_inden]['links'][link]['inputs'][1] +"&hellip;</p>";
    		}
    		$("#modal-body").html(inner);
    	}
    }

    $scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    }

    // TODO: Similar code to the calculateNetworkValue code block further down. Refactor
    $scope.recalculateWholeNetwork = function(){
        var node_name;
        var node_vars;
        var slider_cnt = 1;
        var k;  // loop counter
        var start_calculation = false;
        var new_value;  // will be used to hold a newly computed node_name value

        for(node_name in $scope.netwrkVars.vars){
            node_vars = $scope.netwrkVars.vars[node_name]
            for (k in node_vars['links']) {
                if (inputsBeforeNode(node_vars['links'][k]['inputs'], $scope.netwrkVars.vars, node_name)){
                    // compute the new value using the appropriate link function and inputs
                    new_value = compute(
                        node_vars['links'][k]['relation'],  // computation_name
                        getLinkInputValsArray($scope.netwrkVars.vars, node_name, k))  // input_vals
                    // change the node_name's value where you have to
                    changeNodeValue($scope, node_name, new_value)
                }
            }
            slider_cnt = slider_cnt + 1;
        }
    }

    $scope.calculateNetworkValue = function(){
    	changed_nodes = [];
    	for (node_name in ordered_node_val_map){
    		if(ordered_node_val_map[node_name] != $scope.netwrkVars.vars[node_name]['value']){
    			changed_nodes.push(node_name);
    			ordered_node_val_map[node_name] = $scope.netwrkVars.vars[node_name]['value'];
    		}
    	}
        var node_name;
        var node_vars;
        var slider_cnt = 1;
        var i;  // loop counter
        var k;  // loop counter
    	var start_calculation = false;
        var new_value;  // will be used to hold a newly computed node_name value

    	for (i in changed_nodes){
    		for (node_name in $scope.netwrkVars.vars){
                node_vars = $scope.netwrkVars.vars[node_name]
    			if(changed_nodes[i] != node_name && start_calculation == false){
    				slider_cnt += 1;
    				continue;
    			}
    			if( changed_nodes[i] == node_name && start_calculation == false){
    				start_calculation = true;
    				slider_cnt += 1;
    				continue;
    			}
    			if(start_calculation){
    				for (k in node_vars['links']){
    					if (inputsBeforeNode(node_vars['links'][k]['inputs'], $scope.netwrkVars.vars, node_name)){

                            // compute the new value using the appropriate link function and inputs
                            new_value = compute(
                                node_vars['links'][k]['relation'],  // computation_name
                                getLinkInputValsArray($scope.netwrkVars.vars, node_name, k))  // input_vals

                            changeNodeValue($scope, node_name, new_value)
    					}
    				}
    			}
    		}
    	}
//    	console.log(ordered_node_val_map)
    }

    $scope.onTxtBoxChange = function (tbobj){
        $scope.netwrkVars.vars[tbobj]['value'] = $('[name="'+tbobj+'"]').val();
        sldr_suffix = ($('[name="'+tbobj+'"]').attr('id')).slice(1);
        $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[tbobj]['value']);
        $scope.calculateNetworkValue();
    }
}

