import { Pressable, StyleSheet, Text, View } from 'react-native';

type QuantityControlProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityControlProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </Pressable>

      <Text style={styles.quantity}>{quantity}</Text>

      <Pressable style={styles.button} onPress={onIncrement}>
        <Text style={styles.buttonText}>+</Text>
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
});
