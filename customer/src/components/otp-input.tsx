import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import { Colors } from "../constants/theme";

interface OTPInputProps {
  codeCount?: number;
  onCodeFilled?: (code: string) => void;
}

export const OTPInput = ({ codeCount = 6, onCodeFilled }: OTPInputProps) => {
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChangeText = (text: string) => {
    // Only allow numbers and limit length
    const cleanedText = text.replace(/[^0-9]/g, "");
    setCode(cleanedText);
    if (cleanedText.length === codeCount) {
      onCodeFilled?.(cleanedText);
      Keyboard.dismiss();
    }
  };

  // Create an array based on codeCount to render the boxes
  const codeDigits = Array(codeCount).fill(0);

  return (
    <View style={styles.container}>
      <Pressable style={styles.inputsContainer} onPress={handlePress}>
        {codeDigits.map((_, index) => {
          const char = code[index] || "";
          const isCurrentChar = index === code.length;
          const isLastChar = index === codeCount - 1;
          const isCodeFull = code.length === codeCount;
          const isFocusedChar =
            isFocused && (isCurrentChar || (isCodeFull && isLastChar));

          return (
            <View
              key={index}
              style={[styles.inputBox, isFocusedChar && styles.inputBoxFocused]}
            >
              <Text style={styles.inputText}>{char}</Text>
              {/* Caret/Cursor simulation */}
              {isFocusedChar && !char && <View style={styles.caret} />}
            </View>
          );
        })}
      </Pressable>

      {/* Hidden TextInput */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChangeText}
        maxLength={codeCount}
        keyboardType="number-pad"
        textContentType="oneTimeCode" // Enables iOS Auto-fill
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  inputsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inputBox: {
    flex: 1,
    width: 45,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBoxFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.foreground,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  caret: {
    position: "absolute",
    width: 2,
    height: 20,
    backgroundColor: Colors.primary,
  },
});
