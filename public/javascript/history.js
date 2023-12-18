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

        const table = document.getElementById('history')

        for (let i = 0; i < res.length; i++) {
            const row = document.createElement('tr')
            
            const name = document.createElement('td')
            name.innerHTML = res[i].name
            row.appendChild(name)

            const type = document.createElement('td')
            type.innerHTML = res[i].type
            row.appendChild(type)

            var fdate = new Date(res[i].created_at)
            var fdate = fdate.toLocaleString()
            
            const date = document.createElement('td')
            date.innerHTML = fdate
            row.appendChild(date)

            const viewCell = document.createElement('td')
            const view = document.createElement('button')
            view.setAttribute('class', 'button-24')
            viewCell.appendChild(view)
            view.innerHTML = "View Results"
            view.onclick = function () {loadHistoryResults(res[i].spotify_id, res[i].type)}
            row.appendChild(viewCell)

            table.appendChild(row)
        }
    })
}

function loadHistoryResults() {
    
}

window.onload = getSearch

