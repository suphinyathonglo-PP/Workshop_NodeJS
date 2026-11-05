const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://:27017/WorkshopNodeJS');
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

  console.log('Connected to Database Successfully');
}