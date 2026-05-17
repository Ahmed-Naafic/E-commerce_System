const Product = require("../models/Product");
const Category = require("../../category/models/Category.js");
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      image,
    } = req.body;

    // validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    //check existing category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        message:"invalid category"
      })
    }

    const existingCategory = await Category.findById(category);

    if(!existingCategory) {
      return res.status(400).json({
        message:"invalid category"
      })
    }

    // create product
    const product = await Product.create({
     name,
      description,
      price,
      stock,
      category: existingCategory._id,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getProducts = async (req, res) => {
  try {

    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    // query object
    const query = {
      isDeleted: false,
    };

    // search by keyword
    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    // filter category
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      query.category = new mongoose.Types.ObjectId(category);
    }

    // filter price
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("createdBy", "name email")
      .populate("category", "name ")
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getSingleProduct = async (req,res)=>{
    try {
        const product = await Product.findOne({_id:req.params.id, isDeleted:false})
          .populate("createdBy","name email")
          .populate("category", "name");

        if(!product){
            return res.status(404).json({
                message : "products not found"
            })
        }
        
    res.status(200).json(product)
    } catch (error) {
          res.status(500).json({
      message: error.message,
    });}
}


const updateProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(400).json({
                message : "product not found "
            })
        }

        const updateData = { ...req.body };

        if (updateData.category) {
          if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
            return res.status(400).json({
              message: "Invalid category",
            });
          }

          const existingCategory = await Category.findById(
            updateData.category
          );

          if (!existingCategory) {
            return res.status(400).json({
              message: "invalid category",
            });
          }

          updateData.category = existingCategory._id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData , {new:true, runValidators:true})
          .populate("category", "name")

        res.status(200).json({
            message : "product updated successfully",
            product : updatedProduct
        })
        
    } catch (error) {
         res.status(500).json({
      message: error.message,
    });
        
    }

    
}

const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    // check product exists
    if (!product || product.isDeleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // delete product (hard delete)
    // await product.deleteOne();


    //soft delete
    product.isDeleted = true;
    product.deletedAt = Date.now();
  await product.save()

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
