import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { referralService } from "../../services/referralService";
import type { ReferralProfile } from "../../types/referral";
import { theme } from "../../theme";

type Props = {
  clientId: string;
};

export function ReferralDetailsCard({ clientId }: Props) {
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadReferral() {
      setLoading(true);

      try {
        const data = await referralService.getMyReferral(clientId);
        if (active) setProfile(data);
      } catch {
        if (active) {
          Alert.alert(
            "Referral unavailable",
            "Could not load your referral details. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (clientId) {
      loadReferral();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [clientId]);

  const PLAY_STORE_LINK =
    "https://play.google.com/store/apps/details?id=com.sustainfyenergy.pvprotect";

  async function shareReferral() {
    if (!profile?.referralLink) return;

    try {
      await Share.share({
        message:
          `Hey!\n\n` +
          `I've been using PVprotech for my solar panel cleaning & maintenance, and the experience has been great.\n\n` +
          `Professional cleaning, maintenance, and repairs — all handled smoothly by trained experts.\n\n` +
          `Download the app here:\n` +
          `Link: ${profile.referralLink}\n\n` +
          `Definitely recommend giving it a try. 🙌\n\n` +
          `Use my referral code: ${profile.referralCode}\n\n` +
          `Play Store link:\n${PLAY_STORE_LINK}`,
      });
    } catch {
      Alert.alert("Unable to share", "Please try again.");
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.iconBox}>
          <Ionicons name="gift-outline" size={22} color={theme.colors.accent} />
        </View>
        <View style={styles.headingText}>
          <Text style={styles.title}>Your referral code</Text>
          <Text style={styles.subtitle}>Invite friends and earn rewards</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
      ) : profile ? (
        <>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{profile.referralCode}</Text>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={theme.colors.accent}
            />
          </View>

          <Pressable style={styles.shareButton} onPress={shareReferral}>
            <Ionicons name="share-social-outline" size={19} color="#fff" />
            <Text style={styles.shareText}>Share referral link</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            referralService
              .getMyReferral(clientId)
              .then(setProfile)
              .catch(() =>
                Alert.alert("Error", "Unable to load referral details."),
              )
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryText}>Retry loading referral</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 17,
    gap: 15,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: theme.colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: { flex: 1 },
  title: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  codeBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.radius.md,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  code: {
    color: theme.colors.primary,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  shareText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  loader: { paddingVertical: 20 },
  retryButton: { paddingVertical: 12, alignItems: "center" },
  retryText: { color: theme.colors.primaryMid, fontWeight: "700" },
});
