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

var node_val = {}

myApp.factory('Network', function(){
	var Network = {};
	Network.vars = network_vars

  	Network.name = network_name;
  	Network.generalInfo = network_general_info;

	for (i in Network.vars){
		node_val[Network.vars[i]['viewname']] = Network.vars[i]['value'];
	}
	//console.log(node_val);
	return Network;
})

function inputsBeforeNode(inputs, topology, present_node){
	var inp1_before = false
	var inp2_before = false
	for (node in topology){
		if (node == inputs[0]){
			inp1_before = true;
		}
		if (node == inputs[1]){
			inp2_before = true;
		}
		if (node == present_node){
			if(inp1_before == false || inp2_before == false){
                // console.log("---------------------------");
                // console.log("In False");
                // console.log(present_node);
                // console.log(inputs);
                // console.log("---------------------------");
				return false;
			}else{
                // console.log("---------------------------");
                // console.log("In True");
                // console.log(present_node);
                // console.log(inputs);
                // console.log("---------------------------");
				return true;
			}
		}
	}
	return true
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
	            node = $(this).data('role');
                //console.log(node);
	            $scope.netwrkVars.vars[node]['value'] = ui.value;
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
			    node_val = tmep_node_val;
			    //console.log(node_val);
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

    $scope.recalculateWholeNetwork = function(){
    	slider_cnt = 1;
    	for(node in $scope.netwrkVars.vars){
    		for (k in $scope.netwrkVars.vars[node]['links']){
    			if (inputsBeforeNode($scope.netwrkVars.vars[node]['links'][k]['inputs'], $scope.netwrkVars.vars, node)){
    				if ($scope.netwrkVars.vars[node]['links'][k]['relation'] == 'multiply'){
    					var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['value'];
    					var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['value'];
    					$scope.netwrkVars.vars[node]['value'] =  var1 * var2;
    					sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').attr('id')).slice(1);
    					$("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[node]['value']);
                        node_val[node] = $scope.netwrkVars.vars[node]['value'];
    					//slider_cnt = slider_cnt + 1;
    					//console.log($scope.netwrkVars.vars[node]['viewname'] +" = "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['viewname'] +" multiply "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['viewname']+" = "+var1 * var2)
    					$('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').val($scope.netwrkVars.vars[node]['value']);
    					break;
    				}
    				if ($scope.netwrkVars.vars[node]['links'][k]['relation'] == 'divide'){
    					var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['value'];
    					var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['value'];
    					$scope.netwrkVars.vars[node]['value'] = var1 / var2;
    					sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').attr('id')).slice(1);
    					$("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[node]['value']);
                        node_val[node] = $scope.netwrkVars.vars[node]['value'];
    					//slider_cnt = slider_cnt + 1;
    					//console.log($scope.netwrkVars.vars[node]['viewname'] +" = "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['viewname'] +" divide "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['viewname']+" = "+var1 / var2)
    					$('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').val($scope.netwrkVars.vars[node]['value']);
    					break;
    				}
    				if ($scope.netwrkVars.vars[node]['links'][k]['relation'] == 'plus'){
    					var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['value'];
    					var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['value'];
    					$scope.netwrkVars.vars[node]['value'] = var1 + var2;
    					sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').attr('id')).slice(1);
    					$("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[node]['value']);
                        node_val[node] = $scope.netwrkVars.vars[node]['value'];
    					//slider_cnt = slider_cnt + 1;
    					//console.log($scope.netwrkVars.vars[node]['viewname'] +" = "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['viewname'] +" plus "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['viewname']+" = "+var1 + var2)
    					$('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').val($scope.netwrkVars.vars[node]['value']);
    					break;
    				}
    				if ($scope.netwrkVars.vars[node]['links'][k]['relation'] == 'minus'){
    					var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['value'];
    					var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['value'];
    					$scope.netwrkVars.vars[node]['value'] = var1 - var2;
    					sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').attr('id')).slice(1);
    					$("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[node]['value']);
                        node_val[node] = $scope.netwrkVars.vars[node]['value'];
    					//slider_cnt = slider_cnt + 1;
    					//console.log($scope.netwrkVars.vars[node]['viewname'] +" = "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][0]]['viewname'] +" minus "+$scope.netwrkVars.vars[$scope.netwrkVars.vars[node]['links'][k]['inputs'][1]]['viewname']+" = "+var1 - var2)
    					$('[name="'+$scope.netwrkVars.vars[node]['viewname']+'"]').val($scope.netwrkVars.vars[node]['value']);
    					break;
    				}
    			}
    		}
    		slider_cnt = slider_cnt + 1;
    	}
    }

    $scope.calculateNetworkValue = function(){
    	changed_nodes = [];
    	for (node in node_val){
    		if(node_val[node] != $scope.netwrkVars.vars[node]['value']){
    			changed_nodes.push(node);
    			node_val[node] = $scope.netwrkVars.vars[node]['value'];
    		}
    	}
    	//console.log(changed_nodes);
    	var start_calculation = false;
    	slider_cnt = 1;
    	for (i in changed_nodes){
    		for (orig_nodes in $scope.netwrkVars.vars){
    			if(changed_nodes[i] != orig_nodes && start_calculation == false){
    				slider_cnt = slider_cnt + 1;
    				continue;
    			}
    			if( changed_nodes[i] == orig_nodes && start_calculation == false){
    				start_calculation = true;
    				slider_cnt = slider_cnt + 1;
    				continue;
    			}
    			if(start_calculation){
    				for (k in $scope.netwrkVars.vars[orig_nodes]['links']){
                        //console.log(orig_nodes);
    					if (inputsBeforeNode($scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'], $scope.netwrkVars.vars, orig_nodes)){
    						if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'multiply'){

                                // TODO: collect var values through a loop over all inputs! There may be 1 input, there may be more than 2..
                                // TODO: Factor this code out. It's the same for every code block.
    							var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
    							var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];

                                // TODO: This is the part that actually computes. Better put this in a function baring the appropriate name
    							$scope.netwrkVars.vars[orig_nodes]['value'] =  var1 * var2;

                                // TODO: Is this part the same for every block? If so, refactor
    							sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
    							$('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
    						}
    						if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'divide'){
                                //console.log('div');
                                //console.log(orig_nodes);
    							var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
    							var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];

    							$scope.netwrkVars.vars[orig_nodes]['value'] = var1 / var2;

    							sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
    							$('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
    						}
                            // Start new function
                            if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'f'){
                                //console.log('div');
                                //console.log(orig_nodes);
                                var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
                                var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];
                                var3 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][2]]['value'];

                                $scope.netwrkVars.vars[orig_nodes]['value'] = var1 - (var3 * var2);

                                sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
                                $('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
                            } // End new function !!!
    						if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'plus'){
                                //console.log('plus');
    							var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
    							var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];

    							$scope.netwrkVars.vars[orig_nodes]['value'] = var1 + var2;

    							sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
    							$('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
    						}
    						if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'minus'){
                                //console.log('minus');
    							var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
    							var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];

    							$scope.netwrkVars.vars[orig_nodes]['value'] = var1 - var2;

    							sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
    							$('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
    						}
                            // x * y ^ z (power_multiple) function
                            if ($scope.netwrkVars.vars[orig_nodes]['links'][k]['relation'] == 'power_multiple'){
                                var1 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][0]]['value'];
                                var2 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][1]]['value'];
                                var3 = $scope.netwrkVars.vars[$scope.netwrkVars.vars[orig_nodes]['links'][k]['inputs'][2]]['value'];

    							$scope.netwrkVars.vars[orig_nodes]['value'] = var1 * Math.pow(var2, var3);

    							sldr_suffix = ($('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').attr('id')).slice(1);
                                $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[orig_nodes]['value']);
                                node_val[orig_nodes] = $scope.netwrkVars.vars[orig_nodes]['value'];
    							$('[name="'+$scope.netwrkVars.vars[orig_nodes]['viewname']+'"]').val($scope.netwrkVars.vars[orig_nodes]['value']);
                                //break;
    						}
    					}
    				}
    			}
    		}
    	}
    	//console.log($scope.netwrkVars.vars);
    }

    $scope.onTxtBoxChange = function (tbobj){
        $scope.netwrkVars.vars[tbobj]['value'] = $('[name="'+tbobj+'"]').val();
        sldr_suffix = ($('[name="'+tbobj+'"]').attr('id')).slice(1);
        $("#node"+sldr_suffix).slider("value", $scope.netwrkVars.vars[tbobj]['value']);
        $scope.calculateNetworkValue();
    }
}
