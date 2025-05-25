import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const usePostStore = create((set) => ({
  posts: [],

  fetchPosts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        };
      });
      set({ posts: postsData });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  },

  addPost: async (post) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), post);
      set((state) => ({ posts: [{ id: docRef.id, ...post }, ...state.posts] }));
      return docRef;
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  },

  updatePost: async (postId, updatedPost) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, updatedPost);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        ),
      }));
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  },

  deletePost: async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  },
}));
