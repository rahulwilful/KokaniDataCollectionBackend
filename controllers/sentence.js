const Sentence = require("../Models/Sentence.js");

const getAllSentences = async (req, res) => {
  try {
    const sentences = await Sentence.find().populate({ path: "translator_id" });
    console.log(sentences);
    res.status(200).json({ result: sentences });
  } catch (error) {
    console.error("Error getting all translators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSentenceById = async (req, res) => {
  try {
    const id = req.params.id;
    
    const sentence = await Sentence.findById(req.params.id).populate({ path: "translator_id" });

    console.log(" Sentence ", Sentence);

    if (!sentence) {
      return res.status(404).json({ message: "Sentence not found" });
    }

    res.status(200).json({ result: sentence });
  } catch (error) {
    console.error("Error getting translator by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSentencesByTranslator = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id : ", id);
    const sentences = await Sentence.find({ translator_id: id }).populate({ path: "translator_id" });

    console.log(" Sentence ", sentences);

    if (!sentences) {
      return res.status(404).json({ message: "Sentences not found" });
    }

    res.status(200).json({ result: sentences });
  } catch (error) {
    console.error("Error getting translator by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSentences,
  getSentenceById,
  getSentencesByTranslator,
};
