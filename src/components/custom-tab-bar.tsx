import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    name: "index",
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  learn: {
    name: "learn",
    label: "Learn",
    icon: "book-outline",
    activeIcon: "book",
  },
  "ai-teacher": {
    name: "ai-teacher",
    label: "AI Teacher",
    icon: "sparkles-outline",
    activeIcon: "sparkles",
  },
  chat: {
    name: "chat",
    label: "Chat",
    icon: "chatbubble-outline",
    activeIcon: "chatbubble",
  },
  profile: {
    name: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
};

const CIRCLE_SIZE = 46;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = state.index;

  const tabWidth = containerWidth > 0 ? containerWidth / state.routes.length : 0;
  const targetX =
    tabWidth > 0 ? activeIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2 : 0;

  const indicatorX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      indicatorX.value = withSpring(targetX, {
        damping: 18,
        stiffness: 160,
        mass: 0.8,
      });
    }
  }, [activeIndex, tabWidth, targetX, indicatorX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorX.value }],
    };
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        paddingBottom: Math.max(insets.bottom, 12),
        borderTopWidth: 1,
        borderTopColor: "#F0F2F5",
        elevation: 8,
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <View
        className="relative h-[62px] flex-row items-center"
        onLayout={handleLayout}
      >
        {/* Animated Active Circle Background */}
        {containerWidth > 0 ? (
          <Animated.View
            className="absolute top-[8px] size-[46px] items-center justify-center rounded-full bg-brand-purple"
            style={[animatedIndicatorStyle]}
          />
        ) : null}

        {/* Tab Buttons */}
        {state.routes.map(
          (
            route: any,
            index: number
          ) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIGS[route.name] || {
              name: route.name,
              label: route.name,
              icon: "square-outline",
              activeIcon: "square",
            };

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={descriptors[route.key]?.options?.tabBarAccessibilityLabel ?? config.label}
                testID={descriptors[route.key]?.options?.tabBarButtonTestID}
                activeOpacity={0.8}
                className="flex-1 items-center justify-center h-full"
                onPress={onPress}
                onLongPress={onLongPress}
              >
                {isFocused ? (
                  // Active Tab: Only white icon inside animated circle, no text label
                  <View className="size-[46px] items-center justify-center">
                    <Ionicons
                      name={config.activeIcon}
                      size={22}
                      color="#FFFFFF"
                    />
                  </View>
                ) : (
                  // Inactive Tab: Icon + Label text below
                  <View className="items-center justify-center gap-1">
                    <Ionicons
                      name={config.icon}
                      size={22}
                      color="#8490AD"
                    />
                    <Text
                      className="font-poppins-medium text-[11px] leading-[14px] text-[#8490AD]"
                      numberOfLines={1}
                    >
                      {config.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </View>
  );
}

