import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { referralService } from "../../services/referralService";
import type {
  ReferralHistory,
  ReferralHistoryItem,
} from "../../types/referral";
import { theme } from "../../theme";

const PREVIEW_COUNT = 5;

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return `${user.slice(0, 2)}${"*".repeat(
    Math.min(Math.max(user.length - 2, 3), 5),
  )}@${domain}`;
}

function maskPhone(phone: string) {
  return phone.length > 4
    ? `${phone.slice(0, 2)}${"x".repeat(phone.length - 4)}${phone.slice(-2)}`
    : phone;
}

type Props = {
  clientId: string;
};

function formatDate(value?: string) {
  if (!value) return "Not completed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusColor(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return theme.colors.accent;
    case "PENDING":
      return "#D97706";
    case "FAILED":
      return theme.colors.danger;
    default:
      return theme.colors.muted;
  }
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={18} color={theme.colors.primaryMid} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ReferralRow({ item }: { item: ReferralHistoryItem }) {
  const name = item.referredClient?.name?.trim() || item.referredClientId;

  return (
    <View style={styles.referralRow}>
      <View style={styles.personIcon}>
        <Ionicons
          name="person-outline"
          size={20}
          color={theme.colors.primaryMid}
        />
      </View>

      <View style={styles.referralInfo}>
        <Text style={styles.referralName} numberOfLines={1}>
          {name}
        </Text>

        {item.referredClient?.email ? (
          <Text style={styles.date} numberOfLines={1}>
            {maskEmail(item.referredClient.email)}
          </Text>
        ) : null}

        {item.referredClient?.contactNumber ? (
          <Text style={styles.date}>
            {maskPhone(item.referredClient.contactNumber)}
          </Text>
        ) : null}

        <Text style={styles.date}>Joined {formatDate(item.createdAt)}</Text>

        <Text style={styles.date}>
          {item.completedAt
            ? `Completed ${formatDate(item.completedAt)}`
            : "Awaiting completion"}
        </Text>
      </View>

      <View style={styles.rewardInfo}>
        <Text
          style={[
            styles.reward,
            !item.rewardGiven && { color: theme.colors.muted },
          ]}
        >
          {item.rewardGiven ? `+₹${item.referrerReward ?? 0}` : "—"}
        </Text>
        <Text style={[styles.status, { color: statusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

export function ReferralHistoryCard({ clientId }: Props) {
  const [history, setHistory] = useState<ReferralHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const referrals = [...(history?.referrals ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const visibleReferrals = showAll
    ? referrals
    : referrals.slice(0, PREVIEW_COUNT);
  const hasMore = referrals.length > PREVIEW_COUNT;

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await referralService.getReferralHistory(clientId);
      setHistory(data);
      setShowAll(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      void loadHistory();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [clientId, loadHistory]);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded((previous) => !previous)}
      >
        <View style={styles.headerIcon}>
          <Ionicons
            name="people-outline"
            size={22}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Referral history</Text>
          <Text style={styles.subtitle}>Track your invites and rewards</Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.muted}
        />
      </Pressable>

      {expanded && (
        <>
          {loading ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={styles.loader}
            />
          ) : error || !history ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                Could not load referral history.
              </Text>
              <Pressable onPress={() => void loadHistory()}>
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <Stat
                  label="Total invites"
                  value={history.summary.totalReferrals}
                  icon="people-outline"
                />
                <Stat
                  label="Completed"
                  value={history.summary.completedReferrals}
                  icon="checkmark-circle-outline"
                />
                <Stat
                  label="Pending"
                  value={history.summary.pendingReferrals}
                  icon="time-outline"
                />
                <Stat
                  label="Failed"
                  value={history.summary.failedReferrals}
                  icon="close-circle-outline"
                />
              </View>

              <View style={styles.totalRewards}>
                <View>
                  <Text style={styles.totalLabel}>Total rewards earned</Text>
                  <Text style={styles.totalHint}>From your referrals</Text>
                </View>
                <Text style={styles.totalAmount}>
                  ₹{history.summary.totalRewards}
                </Text>
              </View>

              <Text style={styles.listTitle}>Recent referrals</Text>

              {referrals.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons
                    name="people-outline"
                    size={28}
                    color={theme.colors.muted}
                  />
                  <Text style={styles.emptyText}>
                    No referrals yet. Share your code to get started!
                  </Text>
                </View>
              ) : (
                <>
                  {visibleReferrals.map((item) => (
                    <ReferralRow key={item.referralId} item={item} />
                  ))}

                  {hasMore && (
                    <Pressable
                      style={styles.viewAllButton}
                      onPress={() => setShowAll((prev) => !prev)}
                    >
                      <Text style={styles.viewAllText}>
                        {showAll
                          ? "Show less"
                          : `View all (${referrals.length})`}
                      </Text>
                      <Ionicons
                        name={showAll ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={theme.colors.primaryMid}
                      />
                    </Pressable>
                  )}
                </>
              )}

              <Pressable
                style={styles.refreshButton}
                onPress={() => void loadHistory()}
              >
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.refreshText}>Refresh history</Text>
              </Pressable>
            </>
          )}
        </>
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
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  stat: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    gap: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  statLabel: { fontSize: 12, color: theme.colors.muted },
  totalRewards: {
    backgroundColor: theme.colors.softGreen,
    borderRadius: theme.radius.md,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 13, fontWeight: "800", color: theme.colors.primary },
  totalHint: { fontSize: 11, color: theme.colors.muted, marginTop: 4 },
  totalAmount: { fontSize: 25, fontWeight: "900", color: "#15803D" },
  listTitle: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  personIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  referralInfo: { flex: 1 },
  referralName: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  date: { color: theme.colors.muted, fontSize: 11, marginTop: 3 },
  rewardInfo: { alignItems: "flex-end", gap: 5 },
  reward: {
    color: "#15803D",
    fontSize: 15,
    fontWeight: "900",
  },
  status: { fontSize: 10, fontWeight: "800" },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
  },
  viewAllText: {
    color: theme.colors.primaryMid,
    fontSize: 13,
    fontWeight: "800",
  },
  empty: { alignItems: "center", padding: 20, gap: 9 },
  emptyText: {
    color: theme.colors.muted,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
  errorBox: { alignItems: "center", padding: 15, gap: 10 },
  errorText: { color: theme.colors.muted, fontSize: 12 },
  retryText: { color: theme.colors.primaryMid, fontWeight: "800" },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  refreshText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  loader: { paddingVertical: 24 },
});
