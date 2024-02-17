const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(newObject) {
        const { title, description, price, img, code, stock } = newObject;

        if (![title, description, price, img, code, stock].every(Boolean)) {
            console.log("Please enter all the information.");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("Please enter a unique code.");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        };

        this.products.push(newProduct);
        await this.saveToFile(this.products);
    }

    async getProducts() {
        try {
            return await this.readFile();
        } catch (error) {
            console.log("Error reading file:", error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.readFile();
            const foundProduct = products.find(item => item.id === id);

            if (!foundProduct) {
                console.log("Product not found.");
            } else {
                console.log("Product found.");
                return foundProduct;
            }
        } catch (error) {
            console.log("Error reading file:", error);
        }
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            return JSON.parse(response);
        } catch (error) {
            console.log("Error reading file:", error);
        }
    }

    async saveToFile(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.log("Error saving file:", error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.readFile();
            const index = products.findIndex(item => item.id === id);

            if (index !== -1) {
                products.splice(index, 1, updatedProduct);
                await this.saveToFile(products);
            } else {
                console.log("Product not found.");
            }
        } catch (error) {
            console.log("Error updating product:", error);
        }
    }
}

module.exports = ProductManager;
