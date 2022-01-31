`use strict`

const express = require("express");
const cors = require("cors");
const app = express();
const data = require("./MovieData/data.json");
const axios = require("axios");
require("dotenv").config();

app.use(cors());
const PORT = process.env.PORT;

let url =`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;
// let trendUrl = process.env.trendUrl;
// let searchUrl = process.env.searchUrl;
let query="The Lord of the Rings: The Fellowship of the Ring"
app.get("/favorite", welcome);
// app.get('/movie', serverError)
app.get("/", getMovies);
app.use("/spider", notFound);
app.get('/search',searchMovies)
app.get('/trending',trendGetter)
app.get('/popular',popularHandler)
app.get('/playing',playingMovies)
// function serverError (req,res){
//     return res.status(500).json(data.errorData500)
// }

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
      message: 'error',
    };
    res.status(500).send(errorr);
  }

app.listen(PORT, () => {
  console.log(` listening on port ${PORT}`);
});
