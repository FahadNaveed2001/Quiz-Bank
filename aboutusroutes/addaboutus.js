const express = require("express");
const ABOUTUS = require("../models/aboutus");

const addAboutUs = async (req, res) => {
  try {
    const aboutUsText = req.body.aboutUsText;
    if (!aboutUsText) {
      return res.status(400).json({ error: "aboutUsText is required" });
    }
    await ABOUTUS.deleteMany({});
    const newAboutUs = new ABOUTUS({ aboutUsText });
    await newAboutUs.save();
    res.status(201).json(newAboutUs);
  } catch (error) {
    res.status(500).json({ error: "Failed to add About Us content" });
    console.log(error);
  }
};

module.exports = addAboutUs;
