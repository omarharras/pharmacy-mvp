import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadingStateProps = {
  variant?: 'card' | 'center';
};

export function LoadingState({ variant = 'card' }: LoadingStateProps) {
  return (
    <View style={variant === 'center' ? styles.center : styles.card}>
      <ActivityIndicator color="#00b6bd" size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 72,
    padding: 16,
  },
  center: {
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});
