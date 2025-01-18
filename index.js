require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// Linked to ahammods-projects/soft-heart-backend (created .vercel and added it to .gitignore)
// Inspect: https://vercel.com/ahammods-projects/soft-heart-backend/7A84zGyvyrK3QFvYTiXNK2Bg4kfx [3s]
// Production: https://soft-heart-backend-eiw7wl9s5-ahammods-projects.vercel.app [3s]

// 
// console.log(process.env.admin, process.env.pass)

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.admin}:${process.env.pass}@cluster0.j5xue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // my database 
    const softHeart = client.db("softHeart");
    const campaigns = softHeart.collection("Campaign");
    app.get('/',(req, res) => {
        res.send('yes')
    })
   
    
    
    // Insert the defined document into the "haiku" collection
   

    app.post('/newcampaign', async(req,res)=>{
        const camp = req.body;
        const doc = {
            title: camp.campaignTitle,  campType : camp.campaignType, campaignStart : camp.campStart, campaignEnd : camp.campEnd, joinAbleMember : camp.applyer, campDiscription : camp.description,
            donation : camp.isDonationNeed, file: camp.file, author: camp.author
          }
        const result = await campaigns.insertOne(doc);
        res.send(result)
        
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. success MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('your port is ',port)
})