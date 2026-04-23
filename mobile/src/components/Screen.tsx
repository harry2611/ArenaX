import { ReactNode } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};

export function Screen({ children, scroll = true, contentStyle, maxWidth }: Props) {
  const { width } = useWindowDimensions();
  const resolvedMaxWidth =
    maxWidth ?? (width >= 1400 ? 1320 : width >= 1100 ? 1180 : width >= 768 ? 960 : 720);

  return (
    <LinearGradient
      colors={["#06111f", "#091829", "#0a1320"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              width >= 1100 ? styles.scrollContentDesktop : null
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.content,
                width >= 1100 ? styles.contentDesktop : null,
                { maxWidth: resolvedMaxWidth },
                contentStyle
              ]}
            >
              {children}
            </View>
          </ScrollView>
        ) : (
          <View
            style={[
              styles.content,
              width >= 1100 ? styles.contentDesktop : null,
              { maxWidth: resolvedMaxWidth },
              contentStyle
            ]}
          >
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center"
  },
  scrollContentDesktop: {
    paddingHorizontal: 24
  },
  content: {
    width: "100%",
    padding: 20,
    gap: 16
  },
  contentDesktop: {
    paddingHorizontal: 24,
    paddingVertical: 28
  }
});
