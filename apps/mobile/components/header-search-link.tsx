import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export function HeaderSearchLink() {
  return (
    <Link href="/search" asChild>
      <Pressable style={styles.searchInput}>
        <Ionicons name="search-outline" size={19} color="#8A8A8A" />
        <Text style={styles.searchPlaceholder}>Search medicines and products</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 14,
  },
  searchPlaceholder: {
    color: '#8A8A8A',
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
});
