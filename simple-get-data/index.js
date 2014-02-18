var btn_go=$("#btn_go");
var input_url=$("#input_url");

var url='';


btn_go.click(function(){
	url = encodeURIComponent(input_url.val());
	if(url!==''){
		$.get('/get-data',{
			url:url
		},function(data){
			$('#txt_containt').val(data);
		});
	};
	return false;
});
