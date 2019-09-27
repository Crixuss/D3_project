drop table if exists beer_data;

-- Create tables for raw data to be loaded into
CREATE TABLE beer_data (
id serial PRIMARY KEY,
beer_abv numeric,
beer_ibu numeric,
beer_id int,
beer_name text,
beer_style text,
brewery_id int,
beer_ounces numeric,
brewery_name text,
brewery_city text,
brewery_state text	
);

select *
from beer_data;