const express = require("express");
const mongoose = require("mongoose");
const cors =require("cors")
require("dotenv").config();
const app = express();
app.use(cors())
app.use(express.json());
try {
  mongoose.connect(process.env.MONGO);
} catch (error) {
  console.log(error.message);
}

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

app.get("/post", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({'createdAt': 'descending'});
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post("/post", async (req, res) => {
  try {
    const { title, body, password } = req?.body;
    if(!title || !body){
      return res.json({ success: false, message: "Fill All fields" });
    }
    if (!password || !(password == process.env.PASSWORD)) {
      return res.json({ success: false, message: "Incorrect Password" });
    }
    const blog = await Blog.create({ title, body });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.listen(3000);
