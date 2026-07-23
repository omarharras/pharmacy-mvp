import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const colors = {
  brand: '#00b6bd',
  brandSoft: '#E6F8F7',
  border: '#BCEDEA',
  muted: '#6B7280',
  text: '#111827',
  white: '#FFFFFF',
};

type AuthRequiredModalProps = {
  onClose: () => void;
  returnTo?: string;
  visible: boolean;
};

export function AuthRequiredModal({ onClose, returnTo, visible }: AuthRequiredModalProps) {
  const router = useRouter();

  const goToAuth = (pathname: '/signin' | '/signup') => {
    onClose();
    router.push({
      pathname,
      params: returnTo ? { returnTo } : undefined,
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal}>
          <View style={styles.icon}>
            <Ionicons name="lock-closed-outline" size={28} color={colors.brand} />
          </View>
          <Text style={styles.title}>Sign in required</Text>
          <Text style={styles.text}>Sign in or create an account to continue.</Text>
          <Pressable style={styles.primaryButton} onPress={() => goToAuth('/signin')}>
            <Text style={styles.primaryText}>Sign in</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => goToAuth('/signup')}>
            <Text style={styles.secondaryText}>Create account</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.48)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modal: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    width: '100%',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginBottom: 14,
    width: 60,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  secondaryText: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '800',
  },
});
