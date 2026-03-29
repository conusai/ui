import type { MotionProps, Variants } from "framer-motion";

const reducedEase = [0.16, 1, 0.3, 1] as const;

export function createSidebarVariants(shouldReduceMotion: boolean): Variants {
  if (shouldReduceMotion) {
    return {
      closed: {
        opacity: 0,
        transition: { duration: 0.16, ease: reducedEase },
      },
      open: {
        opacity: 1,
        transition: { duration: 0.16, ease: reducedEase },
      },
    };
  }

  return {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 280, damping: 30 },
    },
  };
}

export function createPanelVariants(shouldReduceMotion: boolean): Variants {
  if (shouldReduceMotion) {
    return {
      closed: {
        opacity: 0,
        transition: { duration: 0.16, ease: reducedEase },
      },
      open: {
        opacity: 1,
        transition: { duration: 0.16, ease: reducedEase },
      },
    };
  }

  return {
    closed: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] as const },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 28 },
    },
  };
}

export function createFadeUpVariants(shouldReduceMotion: boolean): Variants {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: () => ({
        opacity: 1,
        transition: { duration: 0.16, ease: reducedEase },
      }),
    };
  }

  return {
    hidden: { opacity: 0, y: 18 },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.06 * index,
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };
}

export function createLoaderVariants(shouldReduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0.14 : 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0.14 : 0.24 },
    },
  };
}

export function createTapMotion(
  shouldReduceMotion: boolean
): Pick<MotionProps, "whileHover" | "whileTap"> {
  if (shouldReduceMotion) {
    return {};
  }

  return {
    whileTap: { scale: 0.97 },
    whileHover: { y: -1 },
  };
}

export function cnMotionProps<T extends MotionProps>(
  ...propsList: Array<Partial<T> | undefined>
): Partial<T> {
  const merged: Partial<T> = {};

  for (const props of propsList) {
    if (!props) {
      continue;
    }

    Object.assign(merged, props);
  }

  return merged;
}
