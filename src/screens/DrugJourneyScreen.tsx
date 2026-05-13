import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Colors, Typography, Spacing, Radius} from '../theme';
import drugJourneyHtml from '../data/drugJourneyHtml';

/**
 * İlaç Vücutta Yolculuk Animasyonu Ekranı
 * ─────────────────────────────────────────
 * 9 aşamalı interaktif canvas animasyonu.
 * HTML doğrudan JS modülünden yüklenir — cache sorunu yok.
 */
export default function DrugJourneyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        <View style={styles.backBtn} />
      </View>

      {/* ── WebView ──────────────────────────────────────────────────────── */}
      <WebView
        source={{html: drugJourneyHtml}}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
      />
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
});
