select beer_style, count(brewery_name) as num_breweries
from beer_data
group by beer_style
order by num_breweries desc;

select 	count(distinct beer_style) as total_styles, 
		count(distinct beer_name) as total_beers
from beer_data;

select brewery_state, count(distinct brewery_name) as total_breweries, 
		count(distinct beer_style) as total_styles, 
		count(distinct beer_name) as total_beers
from beer_data
group by brewery_state
order by total_styles desc;

select beer_style, 
		count(beer_name) as total_beers
from beer_data
where brewery_state LIKE '%IL%' OR  brewery_state LIKE '%WI%'
group by beer_style;

select brewery_state, beer_style, 
		count(distinct brewery_name) as total_breweries, 
		count(beer_name) as total_beers
from beer_data
where beer_style = 'American IPA'
group by brewery_state, beer_style
order by total_beers desc;