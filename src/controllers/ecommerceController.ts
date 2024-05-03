import { Request, Response } from "express";
import { creatProductSchema, updateProductSchema, option } from "../utils/utils";
import Ecommerce from "../model/ecommerceModel";

export const createProduct = async (req: Request | any, res: Response) => {
  try {
    const verify = req.user;

    //validate Product form inputs
    const validateUser = creatProductSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    const newProduct = await Ecommerce.create({
      ...req.body,
      user: verify._id,
    });

    return res
      .status(200)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { description, completed } = req.body;
    const { id } = req.params;
    //validate Product form inputs
    const validateUser = updateProductSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    const Product = await Ecommerce.findById({ _id: id });

    if (!Product) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    const updateRecord = await Ecommerce.findByIdAndUpdate(id,
      {
        description,
        completed,
      },

      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updateRecord) {
      return res.status(404).json({
        msg: "Product not updated",
      });
    }

    return res.status(200).json({
      message: "Product updates successfully",
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const getAllUserProducts = await Ecommerce.find().populate("user");

    res.status(200).json({
      msg: "Products successfully fetched",
      getAllUserProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const singleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const getsingleProducts = await Ecommerce.findById(id);

    if (!getsingleProducts) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    res.status(200).json({
      msg: "Products successfully fetched",
      getsingleProducts
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const getAllUserProducts = await Ecommerce.find({ user: userId });

    res.status(200).json({
      msg: "Products successfully fetched",
      getAllUserProducts,
    });
  } catch (error) {
    console.log(error);
  }
};



export const deleteSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteSingleRecord = await Ecommerce.findByIdAndDelete(id)
    if (!deleteSingleRecord) {
      return res.status(400).json({
        error: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product successfully deleted",
      deleteSingleRecord
    });
  } catch (error) {
    console.error("Problem deleting Product");
  }
};