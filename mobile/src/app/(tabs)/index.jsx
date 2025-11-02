import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image as RNImage,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Send,
  Loader2,
  BookOpen,
  Calculator,
  Zap,
  Upload,
  Image,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function FinancialSolver() {
  const insets = useSafeAreaInsets();
  const [problem, setProblem] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedImage({
          uri: asset.uri,
          name: asset.filename || "image.jpg",
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  }, []);

  const solveProblem = useCallback(async () => {
    if (!problem.trim() && !uploadedImage) {
      Alert.alert("Error", "Please enter a question or upload an image");
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

YOUR APPROACH:
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
      Alert.alert("Error", "Failed to get response. Please try again.");
    }
  }, [problem, messages, uploadedImage, handleStreamResponse]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage("");
    setUploadedImage(null);
  }, []);

  const exampleQuestions = [
    "What is the theory of relativity?",
    "How do I learn Python programming?",
    "Explain climate change",
    "How does photosynthesis work?",
    "What's the future of AI?",
    "How to improve productivity?",
  ];

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0F172A", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      {/* Professional Header */}
      <View
        style={{
          backgroundColor: "#1E293B",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#334155",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#3B82F6",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <img
              src="https://raw.createusercontent.com/8f487fcd-c707-4a4c-9904-4996ae0ffb55/"
              alt="Rohit Logo"
              style={{ width: 24, height: 24, objectFit: "contain" }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "white",
              }}
            >
              Rohit AI
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "#94A3B8",
                marginTop: 2,
              }}
            >
              Powered by Rohit Pokhrel
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !streamingMessage && (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#1E3A8A",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Zap size={48} color="#60A5FA" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "white",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Ask Me Anything
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#94A3B8",
                textAlign: "center",
                marginBottom: 24,
                paddingHorizontal: 20,
              }}
            >
              I can answer questions about science, tech, history, business,
              coding, and more. Upload an image or ask a question!
            </Text>

            {/* Example Questions */}
            <View style={{ width: "100%", gap: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "white",
                  paddingHorizontal: 4,
                }}
              >
                Try Asking:
              </Text>
              {exampleQuestions.map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "#1E293B",
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#334155",
                  }}
                  onPress={() => setProblem(example)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#CBD5E1",
                      fontWeight: "500",
                    }}
                  >
                    {example}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((message, index) => (
          <View
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: message.role === "user" ? "#2563EB" : "#1E293B",
              padding: 12,
              borderRadius: 12,
              marginVertical: 6,
              maxWidth: "90%",
              borderWidth: message.role === "assistant" ? 1 : 0,
              borderColor: "#334155",
            }}
          >
            <Text
              style={{
                color: message.role === "user" ? "white" : "#E2E8F0",
                fontSize: 13,
                lineHeight: 20,
                fontFamily: "monospace",
              }}
            >
              {message.content}
            </Text>
          </View>
        ))}

        {streamingMessage && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#1E293B",
              padding: 12,
              borderRadius: 12,
              marginVertical: 6,
              maxWidth: "90%",
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <Text
              style={{
                color: "#E2E8F0",
                fontSize: 13,
                lineHeight: 20,
                fontFamily: "monospace",
              }}
            >
              {streamingMessage}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View
        style={{
          backgroundColor: "#1E293B",
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1,
          borderColor: "#334155",
        }}
      >
        {uploadedImage && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0F172A",
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Image size={16} color="#64748B" />
              <Text style={{ fontSize: 12, color: "#64748B", maxWidth: 200 }}>
                {uploadedImage.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setUploadedImage(null)}>
              <Text style={{ fontSize: 12, color: "#64748B" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {messages.length > 0 && (
          <TouchableOpacity
            onPress={clearChat}
            style={{
              alignSelf: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#64748B", fontSize: 12, fontWeight: "500" }}>
              Clear Conversation
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#334155",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
              maxHeight: 100,
              backgroundColor: "#0F172A",
              color: "white",
              fontFamily: "monospace",
            }}
            placeholder="Ask anything or upload a photo..."
            placeholderTextColor="#64748B"
            value={problem}
            onChangeText={setProblem}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: "#B45309",
              borderRadius: 12,
              padding: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Upload size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={solveProblem}
            disabled={loading || (!problem.trim() && !uploadedImage)}
            style={{
              backgroundColor:
                loading || (!problem.trim() && !uploadedImage)
                  ? "#475569"
                  : "#2563EB",
              borderRadius: 12,
              padding: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Loader2 size={20} color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
