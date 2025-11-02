"use client";

import React, { useState, useCallback } from "react";
import {
  Send,
  Calculator,
  BookOpen,
  TrendingUp,
  Settings,
  Loader2,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Upload,
  Image,
} from "lucide-react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function FinancialAnalyticsSolver() {
  const [problem, setProblem] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("solver");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({
          data: event.target?.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const solveProblem = useCallback(async () => {
    if (!problem.trim() && !uploadedImage) {
      alert("Please enter a question or upload an image");
      return;
    }

    setLoading(true);
    const userContent = uploadedImage
      ? `[Image uploaded: ${uploadedImage.name}]\n${problem}`
      : problem;
    const userMessage = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMessage]);
    setProblem("");

    const systemPrompt = {
      role: "system",
      content: `You are Rohit, an advanced AI assistant powered by cutting-edge technology. You are an expert across all domains and can answer any type of question with precision and clarity.

YOUR CAPABILITIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERT DOMAINS:
✓ Financial Analysis & Valuation
✓ Science & Mathematics
✓ History & Geography
✓ Literature & Language
✓ Technology & Programming
✓ Business & Strategy
✓ Health & Medicine
✓ Arts & Design
✓ Philosophy & Ethics
✓ General Knowledge

SPECIALIZED SKILLS:
✓ Problem Solving - Complex analytical challenges
✓ Image Analysis - Analyze uploaded photos and images
✓ Research - Comprehensive information gathering
✓ Explanation - Clear, accessible communication
✓ Coding - Multiple programming languages
✓ Creative Writing - Stories, poetry, content
✓ Math - Advanced calculations and proofs
✓ Research Papers - Academic quality analysis

YOUR APPROACH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. UNDERSTAND: Carefully analyze the question or image
2. RESEARCH: Gather relevant information and context
3. ANALYZE: Break down complex topics systematically
4. EXPLAIN: Communicate clearly and comprehensively
5. VERIFY: Ensure accuracy and completeness

TONE & STYLE:
• Professional yet friendly and approachable
• Precise and accurate in all information
• Helpful and educational
• Engaging and easy to understand
• Honest about limitations and uncertainties

IMAGE ANALYSIS:
If an image is provided, you can:
✓ Describe what you see
✓ Analyze visual elements
✓ Extract text from images (OCR)
✓ Identify objects, places, concepts
✓ Answer questions about the image content
✓ Provide context and information related to the image

QUALITY STANDARDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Accurate and factually correct information
✓ Well-structured and organized responses
✓ Detailed explanations with examples
✓ Clear formatting for readability
✓ Practical and actionable advice
✓ Citations when referencing sources

You are here to help with ANY question or task. Be thorough, helpful, and always strive to provide the best possible answer.`,
    };

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemPrompt, ...messages, userMessage],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error solving problem:", error);
      setLoading(false);
      alert("Failed to get response. Please try again.");
    }
  }, [problem, messages, uploadedImage, handleStreamResponse]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage("");
    setUploadedImage(null);
  }, []);

  const exampleQuestions = [
    "What is the theory of relativity and how does it work?",
    "How do I learn Python programming from scratch?",
    "What are the best practices for effective time management?",
    "Explain the causes and effects of climate change",
    "How does the human brain process emotions?",
    "What are the key principles of effective communication?",
  ];

  const topics = [
    {
      title: "Science & Nature",
      description:
        "Physics, chemistry, biology, astronomy, and natural phenomena",
      color: "bg-blue-600",
      subtopics: [
        "Physics & Space",
        "Biology & Life",
        "Chemistry",
        "Astronomy",
      ],
    },
    {
      title: "Technology & Code",
      description: "Programming, software development, AI, and tech innovation",
      color: "bg-purple-600",
      subtopics: ["Web Development", "AI & ML", "Mobile Apps", "DevOps"],
    },
    {
      title: "Business & Finance",
      description:
        "Entrepreneurship, marketing, investing, and financial strategy",
      color: "bg-green-600",
      subtopics: ["Startups", "Investment", "Marketing", "Finance"],
    },
    {
      title: "Arts & Culture",
      description:
        "Literature, history, philosophy, music, and creative expression",
      color: "bg-pink-600",
      subtopics: ["History", "Literature", "Philosophy", "Music"],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Space Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
        {/* Animated stars */}
        <style jsx global>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
          }
          .nebula {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.15;
          }
        `}</style>

        {/* Nebula effects */}
        <div className="nebula w-96 h-96 bg-blue-500 top-0 left-20"></div>
        <div className="nebula w-80 h-80 bg-purple-500 top-32 right-40"></div>
        <div className="nebula w-72 h-72 bg-cyan-500 bottom-20 left-1/2"></div>

        {/* Stars */}
        <div
          className="star w-1 h-1 top-10 left-20"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="star w-1.5 h-1.5 top-20 right-32"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="star w-1 h-1 top-32 left-1/4"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="star w-2 h-2 top-1/4 right-20"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="star w-1 h-1 top-1/3 left-10"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="star w-1.5 h-1.5 top-1/2 right-1/4"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="star w-1 h-1 bottom-32 left-32"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="star w-2 h-2 bottom-20 right-40"
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className="star w-1 h-1 bottom-40 left-1/2"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className="star w-1.5 h-1.5 bottom-1/4 right-32"
          style={{ animationDelay: "1.8s" }}
        ></div>
      </div>

      {/* Professional Header */}
      <header className="relative z-10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md text-white shadow-2xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
                <img
                  src="https://raw.createusercontent.com/8f487fcd-c707-4a4c-9904-4996ae0ffb55/"
                  alt="Rohit Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Rohit AI
                </h1>
                <p className="text-slate-300 text-xs mt-1">
                  Powered by Rohit Pokhrel • Answer Anything, Anytime
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-300">
              <Zap className="h-4 w-4" />
              <span>Universal AI Assistant</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-2">
            {[
              { id: "solver", label: "Chat", icon: Zap },
              { id: "topics", label: "Explore", icon: BookOpen },
              { id: "analytics", label: "Stats", icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 font-medium ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === "solver" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Advanced Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 h-[650px] flex flex-col">
                <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-700/80">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    <span>Universal Problem Solver</span>
                  </h2>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="mt-3 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear Conversation
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && !streamingMessage && (
                    <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8 rounded-lg border border-slate-700/50 mb-6">
                        <Zap className="h-16 w-16 text-cyan-400 mx-auto" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Ask Me Anything
                      </h3>
                      <p className="text-slate-400 text-sm max-w-md">
                        I can help with questions about science, technology,
                        history, business, coding, and much more. Upload an
                        image or ask your question!
                      </p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none"
                            : "bg-slate-700/80 text-slate-100 rounded-bl-none border border-slate-600/50"
                        }`}
                      >
                        <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {streamingMessage && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] p-4 rounded-lg bg-slate-700/80 text-slate-100 rounded-bl-none border border-slate-600/50">
                        <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                          {streamingMessage}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-slate-700/50 bg-slate-800/80 space-y-3">
                  {uploadedImage && (
                    <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                      <div className="flex items-center space-x-2 text-sm text-slate-200">
                        <Image className="h-4 w-4" />
                        <span>{uploadedImage.name}</span>
                      </div>
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="text-xs text-slate-400 hover:text-slate-200"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Ask me anything... or upload an image and ask about it"
                      className="flex-1 p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          solveProblem();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="px-4 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all cursor-pointer flex items-center justify-center">
                        <Upload className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={solveProblem}
                        disabled={
                          loading || (!problem.trim() && !uploadedImage)
                        }
                        className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  <span>Try Asking</span>
                </h3>
                <div className="space-y-3">
                  {exampleQuestions.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setProblem(example)}
                      className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs text-slate-200 transition-colors border border-slate-600/50 hover:border-cyan-500/50 font-mono"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-700/50 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-cyan-300" />
                  <span>Features</span>
                </h3>
                <ul className="text-xs text-cyan-100 space-y-2">
                  <li>✓ Answer Any Question</li>
                  <li>✓ Image Analysis</li>
                  <li>✓ Code Help</li>
                  <li>✓ Research & Learning</li>
                  <li>✓ Writing & Creative</li>
                  <li>✓ Real-Time Solutions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "topics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-slate-800/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/50 p-8 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-14 h-14 ${topic.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm">
                      {topic.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-300 text-sm">
                        Topics:
                      </h4>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <li key={subIndex} className="flex items-center">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all font-medium">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Questions Answered",
                value: "1,234",
                icon: Zap,
                color: "from-cyan-600 to-blue-700",
              },
              {
                label: "Success Rate",
                value: "98.5%",
                icon: TrendingUp,
                color: "from-green-600 to-emerald-700",
              },
              {
                label: "Avg. Response Time",
                value: "1.2s",
                icon: Send,
                color: "from-purple-600 to-pink-700",
              },
              {
                label: "Topics Covered",
                value: "50+",
                icon: Brain,
                color: "from-orange-600 to-red-700",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-300 text-sm">
                  {stat.label}
                </h3>
              </div>
            ))}

            <div className="md:col-span-2 lg:col-span-4 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/50 p-8">
              <h3 className="text-lg font-bold text-white mb-6">
                What I Can Help With
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Science & Physics",
                  "Programming & Code",
                  "Business Strategy",
                  "Learning & Education",
                  "Writing & Content",
                  "Image Analysis",
                  "Problem Solving",
                  "Research & Facts",
                  "Creative Projects",
                ].map((capability, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50"
                  >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-slate-200 text-sm font-medium">
                      {capability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
