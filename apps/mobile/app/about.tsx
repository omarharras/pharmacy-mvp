import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

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

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.logoMark}>
          <Image
            source={require('@/assets/images/elkhabiry-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>El Khabiry Pharmacy</Text>
        <Text style={styles.subtitle}>A premium pharmacy ordering MVP for products and prescription requests.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What this app does</Text>
        <Text style={styles.bodyText}>
          Customers can browse pharmacy products, choose package units, place product orders, upload prescriptions, select delivery times, and track request status.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>MVP scope</Text>
        <Feature icon="bag-outline" text="Product ordering with cart and checkout" />
        <Feature icon="document-attach-outline" text="Prescription upload and pharmacist review request" />
        <Feature icon="location-outline" text="Saved delivery addresses and branch browsing" />
        <Feature icon="receipt-outline" text="Order tracking for product and prescription flows" />
      </View>

      <View style={styles.versionCard}>
        <Text style={styles.versionLabel}>Version</Text>
        <Text style={styles.versionValue}>MVP 1.0</Text>
      </View>
    </ScrollView>
  );
}

function Feature({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name={icon} size={18} color={colors.brand} />
      <Text style={styles.featureText}>{text}</Text>
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
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    marginBottom: 14,
    padding: 18,
  },
  logoMark: {
    alignItems: 'center',
    height: 86,
    justifyContent: 'center',
    marginBottom: 16,
    width: 86,
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E6FFFE',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
  card: {
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
    marginBottom: 9,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 9,
  },
  featureText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginLeft: 9,
  },
  versionCard: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  versionLabel: {
    color: colors.brandDark,
    fontSize: 14,
    fontWeight: '800',
  },
  versionValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
