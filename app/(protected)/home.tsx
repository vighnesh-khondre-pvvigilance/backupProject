import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { WalletCard } from "../../src/components/WalletCard";
import { ReferralCard } from "../../src/components/ReferralCard";
import { theme } from "../../src/theme";
import { ReferralDetailsCard } from "../../src/components/referrals/ReferralDetailsCard";
import { ReferralHistoryCard } from "../../src/components/referrals/ReferralHistoryCard";

export default function HomeScreen() {
  const { user, loading, refreshProfile, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const clientId =
    (
      user as
        | (typeof user & {
            clientId?: string;
            client_id?: string;
            id?: string;
          })
        | null
    )?.clientId ??
    (
      user as
        | (typeof user & {
            client_id?: string;
            id?: string;
          })
        | null
    )?.client_id ??
    (user as (typeof user & { id?: string }) | null)?.id ??
    "";

  useFocusEffect(
    useCallback(() => {
      if (!loading && !user) router.replace("/(auth)/login");
    }, [loading, user]),
  );

  async function refresh() {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch {
      Alert.alert(
        "Could not refresh",
        "Check your internet connection and try again.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function signOut() {
    await logout();
    router.replace("/(auth)/login");
  }

  if (loading || !user)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>PVPROTECH</Text>
          <Text style={styles.greeting}>
            Hello, {user.name?.split(" ")[0] || "there"} 👋
          </Text>
          <Text style={styles.headerSub}>Your rewards, all in one place.</Text>
        </View>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Account",
              `${user.name || "Customer"}\n${user.contactNumber || user.phone || ""}\n${user.email || ""}`,
            )
          }
          style={styles.avatar}
        >
          <Ionicons
            name="person-outline"
            size={23}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>
      <WalletCard balance={user.balance} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Invite & earn</Text>
        <Text style={styles.sectionHint}>Referral rewards</Text>
      </View>

      <ReferralDetailsCard clientId={clientId} />

      <ReferralHistoryCard clientId={clientId} />
      <View style={styles.infoCard}>
        <Ionicons
          name="information-circle-outline"
          size={21}
          color={theme.colors.primaryMid}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>How rewards work</Text>
          <Text style={styles.infoText}>
            Your friend receives ₹50 and you receive ₹25 when their registration
            is successfully verified.
          </Text>
        </View>
      </View>
      <Pressable style={styles.logout} onPress={signOut}>
        <Ionicons name="log-out-outline" size={18} color={theme.colors.muted} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      <Text style={styles.footer}>
        PVprotech Customer · Made for better solar experiences
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingBottom: 20,
  },
  content: { padding: 10, paddingTop: 24, paddingBottom: 36, gap: 20 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  brand: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 7,
  },
  greeting: {
    color: theme.colors.primary,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  headerSub: { color: theme.colors.muted, fontSize: 13, marginTop: 5 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: -10,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },
  sectionHint: { color: theme.colors.muted, fontSize: 12 },
  infoCard: {
    flexDirection: "row",
    gap: 11,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoTitle: { color: theme.colors.primary, fontWeight: "800", fontSize: 13 },
  infoText: { color: "#475569", fontSize: 12, lineHeight: 18, marginTop: 4 },
  logout: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 10,
  },
  logoutText: { color: theme.colors.muted, fontSize: 13, fontWeight: "700" },
  footer: {
    color: "#94A3B8",
    textAlign: "center",
    fontSize: 10,
    marginTop: -10,
  },
});
