import mongoose from 'mongoose';

const connect_DB = async() => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    await mongoose.connect(`${process.env.MONGODB_URL}/Communet`)
}

export default connect_DB;