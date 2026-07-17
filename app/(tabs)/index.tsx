import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const categories = ['Medicines', 'Skin Care', 'Vitamins', 'Personal Care'];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.title}>What do you need today?</Text>
        </View>

        <Pressable style={styles.cartButton}>
          <Text style={styles.cartText}>Cart</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder='Search medicines and products'
        placeholderTextColor='#8A8A8A'
      />

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Upload your prescription</Text>

        <Text style={styles.bannerDescription}>
          Send your prescription and our pharmacist will review it.
        </Text>

        <Pressable style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Upload now</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>

      <View style={styles.categories}>
        {categories.map((category) => (
          <Pressable key={category} style={styles.categoryCard}>
            <View style={styles.categoryIcon} />

            <Text style={styles.categoryText}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular products</Text>

        <Pressable>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.productCard}>
        <View style={styles.productImage}>
          <Text style={styles.productImageText}>Product</Text>
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName}>Panadol Extra</Text>
          <Text style={styles.productDescription}>24 tablets</Text>
          <Text style={styles.productPrice}>75 EGP</Text>
        </View>

        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greeting: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },
  cartButton: {
    backgroundColor: '#E7F5EF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cartText: {
    color: '#087F5B',
    fontWeight: '600',
  },
  searchInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#087F5B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  bannerDescription: {
    color: '#D8F3E8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  bannerButtonText: {
    color: '#087F5B',
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '700',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 28,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    width: '48%',
    marginBottom: 14,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#E7F5EF',
    borderRadius: 22,
    marginBottom: 10,
  },
  categoryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#087F5B',
    fontWeight: '600',
  },
  productCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 14,
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  productImageText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  productDetails: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  productDescription: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 8,
  },
  productPrice: {
    color: '#087F5B',
    fontSize: 15,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#087F5B',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 26,
  },
});
