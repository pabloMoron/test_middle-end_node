'use strict'

import express from "express";

let app = express();
app.set("port",3000)
app.route('/hello')
.get((req, res) => {
    res.json({
        message: "Hello! ^^"
    })
})


app.listen(3000,()=>
{
    console.log('app initialized');
})