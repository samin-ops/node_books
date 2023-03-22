import express from "express";
import mongoose from "mongoose";
import Book from "./model/book.model";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();


app.use(bodyParser.json());
app.use(cors());


// Connection a la base de donnees MongoDB
const uri: string = "mongodb://localhost:27017/biblio";
mongoose.connect(uri, (err)=>{
    if(err) console.log(err);
    else console.log("MongoDB is connected");      
    
});

app.get("/", (_req, res)=>{
res.send("Hello bakend with Nodejs, Typescript & MongoDB.");
});

app.get("/books", (_req, res)=>{
    Book.find((err, books)=>{
        if(err)  res.status(500).send(err);
        else res.send(books);  
    });  
});

app.post("/books", (req, res)=>{
    let book = new Book(req.body);
    book.save(err =>{
        if(err)res.status(500).send(err);
        else res.send(book);
    })
});

app.get("/books/:id", (req, res)=>{
    Book.findById(req.params.id, (err:any, book:any)=>{
        if(err) res.status(500).send(err);
        else res.send(book);   
    });  
});

app.put("/books/:id", (req, res)=>{
    Book.findByIdAndUpdate(req.params.id, req.body, (err:any)=>{
        if(err) res.status(500).send(err);
        else res.send("Book updated successfully.");  
    }); 
});

app.delete("/books/:id", (req, res)=>{
    Book.findByIdAndDelete(req.params.id, (err:any)=>{
        if(err) res.status(500).send(err);
        else res.send("Book deleted successfully.");   
    });  
});


// Paginer un document mongodb: GET http://localhost:7000/pbooks?page=1&size=5
app.get("/pbooks", (req, res)=>{
    if(typeof req.query.page ==="string" && typeof req.query.size==="string"){
        let page:number = parseInt(req.query.page) || 1;
        let size:number = parseInt(req.query.size) || 5;
        Book.paginate({}, {page:page,limit:size}, (err, books)=>{
            if(err) {
                res.status(500).send(err);
            }
            else {
                res.send(books); 
            } 
        });
    }  
});

//GET http://localhost:7000/books-seach?kw=page=1&size=5 par example.

app.get("/books-search", (req, res)=>{
    if( typeof req.query.page==="string" && typeof req.query.size==="string" && typeof req.query.kw==="string"){
        let page:number = parseInt(req.query.page) || 1;
        let size:number = parseInt(req.query.size )|| 5;
        let kw:string = req.query.kw  || "";
        if(kw.length < 2){
            const message: string = "le terme de recherche doit avoir au moin 2 lettre."
            res.status(500).send({message});
        }
        Book.paginate({title:{$regex:".*(?i)"+kw+".*"}}, {page:page,limit:size}, (err, books)=>{
            if(err) res.status(500).send(err);
            else res.send(books);  
            console.log(books);
            
        });  
    }
});
     
app.listen(7000, ()=>{
    console.log("server is listerning into port 7000.");   
});