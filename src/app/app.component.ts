import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ztech';
  genreTerm: string;
  keyword = 'name';
  genresV: any;
  moviesV: any;
  ratingValue: number;
  rate: number;
  filmArray = [];
  tempArray = []
  genreFilteredMovies = []
  ratingFilteredMovies = []
  genreFilteredName: string;
  movieRatingFilteredLevel: number;
  moviesLength: number;

  @ViewChild('auto') auto;
  constructor(private httpClient: HttpClient) { }

  selectEvent(item) {
    this.genreFilteredName = item.name;
    // Clear down the array
    this.genreFilteredMovies = [];
    // Iterate over movies list
    for (const [i, v] of this.filmArray.entries()) {
      console.log(i, v)
      if (this.filmArray[i].genre_ids.includes(item.id) == true) {
        // Push the movie to array
        this.genreFilteredMovies.push(this.filmArray[i])
      }
    }
    // Set model to filtered movies
    this.filmArray = this.genreFilteredMovies;
  }

  onInputCleared() {

    if (this.movieRatingFilteredLevel) {
      this.getMoviesList('ratings', this.movieRatingFilteredLevel)
    } else {
      this.getMoviesList('movies', 0);
    }
    this.close()

    this.genreFilteredName = null;
  }

  onChangeSearch(event) {
  }

  close(): void {
    // e.stopPropagation();
    this.auto.close();
  }
  focus(e): void {
    // 
    // e.keyword = ''
    // e.stopPropagation();

  }
  onFocused(event) {
    // 
    // this.focus(event)
  }

  rateLeave() {
    this.getMoviesList("movies", 0);
  }
  rateChg(ratingValue, action) {
    if (action != 'continue') {
      if (this.filmArray.length != this.moviesLength) {
        setTimeout(() => {
          this.getMoviesList("ratings", ratingValue);
        }, 0)
      }
    }
    this.movieRatingFilteredLevel = ratingValue;
    // Clear down the array
    this.ratingFilteredMovies = [];
    // Iterate over movies list
    for (const [i, v] of this.filmArray.entries()) {
      if (this.filmArray[i].vote_average.toFixed(0) == ratingValue) {
        this.ratingFilteredMovies.push(this.filmArray[i]);
      }
    }
    // Set model to filtered movies
    this.filmArray = this.ratingFilteredMovies;
  }

  resetRatingsFilter() {
    this.rate = 0;
    this.movieRatingFilteredLevel = null;
    this.getMoviesList('movies', 0);
  }
  resetAllFilters() {
    this.getMoviesList("movies", 0);
    this.genreFilteredName = null;
    this.rate = 0;
    this.movieRatingFilteredLevel = null;
    this.genreTerm = null;
  }

  getGenres(genres, id) {
    return genres
      .filter(function (obj) {
        return obj.id == id;
      })
      .map(function (obj) {
        return obj.name;
      });
  }

  populateGenres(data) {
    this.genresV = data;
  }
  getGenresList() {
    fetch('assets/tmdb_movie_genres_api.json')
      .then(response => response.json())
      .then(data =>
        this.populateGenres(data)
      )
  }
  populateMovies(data, type, ratingValue) {
    this.moviesV = data;
    // Store the results array
    var moviesResults = this.moviesV.results

    this.moviesLength = moviesResults.length;
    // Loop through movies results to link genre id from genres data
    for (const [filmIndex, filmCurrentValue] of moviesResults.entries()) {
      for (const [genIndex, genCurrentValue] of filmCurrentValue.genre_ids.entries()) {

        var shortMessageTexts = this.getGenres(this.genresV, genCurrentValue);
        this.tempArray.push(shortMessageTexts)
      }
      this.filmArray[filmIndex] = filmCurrentValue
      this.filmArray[filmIndex].genre = this.tempArray
      this.tempArray = []
    }

    if (type == 'ratings') {
      this.rateChg(ratingValue, 'continue')
    }
  }
  getMoviesList(type, ratingValue) {
    fetch('assets/tmdb_movies_now_playing_api.json')
      .then(response => response.json())
      .then(data =>
        this.populateMovies(data, type, ratingValue)
      )
  }


  ngOnInit() {
    // Make call to load the Genres
    this.getGenresList()
    // Make call to load the movies
    this.getMoviesList("movies", 0);
  }
}
