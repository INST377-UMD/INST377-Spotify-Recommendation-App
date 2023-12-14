const express = require('express')
var bodyParser = require('body-parser')
// const supabaseClient = require('@supabase/supabase-js')
const app = express()
const port = 4000;
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// const supabaseURL = 'https://pueflwasgpnrgcwsoqop.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWZsd2FzZ3Bucmdjd3NvcW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MjM3MTAsImV4cCI6MjAxODA5OTcxMH0.LkJmwOK29RFHNWG-_xhBMyFa0igYXw5yHexUAg1XwgA'
// const supabase = supabaseClient.createClient(supabaseURL, supabaseKey);

app.get('/home.html', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname})
})

app.listen(port, () => {
    console.log('App is running')
})



