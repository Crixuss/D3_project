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
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
@app.route("/")
def index():
   """Return the homepage."""
   return render_template("index.html")
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
if __name__ == "__main__":
    app.debug = True
    app.run()