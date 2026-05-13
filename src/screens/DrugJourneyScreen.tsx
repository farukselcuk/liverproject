import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Asset} from 'expo-asset';

import {Colors, Typography, Spacing, Radius} from '../theme';

/**
 * İlaç Vücutta Yolculuk Animasyonu Ekranı
 * ─────────────────────────────────────────
 * assets/drugJourney.html dosyasını WebView içinde görüntüler.
 * İlacın ağızdan alınmasından hedef organa ulaşmasına kadar
 * 9 aşamalı interaktif canvas animasyonu sunar.
 */
export default function DrugJourneyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const loadAsset = useCallback(async () => {
    try {
      setError(false);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const asset = Asset.fromModule(require('../../assets/drugJourney.html'));
      await asset.downloadAsync();
      if (asset.localUri) {
        setLocalUri(asset.localUri);
      } else {
        setError(true);
      }
    } catch (e) {
      console.warn('DrugJourney asset yüklenemedi:', e);
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  return (
    <View style={styles.screen}>
      {/* ── Üst Bar ──────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>💊 İlaç Yolculuğu</Text>
        {/* sağ taraf denge için boş view */}
        <View style={styles.backBtn} />
      </View>

      {/* ── İçerik ───────────────────────────────────────────────────────── */}
      {localUri ? (
        <WebView
          source={{uri: localUri}}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          bounces={false}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.brandBlue} />
            </View>
          )}
        />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Animasyon yüklenemedi</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadAsset}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.brandBlue} />
          <Text style={styles.loadingText}>Animasyon hazırlanıyor…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#06061a',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: 'rgba(6,6,26,0.92)',
    zIndex: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.round,
  },
  backIcon: {
    fontSize: 26,
    color: '#f0f4f8',
    fontWeight: '600',
  },
  topBarTitle: {
    ...Typography.headingMedium,
    color: '#f0f4f8',
    flex: 1,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#06061a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06061a',
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
    marginTop: Spacing.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.headingSmall,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.lg,
  },
  retryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.brandBlue,
    borderRadius: Radius.round,
  },
  retryText: {
    ...Typography.labelLarge,
    color: '#fff',
  },
});
