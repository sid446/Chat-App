import express from 'express'


const app=express()

app.post("/",(req,res)=>{
    res.send("hi")
})


export {app}