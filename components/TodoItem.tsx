import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const checkboxScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const deleteOpacity = useRef(new Animated.Value(0.5)).current;

  // Initial fade-in animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Completion animation
  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: todo.completed ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [todo.completed]);

  const handleToggle = () => {
    // Checkbox animation
    Animated.sequence([
      Animated.spring(checkboxScale, {
        toValue: 0.8,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(checkboxScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(todo._id);
  };

  const handleDelete = () => {
    // Delete animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete(todo._id);
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          borderBottomColor: theme.border,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        style={styles.checkboxContainer}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: checkboxScale }] }}>
          {todo.completed ? (
            <LinearGradient
              colors={['#57DDFF', '#C058F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkboxGradient}
            >
              <Ionicons name="checkmark" size={11} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View style={[styles.checkboxEmpty, { borderColor: theme.border }]} />
          )}
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text
          style={[
            styles.title,
            {
              color: todo.completed ? theme.completedText : theme.text,
              textDecorationLine: todo.completed ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={0}
        >
          {todo.title}
        </Text>
      </Animated.View>

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        activeOpacity={0.7}
        onPressIn={() => {
          Animated.timing(deleteOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(deleteOpacity, {
            toValue: 0.5,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }}
      >
        <Animated.View style={{ opacity: deleteOpacity }}>
          <Ionicons name="close" size={18} color={theme.icon} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    gap: 12,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: -0.17,
    fontFamily: 'JosefinSans-Regular',
  },
  deleteButton: {
    padding: 2,
    marginTop: 2,
  },
});