const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  datecreated: {
    type: Date,
    default: Date.now(),
  },
});

const Notes = mongoose.model("Notes", notesSchema);
module.exports = Notes;
