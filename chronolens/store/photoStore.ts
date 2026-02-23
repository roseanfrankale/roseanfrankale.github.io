import { useState, useCallback } from "react";
import { ImageSourcePropType } from "react-native";

export interface PhotoLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface Photo {
  id: string;
  uri: string;
  year: number;
  date: string;
  caption?: string;
  tags?: string[];
  title?: string;
  catalogNumber?: string;
  era?: string;
  isShared: boolean;
  uploadDate: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  userName?: string;
  userAvatar?: ImageSourcePropType;
  userPoints?: number;
  userId?: string;
  location?: PhotoLocation | string;
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
    date: "1985-07-15",
    caption:
      "Summer vacation at the lake. Dad teaching me to fish for the first time.",
    isShared: true,
    uploadDate: "2024-01-15",
    likes: 124,
    comments: 18,
    isLiked: false,
    userName: "Sarah M.",
    userAvatar: AVATARS.camera,
    userPoints: 850,
    userId: "u1",
    location: { lat: 44.9778, lng: -93.2650, name: "Minneapolis, MN" },
  },
  {
    id: "c2",
    uri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    year: 1972,
    date: "1972-12-20",
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
    location: { lat: 40.7128, lng: -74.0060, name: "New York, NY" },
  },
  {
    id: "c3",
    uri: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600",
    year: 1994,
    date: "1994-06-10",
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
    location: { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA" },
  },
  {
    id: "c4",
    uri: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600",
    year: 1968,
    date: "1968-08-05",
    caption:
      "Family road trip across the country. The beginning of many adventures.",
    isShared: true,
    uploadDate: "2024-01-05",
    likes: 201,
    comments: 31,
    isLiked: false,
    userName: "David K.",
    userAvatar: AVATARS.album,
    userPoints: 980,
    userId: "u4",
    location: { lat: 37.7749, lng: -122.4194, name: "San Francisco, CA" },
  },
  {
    id: "c5",
    uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
    year: 2010,
    date: "2010-03-22",
    caption: "Spring break in Paris. Eiffel Tower at sunset.",
    isShared: true,
    uploadDate: "2024-01-03",
    likes: 315,
    comments: 42,
    isLiked: true,
    userName: "Emma T.",
    userAvatar: AVATARS.camera,
    userPoints: 1500,
    userId: "u5",
    location: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
  },
  {
    id: "c6",
    uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
    year: 2005,
    date: "2005-11-12",
    caption: "Wedding day in Tokyo. Best day of our lives!",
    isShared: true,
    uploadDate: "2024-01-02",
    likes: 267,
    comments: 38,
    isLiked: false,
    userName: "Kenji S.",
    userAvatar: AVATARS.film,
    userPoints: 1120,
    userId: "u6",
    location: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
  },
  {
    id: "c7",
    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    year: 1999,
    date: "1999-09-18",
    caption: "College days in Boston. Forever young!",
    isShared: true,
    uploadDate: "2024-01-01",
    likes: 178,
    comments: 22,
    isLiked: true,
    userName: "Chris B.",
    userAvatar: AVATARS.polaroid,
    userPoints: 890,
    userId: "u7",
    location: { lat: 42.3601, lng: -71.0589, name: "Boston, MA" },
  },
  {
    id: "c8",
    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    year: 2015,
    date: "2015-05-30",
    caption: "Beach vacation in Sydney. Sun, sand, and family.",
    isShared: true,
    uploadDate: "2023-12-30",
    likes: 243,
    comments: 29,
    isLiked: false,
    userName: "Olivia W.",
    userAvatar: AVATARS.album,
    userPoints: 1050,
    userId: "u8",
    location: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
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

  const addPhoto = useCallback(
    (
      photo: Omit<
        Photo,
        "id" | "uploadDate" | "likes" | "comments" | "isLiked"
      >,
    ) => {
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
    },
    [],
  );

  const toggleLike = useCallback((photoId: string) => {
    globalCommunityPhotos = globalCommunityPhotos.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            isLiked: !photo.isLiked,
            likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1,
          }
        : photo,
    );
    notifyListeners();
  }, []);

  const deletePhoto = useCallback((photoId: string) => {
    globalPhotos = globalPhotos.filter((p) => p.id !== photoId);
    globalCommunityPhotos = globalCommunityPhotos.filter(
      (p) => p.id !== photoId,
    );
    notifyListeners();
  }, []);

  const getPhotoById = useCallback((photoId: string): Photo | undefined => {
    return [...globalPhotos, ...globalCommunityPhotos].find(
      (p) => p.id === photoId,
    );
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
