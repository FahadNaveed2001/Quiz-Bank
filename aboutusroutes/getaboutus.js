const express = require("express");
const ABOUTUS = require("../models/aboutus");

const getAboutUs = async (req, res) => {
  try {
    const aboutUsContent = await ABOUTUS.findOne();
    if (!aboutUsContent) {
      return res.status(404).json({ error: "About Us content not found" });
    }
    res.status(200).json(aboutUsContent);
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    res.status(500).json({ error: "Failed to fetch About Us content" });
  }
};

module.exports = getAboutUs;
