const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/bookstore')

const db=mongoose.connection

db.once('open',(err)=>{
    if(err){
        console.log(err);
        
    }
    console.log('the server connect');
    
})