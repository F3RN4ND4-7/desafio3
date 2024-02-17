const express = require("express");
const app = express();
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
const PUERTO = 8080;

app.use(express.json());

app.get("/products", async (req, res) =>  {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();
        if (limit) {
            res.json(productos.slice(0,limit));
        } else {
            res.json(productos)
        }
    } catch (error) {
        res.status(500).json({error: "Internal error 😱"})
    }
})

//2) Retornamos producto por ID: 

app.get("/products/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        const producto = await productManager.getProductById(parseInt(id));

        if(!producto) {
            return res.json({error: "ID not found 🤦🏻‍♀️"});
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({error: "Server Error 😅"})
    }
})

//Listen del servidor
app.listen(PUERTO, () => {
    console.log(`🚀 Listening on ${PUERTO} ✨ `);
})