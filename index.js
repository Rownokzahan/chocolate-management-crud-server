const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jxgrj34.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        const chocolates = client.db("chocolatesDB").collection("chocolates");

        app.get('/chocolates', async(req, res) => {
            const result = await chocolates.find().toArray();
            res.send(result);
        })

        app.get('/chocolates/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolates.findOne(query);
            res.send(result);
        })

        app.post('/chocolates/', async(req, res) => {
            const newChocolate = req.body;
            const result = await chocolates.insertOne(newChocolate);
            res.send(result);
        })

        app.put('/chocolates/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateChocolate = {
                $set: {
                    name : req.body.name,
                    photo : req.body.photo,
                    country : req.body.country,
                    category : req.body.category, 
                }
            };
            const result = await chocolates.updateOne(filter, updateChocolate);
            res.send(result);
        })

        app.delete('/chocolates/:id', async(req, res) => {
            const id = req.params.id;
            const result = await chocolates.deleteOne({_id : new ObjectId(id)});
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send({ message: "Chocolate Management Server Is Running" });
})

app.listen(port, () => {
    console.log(`Chocolate management server is running on port : ${port}`);
})