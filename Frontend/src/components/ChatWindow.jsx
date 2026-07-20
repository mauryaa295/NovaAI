import React, { useContext, useEffect, useState } from "react";
import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { ScaleLoader } from "react-spinners";
const API = import.meta.env.VITE_API_URL;

const ChatWindow = () => {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    // setCurrThreadId,
    // prevChats,
    setPrevChats,
    // newChat,
    setNewChat,
    setAllThreads,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId: currThreadId,
        message: prompt,
      }),
    };

    try {
      const response = await fetch(`${API}/api/chat`, options);
      const res = await response.json();

      setReply(res.reply);

      setAllThreads((prev) => {
        const exists = prev.some(
          (thread) => thread.threadId === res.thread.threadId,
        );

        if (exists) return prev;

        return [res.thread, ...prev];
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);

    // setPrompt("");
  };

  //Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          NovaAI <i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Setting
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </div>
        </div>
      )}
      <Chat />
      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          NovaAI can make mistakes. Check important info. See Cookie Prefrences.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
