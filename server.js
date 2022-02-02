`use strict`

const express = require("express");
const cors = require("cors");
const app = express();
const data = require("./MovieData/data.json");
const axios = require("axios");
const pg =require('pg')
require("dotenv").config();

const client =new pg.Client(process.env.DATABASE_URL)

app.use(cors());
app.use(express.json())
const PORT = process.env.PORT;

let url =`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;

// let query="The Lord of the Rings: The Fellowship of the Ring" changed to be input data from the user instead of fixed
app.get("/favorite", welcome);
app.post('/addmovie',addFavorite)
app.get('/getmovies',getFavMovies)
// app.get('/movie', serverError)
app.get("/", getMovies);
app.use("/spider", notFound);
app.get('/search',searchMovies)
app.get('/trending',trendGetter)
app.get('/popular',popularHandler)
app.get('/playing',playingMovies)
app.delete('/DELETE/:id',deleting)
app.put('/UPDATE/:id',updating)
app.get('/getMovie/:id',gettingbyid)


function welcome(req, res) {
  return res.status(200).send("Welcome to Favorite Page ");
}

function Movie (id, title,release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
  this.release_date = release_date;
}
function Movie1 (vote_count,original_title,popularity){
    this.vote_count=vote_count
  this.popularity=popularity
  this.original_title=original_title
}
function Movie2 (genre_ids,original_language,adult,title){
    this.genre_ids=genre_ids
    this.original_language=original_language
    this.adult=adult
    this.title=title

}
function getMovies(req, res) {
  let movies=[]
  data.moviesData.map(movie =>{
      let movie1 = new Movie (movie.title,movie.poster_path,movie.overview)
    
      movies.push(movie1)
})
return res.status(200).json(movies)
}
function notFound(req, res) {
  res.status(404).send("This page is not found");
}

function trendGetter (req,res){ 
  url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
       axios.get(url)
      .then(movies => {
        let results = movies.data.results.map((moviesS) => {
            return new Movie(moviesS.id,moviesS.title,moviesS.release_date,moviesS.poster_path,moviesS.overview);
            });
           
            res.status(200).json(results);
           })
           .catch((err) => {
            serverError(err,req,res)
        // {we used to do out like this, but the new way is above declaring a function with err attirbute/parameter
        //   status: 500;
        //   responseText: "Sorry, something went wrong";
        // }
        // res.status(500).json(err)
       });
   }
   function searchMovies(req,res){
       let query = req.query.query
       let urlS=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${query}`
       axios.get(urlS)
       .then(search=>{
           let searchResults= search.data.results.map(found=>{
               return new Movie(found.id,found.title,found.releas_date,found.poster_path,found.overview)
           })
           res.status(200).json(searchResults)
       }).catch(err=>{
           serverError(err,req,res)
       })
   }

   function popularHandler(req,res){
       let urlP= `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.APIKEY}&language=ru-RUS&page=1`
       axios.get(urlP)
       .then(pop=>{
           let popularMovies = pop.data.results.map(mostPop=>{
               return new Movie1(mostPop.vote_count,mostPop.original_title,mostPop.popularity)
           })
           res.status(200).json(popularMovies)
       }).catch(err=>{
        serverError(err,req,res)
    })
   }

   function  playingMovies  (req,res){
    let urlNow= `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.APIKEY}&language=ar-AR&page=1`
    axios.get(urlNow)
    .then(playing=>{
        let playingNowMovies = playing.data.results.map(playN=>{
            return new Movie2(playN.genre_ids,playN.original_language,playN.adult,playN.title)
        })
        res.status(200).json(playingNowMovies)
    }).catch(err=>{
     serverError(err,req,res)
 })
   }

  function serverError(err, req, res) {
  const errorr = {
    status: 500,
    message: "error",
   };
    res.status(500).send(errorr);
  }
  function addFavorite(req,res){
    console.log(req.body)
   const added= req.body
   let sql = 'INSERT INTO favorMovies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;'
   let values =[added.title,added.release_date,added.poster_path,added.overview]
   client.query(sql,values).then(data=>{
     res.status(200).json(data.rows)
   }).catch (err=>{
     serverError(err,req,res)
     console.log(err)
   })
  }
  function getFavMovies (req,res){
    let sql = `SELECT * FROM favorMovies;`
    client.query(sql)
    .then(select=>{
      res.status(200).json (select.rows)
    }).catch (err=>{
      serverError(err,req,res)
    })

  }
  function updating (req,res){
    const id =req.params.id
    const movie = req.body
    let sql = `UPDATE favormovies SET  title=$1,release_date=$2,poster_path=$3,overview=$4 WHERE id=${id} RETURNING *;`
    let values =[movie.title,movie.release_date,movie.poster_path,movie.overview]
    client.query(sql,values).then(upp=>{
      res.status(200).json(upp.rows)
    }).catch (err=>{
      serverError(err,req,res)
    })
  }
  function deleting (req,res){
    const id = req.params.id
    let sql = `DELETE FROM favorMovies WHERE id=${id};`
    
    client.query(sql).then(()=>{
      res.status(200).send("This Movie Has been deleted");
      // res.status(204).json({})
   }) .catch (err=>{
      serverError(err,req,res)
   })

  }
  function gettingbyid (req,res){
    const id = req.params.id
    let sql = `SELECT * FROM favorMovies WHERE id=${id};`
    
    client.query(sql).then(data=>{
      res.status(200).json(data.rows);
      // res.status(204).json({})
   }) .catch (err=>{
      serverError(err,req,res)
   })

  }
  // server and clinet are connected 
client.connect().then(()=>{
  app.listen(PORT, () => {
    console.log(` listening on port ${PORT}`);
  });
})

// app.listen(PORT, () => {
//   console.log(` listening on port ${PORT}`);
// });
