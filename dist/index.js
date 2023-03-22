"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./model/book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Connection a la base de donnees MongoDB
const uri = "mongodb://localhost:27017/biblio";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("MongoDB is connected");
});
app.get("/", (_req, res) => {
    res.send("Hello bakend with Nodejs, Typescript & MongoDB.");
});
app.get("/books", (_req, res) => {
    book_model_1.default.find((err, books) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app.post("/books", (req, res) => {
    let book = new book_model_1.default(req.body);
    book.save(err => {
        if (err)
            res.status(500).send(err);
        else
            res.send(book);
    });
});
app.get("/books/:id", (req, res) => {
    book_model_1.default.findById(req.params.id, (err, book) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(book);
    });
});
app.put("/books/:id", (req, res) => {
    book_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err)
            res.status(500).send(err);
        else
            res.send("Book updated successfully.");
    });
});
app.delete("/books/:id", (req, res) => {
    book_model_1.default.findByIdAndDelete(req.params.id, (err) => {
        if (err)
            res.status(500).send(err);
        else
            res.send("Book deleted successfully.");
    });
});
// Paginer un document mongodb: GET http://localhost:7000/pbooks?page=1&size=5
app.get("/pbooks", (req, res) => {
    if (typeof req.query.page === "string" && typeof req.query.size === "string") {
        let page = parseInt(req.query.page) || 1;
        let size = parseInt(req.query.size) || 5;
        book_model_1.default.paginate({}, { page: page, limit: size }, (err, books) => {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(books);
            }
        });
    }
});
//GET http://localhost:7000/books-seach?kw=page=1&size=5 par example.
app.get("/books-search", (req, res) => {
    if (typeof req.query.page === "string" && typeof req.query.size === "string" && typeof req.query.kw === "string") {
        let page = parseInt(req.query.page) || 1;
        let size = parseInt(req.query.size) || 5;
        let kw = req.query.kw || "";
        if (kw.length < 2) {
            const message = "le terme de recherche doit avoir au moin 2 lettre.";
            res.status(500).send({ message });
        }
        book_model_1.default.paginate({ title: { $regex: ".*(?i)" + kw + ".*" } }, { page: page, limit: size }, (err, books) => {
            if (err)
                res.status(500).send(err);
            else
                res.send(books);
            console.log(books);
        });
    }
});
app.listen(7000, () => {
    console.log("server is listerning into port 7000.");
});
//sourceMappingURL=index.js.map