import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import config
import states
#################################################
# Database Setup
#################################################
engine = create_engine(f"postgresql+psycopg2://postgres:{config.password}@localhost:5432/beer_db", client_encoding='utf8')
# reflect an existing database into a new model
Base = automap_base()
# reflect the table
Base.prepare(engine, reflect=True)
# Save reference to the table
all_beer_data = Base.classes.beer_data
brewery_data = Base.classes.brewery_count_data

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

@app.route("/")
def index():
   """Return the homepage."""
   return render_template("index.html")

@app.route("/beer-data-plot")
def beerdataplot():
    session = Session(engine)
    sel = [
       all_beer_data.id,
       all_beer_data.beer_abv,
       all_beer_data.beer_ibu,
       all_beer_data.beer_id,
       all_beer_data.beer_name,
       all_beer_data.beer_style,
       all_beer_data.brewery_id,
       all_beer_data.beer_ounces,
       all_beer_data.brewery_name,
       all_beer_data.brewery_city,
       all_beer_data.brewery_state]
    results_plot = session.execute("select *\
                                    from beer_data\
                                    where beer_style IN ('American IPA', 'American Pale Ale (APA)', 'American Amber / Red Ale', 'American Double / Imperial IPA',\
					                'American Blonde Ale', 'American Pale Wheat Ale', 'American Porter', 'American Brown Ale', 'Fruit / Vegetable Beer',\
					                'Hefeweizen');").fetchall()

    session.close()

    beer_plot = []
    for result in results_plot:
       beer_plot_dict = {}
       beer_plot_dict["id"] = result[0]
       beer_plot_dict["beer_abv"] = result[1]
       beer_plot_dict["beer_ibu"] = result[2]
       beer_plot_dict["beer_id"] = result[3]
       beer_plot_dict["beer_name"] = result[4]
       beer_plot_dict["beer_style"] = result[5]
       beer_plot_dict["brewery_id"] = result[6]
       beer_plot_dict["beer_ounces"] = result[7]
       beer_plot_dict["brewery_name"] = result[8]
       beer_plot_dict["brewery_city"] = result[9]
       beer_plot_dict["brewery_state"] = result[10]
       beer_plot.append(beer_plot_dict)

    return jsonify(beer_plot)


@app.route("/beer-data")
def beerdata():
    session = Session(engine)
    sel = [
       all_beer_data.id,
       all_beer_data.beer_abv,
       all_beer_data.beer_ibu,
       all_beer_data.beer_id,
       all_beer_data.beer_name,
       all_beer_data.beer_style,
       all_beer_data.brewery_id,
       all_beer_data.beer_ounces,
       all_beer_data.brewery_name,
       all_beer_data.brewery_city,
       all_beer_data.brewery_state]
    results = session.query(*sel).all()
    session.close()
    beer_list = []
    for result in results:
       beer_list_dict = {}
       beer_list_dict["id"] = result[0]
       beer_list_dict["beer_abv"] = result[1]
       beer_list_dict["beer_ibu"] = result[2]
       beer_list_dict["beer_id"] = result[3]
       beer_list_dict["beer_name"] = result[4]
       beer_list_dict["beer_style"] = result[5]
       beer_list_dict["brewery_id"] = result[6]
       beer_list_dict["beer_ounces"] = result[7]
       beer_list_dict["brewery_name"] = result[8]
       beer_list_dict["brewery_city"] = result[9]
       beer_list_dict["brewery_state"] = result[10]
       beer_list.append(beer_list_dict)
    return jsonify(beer_list)

@app.route("/brewery-data")
def brewerydata():
   session = Session(engine)
   sel = [
      brewery_data.brewery_state,
      brewery_data.count,
      brewery_data.id]
   results = session.query(*sel).all()
   session.close()
   brewery_list = []
   for result in results:
      brewery_list_dict = {}
      brewery_list_dict["brewery_state"] = result[0]
      brewery_list_dict["count"] = result[1]
      brewery_list.append(brewery_list_dict)
   return jsonify(brewery_list)

@app.route("/brewery-states")
def brewerystates():
    brewery_state_list = states.states
    return jsonify(brewery_state_list)


if __name__ == "__main__":
    app.debug = True
    app.run()