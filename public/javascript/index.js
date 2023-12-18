const CLIENT_ID = "fa50e1ed76c34dd1b12abf783affb2c7"
const  CLIENT_SECRET = "9713e2483d964e5da182937d162d1511"

// Retrives the TOKEN using my client credentials
async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
  });

  const data = await response.json();
  return data.access_token;
}

// Calls the SEARCH API and returns a table of buttons that allow the user to choose the desired artist/track/album
async function getSearchResults() {
  const token = await getToken()
  const search = document.getElementById('search-input').value
  const type = document.getElementById('search-type').value.toLowerCase()
  const url = `https://api.spotify.com/v1/search?q=${search}&type=${type}&limit=10&offset=0`

  // Calls Spotify SEARCH API
  var searchResults = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    const resultsDiv = document.getElementById('searchResults');

    function displayResults(list) {
      while(resultsDiv.hasChildNodes()) {
        resultsDiv.removeChild(resultsDiv.firstChild);
      }
      const buttonDiv = document.createElement('div')

      for (let i = 0; i < list.length; i++) {
        const name = list[i].name
        const spotifyID = list[i].id
        const nameButton = document.createElement('button')
        if (type == "track" || type == "album") {
          const artist = list[i].artists[0].name
          nameButton.innerHTML = `${name} - ${artist}`
        } else {
          nameButton.innerHTML = `${name}`
        }
        nameButton.onclick = function () {loadData(spotifyID)}
        nameButton.setAttribute('class', 'button-24-2')
        nameButton.style.margin = "5px";
        buttonDiv.appendChild(nameButton)
      }
      resultsDiv.appendChild(buttonDiv)
    }

    if(type == "artist")  {
      const artistsList = data.artists.items
      displayResults(artistsList);

    } else if (type == "track") {
      const tracksList = data.tracks.items
      displayResults(tracksList)

    } else {
      const albumsList = data.albums.items
      displayResults(albumsList)

    }
  })
}

// Loads information about the desired artist/track/album
async function loadData(id_param) {
  const token = await getToken()
  const type = document.getElementById('search-type').value.toLowerCase()
  const id = id_param

  // ARTIST API CALL
  // If the user selects the ARTIST type from the menu, the ARTIST API will be called giving info about the selected ARTIST
  if(type == "artist") {
    const url = `https://api.spotify.com/v1/artists/${id}`
    var artistResult = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data => {
      const infoDiv = document.getElementById('infoDiv')
      while(infoDiv.hasChildNodes()) {
        infoDiv.removeChild(infoDiv.firstChild);
      }

      infoDiv.setAttribute('class', 'content-box')

      const name = document.createElement('h3');
      name.innerHTML = `Name: ${data.name}`;
      infoDiv.appendChild(name);

      const followers = document.createElement('h3');
      followers.innerHTML = `Followers: ${data.followers.total}`;
      infoDiv.appendChild(followers);

      if (data.genres.length > 0) {
        const genres = document.createElement('h3');
        genres.innerHTML = `Genres: ${data.genres}`;
        infoDiv.appendChild(genres);
      }

      const pic = document.createElement('img')
      pic.setAttribute('src', `${data.images[0].url}`)
      infoDiv.appendChild(pic)

      addSearch(data.name, "Artist", id)
    })

    // This API call gets the recommended ARTIST for the ARTIST submitted by the user
    const url2 = `https://api.spotify.com/v1/artists/${id}/related-artists`
    var relatedArtists = await fetch(url2, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data2 => {
      console.log(data2)

      const recDiv = document.getElementById('recDiv')
      while(recDiv.hasChildNodes()) {
        recDiv.removeChild(recDiv.firstChild)
      }

      recDiv.setAttribute('class', 'content-box')
      
      const table = document.createElement('table')
      const headerRow = document.createElement('tr')

      const artistHeader = document.createElement('th')
      artistHeader.innerHTML = "Artist"
      headerRow.appendChild(artistHeader)

      const followersHeader = document.createElement('th')
      followersHeader.innerHTML = "Followers"
      headerRow.appendChild(followersHeader)

      const genreHeader = document.createElement('th')
      genreHeader.innerHTML = "Genres"
      headerRow.appendChild(genreHeader)

      table.appendChild(headerRow)

      for (let i = 0; i < data2.artists.length; i++) {
        const row = document.createElement('tr')

        const artist = document.createElement('td')
        artist.innerHTML = `${data2.artists[i].name}`
        row.appendChild(artist)

        const followers = document.createElement('td')
        followers.innerHTML = `${data2.artists[i].followers.total}`
        row.appendChild(followers)

        const genres = document.createElement('td')
        genres.innerHTML = `${data2.artists[i].genres}`
        row.appendChild(genres)

        table.appendChild(row)
      }
      
      recDiv.appendChild(table)

    })

  // TRACKS API CALL
  // If the user selects the TRACK type from the menu, the TRACK API will be called giving info about the selected TRACK
  } else if (type == "track") {
    const url = `https://api.spotify.com/v1/tracks/${id}`
    var trackResult = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data => {
      const infoDiv = document.getElementById('infoDiv')
      while(infoDiv.hasChildNodes()) {
        infoDiv.removeChild(infoDiv.firstChild);
      }

      infoDiv.setAttribute('class', 'content-box')

      const name = document.createElement('h3');
      name.innerHTML = `Name: ${data.name}`;
      infoDiv.appendChild(name);

      const artist = document.createElement('h3');
      artist.innerHTML = `Artist: ${data.artists[0].name}`;
      infoDiv.appendChild(artist);

      const duration = document.createElement('h3')
      duration.innerHTML = `Duration: ${millisToMinutesAndSeconds(data.duration_ms)}`
      infoDiv.appendChild(duration)

      const pic = document.createElement('img')
      pic.setAttribute('src', `${data.album.images[0].url}`)
      pic.style.height = "40%"
      infoDiv.appendChild(pic)

      addSearch(data.name, "Track", id)
    })

    // This API call gets the recommended TRACK for the TRACK submitted by the user
    const url2 = `https://api.spotify.com/v1/recommendations?seed_tracks=${id}`
    var trackRecs = await fetch (url2, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data2 => {
      console.log(data2)

      const recDiv = document.getElementById('recDiv')
      while(recDiv.hasChildNodes()) {
        recDiv.removeChild(recDiv.firstChild)
      }

      recDiv.setAttribute('class', 'content-box')

      const table = document.createElement('table')
      const headerRow = document.createElement('tr')

      const trackHeader = document.createElement('th')
      trackHeader.innerHTML = "Track"
      headerRow.appendChild(trackHeader)

      const artistHeader = document.createElement('th')
      artistHeader.innerHTML = "Artist"
      headerRow.appendChild(artistHeader)

      const albumHeader = document.createElement('th')
      albumHeader.innerHTML = "Album"
      headerRow.appendChild(albumHeader)

      const durationHeader = document.createElement('th')
      durationHeader.innerHTML = "Duration"
      headerRow.appendChild(durationHeader)

      table.appendChild(headerRow)

      for (let i = 0; i < data2.tracks.length; i++) {
        const row = document.createElement('tr')

        const trackName = document.createElement('td')
        trackName.innerHTML = `${data2.tracks[i].name}`
        row.appendChild(trackName)

        const artist = document.createElement('td')
        artist.innerHTML = `${data2.tracks[i].artists[0].name}`
        row.appendChild(artist)

        const albumName = document.createElement('td')
        albumName.innerHTML = `${data2.tracks[i].album.name}`
        row.appendChild(albumName)

        const duration = document.createElement('td')
        duration.innerHTML = `${millisToMinutesAndSeconds(data2.tracks[i].duration_ms)}`
        row.appendChild(duration)

        table.appendChild(row)
      }
      
      recDiv.appendChild(table)
    })

  // ALBUM API CALL
  // If the user selects the ALBUM type from the menu, the ALBUM API will be called giving info about the selected ALBUM
  } else {
    const url = `https://api.spotify.com/v1/albums/${id}`
    var albumResult = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data => {
      const infoDiv = document.getElementById('infoDiv')
      while(infoDiv.hasChildNodes()) {
        infoDiv.removeChild(infoDiv.firstChild);
      }

      infoDiv.setAttribute('class', 'content-box')

      const name = document.createElement('h3');
      name.innerHTML = `Name: ${data.name}`;
      infoDiv.appendChild(name);

      const artist = document.createElement('h3');
      artist.innerHTML = `Artist: ${data.artists[0].name}`;
      infoDiv.appendChild(artist);

      const releaseDate = document.createElement('h3')
      releaseDate.innerHTML = `Release Date: ${data.release_date}`
      infoDiv.appendChild(releaseDate)

      const pic = document.createElement('img')
      pic.setAttribute('src', `${data.images[0].url}`)
      infoDiv.appendChild(pic)

      addSearch(data.name, "Album", id)
    })

    // This API call gets the tracklist for the ALBUM selected by the user
    const url2 = `https://api.spotify.com/v1/albums/${id}/tracks`
    var albumTracks = await fetch(url2, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(data2 => {
      console.log(data2)

      const recDiv = document.getElementById('recDiv')
      while(recDiv.hasChildNodes()) {
        recDiv.removeChild(recDiv.firstChild)
      }

      recDiv.setAttribute('class', 'content-box')

      const table = document.createElement('table')
      const headerRow = document.createElement('tr')

      const trackNumHeader = document.createElement('th')
      trackNumHeader.innerHTML = "Track #"
      headerRow.appendChild(trackNumHeader)

      const trackHeader = document.createElement('th')
      trackHeader.innerHTML = "Track Name"
      headerRow.appendChild(trackHeader)

      const durationHeader = document.createElement('th')
      durationHeader.innerHTML = "Duration"
      headerRow.appendChild(durationHeader)

      table.appendChild(headerRow)

      for (let i = 0; i < data2.items.length; i++) {
        const row = document.createElement('tr')

        const trackNum = document.createElement('td')
        trackNum.innerHTML = `${data2.items[i].track_number}. `
        row.appendChild(trackNum)

        const trackName = document.createElement('td')
        trackName.innerHTML = `${data2.items[i].name}`
        row.appendChild(trackName)

        const duration = document.createElement('td')
        duration.innerHTML = `${millisToMinutesAndSeconds(data2.items[i].duration_ms)}`
        row.appendChild(duration)

        table.appendChild(row)
      }
      recDiv.appendChild(table)
    })
  }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function addSearch(name, type, id) {
  console.log('Creating Search')
  var host = window.location.origin
  console.log(host)

  var test = await fetch(`${host}/history`, {
      method: 'POST',
      body: JSON.stringify({
          "name": `${name}`,
          "type": `${type}`,
          "spotify_id": `${id}`
      }),
      headers: {
        "Content-Type": "application/json"
      }
  })
}

function checkLocalStorage() {
  if (localStorage) {
    document.getElementById('search-input').value = localStorage.getItem("spotify_name")
    document.getElementById('search-type').value = localStorage.getItem("searchType")
    console.log(localStorage.getItem("spotify_name"),localStorage.getItem("searchType"))
    getSearchResults()
    localStorage.removeItem("spotify_id")
    localStorage.removeItem("spotify_name")
    localStorage.removeItem("searchType")
  }
}
window.onload = checkLocalStorage