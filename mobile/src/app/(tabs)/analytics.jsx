import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react-native";

export default function Analytics() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const screenWidth = Dimensions.get("window").width;

  // Mock analytics data - in a real app, this would come from a database
  const [analyticsData, setAnalyticsData] = useState({
    problemsSolved: 24,
    averageTime: "3.2 min",
    accuracy: 87,
    streak: 5,
    topicProgress: [
      { topic: "Ratio Analysis", progress: 85, color: "#3B82F6" },
      { topic: "Capital Budgeting", progress: 72, color: "#10B981" },
      { topic: "Working Capital", progress: 91, color: "#F59E0B" },
      { topic: "Financial Planning", progress: 68, color: "#8B5CF6" },
      { topic: "Cost of Capital", progress: 79, color: "#EF4444" },
      { topic: "Statement Analysis", progress: 83, color: "#06B6D4" },
    ],
    recentActivity: [
      { date: "2024-11-02", problems: 5, avgTime: "2.8 min" },
      { date: "2024-11-01", problems: 3, avgTime: "3.1 min" },
      { date: "2024-10-31", problems: 7, avgTime: "2.9 min" },
      { date: "2024-10-30", problems: 4, avgTime: "3.5 min" },
      { date: "2024-10-29", problems: 6, avgTime: "3.0 min" },
      { date: "2024-10-28", problems: 2, avgTime: "4.2 min" },
      { date: "2024-10-27", problems: 8, avgTime: "2.7 min" },
    ],
  });

  const periods = [
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        flex: 1,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          backgroundColor: color + "20",
          borderRadius: 8,
          padding: 8,
          alignSelf: "flex-start",
          marginBottom: 12,
        }}
      >
        <Icon size={20} color={color} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1F2937",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#6B7280",
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 10,
            color: "#9CA3AF",
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const ProgressBar = ({ topic, progress, color }) => (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
          {topic}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "600", color: color }}>
          {progress}%
        </Text>
      </View>
      <View
        style={{
          height: 8,
          backgroundColor: "#F3F4F6",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#3B82F6",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Learning Analytics
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#E0E7FF",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Track your progress and performance
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor:
                  selectedPeriod === period.id ? "#3B82F6" : "transparent",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedPeriod === period.id ? "white" : "#6B7280",
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            marginHorizontal: -4,
          }}
        >
          <StatCard
            icon={Target}
            title="Problems Solved"
            value={analyticsData.problemsSolved}
            subtitle="This week"
            color="#3B82F6"
          />
          <StatCard
            icon={Clock}
            title="Avg. Time"
            value={analyticsData.averageTime}
            subtitle="Per problem"
            color="#10B981"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            marginHorizontal: -4,
          }}
        >
          <StatCard
            icon={Award}
            title="Accuracy"
            value={`${analyticsData.accuracy}%`}
            subtitle="Overall score"
            color="#F59E0B"
          />
          <StatCard
            icon={TrendingUp}
            title="Streak"
            value={`${analyticsData.streak} days`}
            subtitle="Keep it up!"
            color="#8B5CF6"
          />
        </View>

        {/* Topic Progress */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <PieChart size={20} color="#3B82F6" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1F2937",
                marginLeft: 8,
              }}
            >
              Topic Progress
            </Text>
          </View>

          {analyticsData.topicProgress.map((item, index) => (
            <ProgressBar
              key={index}
              topic={item.topic}
              progress={item.progress}
              color={item.color}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BarChart3 size={20} color="#3B82F6" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1F2937",
                marginLeft: 8,
              }}
            >
              Recent Activity
            </Text>
          </View>

          {analyticsData.recentActivity.map((day, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth:
                  index < analyticsData.recentActivity.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                  }}
                >
                  Avg: {day.avgTime}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#3B82F6",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {day.problems} problems
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#F59E0B",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#92400E",
              marginBottom: 8,
            }}
          >
            🏆 Recent Achievements
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#92400E",
              lineHeight: 20,
            }}
          >
            • Solved 5 problems in a row correctly{"\n"}• Completed Ratio
            Analysis topic{"\n"}• Maintained 5-day learning streak{"\n"}•
            Improved average solving time by 15%
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
