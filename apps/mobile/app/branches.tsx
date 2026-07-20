import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Branch, getBranches } from '@/lib/api';

const colors = {
  brand: '#00A9A5',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function BranchesScreen() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setBranches(await getBranches());
    } catch {
      setErrorMessage('Unable to load branches. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBranches();
  }, [loadBranches]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchBand}>
        <Ionicons name="search-outline" size={20} color={colors.brand} />
        <Text style={styles.searchText}>Search by area or branch name</Text>
      </View>

      <View style={styles.mapPreview}>
        <Ionicons name="map-outline" size={34} color={colors.brand} />
        <Text style={styles.mapTitle}>Nearby branches</Text>
        <Text style={styles.mapText}>Branch map integration can be added after location permission is in scope.</Text>
      </View>

      {isLoading ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading branches</Text>
          <Text style={styles.stateText}>Getting available branch locations.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadBranches}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {branches.map((branch) => (
        <View key={branch.name} style={styles.branchCard}>
          <View style={styles.branchTopRow}>
            <View style={styles.branchIcon}>
              <Ionicons name="business-outline" size={23} color={colors.brand} />
            </View>
            <View style={styles.branchTextBlock}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchHours}>{branch.hours}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.muted} />
            <Text style={styles.infoText}>{branch.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={colors.muted} />
            <Text style={styles.infoText}>{branch.phone}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryAction}
              onPress={() => Linking.openURL(`tel:${branch.phone}`)}
            >
              <Ionicons name="call-outline" size={18} color={colors.white} />
              <Text style={styles.primaryActionText}>Call</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryAction}
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`)}
            >
              <Ionicons name="navigate-outline" size={18} color={colors.brand} />
              <Text style={styles.secondaryActionText}>Directions</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
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
  searchBand: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  searchText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
  },
  mapPreview: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 128,
    justifyContent: 'center',
    padding: 18,
  },
  mapTitle: {
    color: colors.brandDark,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 5,
  },
  mapText: {
    color: colors.brandDark,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'center',
  },
  branchCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  stateCard: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  stateText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  errorTitle: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#9F1D1D',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '800',
  },
  branchTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  branchIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  branchTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  branchName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  branchHours: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '800',
  },
  infoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'center',
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'center',
  },
  secondaryActionText: {
    color: colors.brandDark,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
  },
});
