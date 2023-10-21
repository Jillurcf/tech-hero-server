const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkhpyyg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const addedProductCollection = client.db("addedprodDB").collection("addedproduct");
    const userCollection = client.db("signupUserdDB").collection("signupUserdDB");
    const cartCollection = client.db("addcartDB").collection("addcart");

    app.get("/addedproduct", async (req, res) => {
      const cursor = addedProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

   


    app.get("/addedproduct/:brandname", async (req, res) => {
      const brandname = req.params.brandname;
      const query = { brandname: brandname }
      // const options = {
      //   sort: {brandname: 1},
      //   limit: 4
      // }
      const result = await addedProductCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/addedproduct/products/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addedProductCollection.findOne(query)
      console.log(result);
      res.send(result)
    });

    

    app.post("/addedproduct", async(req, res) => {
      const addedProduct = req.body;
      const result = await addedProductCollection.insertOne(addedProduct);
      res.send(result);
    });

    app.put('/addedproduct/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedProduct = req.body;
      const product = {
          $set: {

            image: updatedProduct.image,
            name: updatedProduct.name, 
            brandname: updatedProduct.brandname, 
            type: updatedProduct.type, 
            price: updatedProduct.price, 
            shortdescription: updatedProduct.shortdescription, 
            rating: updatedProduct.rating           
          }
      }
      const result = await addedProductCollection.updateOne(filter, product, options )
      res.send(result)
      console.log(result);
  })

  //  cart related api

  app.get('/addcart', async(req, res) => {
    const cursor = cartCollection.find();
    const result = await cursor.toArray()
    res.send(result)
    console.log(result);
  })

  

  app.delete('/addcart/delete/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await cartCollection.deleteOne(query);
    res.send(result)

})

  app.post('/addcart', async(req, res)=>{
    const addCart = req.body;
    const result = await cartCollection.insertOne(addCart);
    console.log(result);
    res.send(result)
  })



    // user related API
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

   
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand Shop is running");
});

app.listen(port, () => {
  console.log(`Brand Shop is running: ${port}`);
});
