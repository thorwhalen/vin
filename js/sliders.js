var Sliders = function () {

    // n 1
    $("#node1").slider({
        range: "min",
		step: 0.001,
        value: 0.05,
        min: 0.05,
        max: 10000000.00,
        slide: function (event, ui) {
           
			$("#n1").val(parseFloat(ui.value));
        }
    });
   
	$("#n1").val($("#node1").slider("value"));
	
	
	 /* n 2 */
    $("#node2").slider({
        range: "min",
		step: 0.001,
        value: 1,
        min: 0.05,
        max: 300.00,
        slide: function (event, ui) {
          
			$("#n2").val(parseFloat(ui.value));
        }
    });

   
	$("#n2").val($("#node2").slider("value"));
	
		 /* n 3 */
    $("#node3").slider({
        range: "min",
		step: 0.001,
        value: 3,
        min: 0.05,
        max: 100.00,
        slide: function (event, ui) {
           
			$("#n3").val(parseFloat(ui.value));
        }
    });

   
	$("#n3").val($("#node3").slider("value"));
	
	
	 /* n 4 */
    $("#node4").slider({
        range: "min",
		step: 0.001,
        value: 4,
        min: 0.05,
        max: 100.00,
        slide: function (event, ui) {
          
			$("#n4").val(parseFloat(ui.value));
        }
    });

   
	$("#n4").val($("#node4").slider("value"));
	
	
	 /* n 5 */
    $("#node5").slider({
        range: "min",
		step: 0.001,
        value: 5,
        min: 0.05,
        max: 1000000000.00,
        slide: function (event, ui) {
           
			$("#n5").val(parseFloat(ui.value));
        }
    });

   
	$("#n5").val($("#node5").slider("value"));
	
	
	
	
	
   

  
}();
