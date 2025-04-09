import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { getGeminiResponse, getGeminiResponseWithImage } from "../utils/geminiAPI";
import ProfileDropdown from "../components/ProfileDropdown";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [image, setImage] = useState(null);
    const chatInputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const lastMessageRef = useRef(null);
    const storedUsername = localStorage.getItem("username");

    useEffect(() => {
        if (!storedUsername) {
            window.location.href = "/";
        }

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, isTyping]);

    const sendMessage = async () => {
        const message = inputValue.trim();
        if (!message && !image) return;
    
        setMessages((prev) => [...prev, { text: message, sender: "user", image: image?.name }]);
        setInputValue("");
        setImage(null);
        setIsTyping(true);
    
        try {
            let aiReply;
            if (image) {
                aiReply = await getGeminiResponseWithImage(image, message);
            } else {
                aiReply = await getGeminiResponse(message);
            }
            setMessages((prev) => [...prev, { text: aiReply, sender: "ai" }]);
        } catch (error) {
            console.error("AI Error:", error);
        }
    
        setIsTyping(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) setImage(file);
    };
    const logoutUser = () => {
        localStorage.removeItem("username");
        window.location.href = "/";
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-white overflow-hidden shadow-md">
        <div className="layout-container flex h-full flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-50 flex items-center justify-between w-full px-8 py-3 text-sm bg-gradient-to-r from-purple-300 to-green-300 shadow-md">
            {/* Left Side: Logo + Title */}
            <div className="flex items-center gap-3 text-[#1C160C]">
              <div className="size-5">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-[#1C160C] text-lg font-bold tracking-tight">
                <a href="/home">Millets</a>
              </h2>
            </div>
    
            <nav className="hidden md:flex items-center gap-6 text-xs text-[#1C160C] ml-auto">
              <a href="/home">Chatbot</a>
              <a href="/news">News</a>
              <a href="/shared">Shared Machineries</a>
              <a href="/collab">Collaborative Farming</a>
              <a href="/help" className="mr-6">Help & Support</a>
            </nav>
    
            <div className="flex items-center gap-6">
              <div className="relative group">
                <a href="/calendar" className="flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="Calendar Icon" className="size-5" />
                </a>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Farming Calendar
                </div>
              </div>
              <div className="relative group">
                <a href="/tracker" className="flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/833/833314.png" alt="Finance Icon" className="size-5" />
                </a>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Finance Tracker
                </div>
              </div>
              <ProfileDropdown logoutUser={logoutUser} />
            </div>
          </header>

                <div className="flex-1 flex flex-col px-32 py-4 relative overflow-hidden fade-content pt-16">
                    <h1 className="text-[#1C160C] text-xl font-bold text-center pb-6 mt-6">Ask me anything about Farming</h1>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 px-4" style={{ maxHeight: "calc(100vh - 230px)", paddingBottom: "120px" }}>
                        {messages.map((msg, index) => (
                            <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`p-4 rounded-lg max-w-md ${msg.sender === "user" ? "bg-[#D1E8D1] text-right" : "bg-[#F6F3EE] text-left"}`}>
                                    <p className="text-sm text-[#1C160C] leading-tight whitespace-pre-wrap">{msg.text}</p>
                                    {msg.image && <p className="text-xs text-gray-500">📎 {msg.image}</p>}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="p-3 bg-[#F6F3EE] rounded-lg max-w-md">
                                    <div className="typing-indicator flex space-x-1">
                                        <span className="dot bg-[#A18249]"></span>
                                        <span className="dot bg-[#A18249]"></span>
                                        <span className="dot bg-[#A18249]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white px-32 py-4 flex items-center gap-3 border-t border-gray-200">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label htmlFor="image-upload" className="cursor-pointer p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition">📷</label>

                        <textarea ref={chatInputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                            className="w-full text-sm px-4 py-3 border border-[#E9DFCE] rounded-full focus:outline-none focus:border-blue-500 bg-transparent placeholder:text-[#A18249] shadow-sm resize-none overflow-hidden"
                            placeholder="Type your questions here..." rows="1"></textarea>

                        <button onClick={sendMessage} className="p-2 bg-[#019863] text-white rounded-full shadow-md hover:bg-[#017A4F] transition">🚀</button>
                    </div>
                </div>
            </div>

            <style>{`
                .typing-indicator .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    animation: typing 1.5s infinite;
                }
                .typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
                .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default Home;
