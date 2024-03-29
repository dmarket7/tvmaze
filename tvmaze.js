/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let results = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}});
  return results.data.map(item => {
    // getEpisodes(item.show.id);
    let genresArr = item.show.genres;
    let genreStr = '';
    
    let itemImage = item.show.image;
    let obj = {
      id: item.show.id,
      name: item.show.name,
      summary: item.show.summary,
      image: itemImage ? itemImage.medium : 'https://tinyurl.com/tv-missing',
      genre: genresArr[0] ? genresArr.join(', ') : 'no genre listed'
    }
    // if(genresArr[0]) {
    //   genreStr = genresArr.join(', ');
    //   obj.genre = genreStr;
    // }
    return obj;
  })
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card" data-show-id="${show.id}">
          <div class="info-card-body">
             
            <div class="genre-text-body" data="${show.name}">
              <h2>Genre: </h2>
              <h4>${show.genre}</h4><br>
              <h3>Click Here for Episodes Info</h3>
            </div>
            <img class="card-img-top" src="${show.image}"> 
          </div>
          
          <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
          </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
  $(".info-card-body").on("click", async function(evt){
    let showId = $(evt.target).closest('.Show').attr('data-show-id');
    
    let episodesArray = await getEpisodes(showId);
    let showName = $(evt.target).closest('.genre-text-body').attr('data');

    populateEpisodes(episodesArray, showName);
  });
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  return episodes.data.map(show => {
    return {
      id: show.id,
      name: show.name,
      season: show.season,
      number: show.number
    };
  })
  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(array, showName) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for (let show of array) {
    let $item = $(
      `<li>${show.name} (season ${show.season}, number ${show.number})</li>`);

    $episodesList.append($item);
  }
  $('.modal-title').html(`Episodes for ${showName}:`);
  $('#episodes-area').show();
  $('#my-modal').modal('show');
}
