var express = require('express');
var app = express();
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

app.get('/songs', function(req, res){
	var db = connectDB();
	if(db != false){
		var urlquery = url.parse(req.url, true).query;
		execSongs(db, urlquery).then(function(data){
			if (data.length > 0) {
				res.end(JSON.stringify(data));
			} else{
				res.end('No data found');
			}
		}).catch((reason)=> {
			res.end("error: " + reason);
		});
	}
})

app.get('/genres', function(req, res){
	var db = connectDB();
	if(db != false){
		execGenres(db).then(function(data){
			if (data.length > 0) {
				res.end(JSON.stringify(data));
			} else{
				res.end('No data found');
			}
		}).catch((reason)=> {
			res.end("error: " + reason);
		});
	}
})

var server = app.listen(8081, function () {
  console.log("API listening")
})

function connectDB(){
	let db = new sqlite3.Database('./db/bvde.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
		return false;
	}
	});
	return db;
}

function closeDB(db){
	db.close();
}

let execSongs = function(db, urlquery){
	return new Promise(
		function(resolve, reject){
			var filter = '1=1 ';

			if(urlquery.artist){
				filter += 'AND UPPER(artist) like UPPER("%'+urlquery.artist+'%") ';
			}
			if(urlquery.song){
				filter += 'AND UPPER(title) like UPPER("%'+urlquery.song+'%") ';
			}
			if(urlquery.genre){
				filter += 'AND UPPER(name) like UPPER("%'+urlquery.genre+'%") ';
			}
			if(urlquery.name){
				filter += 'AND UPPER(name) like UPPER("%'+urlquery.name+'%") ';
			}
			if(urlquery.min && urlquery.max){
				filter += 'AND duration BETWEEN '+urlquery.min+' AND '+urlquery.max+' ';
			}

			let sql = 'SELECT artist artist, title, name, duration '+
			            'FROM songs '+
			            'INNER JOIN genres on genres.id = songs.genre '+
			            'WHERE ' + filter + 
			            ' ORDER BY title';
			
			var data = [];
			db.all(sql, [], (err, row) => {
				if (err) {
					reject(err);
				}
				console.log("Query songs executed!");
				resolve(row);
			});
		});
}

let execGenres = function(db){
	return new Promise(
		function(resolve, reject){
			let sql = 'SELECT name, COUNT(title) , SUM(duration)'+
			            'FROM songs '+
			            'INNER JOIN genres on genres.id = songs.genre '+
			            'GROUP BY name '+
			            'ORDER BY name';
			db.all(sql, [], (err, row) => {
				if (err) {
					reject(err);
				}
				console.log("Query genres executed!");
				resolve(row);
			});
		});
}