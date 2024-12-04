import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function Separator() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        height: 1,
        backgroundColor: Colors[colorScheme].border,
      }}
    />
  );
}
