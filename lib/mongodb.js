import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let connection;

if (!client) {
  client = new MongoClient(uri, options);
}

export async function connectDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  connection = client.db("mongodb://localhost:27017");


  return connection;
}
