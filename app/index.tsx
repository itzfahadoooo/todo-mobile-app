import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ThemeToggle } from "../components/ThemeToggle";
import { TodoItem } from "../components/TodoItem";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../convex/_generated/api";
const darkBg = require("../assets/images/bgdark.png");
const lightBg = require("../assets/images/bglight.png");

type FilterType = "all" | "active" | "completed";

export default function TodoScreen() {
  const { theme, themeMode } = useTheme();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<FilterType>("all");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [inputScaleAnim] = useState(new Animated.Value(1));

  // Responsive width: 327px for mobile, 540px for desktop
  const isMobile = width < 768;
  const contentWidth = isMobile ? 327 : 540;
  const horizontalPadding = isMobile ? 24 : (width - contentWidth) / 2;

  // Convex queries and mutations
  const todos = useQuery(api.todos.getTodos) ?? [];
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  // Initial fade-in animation
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Filter todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    return filtered;
  }, [todos, filter]);

  const activeTodosCount = todos.filter((t) => !t.completed).length;

  const handleAddTodo = async () => {
    if (newTodoTitle.trim()) {
      setIsAdding(true);
      
      // Input animation feedback
      Animated.sequence([
        Animated.timing(inputScaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(inputScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      try {
        await createTodo({ title: newTodoTitle.trim() });
        setNewTodoTitle("");
      } catch (error) {
        console.error("Error adding todo:", error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleToggleTodo = (id: any) => {
    toggleTodo({ id });
  };

  const handleDeleteTodo = (id: any) => {
    deleteTodo({ id });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter((t) => t.completed);
    completedTodos.forEach((todo) => {
      deleteTodo({ id: todo._id });
    });
  };

  if (todos === undefined) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Background image based on theme
  const backgroundImage = themeMode === "dark" ? darkBg : lightBg;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Background Image Header */}
      <ImageBackground
        source={backgroundImage}
        style={[styles.headerBackground, { height: isMobile ? 200 : 300 }]}
        imageStyle={styles.headerImage}
      >
        {/* Gradient Overlay for dimmed effect */}
        <LinearGradient
          colors={["#5596FF", "#AC2DEB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.imageOverlay}
        />

        <View style={styles.headerOverlay}>
          <Animated.View
            style={[
              styles.headerContent,
              { 
                maxWidth: contentWidth, 
                width: "100%", 
                alignSelf: "center",
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header with Title and Theme Toggle */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>TODO</Text>
              <ThemeToggle />
            </View>

            {/* Input Box */}
            <Animated.View
              style={[
                styles.inputContainer,
                { 
                  backgroundColor: theme.cardBackground,
                  transform: [{ scale: inputScaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.checkCircle, { marginTop: isMobile ? 0 : -20 }]}
                onPress={handleAddTodo}
                disabled={isAdding || !newTodoTitle.trim()}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkCircleInner,
                    { borderColor: theme.border },
                  ]}
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderWidth: 0,
                    outline: "none",
                  } as any,
                ]}
                placeholder="Create a new todo..."
                placeholderTextColor={theme.textSecondary}
                value={newTodoTitle}
                onChangeText={setNewTodoTitle}
                onSubmitEditing={handleAddTodo}
                editable={!isAdding}
                returnKeyType="done"
                blurOnSubmit={false}
                multiline
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === 'Enter') {
                    e.preventDefault();
                    handleAddTodo();
                  }
                }}
              />
              {isAdding && (
                <ActivityIndicator size="small" color={theme.primary} />
              )}
            </Animated.View>
          </Animated.View>
        </View>
      </ImageBackground>

      {/* Todo List Container */}
      <Animated.View
        style={[
          styles.contentWrapper,
          { 
            paddingHorizontal: horizontalPadding, 
            marginTop: isMobile ? 56 : -84,
            opacity: fadeAnim,
          },
        ]}
      >
        <View
          style={[
            styles.todoListContainer,
            { backgroundColor: theme.cardBackground, maxWidth: contentWidth, maxHeight: isMobile ? '70%' : '80%'},
          ]}
        >
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            )}
            contentContainerStyle={[
              filteredTodos.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <EmptyState
                  message={
                    filter === "active"
                      ? "No active todos"
                      : filter === "completed"
                        ? "No completed todos"
                        : "No todos yet. Create one to get started!"
                  }
                  icon={
                    filter === "completed"
                      ? "checkmark-done-circle-outline"
                      : "list-outline"
                  }
                />
              </View>
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Filter Bar */}
          <View style={[styles.filterBar, { borderTopColor: theme.border }]}>
            <Text style={[styles.itemsLeft, { color: theme.filterButton }]}>
              {activeTodosCount} items left
            </Text>

            {/* Desktop: Show filters inline */}
            {!isMobile && (
              <View style={styles.filterButtons}>
                <TouchableOpacity onPress={() => setFilter("all")} activeOpacity={0.7}>
                  <Animated.Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          filter === "all" ? theme.primary : theme.filterButton,
                        fontWeight: filter === "all" ? "700" : "400",
                      },
                    ]}
                  >
                    All
                  </Animated.Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter("active")} activeOpacity={0.7}>
                  <Animated.Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          filter === "active"
                            ? theme.primary
                            : theme.filterButton,
                        fontWeight: filter === "active" ? "700" : "400",
                      },
                    ]}
                  >
                    Active
                  </Animated.Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter("completed")} activeOpacity={0.7}>
                  <Animated.Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          filter === "completed"
                            ? theme.primary
                            : theme.filterButton,
                        fontWeight: filter === "completed" ? "700" : "400",
                      },
                    ]}
                  >
                    Completed
                  </Animated.Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={handleClearCompleted} activeOpacity={0.7}>
              <Text style={[styles.clearText, { color: theme.filterButton }]}>
                Clear Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mobile: Separate filter card */}
        {isMobile && (
          <View
            style={[
              styles.mobileFilterCard,
              { backgroundColor: theme.cardBackground, maxWidth: contentWidth },
            ]}
          >
            <View style={styles.filterButtons}>
              <TouchableOpacity onPress={() => setFilter("all")} activeOpacity={0.7}>
                <Animated.Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter === "all" ? theme.primary : theme.filterButton,
                      fontWeight: filter === "all" ? "400" : "400",
                    },
                  ]}
                >
                  All
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilter("active")} activeOpacity={0.7}>
                <Animated.Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter === "active"
                          ? theme.primary
                          : theme.filterButton,
                      fontWeight: filter === "active" ? "400" : "400",
                    },
                  ]}
                >
                  Active
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilter("completed")} activeOpacity={0.7}>
                <Animated.Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter === "completed"
                          ? theme.primary
                          : theme.filterButton,
                      fontWeight: filter === "completed" ? "400" : "400",
                    },
                  ]}
                >
                  Completed
                </Animated.Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer hint */}
        <Text
          style={[
            styles.footerHint,
            { color: theme.filterButton, maxWidth: contentWidth },
          ]}
        >
          Drag and drop to reorder list
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackground: {
    width: "100%",
  },
  headerImage: {
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
  },
  headerOverlay: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  headerContent: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 10,
    fontFamily: "JosefinSans-Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 5,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  checkCircle: {
    padding: 2,
  },
  checkCircleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: -0.17,
    fontFamily: "JosefinSans-Regular",
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
  },
  todoListContainer: {
    width: "100%",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  emptyList: {
    minHeight: 300,
  },
  emptyStateContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  itemsLeft: {
    fontSize: 14,
    letterSpacing: -0.17,
    fontFamily: "JosefinSans-Regular",
    fontWeight: "400",
  },
  filterButtons: {
    flexDirection: "row",
    gap: 18,
  },
  filterText: {
    fontSize: 14,
    letterSpacing: -0.19,
    fontFamily: "JosefinSans-Bold",
  },
  clearText: {
    fontSize: 14,
    letterSpacing: -0.17,
    fontFamily: "JosefinSans-Regular",
    fontWeight: "400",
  },
  mobileFilterCard: {
    width: "100%",
    marginTop: 16,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  footerHint: {
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 24,
    letterSpacing: -0.19,
    fontFamily: "JosefinSans-Regular",
  },
});