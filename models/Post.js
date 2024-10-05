const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mainImage: { type: String, required: true },
    imageUrl: { type: String, required: true },
    body: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Post", postSchema)
