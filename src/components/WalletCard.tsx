import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

export function WalletCard({ balance }: { balance?: number | null }) {
  const value = Number.isFinite(Number(balance)) ? Number(balance) : 0;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.walletIcon}>
          <Ionicons name="wallet-outline" size={21} color="#FFFFFF" />
        </View>
        <Text style={styles.label}>WALLET BALANCE</Text>
        <View style={{ flex: 1 }} />
        <Ionicons name="shield-checkmark-outline" size={18} color="#CBD5E1" />
      </View>
      <Text style={styles.amount}>
        {value.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        })}
      </Text>
      <Text style={styles.note}>Your available reward balance</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    padding: 21,
    minHeight: 160,
    justifyContent: "center",
  },
  top: { flexDirection: "row", alignItems: "center", gap: 9 },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF20",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 18,
  },
  note: { color: "#CBD5E1", fontSize: 12, marginTop: 5 },
});
