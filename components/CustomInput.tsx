import React, { useState, FC, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, icons, SIZES } from '@/constants';
import { useTheme } from '@/contexts/themeContext';
import { Image } from 'expo-image';
import FONTS from '@/constants/fonts';

type InputType = string | number | boolean;

interface InputProps extends TextInputProps {
  id: string;
  icon?: string;
  label: string;
  errorText?: string;
  checked?: boolean;
  isEditable?: boolean;
  prefilledValue?: string;
  onEditPress?: () => void;
  showCheckbox?: boolean;
  fontWeight?: 'normal' | 'bold' | '500';
  showModal?: boolean;
}

const Input: FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(props.readOnly ? true : false);
  const [labelPosition] = useState(new Animated.Value(props.value ? 2 : 18));
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { dark } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(true);
  };

  const handleBlur = () => {
    if (!props.value) {
      setIsFocused(false);
      animateLabel(false);
    }
  };

  const animateLabel = (up: boolean) => {
    Animated.timing(labelPosition, {
      toValue: up ? 2 : 18,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // Move label up if prefilled value exists
    if (props.value || props.prefilledValue) {
      animateLabel(true);
    }
  }, [props.value, props.prefilledValue]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          props.errorText
            ? styles.errorInput
            : { borderColor: isFocused ? COLORS.primary : COLORS.greyscale600 },
        ]}
      >
        {props.icon && (
          <Image
            source={props.icon}
            style={[
              styles.icon,
              { tintColor: isFocused ? COLORS.primary : '#BCBCBC' },
            ]}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={props.id === 'password' && !isPasswordVisible}
          editable={props.isEditable !== false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={props.id}
          ref={inputRef}
          placeholderTextColor={isFocused ? COLORS.primary : '#BCBCBC'}
          style={[
            styles.input,
            {
              color: dark ? COLORS.white : COLORS.black,
              fontWeight: props.fontWeight || FONTS.Regular,
              paddingLeft: props.icon ? 40 : 15,
              paddingRight: 40,
              borderColor: props.errorText
                ? COLORS.error
                : isFocused
                ? COLORS.primary
                : COLORS.greyscale300,
            },
          ]}
        />

        {props.id === 'password' && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Image
              source={isPasswordVisible ? icons.eye : icons.eyeCloseUp}
              style={[
                styles.icon,
                {
                  tintColor: isFocused ? COLORS.primary : '#BCBCBC',
                },
              ]}
            />
          </TouchableOpacity>
        )}

        {props.label && (
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelPosition,
                fontSize: isFocused || props.value || props.readOnly ? 12 : 16,
                color: props.errorText
                  ? COLORS.red
                  : isFocused || props.value || props.readOnly
                  ? COLORS.primary
                  : dark
                  ? COLORS.grayscale200
                  : COLORS.greyscale600,
              },
            ]}
            onPress={() => inputRef.current?.focus()}
          >
            {props.label}
          </Animated.Text>
        )}
      </View>
      {props.errorText && (
        <View>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    paddingVertical: 4,
    borderRadius: SIZES.padding,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  input: {
    width: '100%',
    fontSize: SIZES.body3,
    paddingVertical: 16,
    color: COLORS.black,
    position: 'relative',
    borderRadius: SIZES.padding,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: '35%',
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    position: 'absolute',
    left: 15,
    top: 13,
    bottom: 5,
    fontSize: 16,
    transitionProperty: 'all',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-in-out',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: '400',
    borderColor: COLORS.red,
  },
});

export default Input;
