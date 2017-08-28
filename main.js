

var app = {};
app.key = 'd1efa5af00fc462da56a5611a6e51d93';
app.articleEndpoint = `https://newsapi.org/v1/articles?`;
app.sourceEndpoint = `https://newsapi.org/v1/sources?`;
app.source = '';
var x = 2;
app.articalArrayLength = 0;

app.getArticles = function(query){
	$.ajax({
	url: app.articleEndpoint,
	method: 'GET',
	dataType: 'json',
	data: {
		source: query,
		apiKey: app.key,
	}
	}).then(function(res){
		app.createCards(res.articles)
	});
};

app.getSources = function(query) {
	$.ajax({
	url: app.sourceEndpoint,
	method: 'GET',
	dataType: 'json',
	data: {
		language: 'en',
		category: query
	}
	}).then(function(res){
		app.parseSources(res.sources);
	})
};

app.chooseCategory = function(){
	$('.chooseCategory').on('click', function(e){
		e.preventDefault();
		var chosenCategory = $(this).val();
		app.getSources(chosenCategory);
		$('.newsCategory').hide();
		$('header').removeClass('onLoadStyle').addClass('sourceChoiceStyle');
		if ($(window).width() < 650) {
			$('.mobileHome').css('display', 'inline-block');
		} else {
			$('.home').css('display', 'inline-block')
		}

		$(window).resize(function(){
			if($(window).width() > 650) {
				$('.mobileHome').css('display', 'none');
				$('.home').css('display', 'inline-block');
			} else {
				$('.mobileHome').css('display', 'inline-block');
				$('.home').css('display', 'none');
			}
		});
	});
};

app.parseSources = function(sources) {
	sources.forEach(function(source){
		$('.sources').append(`<button class="source" value="${source.id}">
			<img src='images/${source.id}.png' alt='${source.name}'>
			<span>${source.name}</span>
			</button>`);
		
	});
	$('.sources').css('padding-top', '50px');
	app.chooseSource();
};

app.chooseSource = function() {
	$('.source').on('click', function(e){
		x = 2;		
		e.preventDefault();
		var chosenSource = $(this).val();
		app.getArticles(chosenSource);
		app.source = $(this).text();
		$('.newsSource p').css('display', 'block').css('padding', '20px 0');
		$('.sources').css('padding-top', '0');
		$('.chosenSource').find('span').text(app.source);
		$('header').removeClass('sourceChoiceStyle').addClass('articleStyle');
		$('nav a').focus();
	});

};

app.createCards = function(articleData){
	$('.newsPosts').empty();
	$('.chosenSource').css('display', 'block');
	$('.loadMorePosts').css('display', 'block');
	console.log(articleData);
	articleData.forEach(function(data){
		var author = data.author;
		var title = data.title;
		var description = data.description;
		var image = data.urlToImage;
		var link = data.url;
		$('.newsPosts').append(`<div class="card">
				<img src="${image}">
				<div class="cardContent">
					<h2 class="title">${title}</h2>
					<h3 class="author">${author}</h3>
					<p class="description">${description}</p>
					<a target="_blank" href="${link}">Read The Full Article</a>
				</div>
			</div>`);
	});
	x = 4;
	$('.newsPosts .card:lt('+x+')').css('display', 'flex');
	app.updateContent();
};

app.updateContent = function() {
	$(".author:contains('null')").css('display', 'none');
	$(".description:contains('null')").css('display', 'none');
	$('.newsSource p').text('Choose a different source:');
	$('.newsCategory').detach().appendTo('.currentNews');
	$('.newsCategory').show();
	$('#newsCategory p').text('Want more news?').addClass('moreNews');
	$('#newsCategory button').remove();
	$('#newsCategory').append('<button class="returnToMain">Return to Main Page</button>');
	$('.returnToMain').css('margin', '0 auto');
	$('.source').on('click', function(e){
		e.preventDefault();
		var newSource = $(this).val();
		app.getArticles(newSource);
		$('html, body').animate({scrollTop: 0});
	});
};

app.loadCards = function() {
	$('.loadMorePosts').on('click', function(e){
		e.preventDefault();
		x = x + 2;
		$('.newsPosts .card:lt('+x+')').css('display', 'flex');
		if ($('.card:last-of-type').css('display') === 'flex') {
			$('.loadMorePosts').css('display', 'none');
		}
	});
};

app.init = function() {
	app.chooseCategory();
	app.loadCards();
};

$(function() {
	app.init();
});
