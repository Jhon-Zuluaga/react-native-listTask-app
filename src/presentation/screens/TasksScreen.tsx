import { useAuthStore } from "../stores/authStore";
import { useTaskStore } from "../stores/taskStore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { taskStyle } from "../../../styles/taskStyle";
import { useEffect, useState } from "react";
import { generateTasksPDFTemplate } from "../templates/TasksPdfTemplate";
import { profileStyle } from "../../../styles/profileStyle";
import { ProfileBottomSheet } from "./ProfileBottomSheet";


/**
 * Pantalla principal de tareas
 */
export const TasksScreen = () => {

  // Estado global (auth y tareas)
  const { user, logout } = useAuthStore();
  const {
    tasks,
    isLoading,
    loadTasks,
    createTask,
    toggleTask,
    deletedTask,
    editTask,
  } = useTaskStore();

  // Estado local
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Cargar tareas al iniciar
  useEffect(() => {
    if (user) loadTasks(user.id);
  }, [user]);

  // Crear tarea
  const handleCreate = async () => {
    if (!user || !newTitle.trim()) return;
    await createTask(user.id, newTitle);
    setNewTitle("");
  };

  // Marcar / desmarcar tarea
  const handleToggle = (taskId: string) => {
    if (user) toggleTask(user.id, taskId);
  };

  // Eliminar tarea
  const handleDelete = (taskId: string) => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deletedTask(taskId),
        },
      ],
    );
  };

  // Iniciar edición
  const handleStartEdit = (taskId: string, currentTitle: string) => {
    setEditingId(taskId);
    setEditingText(currentTitle);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingId || !editingText.trim()) return;
    await editTask(editingId, editingText);
    setEditingId(null);
    setEditingText("");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Exportar tareas a PDF
  const handleExportPDF = async () => {
    try {
      const html = generateTasksPDFTemplate({
        userName: user?.name ?? "Usuario",
        tasks,
      });

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir tareas",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

  return (
    <View style={taskStyle.container}>
      <View style={taskStyle.header}>
        <View>
          <Text style={taskStyle.title}>Mis tareas</Text>
          <Text style={taskStyle.subtitle}>Hola, {user?.name} 🙌</Text>

          {/* Conrtador */}
          <Text style={taskStyle.counter}>
              {tasks.filter(t => !t.completed).length} Pendientes • 
              {tasks.filter(t => t.completed).length} Completadas
          </Text>
        </View>

        {/* Acciones */}
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TouchableOpacity onPress={handleExportPDF} style={taskStyle.pdfBtn}>
            <Text style={taskStyle.pdfBtnText}>📄 PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={taskStyle.logoutBtn}>
            <Text style={taskStyle.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Crear tarea */}
      <View style={taskStyle.inputRow}>
        <TextInput
          style={taskStyle.input}
          placeholder="Nueva tarea..."
          placeholderTextColor="#999"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity style={taskStyle.addBtn} onPress={handleCreate}>
          <Text style={taskStyle.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas*/}
      {isLoading ? (
        <ActivityIndicator color="#534AB7" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={taskStyle.taskItem}>
              {/* Checkbox */}
              <TouchableOpacity
                style={[
                  taskStyle.checkbox,
                  item.completed && taskStyle.checkboxDone,
                ]}
                onPress={() => handleToggle(item.id)}
              >
                {item.completed && <Text style={taskStyle.checkmark}>✓</Text>}
              </TouchableOpacity>
              
               {/* Título o input de edición */}
              {editingId === item.id ? (
                <TextInput
                  style={taskStyle.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                  autoFocus
                  placeholderTextColor="#999"
                />
              ) : (
                <Text
                  style={[
                    taskStyle.taskTitle,
                    item.completed && taskStyle.taskTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
              )}

              {/* Acciones */}
              <View style={taskStyle.actions}>
                {editingId === item.id ? (
                  // Modo edición: guardar y cancelar
                  <>
                    <TouchableOpacity
                      style={taskStyle.saveBtn}
                      onPress={handleSaveEdit}
                    >
                      <Text style={taskStyle.saveBtnText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={taskStyle.cancelBtn}
                      onPress={handleCancelEdit}
                    >
                      <Text style={taskStyle.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  
                  <>
                    <TouchableOpacity
                      style={taskStyle.editBtn}
                      onPress={() => handleStartEdit(item.id, item.title)}
                    >
                      <Text style={taskStyle.editBtnText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={taskStyle.deleteBtn}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={taskStyle.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={taskStyle.empty}>No hay tareas aún. ¡Agrega una!</Text>
          }
        />
      )}
      {/* Botón perfil */}
      <TouchableOpacity
        onPress={() => setShowProfile(true)}
        style={profileStyle.settingsBtn}
        activeOpacity={0.85}
      >
        <Text style={profileStyle.settingsBtnText}>⚙️</Text>
      </TouchableOpacity>
        {/* BottomSheet profile */}
      <ProfileBottomSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </View>
  );
};
