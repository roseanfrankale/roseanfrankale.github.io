import { useState, useCallback } from "react";
import { ImageSourcePropType } from "react-native";

export interface Photo {
  id: string;
  uri: string;
  year: number;
  caption?: string;
  tags?: string[];
  isShared: boolean;
  uploadDate: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  userName?: string;
  userAvatar?: ImageSourcePropType;
  userPoints?: number;
  userId?: string;
}

const AVATARS = {
  camera: require("../assets/images/avatars/camera.png"),
  film: require("../assets/images/avatars/film.png"),
  polaroid: require("../assets/images/avatars/polaroid.png"),
  album: require("../assets/images/avatars/album.png"),
};

const SAMPLE_COMMUNITY_PHOTOS: Photo[] = [
  {
    id: "c1",
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    year: 1985,
    caption: "Summer vacation at the lake. Dad teaching me to fish for the first time.",
    isShared: true,
    uploadDate: "2024-01-15",
    likes: 124,
    comments: 18,
    isLiked: false,
    userName: "Sarah M.",
    userAvatar: AVATARS.camera,
    userPoints: 850,
    userId: "u1",
  },
  {
    id: "c2",
    uri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    year: 1972,
    caption: "Grandma's kitchen. She made the best apple pie.",
    isShared: true,
    uploadDate: "2024-01-10",
    likes: 89,
    comments: 12,
    isLiked: true,
    userName: "Michael R.",
    userAvatar: AVATARS.film,
    userPoints: 620,
    userId: "u2",
  },
  {
    id: "c3",
    uri: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600",
    year: 1994,
    caption: "High school graduation day. Time flies!",
    isShared: true,
    uploadDate: "2024-01-08",
    likes: 156,
    comments: 24,
    isLiked: false,
    userName: "Jessica L.",
    userAvatar: AVATARS.polaroid,
    userPoints: 1200,
    userId: "u3",
  },
  {
    id: "c4",
    uri: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600",
    year: 1968,
    caption: "Family road trip across the country. The beginning of many adventures.",
    isShared: true,
    uploadDate: "2024-01-05",
    likes: 201,
    comments: 31,
    isLiked: false,
    userName: "David K.",
    userAvatar: AVATARS.album,
    userPoints: 980,
    userId: "u4",
  },
];

let globalPhotos: Photo[] = [];
let globalCommunityPhotos: Photo[] = [...SAMPLE_COMMUNITY_PHOTOS];
let listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function usePhotoStore() {
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

  const addPhoto = useCallback((photo: Omit<Photo, "id" | "uploadDate" | "likes" | "comments" | "isLiked">) => {
    const newPhoto: Photo = {
      ...photo,
      id: `p${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    globalPhotos = [newPhoto, ...globalPhotos];
    
    if (photo.isShared) {
      globalCommunityPhotos = [
        {
          ...newPhoto,
          userName: "You",
          userAvatar: AVATARS.camera,
          userPoints: 0,
          userId: "self",
        },
        ...globalCommunityPhotos,
      ];
    }
    
    notifyListeners();
    return newPhoto;
  }, []);

  const toggleLike = useCallback((photoId: string) => {
    globalCommunityPhotos = globalCommunityPhotos.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            isLiked: !photo.isLiked,
            likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1,
          }
        : photo
    );
    notifyListeners();
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    globalPhotos = globalPhotos.filter((p) => p.id !== photoId);
    globalCommunityPhotos = globalCommunityPhotos.filter((p) => p.id !== photoId);
    notifyListeners();
  }, []);

  const getPhotoById = useCallback((photoId: string): Photo | undefined => {
    return [...globalPhotos, ...globalCommunityPhotos].find((p) => p.id === photoId);
  }, []);

  return {
    photos: globalPhotos,
    communityPhotos: globalCommunityPhotos,
    addPhoto,
    toggleLike,
    deletePhoto,
    getPhotoById,
  };
}
