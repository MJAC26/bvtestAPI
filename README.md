# bvtestAPI
Repository for technical test of an SQLite API 

### Languagues
Node.js

### Setup
1. Install [Node.js](https://nodejs.org/es/download/)
2. Import the following modules for the project:
  `npm install express`
  `npm install sqlite3`
3. Run the project
  `node apiserver.js`
4. Check the api with [PostMan](https://www.getpostman.com/apps)

### Using API
To consume the API there is 2 routes:
+ http://127.0.0.1:8081/songs:
  This route return all songs. Passing url arguments search for an specific value:
    - ?song: return songs searched by the title. Example: http://127.0.0.1:8081/songs?song=Gotta
    ![alt text](https://github.com/MJAC26/bvtestAPI/blob/master/img/song.png "Song example")
    - ?artist: return songs searched by artist. Example: http://127.0.0.1:8081/songs?artist=Beatles
    ![alt text](https://github.com/MJAC26/bvtestAPI/blob/master/img/artist.png "Artist example")
    - ?genre: return songs searched by genre. Example: http://127.0.0.1:8081/songs?genre=Rock
    ![alt text](https://github.com/MJAC26/bvtestAPI/blob/master/img/genre.png "Genre example")
    - ?min&max: return songs searched by duration. Example: http://127.0.0.1:8081/songs?min=159&max=165
    ![alt text](https://github.com/MJAC26/bvtestAPI/blob/master/img/duration.png "Genre example")
    
+ http://127.0.0.1:8081/genres:
  This route return a list of the genres, and the number of songs and the total length of all the songs by genre.  
  Example: http://127.0.0.1:8081/genres
  ![alt text](https://github.com/MJAC26/bvtestAPI/blob/master/img/genre.png "Genres example")

