var express = require('express');
var app = express();
var fs = require("fs");
var url = require("url");
const sqlite3 = require('sqlite3').verbose();

var dblite = connectDB();
if(dblite != false){
	dblite.serialize(function() {
		dblite.run("CREATE TABLE IF NOT EXISTS genres (id int,name varchar(64))");
		dblite.run("CREATE TABLE IF NOT EXISTS songs (artist varchar(1024),title varchar(1024),genre int,duration int)");
		dblite.run("DELETE FROM genres");
		dblite.run("DELETE FROM songs");

		var geninsert = dblite.prepare("INSERT INTO genres VALUES"+
			"(1, 'Rock')," +
			"(2, 'Country')," +
			"(3, 'Rap')," +
			"(4, 'Classical')," +
			"(5, 'Indie Rock')," +
			"(6, 'Noise Rock')," +
			"(7,'Latin Pop Rock')," +
			"(8, 'Classic Rock')," +
			"(9, 'Pop')"
		);
		geninsert.run();
		geninsert.finalize();

		var songsinsert = dblite.prepare("INSERT INTO songs VALUES"+
			"('424', 'Gala', 5, 189)," + 
			"('Colornoise', 'Amalie', 6, 246)," + 
			"('Los Waldners', 'Horacio', 7, 165)," + 
			"('Beatles', 'Strawberry Fields Forever', 8, 245)," + 
			"('Chubby Checker', 'The Twist', 9, 235)," + 
			"('Santana', 'Smooth', 9, 167)," + 
			"('Bobby Darin', 'Mack the Knife', 1, 245)," + 
			"('LeAnn Rhimes', 'How Do I Live', 2, 237)," + 
			"('LMFAO', 'Party Rock Anthem', 3, 189)," + 
			"('The Black Eyed Peas', 'I Gotta Feeling', 3, 219)," + 
			"('Los Del Rio', 'Macarena', 9, 159)," + 
			"('Olivia Newton-John', 'Physical', 9, 195)," + 
			"('Debby Boone', 'You Light Up My Life', 9, 245)," + 
			"('Beatles', 'Hey Jude', 8, 162)"
			);
		songsinsert.run();
		songsinsert.finalize();
		
	});
}
closeDB(dblite);

var server = app.listen(8081, function () {

  console.log("API listening")

})

function connectDB(){
	let db = new sqlite3.Database('./db/bvde.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
		return false;
	}
	console.log('Connected to the database.');
	});
	return db;
}

function closeDB(db){
	db.close();
}

