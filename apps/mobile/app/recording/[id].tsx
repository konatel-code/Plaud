import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { STATUS_LABEL, TYPE_LABEL, type RecordingDetail } from "@/lib/types";

const PROCESSING = ["UPLOADED", "TRANSCRIBING", "TRANSCRIBED", "SUMMARIZING"];

export default function RecordingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rec, setRec] = useState<RecordingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRec(await api.get<RecordingDetail>(`/recordings/${id}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba načítania");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!rec || !PROCESSING.includes(rec.stav)) return;
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [rec?.stav, load]);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!rec)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0e7490" />
      </View>
    );

  const summary = rec.summaries[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{rec.nazov}</Text>
      <Text style={styles.meta}>
        {TYPE_LABEL[rec.typ]} · {STATUS_LABEL[rec.stav]}
      </Text>

      {PROCESSING.includes(rec.stav) && (
        <View style={styles.processing}>
          <ActivityIndicator color="#92400e" />
          <Text style={styles.processingText}>
            Prebieha spracovanie ({STATUS_LABEL[rec.stav]})…
          </Text>
        </View>
      )}

      {summary ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zhrnutie</Text>
          <Text style={styles.body}>{summary.markdown}</Text>
        </View>
      ) : (
        !PROCESSING.includes(rec.stav) && (
          <Text style={styles.muted}>Zatiaľ bez zhrnutia.</Text>
        )
      )}

      {rec.transcript && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prepis</Text>
          <Text style={styles.body}>{rec.transcript.plnyText}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  meta: { marginTop: 4, marginBottom: 14, color: "#64748b", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { fontWeight: "600", color: "#155e75", marginBottom: 8 },
  body: { color: "#1e293b", lineHeight: 21, fontSize: 14 },
  muted: { color: "#94a3b8" },
  processing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  processingText: { color: "#92400e", fontSize: 13 },
  error: { color: "#b91c1c", padding: 16 },
});
