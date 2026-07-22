import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type OrderSuccessScreenProps = {
  message: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  title: string;
};

export function OrderSuccessScreen({
  message,
  onPrimaryPress,
  onSecondaryPress,
  primaryLabel,
  secondaryLabel,
  title,
}: OrderSuccessScreenProps) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.successMarkOuter}>
          <View style={styles.successMarkInner}>
            <Ionicons name="checkmark" size={64} color="#00b6bd" />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.actionBar}>
        <Pressable style={styles.primaryButton} onPress={onPrimaryPress}>
          <Ionicons name="receipt-outline" size={20} color="#00b6bd" />
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
          <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#00b6bd',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#00b6bd',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  successMarkOuter: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 64,
    height: 128,
    justifyContent: 'center',
    marginBottom: 24,
    width: 128,
  },
  successMarkInner: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    color: '#DFF9F8',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    maxWidth: 320,
    textAlign: 'center',
  },
  actionBar: {
    marginTop: 24,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    marginBottom: 11,
  },
  primaryButtonText: {
    color: '#00b6bd',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.42)',
    borderRadius: 14,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
