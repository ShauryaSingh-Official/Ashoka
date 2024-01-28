const ProductModel = require("../models/product");
const Product = ProductModel.Product;

// _____________________________________________________________________________________________________________________________
exports.getfilteredProducts = async (req, res) => {
  let { search, category, sortBasis, sort, page } = req.query;
  let filterData = {};

  if (search) {
     // REGEX (Mongoose) : case insensitive partial pattern match  
    filterData.product_name = { $regex: search, $options: "i" };
  }
  if (category) {
    const keys = req.query.category.split("_");
    const newCategory = keys.join(" ");
    filterData.category = { $regex: newCategory, $options: "i" };
  }
  let sortBy = "";
  if (sortBasis) {
    sortBy = sortBasis;
  }
  let newSort = 1;
  if (+sort === -1 || +sort === 1) {
    newSort = +sort;
  }

  // NO. OF PRODUCTS TO BE SEND IN ONE PAGE
  let N = 12;
  if (page) {
    page = +page;
  } else {
    page = 1;
  }
  // NO. OF PRODUCTS TO BE SKIP FOR 'Nth' PAGE
  let skipCount = N * (+page - 1);

  // REPRESENTS THE FILTERED DATA RECEIVED FROM DB (ONLY ONE PAGE i.e. 12 PRODUCTS) , AND NO. OF TOTAL RELATED RESULTS FOUND.
  let queryOutput;
  let totalResult = 0;

  try {
    if (+sort === 1 || +sort === -1) {
      if (sortBy == "price") {
        queryOutput = await Product.find(filterData)
          .sort({ price: newSort })
          .skip(skipCount)
          .limit(N);
        totalResult = await Product.find(filterData).sort({ price: newSort });
      }
      if (sortBy === "weight") {
        queryOutput = await Product.find(filterData)
          .sort({ weight: newSort })
          .skip(skipCount)
          .limit(N);
        totalResult = await Product.find(filterData).sort({ weight: newSort });
      }
      res
        .status(200, "Products Fetch sucessful !!!")
        .json({ products: queryOutput, productsCount: totalResult.length });
    } else {
      totalResult = await Product.find(filterData);
      queryOutput = await Product.find(filterData).skip(skipCount).limit(N);
      res
        .status(200, "Products Fetch sucessful !!!")
        .json({ products: queryOutput, productsCount: totalResult.length });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(404, "Some Error Found , Retry Again !!!")
      .send("Some Error Found , Retry Again !!!");
  }
};
// ?search=Hanuman&category=idols&sortBasis=price&sortOrder=-1&page=3                     (URL FORMAT)

// _____________________________________________________________________________________________________________________________
exports.getProductById = async (req, res) => {
  let id = req.url.split(":")[1];
  try {
    const productFound = await Product.findOne({ _id: id });
    res.status(200, "Product Found successful using Id").json(productFound);
  } catch (err) {
    res.json(err);
  }
};

// _____________________________________________________________________________________________________________________________
exports.createProduct = (req, res) => {
  try {
    let modified = {
      ...req.body,
      category: req.body.category.replace("_", " "),
    //   category: req.body.category.split("_").join(" "),
    };
    let NewProduct = new Product(modified);
    NewProduct.save();
    res.status(201, "Product Created").json(NewProduct);
  } catch (err) {
    res.json(err);
  }
};

// _____________________________________________________________________________________________________________________________
exports.deleteProduct = async (req, res) => {
  const pid = req.params.id.split(":")[1];
  console.log(pid , "product 108");
  try {
    const result = await Product.findByIdAndDelete({ _id: pid });
    res.status(200, "Product Deleted").json({ "Product deleted": result });
  } catch (err) {
    res.status(401).json(err);
  }
};

// _____________________________________________________________________________________________________________________________ (IMAGE)
exports.uploadImage = (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename; // This name will be the modified name (store image using multer)
  // try{
  //     await Product.create({...req.body , 'image':imageName});
  //     Product.save();
  // }
  //   catch(err){res.status(401,{message:`${err.message}\nImage not uploaded.`})}
  res.status(201, { message: "New Image Uploaded" }).json({ image: imageName });
};