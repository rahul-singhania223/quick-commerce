import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OtpInputProps {
    code: string;
    setCode: (code: string) => void;
    isError: boolean;
    isDisabled: boolean;
}

const OtpInput = ({ code, setCode, isError, isDisabled } : OtpInputProps) => {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text : string, index : number) => {
    const newCode = code.split('');
    newCode[index] = text;
    const finalCode = newCode.join('');
    setCode(finalCode);

    // Auto-advance
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e : any, index : number) => {
    // Backspace to previous box
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(6).fill(0).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputs.current[i] = ref)}
          style={[
            styles.box,
            code[i] ? styles.boxActive : null,
            isError ? styles.boxError : null,
          ]}
          maxLength={1} // One char per box
          keyboardType="number-pad"
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          value={code[i] || ''}
          editable={!isDisabled}
          autoFocus={i === 0}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  boxActive: {
    borderColor: '#16A34A',
    borderWidth: 2,
  },
  boxError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
});

export default OtpInput;