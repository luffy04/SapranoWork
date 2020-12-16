const { MongoClient, ObjectID } = require('mongodb');
const url = `mongodb://localhost:27017`;
var db;

connectDB = () => {
    MongoClient.connect(url, (err, client) => {
        console.log("Connected");
        db = client.db("admin");
    })
}

getCollection = (cb) => {
    db.collection("list").find({}).toArray((err, result) => {
        cb(result);
    })
}

getCart = (cb) => {
    db.collection("cart").find({}).toArray((err, result) => {
        cb(result);
    })
}

pushCart = async (item, cb) => {
    var newItem = Object.create(item);
    newItem["qty"] = 1;
    db.collection("cart").insert(newItem, async (err, result) => {
        if (err) {
            db.collection("cart").updateOne({ "_id": (item._id) }, { $inc: { "qty": 1 } }, (err, result) => {
                err ? console.log(err) : console.log(result.result);
            });
        }
        db.collection("list").updateOne({ "_id": ObjectID(item._id) }, { $set: { "qty": item.qty - 1 } }, (err, data) => {
            err ? console.log(err) : console.log(data.result);
            cb(data);
        });
    })
}

Buy = (id, cb) => {
    console.log(id);
    db.collection("cart").deleteOne({ "_id": (id) }, (err, result) => {
        err ? console.log(err) : console.log(result.result);
        cb(result);
    })
}

Edit = (item, cb) => {
    db.collection("cart").updateOne({ "_id": item.id }, { $set: { price: item.price } }, (err, result) => {
        db.collection("list").updateOne({ "_id": ObjectID(item.id) }, { $set: { price: item.price } }, (err, data) => {
            cb(data);
        })
    })
}

module.exports = {
    connectDB,
    getCollection,
    pushCart,
    getCart,
    Buy,
    Edit
}
