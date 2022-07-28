const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

//connecting db

mongoose
  .connect("mongodb://localhost:27017/Sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected with mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//1st making schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

//2nd make product model
const Product = new mongoose.model("Product", productSchema);

//3rd making api to create Product
app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);
  console.log("product added");
  res.status(201).json({
    success: true,
    product,
  });
});

app.get("/api/v1/product", async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ sucess: true, products });
  // or
  // res.status(200).send(products);
});

app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ sucess: false, message: "product isn't found" });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });
  res.status(200).json({ sucess: true, product });
});

app.delete("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ sucess: false, message: "product isn't found" });
  }
  await product.remove();

  res
    .status(200)
    .json({ sucess: true, message: "product is deleted sccessfuly" });
});

app.listen(4000, () => {
  console.log("your server is working http://localhost:4000");
});
