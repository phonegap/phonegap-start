var View = {};

View.render = function(viewName) {
	viewFullPath = "core/views/" + viewName + ".html";

	resultingHtml = $.ajax({
		url: viewFullPath, // relative path to www folder
		type:"get",
		contentType:"application/text",
		async:false
	}).responseText;
	
	$("body").html(resultingHtml);
}

