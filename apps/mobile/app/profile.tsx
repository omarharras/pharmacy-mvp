import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthRequiredModal } from '@/components/auth-required-modal';
import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00b6bd',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { customer, isRestoringSession, token, updateProfile } = useSession();
  const [fullName, setFullName] = useState(customer?.fullName ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const canSave = fullName.trim().length >= 2 && !isSaving;

  useEffect(() => {
    if (!customer) {
      return;
    }

    setFullName(customer.fullName);
  }, [customer]);

  useEffect(() => {
    if (!isRestoringSession && !token) {
      setShowAuthPrompt(true);
    }
  }, [isRestoringSession, token]);

  const saveProfile = async () => {
    if (!token) {
      setShowAuthPrompt(true);
      return;
    }

    if (!canSave) {
      setErrorMessage('Enter your name and a valid phone number.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateProfile({
        fullName: fullName.trim(),
      });
      router.back();
    } catch {
      setErrorMessage('Unable to update profile. Check that the API is running.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Edit profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={27} color={colors.brand} />
        </View>
        <View style={styles.profileTextBlock}>
          <Text style={styles.profileTitle}>Customer details</Text>
          <Text style={styles.profileText}>Update the name used for orders and pharmacy contact.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal information</Text>
        <TextInput
          autoCapitalize="words"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          placeholderTextColor="#8A8A8A"
        />
        <TextInput
          editable={false}
          style={styles.readOnlyInput}
          value={customer?.phone ?? ''}
        />
        <Text style={styles.readOnlyHint}>Mobile number cannot be changed from profile settings.</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Pressable
        style={canSave ? styles.saveButton : styles.disabledButton}
        disabled={!canSave}
        onPress={saveProfile}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save profile'}</Text>
      </Pressable>

      <AuthRequiredModal
        returnTo="/profile"
        visible={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  profileTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  profileTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  section: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    height: 54,
    marginBottom: 10,
    paddingHorizontal: 13,
  },
  readOnlyInput: {
    backgroundColor: '#EEF0F2',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    height: 54,
    marginBottom: 7,
    paddingHorizontal: 13,
  },
  readOnlyHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 13,
    lineHeight: 19,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
