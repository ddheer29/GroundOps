import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRealm } from '../database/realm';
import { User } from '../database/schemas';
import { COLORS, SPACING, FONT_SIZE } from '../theme/theme';
import { ApiClient } from '../api/client';

export const EditProfileScreen = () => {
  const realm = useRealm();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const initialUser = route.params?.user;

  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    dob: initialUser?.dob || '',
    profilePhoto: initialUser?.profilePhoto || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, dob: dateString });
    }
  };

  const handleImageResponse = (result: ImagePickerResponse) => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      return;
    }

    if (result.assets && result.assets[0].uri) {
      setFormData({ ...formData, profilePhoto: result.assets[0].uri });
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await launchCamera({
              mediaType: 'photo',
              quality: 1,
              saveToPhotos: true,
            });
            handleImageResponse(result);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 1,
            });
            handleImageResponse(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setShowDatePicker(false);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      const user = realm.objects(User)[0];
      if (!user) {
        throw new Error('User not found');
      }

      // 1. Update Backend
      await ApiClient.updateProfile({
        name: formData.name,
        dob: formData.dob,
        profilePhoto: formData.profilePhoto, // Local URI or expectant of remote URL handling in backend
      });

      // 2. Update Local Realm
      realm.write(() => {
        user.name = formData.name;
        user.dob = formData.dob;
        user.profilePhoto = formData.profilePhoto;
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please check your connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleImageSelection}
            style={styles.avatarWrapper}
          >
            {formData.profilePhoto ? (
              <Image
                source={{ uri: formData.profilePhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  }}
                  style={styles.avatar}
                />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <MaterialDesignIcons
                name="camera"
                size={20}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            placeholder="Enter your full name"
          />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text
                style={[
                  styles.dateText,
                  !formData.dob && { color: COLORS.textSecondary },
                ]}
              >
                {formData.dob || 'Select Date of Birth'}
              </Text>
              <MaterialDesignIcons
                name="calendar"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.m,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    fontSize: FONT_SIZE.m,
    color: COLORS.text,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
  },
  dateText: {
    fontSize: FONT_SIZE.m,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.m,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    padding: SPACING.m,
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.m,
  },
});
