import { useState, useCallback } from "react";
import { ImageSourcePropType } from "react-native";

export interface User {
  id: string;
  displayName: string;
  bio: string;
  avatar: ImageSourcePropType;
  points: number;
  joinedDate: string;
}

const AVATARS = {
  camera: require("../assets/images/avatars/camera.png"),
  film: require("../assets/images/avatars/film.png"),
  polaroid: require("../assets/images/avatars/polaroid.png"),
  album: require("../assets/images/avatars/album.png"),
};

export const AVATAR_OPTIONS = [
  { id: "camera", source: AVATARS.camera },
  { id: "film", source: AVATARS.film },
  { id: "polaroid", source: AVATARS.polaroid },
  { id: "album", source: AVATARS.album },
];

let globalUser: User = {
  id: "self",
  displayName: "Photo Enthusiast",
  bio: "Preserving memories across time",
  avatar: AVATARS.camera,
  points: 0,
  joinedDate: "December 2024",
};

let listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function useUserStore() {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  useState(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  });

  const updateUser = useCallback((updates: Partial<User>) => {
    globalUser = { ...globalUser, ...updates };
    notifyListeners();
  }, []);

  const addPoints = useCallback((points: number) => {
    globalUser = { ...globalUser, points: globalUser.points + points };
    notifyListeners();
  }, []);

  return {
    user: globalUser,
    updateUser,
    addPoints,
  };
}
