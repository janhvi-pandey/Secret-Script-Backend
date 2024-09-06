const express = require("express");
const Notes = require("../Models/Notes");
const userdetails = require("../middleware/userdetails");
const router = express.Router();



//fetch notes
router.get("/getnotes", userdetails, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json({notes: notes});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add notes
router.post("/create", userdetails, async (req, res) => {
  try {
    const { title, description } = req.body;

    const createNote = await Notes.create({
      user: req.user.id,
      title: title,
      description: description,
      datecreated: Date.now(),
    });
    res.status(201).json({ data: createNote });
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
});

router.get("/getnote/:id", userdetails, async (req, res) => {
  try {
    const noteid = req.params.id;
    const note = await Notes.findById(noteid);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "You can't access this note" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/editnote/:id", userdetails, async (req, res) => {
  try {
    const noteid = req.params.id;
    const { title, description } = req.body;
    const note = await Notes.findById(noteid);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "You can't access this note" });
    }
    note.title = title;
    note.description = description;
    note.datecreated = Date.now();
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deletenote/:id", userdetails, async (req, res) => {
  try {
    const noteid = req.params.id;

    const note = await Notes.findById(noteid);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).json({ message: "Cannot access notes" });
    }
    await Notes.findByIdAndDelete(noteid);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
