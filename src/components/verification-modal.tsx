import { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type VerificationModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onVerified: () => void;
  verifyCode: (code: string) => Promise<boolean>;
};

const CODE_LENGTH = 6;

export function VerificationModal({
  visible,
  onDismiss,
  onVerified,
  verifyCode,
}: VerificationModalProps) {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDismiss = () => {
    inputRef.current?.blur();
    setCode("");
    onDismiss();
  };

  const handleCodeChange = async (value: string) => {
    const nextCode = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(nextCode);

    if (nextCode.length === CODE_LENGTH && !isVerifying) {
      setIsVerifying(true);
      let isVerified = false;

      try {
        isVerified = await verifyCode(nextCode);
      } catch {
        isVerified = false;
      }

      setIsVerifying(false);

      if (!isVerified) {
        return;
      }

      inputRef.current?.blur();
      onVerified();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleDismiss}
      onShow={() => inputRef.current?.focus()}
    >
      <View className="flex-1 bg-black/30">
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View
            className="rounded-t-[28px] bg-white px-6 pb-9 pt-3"
            style={{ boxShadow: "0 -12px 32px rgba(13, 19, 43, 0.14)" }}
          >
            <View className="mb-5 h-1.5 w-10 self-center rounded-full bg-[#D9DCE5]" />

            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="font-poppins-bold text-[26px] leading-[34px] text-text-primary">
                  Check your email
                </Text>
                <Text className="mt-2 font-poppins text-[15px] leading-[23px] text-text-secondary">
                  We sent you a verification code. Enter the 6-digit code to continue.
                </Text>
              </View>

              <TouchableOpacity
                accessibilityLabel="Close verification"
                className="size-10 items-center justify-center"
                hitSlop={8}
                onPress={handleDismiss}
              >
                <Text className="font-poppins text-[30px] leading-[30px] text-text-secondary">
                  {"\u00D7"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="relative mt-7 flex-row justify-between">
              <View
                className="pointer-events-none flex-row justify-between"
                style={{ width: "100%" }}
              >
                {Array.from({ length: CODE_LENGTH }, (_, index) => (
                  <View
                    key={index}
                    className={`size-12 items-center justify-center rounded-[12px] border-2 ${
                      code[index] ? "border-brand-purple" : "border-[#E5E7EB]"
                    }`}
                  >
                    <Text className="font-poppins-semibold text-[20px] text-text-primary">
                      {code[index] ?? ""}
                    </Text>
                  </View>
                ))}
              </View>

              <TextInput
                ref={inputRef}
                accessibilityLabel="Six-digit verification code"
                autoComplete="one-time-code"
                caretHidden
                contextMenuHidden
                inputMode="numeric"
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                onChangeText={handleCodeChange}
                showSoftInputOnFocus
                style={{
                  bottom: 0,
                  left: 0,
                  opacity: 0.01,
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
                textContentType="oneTimeCode"
                value={code}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
