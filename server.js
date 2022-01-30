const express = require ('express')
const cors = require ('cors')
// const res = require('response')
const app = express ()
const port = 3030
const data= require('./MovieData/data.json')

app.use(cors())


app.get('/favorite',welcome)
app.get('/movie',serverError)
app.get('/',getMovies)
app.get('/spider',notFound)



function serverError (req,res){
    return res.status(500).json(data.errorData500)
}

function welcome(req,res){
    return res.status(200).send("Welcome to Favorite Page ")
    }

function Movie(title,poster_path,overview){
this.title = title;
this.poster_path=poster_path;
this.overview=overview;


}

function getMovies(req,res){
  let movies=[]
  data.moviesData.map(movie =>{
      let movie1 = new Movie (movie.title,movie.poster_path,movie.overview)
    
      movies.push(movie1)
})
return res.status(200).json(movies)

}
function notFound(req,res){
    return res.status(404).json(data.errorData404)
}

app.listen(port, ()=>{
    console.log(` listening on port ${port}`)
}
)