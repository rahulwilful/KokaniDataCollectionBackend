const Translator = require("../Models/Translator.js");
const { validationResult, matchedData } = require("express-validator");

const addTranslator = async (req, res) => {
  try {
    const data = matchedData(req);
    number = data.number;
    console.log("data", data);
    const old = await Translator.findOne({ number: data.number });
    console.log("old", old);
    if (old) {
      return res.status(400).json({ message: "translator exist" });
    }
    // Create a new translator object
    const newTranslator = Translator.create({
      name: data.name,
      number: data.number,
    });

    res.status(201).json({ message: "Translator created successfully", translator: newTranslator });
  } catch (error) {
    console.error("Error creating translator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to handle retrieving all translators
const getAllTranslators = async (req, res) => {
  try {
    // Retrieve all translators from the database
    const translators = await Translator.find();
    console.log(translators);
    res.status(200).json(translators);
  } catch (error) {
    console.error("Error getting all translators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTranslator = async (req, res) => {
  try {
    const { translatorId, name, number, sentence, sentence_id } = req.body;
    const id = req.params.id;

    const data = matchedData(req);
    console.log("data : ", data);
    const updatedTranslator = await Translator.findByIdAndUpdate(
      id,
      {
        name: data.name,
        number: data.number,
      },
      { new: true } // Return the updated document
    );
    if (!updatedTranslator) {
      return res.status(404).json({ message: "Translator not found" });
    }

    res.status(200).json({ message: "Translator updated successfully", translator: updatedTranslator });
  } catch (error) {
    console.error("Error updating translator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to handle deleting a translator
const deleteTranslator = async (req, res) => {
  try {
    // Extract translator ID from request body
    const { translatorId } = req.body;

    // Find the translator by ID and delete it
    await Translator.findByIdAndDelete(translatorId);

    res.status(200).json({ message: "Translator deleted successfully" });
  } catch (error) {
    console.error("Error deleting translator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to handle retrieving a translator by ID
const getTranslatorById = async (req, res) => {
  try {
    // Extract translator ID from request body
    const { translatorId } = req.body;

    // Find the translator by ID
    const translator = await Translator.findById(req.params.id);

    console.log(" Translator ", translator);

    if (!translator) {
      return res.status(404).json({ message: "Translator not found" });
    }

    res.status(200).json(translator);
  } catch (error) {
    console.error("Error getting translator by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addTranslator,
  getAllTranslators,
  updateTranslator,
  deleteTranslator,
  getTranslatorById,
};
