require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.admin}:${process.env.pass}@cluster0.j5xue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main function to handle database operations
async function run() {
  try {
    await client.connect();

    const softHeart = client.db("softHeart");

    const campaigns = softHeart.collection("Campaign");
    const donarsCollection = softHeart.collection("donarsCollection");
    const usersCollection = softHeart.collection("users");

    // Endpoints
    app.get('/', async (req, res) => {
      const result = await campaigns.find().toArray();
      res.send(result);
    });

    app.get('/runningcamp', async(req, res)=> {
      const filter = {
        campaignStart : { $lt :  new Date().toISOString()},
        campaignEnd : { $gt:  new Date().toISOString()}
      }
       const result = await campaigns.find(filter).limit(0).toArray()
      res.send(result)
    });
    app.get('/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { email: mail };
      const result = await campaigns.find(query).toArray();
      res.send(result);
    });

    app.get('/updateCamp/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaigns.findOne(query);
      res.send(result);
    });

    app.patch('/updateCamp/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: data.campaignTitle,
          campType: data.campaignType,
          campaignStart: data.campStart,
          campaignEnd: data.campEnd,
          campDiscription: data.description,
          donation: data.donationAmount_,
          file: data.file,
          name: data.name,
          email: data.email,
        },
      };
      const result = await campaigns.updateMany(filter, updateDoc);
      res.send(result);
    });

    app.post('/newcampaign', async (req, res) => {
      const camp = req.body;
      const doc = {
        title: camp.campaignTitle,
        campType: camp.campaignType,
        campaignStart: camp.campStart,
        campaignEnd: camp.campEnd,
        campDiscription: camp.description,
        donation: camp.donationAmount_,
        file: camp.file,
        name: camp.name,
        email: camp.email,
      };
      const result = await campaigns.insertOne(doc);
      res.send(result);
    });

    app.delete('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaigns.deleteOne(query);
      res.send(result);
    });

    app.post('/donarDetails', async (req, res) => {
      const donationDetails = req.body;
      const doc = {
        campID: donationDetails.campID,
        donarName: donationDetails.donarName,
        donarMail: donationDetails.donarMail,
        thumb: donationDetails.thumb,
        amount: donationDetails.donatedAmount,
        title: donationDetails.headline,
        situation: donationDetails.donationSituation,
        donationDate: donationDetails.donationDate,
      };
      const result = await donarsCollection.insertOne(doc);
      res.send(result);
    });

    app.get('/donatDetails/getInfo', async (req, res) => {
      const result = await donarsCollection.find().toArray();
      res.send(result);
    });

    app.get('/donarDetails/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { donarMail: mail };
      const result = await donarsCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const data = req.body;
      const doc = {
        Email: data.Email,
        name: data.name,
        date : data.date
      };
      const result = await usersCollection.insertOne(doc);
      res.send(result);
    });

    app.get('/users/info', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Confirm database connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Connected successfully to MongoDB!");
  } finally {
    // Leave client open for persistent connections
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('Server is running on port', port);
});
