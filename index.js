const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const {ObjectId} = require('mongodb')
const app = express()
const port = process.env.PORT || 5000


// SET MIDDLEWERE
app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('Explore Bangladesh Server Running...')
})

app.listen(port, ()=>{
    console.log('Running Server is at', port)
})

// DATABASE CONNECTION START
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yfcy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        
        await client.connect()
        const database = client.db('exploreBD')
        const destinationCollection = database.collection('destination')
        const ordersCollection = database.collection('orders')


        //POST API FOR ADD DESTINATION 

        app.post('/destinations', async (req, res) =>{
            const newDestination = req.body
            const result = await destinationCollection.insertOne(newDestination)
            res.json(result)
        })

        //GET API TO GET ALL DESTINATION DATA 
        app.get('/destinations', async (req, res) =>{
            const cursor = destinationCollection.find({})
            const allDestinations = await cursor.toArray()
            res.send(allDestinations) 
        })

        //  GET API TO GET SINGLE ITEM WHICH REDIRECT TO ORDER PLACE PAGE
        app.get('/orders/:id', async (req, res) =>{
            const id = req.params.id 
            const query = { _id: ObjectId(id) }
            const singleDestination = await destinationCollection.findOne(query)
            res.send(singleDestination)
        })

        // POST API FOR  RECEIVE ORDER

        app.post('/order', async (req,res)=>{
            const newDestination = req.body 
            const result = await ordersCollection.insertOne(newDestination)
            res.json(result)
        })

        //GET API TO GET ALL BOOKING LIST 

        app.get('/booking', async (req, res) =>{
            const cursor = ordersCollection.find({})
            const allBookingList = await cursor.toArray()
            res.send(allBookingList)
        })


        // DELETE AOI FOR DELETE BOOKING
        app.delete('/booking/:id', async (req, res) =>{
            const id = req.params.id 
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })


        

    } finally {
        // await client.close()
    }
}

run().catch(console.dir())

// DATABASE CONNECTION END