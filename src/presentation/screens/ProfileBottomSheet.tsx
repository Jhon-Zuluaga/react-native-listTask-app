import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useRef, useState, } from "react";
import { getProfileColors, profileStyle } from "../../../styles/profileStyle";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
}


/** 
 * BottomSheet de perfil de usuario (editar datos)
 */
export const ProfileBottomSheet = ({ visible, onClose }: Props) => {

  // Tema (dark / light)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Estado global
  const { user, updateProfile } = useAuthStore();

  // Animación del sheet
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Estado de edición
  const [editingField, setEditingField] = useState<
    "name" | "email" | "password" | null
  >(null);

  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const c = getProfileColors(isDark);


  // Animar apertura / cierre
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);


  // Guardar cambios
  const handleSave = async () => {
    if (!newValue.trim()) return;
    setIsLoading(true);

    const updates: { name?: string; email?: string; password?: string } = {};
    if (editingField === "name") updates.name = newValue;
    if (editingField === "email") updates.email = newValue;
    if (editingField === "password") updates.password = newValue;

    const success = await updateProfile(updates);
    setIsLoading(false);

    if (success) {
      Alert.alert("✅ Listo", "Datos actualizados correctamente!");
      setEditingField(null);
      setNewValue("");
    } else {
      const { error } = useAuthStore.getState();
      Alert.alert("Error", error ?? "No se pudo actualizar");
    }
  };

  const fieldLabel = {
    name: "Nombre",
    email: "Correo",
    password: "Contraseña",
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}  
    >
      {/* Overlay */}
      <TouchableOpacity
        style={profileStyle.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      {/* Ajuste para teclado */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ position: 'absolute', bottom: 0, left: 0, right : 0}}
      >

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          profileStyle.sheet,
          { backgroundColor: c.bg, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={[profileStyle.handle, { backgroundColor: c.border }]} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Titulo */}
          <Text style={[profileStyle.sheetTitle, { color: c.text }]}>
            Mi perfil
          </Text>

          {/* Info usuario */}
          <View style={profileStyle.avatarContainer}>
            <View style={profileStyle.avatar}>
              <Text style={profileStyle.avatarText}>
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
            <Text style={[profileStyle.userName, { color: c.text }]}>
              {user?.name}
            </Text>
            <Text style={[profileStyle.userEmail, { color: c.subtext }]}>
              {user?.email}
            </Text>
          </View>

          {/* Separador */}
          <View
            style={[profileStyle.separator, { backgroundColor: c.border }]}
          />

          {/* Campos editables */}
          {(["name", "email", "password"] as const).map((field) => (
            <View key={field}>
              <View
                style={[profileStyle.fieldRow, { borderBottomColor: c.border }]}
              >
                <View style={profileStyle.fieldInfo}>
                  <Text style={[profileStyle.fieldLabel, { color: c.subtext }]}>
                    {fieldLabel[field]}
                  </Text>
                  <Text style={[profileStyle.fieldValue, { color: c.text }]}>
                    {field === "password"
                      ? "••••••••"
                      : field === "name"
                        ? user?.name
                        : user?.email}
                  </Text>
                </View>
                <TouchableOpacity
                  style={profileStyle.editFieldBtn}
                  onPress={() => {
                    setEditingField(field);
                    setNewValue(
                      field === "password"
                        ? ""
                        : field === "name"
                          ? (user?.name ?? "")
                          : (user?.email ?? ""),
                    );
                  }}
                >
                  <Text style={profileStyle.editFieldBtnText}>✏️</Text>
                </TouchableOpacity>
              </View>

              {/* Input edicion inline */}
              {editingField === field && (
                <View
                  style={[
                    profileStyle.editContainer,
                    { backgroundColor: c.inputBg },
                  ]}
                >
                  <TextInput
                    style={[
                      profileStyle.editInput,
                      {
                        borderColor: c.inputBorder,
                        color: c.text,
                        backgroundColor: c.bg,
                      },
                    ]}
                    value={newValue}
                    onChangeText={setNewValue}
                    placeholder={`Nuevo ${fieldLabel[field].toLowerCase()}`}
                    placeholderTextColor={c.subtext}
                    secureTextEntry={field === "password"}
                    autoFocus
                    autoCapitalize="none"
                  />

                  {/* Acciones */}
                  <View style={profileStyle.editActions}>
                    <TouchableOpacity
                      style={profileStyle.cancelEditBtn}
                      onPress={() => {
                        setEditingField(null);
                        setNewValue("");
                      }}
                    >
                      <Text style={profileStyle.cancelEditText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={profileStyle.saveEditBtn}
                      onPress={handleSave}
                      disabled={isLoading}
                    >
                      <Text style={profileStyle.saveEditText}>
                        {isLoading ? "Guardando..." : "Guardar"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
