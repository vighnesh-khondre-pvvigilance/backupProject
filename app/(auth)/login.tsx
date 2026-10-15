import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { registerOrLogin } from "../../src/services/auth.service";
import { getApiError } from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";
import { theme } from "../../src/theme";

export default function LoginScreen() {
  const params = useLocalSearchParams<{ ref?: string }>();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(
    typeof params.ref === "string" ? params.ref.toUpperCase() : "",
  );
  const [busy, setBusy] = useState(false);
  const { completeLogin } = useAuth();

  async function submit() {
    const phone = contactNumber.replace(/\s/g, "");
    if (!/^\d{10}$/.test(phone))
      return Alert.alert(
        "Check mobile number",
        "Enter a 10-digit mobile number.",
      );
    setBusy(true);
    try {
      const result = await registerOrLogin({
        name,
        contactNumber: phone,
        email,
        referralCode,
      });

      if (!result.success) {
        if (result.verifyRequired && result.clientId) {
          router.push({
            pathname: "/(auth)/verify-otp",
            params: { clientId: result.clientId },
          });
          return;
        }

        return Alert.alert(
          "Unable to continue",
          result.message || "Please try again.",
        );
      }
      

      if (result.login && result.token && result.user) {
        await completeLogin(result.token, result.user);
        router.replace("/(protected)/home");
        return;
      }
      if (result.verifyRequired && result.clientId) {
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { clientId: result.clientId },
        });
        return;
      }
      Alert.alert(
        "Unexpected response",
        "The server response did not include login or OTP verification details.",
      );
    } catch (error: any) {
  console.log("REGISTER LOGIN ERROR:", {
    message: error?.message,
    status: error?.response?.status,
    data: error?.response?.data,
    url: error?.config?.url,
    baseURL: error?.config?.baseURL,
  });

  Alert.alert(
    "Login error",
    error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.",
  );
} finally {
  setBusy(false);
} }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>PV</Text>
        </View>
        <Text style={styles.eyebrow}>PVPROTECH CUSTOMER</Text>
        <Text style={styles.title}>Welcome aboard.</Text>
        <Text style={styles.subtitle}>
          Sign in or create an account to manage your wallet and referral
          rewards.
        </Text>
        <View style={styles.form}>
          <Field
            label="Mobile number *"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
          />
          <Field
            label="Full name (new customers)"
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
          />
          <Field
            label="Email (needed for new registration)"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Referral code (optional)"
            value={referralCode}
            onChangeText={(v) => setReferralCode(v.toUpperCase())}
            placeholder="e.g. PVPEPK"
            autoCapitalize="characters"
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.88 },
              busy && { opacity: 0.65 },
            ]}
            onPress={submit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </Pressable>
          <Text style={styles.footnote}>
            New customers will receive a one-time password by email. Existing
            verified customers can sign in with their mobile number.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={props.keyboardType || "default"}
        autoCapitalize={props.autoCapitalize || "sentences"}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    letterSpacing: -1,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 26,
  },
  form: { gap: 16 },
  field: { gap: 7 },
  label: { color: theme.colors.text, fontWeight: "700", fontSize: 13 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  footnote: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 2,
  },
})
