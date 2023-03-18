import express from "express";
import mongoose from "mongoose";

import dbConnect from "../config/mongodbConfig.js";
import { RecipesModel } from "../models/recipes.js";
import { UserModel } from "../models/users.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Get All Recipe
router.get("/", async (req, res) => {
  await dbConnect();
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a New Recipe
router.post("/", verifyToken, async (req, res) => {
  await dbConnect();
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  const RECIPEID = req.params.recipeId || "";
  await dbConnect();
  if (RECIPEID !== "") {
    try {
      const result = await RecipesModel.findById(RECIPEID);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    res.status(200).json({});
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  await dbConnect();
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  await dbConnect();
  const USERID = req.params.userId;
  if (USERID !== "none") {
    try {
      const user = await UserModel.findById(USERID);
      res.status(201).json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(201).json({ savedRecipes: [] });
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  await dbConnect();
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };
