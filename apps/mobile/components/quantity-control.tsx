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
    backgroundColor: '#E7F5EF',
    borderRadius: 10,
    flexDirection: 'row',
    height: 34,
    paddingHorizontal: 3,
  },
  button: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  buttonText: {
    color: '#087F5B',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  quantity: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'center',
  },
});
