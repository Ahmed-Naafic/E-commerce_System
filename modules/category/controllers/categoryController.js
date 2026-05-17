const Category = require("../models/Category.js");

const createCategory = async (req,res)=>{
    try {
        const {name, description} = req.body; 
        
        if (!name   ) {
            return res.status(400).json({
                message: "name is required"
            })
        }

        //check existing category
        const existinCategory = await Category.findOne({name});

        if (existinCategory) {
            return res.status(400).json({
                message : "the categor is already exist"
            })
        }

        const category = await Category.create({
            name,
            description,
        })

        res.status(201).json({
            message : "the category has been created",
            category
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })    
    }
}

const getCategory = async (req,res)=>{
    try {
        const category = await Category.find({
            isDeleted: false
        });

        if (!category) {
            return res.status(400).json({
                message: "category not found"
            })
        }

        res.status(200).json({category})
        
    } catch (error) {
        res.status(500).json({
            message :error.message
        })
    }
}

const getSingleCategory =async (req,res)=>{
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(400).json({
                message:"category not found "
            })
        }

        res.status(200).json({category})
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const updateCategory = async (req,res)=>{
    try {
        const category = await Category.findById(req.params.id);

        if(!category){
            return res.status(400).json({
                message : "category not found "
            })
        }

        const updatedProduct = await Category.findByIdAndUpdate(req.params.id, req.body , {new:true, runValidators:true})

        res.status(200).json({
            message : "category updated successfully",
            category : updatedProduct
        })
        
    } catch (error) {
         res.status(500).json({
      message: error.message,
    });
        
    }

    
}


const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    // check product exists
    if (!category || category.isDeleted) {
      return res.status(404).json({
        message: "category not found",
      });
    }

    // delete product (hard delete)
    // await product.deleteOne();


    //soft delete
    category.isDeleted = true;
    category.deletedAt = Date.now();
  await category.save()

    res.status(200).json({
      message: "category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {createCategory, getCategory, getSingleCategory,updateCategory,deleteCategory}
