async function getSearch() {
    console.log('Creating Search')
    var host = window.location.origin

    var test = await fetch(`${host}/history`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then(async res => {
        console.log(res)
    })
}

window.onload = getSearch

