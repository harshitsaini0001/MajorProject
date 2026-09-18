const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("connction sucessful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}
const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({
        ...obj,
        owner:"6a9ec72beb391df8f7c80bc8",
    }));
    await Listing.insertMany(initData.data);
    console.log("updated");

}
initDb();