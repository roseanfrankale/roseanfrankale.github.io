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
    uri: "https://images.unsplash.com/photo-1722370021886-3a70655f6049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYmxhY2slMjB3aGl0ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Nzg0MjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1942,
    date: "1942-08-14",
    caption: "Vintage Black & White Portrait",
    title: "Vintage Black & White Portrait",
    catalogNumber: "REF.2026-001-A",
    isShared: true,
    uploadDate: "2024-01-15",
    likes: 124,
    comments: 18,
    isLiked: false,
    userName: "Sarah M.",
    userAvatar: AVATARS.camera,
    userPoints: 850,
    userId: "u1",
    location: { lat: 51.5074, lng: -0.1278, name: "London, England" },
  },
  {
    id: "c2",
    uri: "https://images.unsplash.com/photo-1690098520669-aa8bf6889a0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBjaXR5JTIwc3RyZWV0JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2Nzg0MjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1955,
    date: "1955-03-22",
    caption: "Old City Street Architecture",
    title: "Old City Street Architecture",
    catalogNumber: "REF.2026-001-B",
    isShared: true,
    uploadDate: "2024-01-10",
    likes: 89,
    comments: 12,
    isLiked: true,
    userName: "Michael R.",
    userAvatar: AVATARS.film,
    userPoints: 620,
    userId: "u2",
    location: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
  },
  {
    id: "c3",
    uri: "https://images.unsplash.com/photo-1674828804983-aae4de899ce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwbGFuZHNjYXBlJTIwbmF0dXJlfGVufDF8fHx8MTc2Nzg0MjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1938,
    date: "1938-06-10",
    caption: "Antique Landscape Nature",
    title: "Antique Landscape Nature",
    catalogNumber: "REF.2026-001-C",
    isShared: true,
    uploadDate: "2024-01-08",
    likes: 156,
    comments: 24,
    isLiked: false,
    userName: "Jessica L.",
    userAvatar: AVATARS.polaroid,
    userPoints: 1200,
    userId: "u3",
    location: { lat: 57.1200, lng: -4.7100, name: "Scottish Highlands" },
  },
  {
    id: "c4",
    uri: "https://images.unsplash.com/photo-1752509323259-5893ffef66df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpY2FsJTIwYnVpbGRpbmclMjBtb251bWVudHxlbnwxfHx8fDE3Njc4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1961,
    date: "1961-11-05",
    caption: "Historical Building Monument",
    title: "Historical Building Monument",
    catalogNumber: "REF.2026-001-D",
    isShared: true,
    uploadDate: "2024-01-05",
    likes: 201,
    comments: 31,
    isLiked: false,
    userName: "David K.",
    userAvatar: AVATARS.album,
    userPoints: 980,
    userId: "u4",
    location: { lat: 41.9028, lng: 12.4964, name: "Rome, Italy" },
  },
  {
    id: "c5",
    uri: "https://images.unsplash.com/photo-1581342997451-0215a38cf1cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFtaWx5JTIwcGhvdG98ZW58MXx8fHwxNzY3ODE5ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1948,
    date: "1948-12-25",
    caption: "Vintage Family Photo",
    title: "Vintage Family Photo",
    catalogNumber: "REF.2026-001-E",
    isShared: true,
    uploadDate: "2024-01-03",
    likes: 315,
    comments: 42,
    isLiked: true,
    userName: "Emma T.",
    userAvatar: AVATARS.camera,
    userPoints: 1500,
    userId: "u5",
    location: { lat: 40.7128, lng: -74.0060, name: "New York, USA" },
  },
  {
    id: "c6",
    uri: "https://images.unsplash.com/photo-1765562435481-4da67d85ae75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHRyYXZlbCUyMHBob3RvZ3JhcGh8ZW58MXx8fHwxNzY3ODQyMzg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1952,
    date: "1952-07-18",
    caption: "Retro Travel Photography",
    title: "Retro Travel Photography",
    catalogNumber: "REF.2026-001-F",
    isShared: true,
    uploadDate: "2024-01-02",
    likes: 267,
    comments: 38,
    isLiked: false,
    userName: "Kenji S.",
    userAvatar: AVATARS.film,
    userPoints: 1120,
    userId: "u6",
    location: { lat: 36.3932, lng: 25.4615, name: "Santorini, Greece" },
  },
  {
    id: "c7",
    uri: "https://images.unsplash.com/photo-1652727743972-5fd1483a23ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FyJTIwdmludGFnZXxlbnwxfHx8fDE3Njc3NzU4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1959,
    date: "1959-04-03",
    caption: "Classic Car Vintage",
    title: "Classic Car Vintage",
    catalogNumber: "REF.2026-001-G",
    isShared: true,
    uploadDate: "2024-01-01",
    likes: 178,
    comments: 22,
    isLiked: true,
    userName: "Chris B.",
    userAvatar: AVATARS.polaroid,
    userPoints: 890,
    userId: "u7",
    location: { lat: 42.3314, lng: -83.0458, name: "Detroit, USA" },
  },
  {
    id: "c8",
    uri: "https://images.unsplash.com/photo-1643970118347-e11ad4d48a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBib29rJTIwbGlicmFyeXxlbnwxfHx8fDE3Njc4NDIzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    year: 1963,
    date: "1963-09-12",
    caption: "Old Book Library",
    title: "Old Book Library",
    catalogNumber: "REF.2026-001-H",
    isShared: true,
    uploadDate: "2023-12-30",
    likes: 243,
    comments: 29,
    isLiked: false,
    userName: "Olivia W.",
    userAvatar: AVATARS.album,
    userPoints: 1050,
    userId: "u8",
    location: { lat: 51.7520, lng: -1.2577, name: "Oxford, England" },
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
