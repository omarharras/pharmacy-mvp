import { Image, StyleSheet } from 'react-native';

export function HeaderLogoTitle() {
  return (
    <Image
      accessibilityLabel="El Khabiry Pharmacy"
      resizeMode="contain"
      source={require('../assets/images/elkhabiry-logo.png')}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 38,
    width: 136,
  },
});
