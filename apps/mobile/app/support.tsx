import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const colors = {
  brand: '#00A9A5',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function SupportScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="headset-outline" size={30} color={colors.brand} />
        </View>
        <Text style={styles.title}>Customer support</Text>
        <Text style={styles.subtitle}>Reach the pharmacy team for order, delivery, and prescription help.</Text>
      </View>

      <View style={styles.card}>
        <SupportRow icon="call-outline" label="Hotline" value="19000" />
        <SupportRow icon="logo-whatsapp" label="WhatsApp" value="+20 100 000 0000" />
        <SupportRow icon="mail-outline" label="Email" value="support@elkhabiry.example" />
        <SupportRow icon="time-outline" label="Working hours" value="Daily, 9:00 AM - 12:00 AM" />
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Prescription support</Text>
        <Text style={styles.noteText}>
          Upload a clear prescription image and request a confirmation call if you need pharmacist review before delivery.
        </Text>
      </View>
    </ScrollView>
  );
}

function SupportRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.brand} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
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
    alignItems: 'flex-start',
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
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: 14,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 13,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  rowValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  noteCard: {
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
  },
  noteText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});
