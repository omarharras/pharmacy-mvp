import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { InsuranceProfile, resolveImageUrl, uploadInsuranceImage } from '@/lib/api';
import {
  insuranceStatusCopy,
  useInsurance,
} from '@/lib/insurance-context';
import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00b6bd',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

const providerOptions = ['AXA', 'MetLife', 'Allianz', 'GlobeMed', 'MedNet'];

type CardSide = 'front' | 'back';
type NationalIdSide = 'nationalIdFront' | 'nationalIdBack';

export default function InsuranceScreen() {
  const params = useLocalSearchParams<{ provider?: string }>();
  const { token } = useSession();
  const {
    isLoadingProfiles,
    profiles,
    removeInsuranceProfile,
    saveInsuranceProfile,
    setUseInsuranceByDefault,
  } = useInsurance();
  const initialProviderName = typeof params.provider === 'string' ? params.provider : '';
  const [isAddingCard, setIsAddingCard] = useState(Boolean(initialProviderName));
  const [isSaving, setIsSaving] = useState(false);
  const [providerName, setProviderName] = useState(initialProviderName);
  const [cardholderName, setCardholderName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [frontImageUri, setFrontImageUri] = useState<string | undefined>();
  const [backImageUri, setBackImageUri] = useState<string | undefined>();
  const [nationalIdFrontImageUri, setNationalIdFrontImageUri] = useState<string | undefined>();
  const [nationalIdBackImageUri, setNationalIdBackImageUri] = useState<string | undefined>();
  const [useByDefault, setUseByDefault] = useState(true);
  const [showProviderPicker, setShowProviderPicker] = useState(false);
  const hasRequiredDetails =
    providerName.trim().length >= 2 &&
    cardholderName.trim().length >= 2 &&
    memberNumber.trim().length >= 3;
  const canSave = hasRequiredDetails;

  const resetForm = () => {
    setProviderName('');
    setCardholderName('');
    setMemberNumber('');
    setFrontImageUri(undefined);
    setBackImageUri(undefined);
    setNationalIdFrontImageUri(undefined);
    setNationalIdBackImageUri(undefined);
    setUseByDefault(profiles.length === 0);
  };

  const openAddCard = () => {
    resetForm();
    setIsAddingCard(true);
  };

  const pickProfileImage = async (side: CardSide | NationalIdSide) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Photo library access is required to attach an insurance card image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!asset) {
      return;
    }

    if (side === 'front') {
      setFrontImageUri(asset.uri);
    } else if (side === 'back') {
      setBackImageUri(asset.uri);
    } else if (side === 'nationalIdFront') {
      setNationalIdFrontImageUri(asset.uri);
    } else {
      setNationalIdBackImageUri(asset.uri);
    }
  };

  const save = async () => {
    if (!token) {
      Alert.alert('Sign in required', 'Sign in before adding an insurance card.');
      return;
    }

    if (!canSave) {
      Alert.alert('Missing details', 'Enter cardholder name, insurance company, and card ID.');
      return;
    }

    setIsSaving(true);

    try {
      const [
        frontImageUrl,
        backImageUrl,
        nationalIdFrontImageUrl,
        nationalIdBackImageUrl,
      ] = await Promise.all([
        uploadInsuranceImageIfNeeded(frontImageUri, 'insurance-front', token),
        uploadInsuranceImageIfNeeded(backImageUri, 'insurance-back', token),
        uploadInsuranceImageIfNeeded(nationalIdFrontImageUri, 'national-id-front', token),
        uploadInsuranceImageIfNeeded(nationalIdBackImageUri, 'national-id-back', token),
      ]);

      await saveInsuranceProfile({
        backImageUrl,
        cardholderName: cardholderName.trim(),
        frontImageUrl,
        memberNumber: memberNumber.trim(),
        nationalIdBackImageUrl,
        nationalIdFrontImageUrl,
        providerName: providerName.trim(),
        useByDefault,
      });
      resetForm();
      setIsAddingCard(false);
    } catch {
      Alert.alert('Could not save', 'Unable to save this insurance card. Check that the API is running.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>{isAddingCard ? 'Add insurance card' : 'Insurance cards'}</Text>

        {!isAddingCard ? (
          <>
            <Pressable style={styles.addCardButton} onPress={openAddCard}>
              <Ionicons name="add" size={22} color={colors.white} />
              <Text style={styles.addCardButtonText}>Add new card</Text>
            </Pressable>

            {isLoadingProfiles ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Loading insurance cards</Text>
              </View>
            ) : profiles.length > 0 ? (
              <View style={styles.cardsList}>
                {profiles.map((insuranceProfile) => (
                  <InsuranceProfileCard
                    key={insuranceProfile.id}
                    profile={insuranceProfile}
                    onRemove={() => void removeInsuranceProfile(insuranceProfile.id)}
                    onUseDefault={() => void setUseInsuranceByDefault(insuranceProfile.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="shield-checkmark-outline" size={30} color={colors.brand} />
                </View>
                <Text style={styles.emptyTitle}>No insurance cards</Text>
                <Text style={styles.emptyText}>
                  Add your insurance card and national ID once, then use it during prescription checkout.
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.brand} />
              </View>
              <View style={styles.statusTextBlock}>
                <Text style={styles.statusTitle}>New card review</Text>
                <Text style={styles.statusText}>
                  Saved insurance cards appear in your list while pharmacy review is in progress.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Member details</Text>
              <TextInput
                style={styles.input}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="Cardholder name"
                placeholderTextColor="#8A8A8A"
              />
              <Pressable style={styles.selectInput} onPress={() => setShowProviderPicker(true)}>
                <Text style={providerName ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {providerName || 'Insurance company'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.muted} />
              </Pressable>
              <TextInput
                style={styles.input}
                value={memberNumber}
                onChangeText={setMemberNumber}
                placeholder="Card ID"
                placeholderTextColor="#8A8A8A"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Insurance card</Text>
              <View style={styles.cardImageRow}>
                <InsuranceCardImage
                  label="Front"
                  uri={frontImageUri}
                  onPress={() => pickProfileImage('front')}
                  onRemove={() => setFrontImageUri(undefined)}
                />
                <InsuranceCardImage
                  label="Back"
                  uri={backImageUri}
                  onPress={() => pickProfileImage('back')}
                  onRemove={() => setBackImageUri(undefined)}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>National ID</Text>
              <View style={styles.cardImageRow}>
                <InsuranceCardImage
                  label="ID front"
                  uri={nationalIdFrontImageUri}
                  onPress={() => pickProfileImage('nationalIdFront')}
                  onRemove={() => setNationalIdFrontImageUri(undefined)}
                />
                <InsuranceCardImage
                  label="ID back"
                  uri={nationalIdBackImageUri}
                  onPress={() => pickProfileImage('nationalIdBack')}
                  onRemove={() => setNationalIdBackImageUri(undefined)}
                />
              </View>
            </View>

            <Pressable style={styles.defaultCard} onPress={() => setUseByDefault((current) => !current)}>
              <Ionicons name="receipt-outline" size={24} color={colors.brand} />
              <Text style={styles.defaultText}>Use insurance by default for prescriptions</Text>
              <View style={useByDefault ? styles.checkboxActive : styles.checkbox}>
                {useByDefault ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
              </View>
            </Pressable>

            <Pressable
              disabled={!canSave || isSaving}
              style={canSave && !isSaving ? styles.saveButton : styles.disabledButton}
              onPress={save}
            >
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save insurance card'}</Text>
            </Pressable>

            <Pressable
              style={styles.clearButton}
              onPress={() => {
                resetForm();
                setIsAddingCard(false);
              }}
            >
              <Text style={styles.clearButtonText}>Cancel</Text>
            </Pressable>
          </>
        )}

      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        presentationStyle="overFullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        visible={showProviderPicker}
        onRequestClose={() => setShowProviderPicker(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowProviderPicker(false)}>
          <Pressable style={styles.providerModal}>
            <View style={styles.providerModalHeader}>
              <Text style={styles.providerModalTitle}>Insurance company</Text>
              <Pressable onPress={() => setShowProviderPicker(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            {providerOptions.map((provider) => {
              const isSelected = providerName === provider;

              return (
                <Pressable
                  key={provider}
                  style={isSelected ? styles.providerOptionActive : styles.providerOption}
                  onPress={() => {
                    setProviderName(provider);
                    setShowProviderPicker(false);
                  }}
                >
                  <Text style={isSelected ? styles.providerOptionTextActive : styles.providerOptionText}>
                    {provider}
                  </Text>
                  {isSelected ? <Ionicons name="checkmark-circle" size={19} color={colors.brand} /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function InsuranceProfileCard({
  onRemove,
  onUseDefault,
  profile,
}: {
  onRemove: () => void;
  onUseDefault: () => void;
  profile: InsuranceProfile;
}) {
  const imageCount = [
    profile.frontImageUrl,
    profile.backImageUrl,
    profile.nationalIdFrontImageUrl,
    profile.nationalIdBackImageUrl,
  ].filter(Boolean).length;

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileCardTop}>
        <View style={styles.profileCardIcon}>
          <Ionicons name="card-outline" size={22} color={colors.brand} />
        </View>
        <View style={styles.profileCardTextBlock}>
          <Text style={styles.profileCardTitle}>{profile.providerName}</Text>
          <Text style={styles.profileCardMeta}>{profile.cardholderName}</Text>
        </View>
        <View style={styles.reviewBadge}>
          <Text style={styles.reviewBadgeText}>{insuranceStatusCopy(profile.status)}</Text>
        </View>
      </View>

      <View style={styles.profileCardDetails}>
        <View>
          <Text style={styles.detailLabel}>Card ID</Text>
          <Text style={styles.detailValue}>{profile.memberNumber}</Text>
        </View>
        <View style={styles.detailRight}>
          <Text style={styles.detailLabel}>Files</Text>
          <Text style={styles.detailValue}>{imageCount}/4</Text>
        </View>
      </View>

      <View style={styles.profileCardActions}>
        <Pressable
          disabled={profile.useByDefault}
          style={profile.useByDefault ? styles.defaultBadge : styles.setDefaultButton}
          onPress={onUseDefault}
        >
          <Ionicons
            name={profile.useByDefault ? 'checkmark-circle' : 'ellipse-outline'}
            size={17}
            color={profile.useByDefault ? colors.brandDark : colors.muted}
          />
          <Text style={profile.useByDefault ? styles.defaultBadgeText : styles.setDefaultText}>
            {profile.useByDefault ? 'Default' : 'Set default'}
          </Text>
        </Pressable>
        <Pressable hitSlop={8} style={styles.removeCardButton} onPress={onRemove}>
          <Ionicons name="trash-outline" size={18} color="#9F1D1D" />
        </Pressable>
      </View>
    </View>
  );
}

async function uploadInsuranceImageIfNeeded(uri: string | undefined, name: string, token: string) {
  if (!uri) {
    return undefined;
  }

  if (resolveImageUrl(uri) === uri && uri.startsWith('http')) {
    return uri;
  }

  const uploadedImage = await uploadInsuranceImage(
    {
      name: `${name}.jpg`,
      type: 'image/jpeg',
      uri,
    },
    token,
  );

  return uploadedImage.url;
}

function InsuranceCardImage({
  label,
  uri,
  onPress,
  onRemove,
}: {
  label: string;
  uri?: string;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable style={styles.cardImageBox} onPress={onPress}>
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.cardImage} />
          <Pressable
            accessibilityLabel={`Remove ${label.toLowerCase()} insurance card image`}
            hitSlop={8}
            style={styles.removeImageButton}
            onPress={onRemove}
          >
            <Ionicons name="close" size={16} color={colors.white} />
          </Pressable>
        </>
      ) : (
        <View style={styles.cardImageEmpty}>
          <Ionicons name="image-outline" size={22} color={colors.brand} />
          <Text style={styles.cardImageLabel}>{label}</Text>
        </View>
      )}
    </Pressable>
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
  pageTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  addCardButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    marginBottom: 14,
  },
  addCardButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  cardsList: {
    gap: 12,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginBottom: 12,
    width: 52,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  profileCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
  },
  profileCardIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  profileCardTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  profileCardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  profileCardMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  reviewBadge: {
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reviewBadgeText: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '800',
  },
  profileCardDetails: {
    borderTopColor: '#EEF0F2',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  profileCardActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  defaultBadge: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  defaultBadgeText: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '800',
  },
  setDefaultButton: {
    alignItems: 'center',
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  setDefaultText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  removeCardButton: {
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 12,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  statusTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  statusText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  section: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  selectInput: {
    alignItems: 'center',
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    marginBottom: 10,
    paddingHorizontal: 13,
  },
  selectInputText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  selectInputPlaceholder: {
    color: '#8A8A8A',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    height: 52,
    marginBottom: 10,
    paddingHorizontal: 13,
  },
  cardImageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cardImageBox: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    height: 96,
    overflow: 'hidden',
  },
  cardImage: {
    height: '100%',
    width: '100%',
  },
  cardImageEmpty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  cardImageLabel: {
    color: colors.brandDark,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  removeImageButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.72)',
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: 7,
    top: 7,
    width: 26,
  },
  defaultCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 62,
    paddingHorizontal: 14,
  },
  defaultText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginLeft: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9CA3AF',
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    marginTop: 4,
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  clearButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#9F1D1D',
    fontSize: 14,
    fontWeight: '800',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  providerModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '76%',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  providerModalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerModalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  providerOption: {
    alignItems: 'center',
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 9,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  providerOptionActive: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 9,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  providerOptionText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  providerOptionTextActive: {
    color: colors.brandDark,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
});
