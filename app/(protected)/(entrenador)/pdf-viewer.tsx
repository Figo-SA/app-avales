import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { ActivityIndicator, Share, StyleSheet, View } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";

export default function PdfViewerScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url || "")}`;

  const handleShare = async () => {
    if (!url) return;
    try {
      setIsSharing(true);
      await Share.share({
        title: title || "Documento",
        url: url,
        message: url,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleOpenInBrowser = async () => {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url);
  };

  if (!url) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.centered}>
          <Icon source="ion:alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={{ color: theme.colors.onSurface, marginTop: 12 }}>
            No se proporcionó una URL válida
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: title || "Documento",
          headerBackTitle: "Volver",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
        }}
      />

      <View style={styles.webviewContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
              Cargando documento...
            </Text>
          </View>
        )}
        <WebView
          source={{ uri: googleViewerUrl }}
          style={styles.webview}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={false}
          javaScriptEnabled
          scalesPageToFit
        />
      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.surfaceVariant }]}>
        <Button
          mode="contained"
          onPress={handleShare}
          loading={isSharing}
          disabled={isSharing}
          icon="ion:share-outline"
          style={styles.footerButton}
          contentStyle={styles.footerButtonContent}
        >
          Compartir
        </Button>
        <Button
          mode="outlined"
          onPress={handleOpenInBrowser}
          icon="ion:open-outline"
          style={styles.footerButton}
          contentStyle={styles.footerButtonContent}
        >
          Abrir en navegador
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
  },
  footerButtonContent: {
    height: 44,
  },
});
