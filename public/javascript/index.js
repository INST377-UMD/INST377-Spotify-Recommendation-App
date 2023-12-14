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
    const table = document.getElementById('resultsTable');

    function displayResults(list) {
      while(table.hasChildNodes()) {
        table.removeChild(table.firstChild);
      }
      const tbody = document.createElement('tbody')

      for (let i = 0; i < list.length; i++) {
        const row = tbody.insertRow()
        const result = row.insertCell()
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
        result.appendChild(nameButton)
      }

      table.appendChild(tbody)
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
async function loadData(id) {
  const token = await getToken()
  const type = document.getElementById('search-type').value.toLowerCase()

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

      const name = document.createElement('h2');
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

      const recList = document.createElement('ul')
      for (let i = 0; i < data2.artists.length; i++) {
        const recArtist = document.createElement('li')
        recArtist.innerHTML = `${data2.artists[i].name}`
        recList.appendChild(recArtist)
      }
      recDiv.appendChild(recList)

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

      const name = document.createElement('h2');
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
      infoDiv.appendChild(pic)
    })

    // This API call gets the recommended ARTIST for the ARTIST submitted by the user
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

      const recList = document.createElement('ul')
      for (let i = 0; i < data2.tracks.length; i++) {
        const recTrack = document.createElement('li')
        recTrack.innerHTML = `${data2.tracks[i].name} - ${data2.tracks[i].artists[0].name}`
        recList.appendChild(recTrack)
      }
      recDiv.appendChild(recList)
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

      const name = document.createElement('h2');
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

      const albumTracklist = document.createElement('ul')
      for (let i = 0; i < data2.items.length; i++) {
        const albumTrack = document.createElement('li')
        albumTrack.innerHTML = `${data2.items[i].track_number}. ${data2.items[i].name}`
        albumTracklist.appendChild(albumTrack)
      }
      recDiv.appendChild(albumTracklist)
    })

  }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}