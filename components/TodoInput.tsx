import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface TodoInputProps {
  onAdd: (title: string) => Promise<void>;
  placeholder?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({ 
  onAdd, 
  placeholder = 'Create a new todo...' 
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (title.trim()) {
      setIsAdding(true);
      try {
        await onAdd(title.trim());
        setTitle('');
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="add-circle-outline" size={24} color={theme.icon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          editable={!isAdding}
          returnKeyType="done"
        />
        {isAdding ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          title.trim().length > 0 && (
            <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
              <Ionicons name="arrow-forward-circle" size={28} color={theme.primary} />
            </TouchableOpacity>
          )
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
});