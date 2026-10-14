import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

export function ReferralCard({
  referralCode,
}: {
  referralCode?: string | null;
}) {
  const code = referralCode || "NOT AVAILABLE";
  const link = `https://pvprotech.com/register?ref=${encodeURIComponent(code)}`;

  async function copyCode() {
    if (!referralCode)
      return Alert.alert(
        "Referral code unavailable",
        "Refresh your profile or contact support.",
      );
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Copied", "Your referral code has been copied.");
  }
  async function share() {
    if (!referralCode)
      return Alert.alert(
        "Referral code unavailable",
        "Refresh your profile or contact support.",
      );
    try {
      await Share.share({
        message: `Join me on PVprotech! Use my referral code ${referralCode} when you register. ${link}`,
      });
    } catch {
      Alert.alert("Unable to share", "Please try again.");
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="people-outline"
            size={22}
            color={theme.colors.accent}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Refer & Earn</Text>
          <Text style={styles.subtitle}>Invite friends. Get rewarded.</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Share your code with a new customer. Rewards are added after their
        mobile registration is verified.
      </Text>
      <View style={styles.codeBox}>
        <View>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.code}>{code}</Text>
        </View>
        <Pressable
          onPress={copyCode}
          style={styles.copyButton}
          accessibilityLabel="Copy referral code"
        >
          <Ionicons
            name="copy-outline"
            size={20}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>
      <View style={styles.rewards}>
        <View>
          <Text style={styles.rewardLabel}>Your reward</Text>
          <Text style={styles.rewardAmount}>₹25</Text>
        </View>
        <View style={styles.rewardDivider} />
        <View>
          <Text style={styles.rewardLabel}>Friend's reward</Text>
          <Text style={styles.rewardAmount}>₹50</Text>
        </View>
      </View>
      <Pressable
        onPress={share}
        style={({ pressed }) => [
          styles.shareButton,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="share-social-outline" size={18} color="#fff" />
        <Text style={styles.shareText}>Share referral</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 15,
  },
  heading: { flexDirection: "row", alignItems: "center", gap: 11 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: theme.colors.primary, fontSize: 19, fontWeight: "800" },
  subtitle: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
  description: { color: theme.colors.muted, fontSize: 13, lineHeight: 19 },
  codeBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeLabel: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  code: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginTop: 5,
  },
  copyButton: {
    width: 42,
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rewards: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 2,
  },
  rewardLabel: { color: theme.colors.muted, fontSize: 12 },
  rewardAmount: {
    color: theme.colors.accent,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 3,
  },
  rewardDivider: { width: 1, height: 35, backgroundColor: theme.colors.border },
  shareButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 14,
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  shareText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
