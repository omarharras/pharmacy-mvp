import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00b6bd',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useSession();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit =
    fullName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    password.length >= 6 &&
    acceptedTerms;

  const submit = async () => {
    if (!canSubmit) {
      Alert.alert('Missing details', 'Complete your details and accept the terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        fullName: fullName.trim(),
        password,
        phone: phone.trim(),
      });
      router.replace('/(tabs)/more');
    } catch {
      Alert.alert('Create account failed', 'This phone may already be registered.');
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
        <Ionicons name="person-add-outline" size={30} color={colors.brand} />
      </View>

      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Save your delivery details and track product and prescription orders.</Text>

      <View style={styles.formCard}>
        <Field label="Full name">
          <TextInput
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </Field>

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
          <TextInput
            placeholder="At least 6 characters"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </Field>

        <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms((current) => !current)}>
          <View style={acceptedTerms ? styles.checkboxActive : styles.checkbox}>
            {acceptedTerms ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
          </View>
          <Text style={styles.termsText}>I accept terms and privacy policy</Text>
        </Pressable>

        <Pressable
          disabled={isSubmitting}
          style={canSubmit && !isSubmitting ? styles.primaryButton : styles.disabledButton}
          onPress={submit}
        >
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable onPress={() => router.replace('/signin')}>
          <Text style={styles.footerLink}>Sign in</Text>
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
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 40,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9CA3AF',
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  termsText: {
    color: colors.brand,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    marginLeft: 10,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 13,
    height: 52,
    justifyContent: 'center',
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 13,
    height: 52,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
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
