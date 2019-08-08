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
  console.log("Results: ", results.data)
  return results.data.map(item => {
    // console.log("Each show: ", item.show)
    getEpisodes(item.show.id);
    let itemImage = item.show.image;
    // console.log("Item image: ", itemImage)
    let obj = {
      id: item.show.id,
      name: item.show.name,
      summary: item.show.summary,
      // genre: item.show.image
      image: itemImage ? itemImage.medium : 'https://tinyurl.com/tv-missing'
      // image: item.show.image.medium
    }
    return obj;
  })
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  console.log("Shows: ", shows)
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">  
         <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
  $("#shows-list").on("click", async function(evt){
    let showId = $(evt.target).closest('.Show').attr('data-show-id');
    console.log("Event target: ", showId)
    let episodesArray = await getEpisodes(showId);
    console.log("Episodes Array: ", episodesArray)
    populateEpisodes(episodesArray);
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
  console.log('Episodes XXXX: ', episodes)
  // let episodesArray = [];
  
  
  // console.log('Episodes: ', episodesArray);
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

function populateEpisodes(array) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
  // console.log("Episodes: ", array)
  for (let show of array) {
    let $item = $(
      `<li>${show.name} (season ${show.season}, number ${show.number})</li>`);

    $episodesList.append($item);
  }
  $('#episodes-area').show();
}
