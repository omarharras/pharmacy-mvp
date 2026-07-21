import { Pressable, StyleSheet, Text, View } from 'react-native';

type QuantityControlProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'compact' | 'large';
};

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  size = 'compact',
}: QuantityControlProps) {
  const isLarge = size === 'large';

  return (
    <View style={isLarge ? styles.largeContainer : styles.container}>
      <Pressable style={isLarge ? styles.largeButton : styles.button} onPress={onDecrement}>
        <Text style={isLarge ? styles.largeButtonText : styles.buttonText}>-</Text>
      </Pressable>

      <Text style={isLarge ? styles.largeQuantity : styles.quantity}>{quantity}</Text>

      <Pressable style={isLarge ? styles.largeButton : styles.button} onPress={onIncrement}>
        <Text style={isLarge ? styles.largeButtonText : styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderRadius: 8,
    flexDirection: 'row',
    height: 28,
    paddingHorizontal: 2,
  },
  button: {
    alignItems: 'center',
    height: 23,
    justifyContent: 'center',
    width: 23,
  },
  buttonText: {
    color: '#00A9A5',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  quantity: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center',
  },
  largeContainer: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderRadius: 14,
    flexDirection: 'row',
    height: 54,
    paddingHorizontal: 6,
  },
  largeButton: {
    alignItems: 'center',
    backgroundColor: '#00A9A5',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  largeButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },
  largeQuantity: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    minWidth: 42,
    textAlign: 'center',
  },
});
