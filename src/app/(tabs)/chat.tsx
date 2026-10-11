import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonsByLanguage } from "@/data/lessons";
import { useLanguageStore } from "@/store/useLanguageStore";

interface ChatMessage {
  id: string;
  sender: "luna" | "user";
  text: string;
  translation?: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  "¡Hola! ¿Cómo estás hoy?",
  "How do I order a coffee in Spanish?",
  "Explain when to use 'Por' vs 'Para'",
  "Quiz me on 5 daily vocabulary words",
  "How do I ask for the check politely?",
];

let nextMessageId = 1;

function generateMessageId(prefix: string): string {
  nextMessageId += 1;
  return `${prefix}-${nextMessageId}`;
}

function getFormattedTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatTab() {
  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const currentLanguage = getSelectedLanguage();
  const lessons = currentLanguage ? getLessonsByLanguage(currentLanguage.id) : [];
  const defaultLessonId = lessons[0]?.id || "es-1-1";

  const languageName = currentLanguage?.name || "Spanish";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "luna",
      text: `¡Hola! I am Luna, your AI language tutor. Let's practice ${languageName} together. You can write to me or ask any question!`,
      translation: `Hello! I am Luna, your AI language tutor. Let's practice together.`,
      timestamp: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: generateMessageId("user"),
      sender: "user",
      text,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // AI Luna response simulation based on input
    setTimeout(() => {
      let aiResponseText = `¡Excelente! That's a great phrase. In ${languageName}, native speakers often say: "¡Qué bueno verte!"`;
      let aiTranslation = "Great! That's a great phrase. In Spanish, native speakers often say: 'So good to see you!'";

      const lower = text.toLowerCase();
      if (lower.includes("coffee") || lower.includes("order") || lower.includes("café")) {
        aiResponseText = "Para pedir un café, puedes decir: \"Un café con leche, por favor.\" ☕";
        aiTranslation = "To order a coffee, you can say: 'A coffee with milk, please.'";
      } else if (lower.includes("hola") || lower.includes("hello") || lower.includes("hi")) {
        aiResponseText = "¡Hola amigo! ¿Qué planes tienes para hoy? Vamos a practicar hablar sobre tu día.";
        aiTranslation = "Hello friend! What plans do you have for today? Let's practice talking about your day.";
      } else if (lower.includes("check") || lower.includes("bill")) {
        aiResponseText = "Puedes decir: \"La cuenta, por favor.\" O más formal: \"¿Me trae la cuenta, por favor?\" 🧾";
        aiTranslation = "You can say: 'The check, please.' Or more formally: 'Could you bring me the check, please?'";
      } else if (lower.includes("quiz") || lower.includes("words")) {
        aiResponseText = "¿Cómo se dice 'Thank you very much' en español? ¡Pista: empieza con 'M'!";
        aiTranslation = "How do you say 'Thank you very much' in Spanish? Hint: starts with 'M'!";
      }

      const aiReply: ChatMessage = {
        id: generateMessageId("luna"),
        sender: "luna",
        text: aiResponseText,
        translation: aiTranslation,
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }, 900);
  };

  const handlePlayVoice = (id: string) => {
    setPlayingAudioId(id);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 1200);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: generateMessageId("msg"),
        sender: "luna",
        text: `¡Hola! Chat refreshed. What would you like to practice in ${languageName}?`,
        translation: "Hello! Chat refreshed. What would you like to practice?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Chat Top Header ─── */}
      <View className="h-[56px] flex-row items-center justify-between px-4 border-b border-[#F5F6F8]">
        <View className="flex-row items-center">
          <View style={styles.avatarWrap}>
            <Image
              source={images.mascotWelcome}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
            <View style={styles.onlineDot} />
          </View>

          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="font-poppins-bold text-[16px] text-text-primary">
                Luna
              </Text>
              <View className="ml-2 rounded-full bg-[#EDE9FE] px-2 py-0.5">
                <Text className="font-poppins-medium text-[10px] text-brand-purple">
                  AI Tutor
                </Text>
              </View>
            </View>
            <Text className="font-poppins text-[11px] text-[#22C55E]">
              Online & Ready
            </Text>
          </View>
        </View>

        {/* Right header actions: Launch Voice Lesson + Clear chat */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            accessibilityLabel="Start voice call with Luna"
            className="flex-row items-center rounded-full bg-brand-purple px-3 py-1.5 shadow-sm active:bg-brand-deep-purple"
            onPress={() => router.push(`/lesson/${defaultLessonId}` as any)}
          >
            <Ionicons name="call" size={14} color="#FFFFFF" />
            <Text className="ml-1.5 font-poppins-semibold text-[12px] text-white">
              Voice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Clear chat"
            className="size-9 items-center justify-center rounded-full active:bg-[#F3F4F6]"
            onPress={handleClearChat}
          >
            <Ionicons name="refresh-outline" size={19} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ─── Message List ─── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isLuna = item.sender === "luna";
            const isPlaying = playingAudioId === item.id;

            return (
              <View
                style={[
                  styles.messageRow,
                  isLuna ? styles.messageRowLuna : styles.messageRowUser,
                ]}
              >
                {isLuna && (
                  <View style={styles.bubbleAvatar}>
                    <Image
                      source={images.mascotLogo}
                      style={{ width: 26, height: 26 }}
                      resizeMode="contain"
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.bubbleCard,
                    isLuna ? styles.bubbleLuna : styles.bubbleUser,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isLuna ? styles.textLuna : styles.textUser,
                    ]}
                  >
                    {item.text}
                  </Text>

                  {item.translation ? (
                    <View style={styles.translationWrap}>
                      <Text style={styles.translationText}>
                        💡 {item.translation}
                      </Text>
                    </View>
                  ) : null}

                  <View className="mt-1 flex-row items-center justify-between">
                    <Text
                      style={[
                        styles.timestampText,
                        isLuna ? styles.timestampLuna : styles.timestampUser,
                      ]}
                    >
                      {item.timestamp}
                    </Text>

                    {isLuna && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.listenButton}
                        onPress={() => handlePlayVoice(item.id)}
                      >
                        <Ionicons
                          name={isPlaying ? "volume-high" : "volume-medium-outline"}
                          size={15}
                          color="#6C4EF5"
                        />
                        <Text style={styles.listenButtonText}>
                          {isPlaying ? "Playing..." : "Pronounce"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicatorRow}>
                <View style={styles.bubbleAvatar}>
                  <Image
                    source={images.mascotLogo}
                    style={{ width: 26, height: 26 }}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color="#6C4EF5" />
                  <Text style={styles.typingText}>Luna is thinking...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* ─── Quick Suggestion Chips ─── */}
        <View style={styles.suggestionsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={QUICK_SUGGESTIONS}
            keyExtractor={(item, index) => `sug-${index}`}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ─── Bottom Chat Input Bar ─── */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.micInputButton}
            onPress={() => handleSendMessage("¡Hola Luna! Practice pronunciation with me.")}
          >
            <Ionicons name="mic-outline" size={20} color="#6C4EF5" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message Luna in ${languageName}...`}
            placeholderTextColor="#9CA3AF"
            returnKeyType="send"
            onSubmitEditing={() => handleSendMessage()}
          />

          <TouchableOpacity
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSendMessage()}
          >
            <Ionicons name="send" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#22C55E",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  messageRowLuna: {
    justifyContent: "flex-start",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    alignSelf: "flex-end",
  },
  bubbleCard: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleLuna: {
    backgroundColor: "#F7F5FF",
    borderWidth: 1,
    borderColor: "#EDE9FE",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#6C4EF5",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  textLuna: {
    color: "#0D132B",
  },
  textUser: {
    color: "#FFFFFF",
  },
  translationWrap: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(108, 78, 245, 0.15)",
  },
  translationText: {
    fontFamily: "Poppins",
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
  },
  timestampText: {
    fontFamily: "Poppins",
    fontSize: 10,
  },
  timestampLuna: {
    color: "#9CA3AF",
  },
  timestampUser: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  listenButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  listenButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    color: "#6C4EF5",
    marginLeft: 3,
  },
  typingIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F5FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  typingText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#6C4EF5",
  },
  suggestionsContainer: {
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F5F6F8",
  },
  suggestionChip: {
    backgroundColor: "#F6F7FB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  suggestionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#4B5563",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  micInputButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#0D132B",
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
});
