import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00A9A5',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = phone.trim().length >= 8 && password.length >= 6;

  const submit = async () => {
    if (!canSubmit) {
      Alert.alert('Missing details', 'Enter a valid phone number and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({
        password,
        phone: phone.trim(),
      });
      router.replace('/(tabs)/more');
    } catch {
      Alert.alert('Sign in failed', 'Check your phone number and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandMark}>
        <Ionicons name="medical-outline" size={30} color={colors.brand} />
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to manage saved addresses, orders, and prescription requests.</Text>

      <View style={styles.formCard}>
        <Field label="Phone number">
          <TextInput
            keyboardType="phone-pad"
            placeholder="01xxxxxxxxx"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        </Field>

        <Field label="Password">
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.eyeButton} onPress={() => setShowPassword((current) => !current)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={colors.muted} />
            </Pressable>
          </View>
        </Field>

        <Pressable
          disabled={isSubmitting}
          style={canSubmit && !isSubmitting ? styles.primaryButton : styles.disabledButton}
          onPress={submit}
        >
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
        </Pressable>

        <Pressable style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>New customer?</Text>
        <Pressable onPress={() => router.replace('/signup')}>
          <Text style={styles.footerLink}>Create account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type FieldProps = {
  children: React.ReactNode;
  label: string;
};

function Field({ children, label }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 32,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 24,
    height: 58,
    justifyContent: 'center',
    marginBottom: 18,
    width: 58,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    height: 50,
    paddingHorizontal: 13,
  },
  passwordRow: {
    alignItems: 'center',
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
  },
  passwordInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 13,
  },
  eyeButton: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 48,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 13,
    height: 52,
    justifyContent: 'center',
    marginTop: 4,
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 13,
    height: 52,
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  forgotButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },
  forgotText: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '800',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  footerLink: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
});
