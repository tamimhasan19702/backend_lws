const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send('This is a home route');
})

app.get('/sample',(req,res) => {
    res.send('This is a Sample route');
})

app.listen(5000, () => {
    console.log('The server is listenting at server 5000')
})