import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { api, uploadRecording } from "@/lib/api";
import { TYPE_LABEL, type RecordingType } from "@/lib/types";

const TYPES: RecordingType[] = ["KONZULTACIA", "PORADA", "DODAVATEL", "INE"];

export default function RecordScreen() {
  const router = useRouter();
  const [nazov, setNazov] = useState("");
  const [typ, setTyp] = useState<RecordingType>("KONZULTACIA");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setError("Bez prístupu k mikrofónu sa nedá nahrávať.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      rec.setOnRecordingStatusUpdate((s) => {
        if (s.isRecording) setSeconds(Math.floor(s.durationMillis / 1000));
      });
      await rec.startAsync();
      setRecording(rec);
    } catch {
      setError("Nepodarilo sa spustiť nahrávanie.");
    }
  }

  async function stopAndUpload() {
    if (!recording) return;
    if (!nazov.trim()) {
      setError("Zadaj názov nahrávky.");
      return;
    }
    setBusy(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const durationSek = seconds;
      setRecording(null);
      if (!uri) throw new Error("Nahrávka sa nevytvorila");

      const rec = await uploadRecording(uri, {
        nazov,
        typ,
        jazyk: "sk",
        zdroj: "MOBIL",
        dlzkaSek: String(durationSek),
      });
      if (typ === "KONZULTACIA") {
        await api.post(`/recordings/${rec.id}/consent`, { sposob: "USTNY_V_NAHRAVKE" });
      }
      router.replace(`/recording/${rec.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahranie zlyhalo");
      setBusy(false);
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.label}>Názov</Text>
      <TextInput
        style={styles.input}
        value={nazov}
        onChangeText={setNazov}
        placeholder="napr. Konzultácia – rodina Nováková"
      />

      <Text style={styles.label}>Typ rozhovoru</Text>
      <View style={styles.types}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.type, typ === t && styles.typeActive]}
            onPress={() => setTyp(t)}
          >
            <Text style={[styles.typeText, typ === t && styles.typeTextActive]}>
              {TYPE_LABEL[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recorder}>
        <Text style={styles.timer}>
          {mm}:{ss}
        </Text>
        {!recording ? (
          <TouchableOpacity style={styles.recBtn} onPress={start}>
            <Text style={styles.recBtnText}>● Začať nahrávať</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopAndUpload} disabled={busy}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.recBtnText}>■ Zastaviť a uložiť</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {typ === "KONZULTACIA" && (
        <Text style={styles.hint}>
          Pri konzultácii sa eviduje súhlas klienta s nahrávaním (GDPR).
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  types: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  type: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#fff",
  },
  typeActive: { backgroundColor: "#0e7490", borderColor: "#0e7490" },
  typeText: { color: "#475569", fontSize: 13 },
  typeTextActive: { color: "#fff" },
  recorder: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 28,
  },
  timer: { fontSize: 40, fontVariant: ["tabular-nums"], color: "#334155", marginBottom: 18 },
  recBtn: { backgroundColor: "#dc2626", borderRadius: 999, paddingHorizontal: 28, paddingVertical: 12 },
  stopBtn: { backgroundColor: "#1e293b", borderRadius: 999, paddingHorizontal: 28, paddingVertical: 12 },
  recBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  hint: { marginTop: 14, fontSize: 13, color: "#64748b", textAlign: "center" },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
});
