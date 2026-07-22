import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const colors = {
  brand: '#00b6bd',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function PrivacyScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="shield-checkmark-outline" size={30} color={colors.brand} />
        </View>
        <Text style={styles.title}>Privacy policy</Text>
        <Text style={styles.subtitle}>How this MVP handles account, order, address, and prescription information.</Text>
      </View>

      <PolicySection
        title="Information we collect"
        text="We collect the details needed to place pharmacy requests, including name, phone number, delivery address, order items, notes, and uploaded prescription files."
      />
      <PolicySection
        title="How we use it"
        text="Your information is used to prepare orders, review prescriptions, contact you about availability, and arrange delivery or pickup."
      />
      <PolicySection
        title="Prescription uploads"
        text="Prescription images are stored locally for this MVP demo. Production storage should use secure, access-controlled infrastructure before release."
      />
      <PolicySection
        title="Account security"
        text="Passwords are hashed on the backend. The mobile app uses a session token after sign in; persistent secure token storage is planned next."
      />
      <PolicySection
        title="Data removal"
        text="For the MVP, data can be removed by the development team from the local database. A customer-facing deletion request flow can be added later."
      />
    </ScrollView>
  );
}

function PolicySection({ text, title }: { text: string; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
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
    paddingTop: 18,
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    marginBottom: 14,
    width: 52,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
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
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
  },
  sectionText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});
