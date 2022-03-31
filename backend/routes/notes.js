const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Fetch all notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    console.log(notes);
    res.send({ notes });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Add Note
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title can't be empty .").isLength({ min: 3 }),
    body("descreption", "Descreption must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, descreption, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Notes({
        title,
        descreption,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("Internal server error. ");
    }
  }
);

// Update Note Login req
router.put(
  "/updatenote/:id",
  fetchUser,

  async (req, res) => {
    try {
      const { title, descreption, tag } = req.body;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (descreption) {
        newNote.descreption = descreption;
      }
      if (tag) {
        newNote.tag = tag;
      }
      let note = await Notes.findById(req.params.id);
      if (!note) {
        res.status(404).send("Not found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not allowed");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      res.status(500).send("Internal server error. ");
    }
  }
);

// Delete Note Login req
router.delete(
  "/deletenote/:id",
  fetchUser,
  async (req, res) => {
    try {
      let note = await Notes.findById(req.params.id);
      if (!note) {
        res.status(404).send({"error":"Not found"});
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not allowed");
      }
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ success: "Note has been deleted.",note });
    } catch (error) {
      res.status(500).send("Internal server error. ");
    }
  }
);

module.exports = router;
