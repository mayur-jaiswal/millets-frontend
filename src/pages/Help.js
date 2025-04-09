import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProfileDropdown from "../components/ProfileDropdown";

const faqs = [
  { question: "How can I check soil quality?", answer: "You can use our AI tool to analyze soil samples and get detailed recommendations." },
  { question: "What crops are best for my region?", answer: "Our AI-powered recommendation system suggests the best crops based on weather, soil, and market trends." },
  { question: "How do I apply for government farming schemes?", answer: "Visit the government portal or check our chatbot for scheme eligibility and application details." },
  { question: "How can I prevent pest infestations?", answer: "Regularly monitor crops, use organic pesticides, and follow crop rotation methods." },
  { question: "What irrigation methods are best for small farms?", answer: "Drip irrigation and sprinkler systems are effective for conserving water while maintaining crop health." },
  { question: "Where can I get high-quality seeds?", answer: "Check with certified agricultural suppliers or government-approved seed banks for quality seeds." }
];

const testimonials = [
  { name: "Rajesh Kumar", feedback: "The AI-powered farming tool helped me choose the right crops and increased my yield!" },
  { name: "Suman Patel", feedback: "I love how easy it is to get accurate soil analysis reports using this platform." },
  { name: "Amit Verma", feedback: "The FAQs and farming tips have been a game changer for my farm!" }
];

export default function HelpSupport() {

    const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const logoutUser = () => {
    localStorage.removeItem("username");
    navigate("/");
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

      {/* Help & Support Section */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-24 px-32 py-10 text-center">
        <h1 className="text-[#1C160C] text-2xl font-bold pb-4">Help & Support</h1>
        <p className="text-[#4A4A4A] text-lg pb-6">
          Need assistance? Find answers below or contact us for support.
        </p>

        {/* FAQ Section */}
        <div className="text-left max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-[#1C160C] pb-2">Frequently Asked Questions</h2>
          {[
            {
              question: "How do I use the chatbot?",
              answer: "Simply type your question in the chatbot, and it will provide relevant farming advice.",
            },
            {
              question: "Is there support for regional languages?",
              answer: "Yes! Our chatbot supports multiple regional languages for better communication.",
            },
            {
              question: "How can I share farming equipment?",
              answer: "Use the 'Shared Machineries' section to list available equipment or find shared resources.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-[#F6F3EE] p-4 rounded-lg shadow-md mb-3">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="text-sm text-[#4A4A4A] mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-lg font-semibold text-[#1C160C] pb-2">Contact Us</h2>
          <form className="bg-[#F6F3EE] p-6 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-[#1C160C]">Your Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1 mb-4"
              placeholder="Enter your name"
            />

            <label className="block text-sm font-medium text-[#1C160C]">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded mt-1 mb-4"
              placeholder="Enter your email"
            />

            <label className="block text-sm font-medium text-[#1C160C]">Your Query</label>
            <textarea
              className="w-full p-2 border rounded mt-1 mb-4"
              rows="4"
              placeholder="Describe your issue"
            ></textarea>

            <button
              type="submit"
              className="w-full p-2 bg-[#019863] text-white rounded hover:bg-[#017A4F] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};