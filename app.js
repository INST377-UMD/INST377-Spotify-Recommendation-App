const express = require('express')
var bodyParser = require('body-parser')
const supabaseClient = require('@supabase/supabase-js')
const app = express()
const port = 4000;
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

const supabaseURL = 'https://pueflwasgpnrgcwsoqop.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWZsd2FzZ3Bucmdjd3NvcW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MjM3MTAsImV4cCI6MjAxODA5OTcxMH0.LkJmwOK29RFHNWG-_xhBMyFa0igYXw5yHexUAg1XwgA'
const supabase = supabaseClient.createClient(supabaseURL, supabaseKey);

app.get('/home.html', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname})
})

app.get('/history', async (req, res) => {
    console.log('Getting History')

    const {data, error} = await supabase
    .from('Spotify Search History')
    .select()

    if (error) {
        console.log(error)
    } else if (data) {
        res.send(data)
    }
})

app.post('/history', async (req, res) => {
    console.log('Adding Search')

    var name = req.body.name;
    var type = req.body.type;
    var spotify_id = req.body.spotify_id

    const {data, error} = await supabase
    .from('Spotify Search History')
    .insert([
        {'name': name, 'type': type, 'spotify_id': spotify_id}
    ])
    .select();

    console.log(data)
    res.header('Content-type', 'application/json')
    res.send(data)
})

app.listen(port, () => {
    console.log('App is running')
})



