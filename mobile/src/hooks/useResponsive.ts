import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width } = useWindowDimensions();

  return {
    width,
    isTablet: width >= 768,
    isDesktop: width >= 1100,
    contentMaxWidth:
      width >= 1400 ? 1320 : width >= 1100 ? 1180 : width >= 768 ? 960 : 720
  };
}

