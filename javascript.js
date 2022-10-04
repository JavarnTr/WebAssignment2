//AJAX
let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let url = 'http://danieldangs.com/itwd6408/json/faqs.json';

//Jquery function "getJSON"
$.getJSON(
	proxy + url,//Send request to the url to get the JSON file 
	function(data){
		$.each(data, function(i, question){
			//Extract Q&A
			let content = `				
			<div class="col-12 col-md-6 bg-warning border border-dark">
				<h4>${question.question}</h4>
				<p class="">${question.answer}</p>
			</div>
			`;
			//Append question to the list
			$('#questions').append(content);
		});
	}//JSON file returned in "data"
);

$('#search-box').on('keyup', function(){
	let keywords = $(this).val().toLowerCase();
	//Loop through the Q&A to find what was searched
	//If it contains the keyword, it is shown. Otherwise it is hidden.
	$('#questions div').filter(function(){
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
	});
});