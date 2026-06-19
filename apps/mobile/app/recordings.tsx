import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  STATUS_LABEL,
  TYPE_LABEL,
  type RecordingList,
  type RecordingListItem,
} from "@/lib/types";

export default function RecordingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [items, setItems] = useState<RecordingListItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<RecordingList>("/recordings");
      setItems(data.items);
    } catch {
      /* ignore */
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => logout().then(() => router.replace("/login"))}>
              <Text style={{ color: "#fff" }}>Odhlásiť</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={items.length === 0 ? styles.empty : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Zatiaľ žiadne nahrávky.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recording/${item.id}`)}
          >
            <Text style={styles.title}>{item.nazov}</Text>
            <Text style={styles.meta}>
              {TYPE_LABEL[item.typ]} · {STATUS_LABEL[item.stav]}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/record")}>
        <Text style={styles.fabText}>＋ Nová nahrávka</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#155e75" },
  meta: { marginTop: 4, fontSize: 13, color: "#64748b" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#94a3b8" },
  fab: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#0e7490",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
  },
  fabText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
