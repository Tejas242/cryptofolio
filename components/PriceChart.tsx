import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface PriceChartProps {
  data: number[];
}

const PriceChart = ({ data }: PriceChartProps) => {
  const colorScheme = useColorScheme();

  const chartConfig = {
    backgroundColor: Colors[colorScheme].background,
    backgroundGradientFrom: Colors[colorScheme].background,
    backgroundGradientTo: Colors[colorScheme].background,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(95, 169, 230, ${opacity})`,
    labelColor: () => Colors[colorScheme].text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors[colorScheme].tint,
    },
    propsForBackgroundLines: {
      stroke: Colors[colorScheme].border,
      strokeWidth: 1,
      strokeDasharray: [],
    },
  };

  if (!data || data.length === 0) {
    return (
      <View style={{ alignItems: "center", padding: 20 }}>
        <ThemedText>No chart data available</ThemedText>
      </View>
    );
  }

  return (
    <LineChart
      data={{
        labels: [], // Empty labels for clean look
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(47, 149, 220, ${opacity})`, // Consistent color
          },
        ],
      }}
      width={Dimensions.get("window").width - 32} // Padding considered
      height={220}
      yAxisLabel="$"
      yAxisSuffix=""
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
      withDots={false}
      withInnerLines={false}
      withOuterLines={true}
      withVerticalLabels={false}
      withHorizontalLabels={true}
    />
  );
};

export default PriceChart;
