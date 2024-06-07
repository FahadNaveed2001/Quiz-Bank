const express = require("express");
const ABOUTUS = require("../models/aboutus");

const editAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const { aboutUsText } = req.body;
    if (!aboutUsText) {
      return res.status(400).json({ error: "aboutUsText is required" });
    }
    const existingAboutUs = await ABOUTUS.findById(id);
    if (!existingAboutUs) {
      return res.status(404).json({ error: "About Us content not found" });
    }
    existingAboutUs.aboutUsText = aboutUsText;
    existingAboutUs.createdAt = new Date();
    await existingAboutUs.save();
    res.status(200).json(existingAboutUs);
  } catch (error) {
    console.error("Error editing About Us content:", error);
    res.status(500).json({ error: "Failed to edit About Us content" });
  }
};

module.exports = editAboutUs;
