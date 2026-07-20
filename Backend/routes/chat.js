import express from "express";
import Thread from "../models/Thread.js";
import getGrokAIAPIResponse from "../utils/grokai.js";

const router = express.Router();

//test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "123ac1",
      title: "Testing 23",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to save in DB" });
  }
});

//Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); //Descending order
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to fetch threads" });
  }
});

//get thread by Id
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to fetch chat" });
  }
});

//delete thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to delete thread" });
  }
});

// chat route
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required field" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      // create a new thread in DB
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
      //const response = thread.save()
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGrokAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({
      reply: assistantReply,
      thread: {
        threadId: thread.threadId,
        title: thread.title,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
