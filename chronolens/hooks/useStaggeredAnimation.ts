import { useEffect } from "react";
import { useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useTheme } from "./useTheme";
import { timingConfig } from "../utils/animations";

interface StaggeredAnimationOptions {
  delay?: number;
  startDelay?: number;
  initialOpacity?: number;
  initialTranslateY?: number;
}

/**
 * Hook for creating staggered entrance animations
 * @param index - Index of the item in the list
 * @param options - Animation configuration options
 * @returns Animated values for opacity and translateY
 */
export function useStaggeredAnimation(
  index: number,
  options: StaggeredAnimationOptions = {},
) {
  const {
    delay = 50,
    startDelay = 0,
    initialOpacity = 0,
    initialTranslateY = 20,
  } = options;

  const { skin } = useTheme();
  const opacity = useSharedValue(initialOpacity);
  const translateY = useSharedValue(initialTranslateY);

  useEffect(() => {
    const config = timingConfig[skin as "historian" | "cyberpunk"];
    const totalDelay = startDelay + index * delay;

    opacity.value = withDelay(totalDelay, withTiming(1, config));
    translateY.value = withDelay(totalDelay, withTiming(0, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, delay, startDelay, skin]);

  return { opacity, translateY };
}

/**
 * Hook for creating entrance animation for a single element
 * @param options - Animation configuration options
 * @returns Animated values for opacity and translateY
 */
export function useEntranceAnimation(
  options: Omit<StaggeredAnimationOptions, "delay"> = {},
) {
  return useStaggeredAnimation(0, { ...options, delay: 0 });
}
