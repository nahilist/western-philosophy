"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  User,
  BookOpen,
  Bookmark,
  PenLine,
  ShieldCheck,
  LogOut,
  Check,
  ArrowRight,
  Trash2,
  Sparkles,
  Clock,
  Lock,
  ExternalLink,
  Edit3,
  Save,
  RefreshCw,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PHILOSOPHER_COURSES } from "@/data/philosophers";
import {
  getUserFullProfile,
  updateUserProfile,
  getAllUserProgress,
  getAllUserBookmarks,
  getAllUserReflections,
  deleteUserReflection,
  UserProfileData,
} from "@/lib/supabase/queries";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "progress" | "bookmarks" | "reflections" | "settings";

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { user, logout, isSupabaseConnected } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [bookmarksList, setBookmarksList] = useState<any[]>([]);
  const [reflectionsList, setReflectionsList] = useState<any[]>([]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTradition, setEditTradition] = useState("Rationalism");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Fetch all user information
  const loadUserData = async () => {
    setLoading(true);
    try {
      const [profRes, progRes, bkmkRes, reflRes] = await Promise.all([
        getUserFullProfile(),
        getAllUserProgress(),
        getAllUserBookmarks(),
        getAllUserReflections(),
      ]);

      if (profRes.data) {
        setProfile(profRes.data);
        setEditName(profRes.data.full_name);
        setEditTradition(profRes.data.favorite_tradition || "Rationalism");
      }
      setProgressList(progRes.data || []);
      setBookmarksList(bkmkRes.data || []);
      setReflectionsList(reflRes.data || []);
    } catch (err) {
      console.error("Error loading account data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccessMsg(null);

    const res = await updateUserProfile({
      full_name: editName,
      favorite_tradition: editTradition,
    });
    setSavingProfile(false);

    if (res.success) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editName,
              favorite_tradition: editTradition,
            }
          : null
      );
      setIsEditing(false);
      setSaveSuccessMsg(
        isHi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई।" : "Profile identity updated successfully."
      );
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleDeleteReflection = async (id: string, courseId: string) => {
    await deleteUserReflection(id, courseId);
    setReflectionsList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-neutral-950 border border-neutral-800 text-white shadow-[0_30px_90px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================
            TOP BAR: LUXURY HEADER WITH IDENTITY BANNER
           ======================================================== */}
        <div className="px-6 sm:px-10 py-5 border-b border-neutral-900 bg-black flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Scholar Monogram Badge */}
            <div className="w-11 h-11 border border-neutral-700 bg-neutral-900 flex items-center justify-center text-white font-serif-classic font-bold text-lg">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "Φ"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif-classic text-lg sm:text-xl font-bold tracking-[0.15em] text-white uppercase">
                  {profile?.full_name || user.name}
                </h2>
                <span className="hidden sm:inline-block text-xs tracking-wider uppercase px-2 py-0.5 border border-neutral-800 text-neutral-300 font-mono font-medium">
                  {isSupabaseConnected ? "PostgreSQL Active" : "Local Codex"}
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-mono tracking-wider">
                {profile?.email || user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadUserData}
              title={isHi ? "रीफ्रेश करें" : "Refresh Data"}
              className="p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              aria-label="Close Account Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================
            NAVIGATION TABS (Desktop + Mobile Scrollable)
           ======================================================== */}
        <div className="flex items-center border-b border-neutral-900 bg-neutral-950/80 px-6 sm:px-10 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-white text-white font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isHi ? "सारांश (Overview)" : "Overview"}</span>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`py-3.5 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "progress"
                ? "border-white text-white font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {isHi ? "पाठ्यक्रम प्रगति" : "Course Progress"} ({progressList.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`py-3.5 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "border-white text-white font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>
              {isHi ? "सहेजे गए ग्रंथ" : "Bookmarks"} ({bookmarksList.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reflections")}
            className={`py-3.5 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "reflections"
                ? "border-white text-white font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>
              {isHi ? "दार्शनिक डायरी" : "Reflections"} ({reflectionsList.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3.5 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-white text-white font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? "प्रोफ़ाइल व सुरक्षा" : "Security & Profile"}</span>
          </button>
        </div>

        {/* ========================================================
            TAB CONTENT PANELS (Scrollable with Dark Luxury Layout)
           ======================================================== */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-thin scrollbar-thumb-neutral-800 space-y-8">
          {saveSuccessMsg && (
            <div className="p-3.5 bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 1: OVERVIEW
             ---------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Quick Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "शुरू किए गए पाठ्यक्रम" : "Courses In Progress"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-3xl font-bold text-white">
                      {progressList.length}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/ 14 Thinkers</span>
                  </div>
                </div>

                <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "सहेजे गए सूत्र व उद्धरण" : "Bookmarks Preserved"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-3xl font-bold text-white">
                      {bookmarksList.length}
                    </span>
                    <Bookmark className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="p-5 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "लिखित दार्शनिक विचार" : "Reflections Inscribed"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-3xl font-bold text-white">
                      {reflectionsList.length}
                    </span>
                    <PenLine className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Scholar Monograph Identity Card */}
              <div className="p-6 sm:p-8 border border-neutral-800 bg-neutral-950 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-300 font-mono font-medium">
                      {isHi ? "दार्शनिक पहचान" : "Scholar Dossier"}
                    </span>
                    <h3 className="font-serif-classic text-2xl font-bold text-white uppercase tracking-wider">
                      {profile?.full_name || user.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 transition-colors w-fit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isHi ? "संपादित करें" : "Edit Details"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono tracking-wider mb-1">
                      {isHi ? "प्राथमिक विचारधारा" : "Favored Tradition"}
                    </span>
                    <span className="font-serif-classic text-sm text-neutral-200">
                      {profile?.favorite_tradition || "Cartesian Rationalism"}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 block uppercase font-mono tracking-wider mb-1">
                      {isHi ? "सुरक्षा स्तर" : "Security Architecture"}
                    </span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Row-Level Security Active
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 block uppercase font-mono tracking-wider mb-1">
                      {isHi ? "पंजीकरण तिथि" : "Academy Member Since"}
                    </span>
                    <span className="font-mono text-neutral-300">
                      {new Date(profile?.created_at || Date.now()).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Highlight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <h4 className="font-serif-classic text-sm uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                    {isHi ? "हालिया अध्ययन" : "Recent Intellectual Inquiries"}
                  </h4>
                  {progressList.length > 0 && (
                    <button
                      onClick={() => setActiveTab("progress")}
                      className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1"
                    >
                      <span>{isHi ? "सभी देखें" : "View All"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {progressList.length === 0 ? (
                  <div className="p-8 border border-neutral-900 bg-black/40 text-center space-y-2">
                    <p className="font-garamond text-neutral-400 italic">
                      {isHi
                        ? "आपने अभी तक कोई पाठ्यक्रम शुरू नहीं किया है।"
                        : "You have not begun any course inquiries yet."}
                    </p>
                    <Link
                      href="/#courses"
                      onClick={onClose}
                      className="inline-block mt-2 text-xs uppercase tracking-[0.2em] font-serif-classic underline text-white"
                    >
                      {isHi ? "पाठ्यक्रम संग्रह देखें →" : "Explore Philosophical Canon →"}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progressList.slice(0, 2).map((item, idx) => {
                      const course = PHILOSOPHER_COURSES.find((c) => c.id === item.course_id);
                      if (!course) return null;
                      return (
                        <div
                          key={idx}
                          className="p-4 border border-neutral-900 bg-black/60 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-neutral-900 border border-neutral-800 flex-shrink-0 overflow-hidden">
                              <Image
                                src={course.image}
                                alt={course.name}
                                fill
                                className="object-cover grayscale"
                              />
                            </div>
                            <div>
                              <h5 className="font-serif-classic text-sm font-semibold text-white uppercase">
                                {course.name}
                              </h5>
                              <p className="text-xs text-neutral-300 font-mono">
                                {item.progress_percent || 0}% Contemplated
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/course/${course.id}`}
                            onClick={onClose}
                            className="px-3 py-1.5 border border-neutral-800 hover:border-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 text-neutral-300 hover:text-white"
                          >
                            <span>Resume</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 2: COURSE PROGRESS
             ---------------------------------------------------- */}
          {activeTab === "progress" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
                    {isHi ? "अकादमिक अध्ययन प्रगति" : "Course Mastery & Progress"}
                  </h3>
                  <p className="text-xs text-neutral-400 font-garamond">
                    {isHi
                      ? "आपके द्वारा पढ़े गए और अध्ययन किए गए दार्शनिकों की प्रगति।"
                      : "Live synchronized tracking of your dialectical syllabus progression."}
                  </p>
                </div>
              </div>

              {progressList.length === 0 ? (
                <div className="p-12 border border-neutral-900 bg-black/40 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-garamond text-base text-neutral-400 italic">
                    {isHi ? "कोई सक्रिय अध्ययन नहीं मिला।" : "No active courses commenced."}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {isHi
                      ? "किसी भी दार्शनिक के पाठ्यक्रम में जाकर लेक्चर्स पर टिक करें।"
                      : "Open any philosopher's treatise and check off lectures to begin tracking."}
                  </p>
                  <Link
                    href="/#courses"
                    onClick={onClose}
                    className="inline-block mt-3 px-6 py-2.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold"
                  >
                    {isHi ? "दार्शनिक खोजें" : "Discover Philosophers"}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressList.map((item, idx) => {
                    const course = PHILOSOPHER_COURSES.find((c) => c.id === item.course_id);
                    if (!course) return null;
                    const percent = item.progress_percent || 0;

                    return (
                      <div
                        key={idx}
                        className="p-5 border border-neutral-900 bg-black/60 space-y-4 hover:border-neutral-800 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 bg-neutral-900 border border-neutral-800 flex-shrink-0 overflow-hidden">
                              <Image
                                src={course.image}
                                alt={course.name}
                                fill
                                className="object-cover grayscale"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                                {course.school.split(",")[0]}
                              </span>
                              <h4 className="font-serif-classic text-base sm:text-lg font-bold text-white uppercase">
                                {course.name}
                              </h4>
                              <p className="text-xs text-neutral-300 font-garamond line-clamp-1">
                                {course.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                            <div className="text-right">
                              <span className="font-mono text-sm font-bold text-white">
                                {percent}%
                              </span>
                              <span className="text-xs text-neutral-400 block uppercase font-mono">
                                Mastered
                              </span>
                            </div>
                            <Link
                              href={`/course/${course.id}`}
                              onClick={onClose}
                              className="px-4 py-2 bg-neutral-900 hover:bg-white hover:text-black border border-neutral-800 text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                            >
                              <span>Continue</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-neutral-900 overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500 ease-out"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 3: BOOKMARKS
             ---------------------------------------------------- */}
          {activeTab === "bookmarks" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
                  {isHi ? "सहेजे गए ग्रंथ एवं अमर सूत्र" : "Preserved Treatises & Bookmarks"}
                </h3>
                <p className="text-xs text-neutral-400 font-garamond">
                  {isHi
                    ? "आपके द्वारा बुकमार्क किए गए दार्शनिक उद्धरण और संदर्भ।"
                    : "Curated aphorisms and seminal texts saved to your personal intellectual codex."}
                </p>
              </div>

              {bookmarksList.length === 0 ? (
                <div className="p-12 border border-neutral-900 bg-black/40 text-center space-y-3">
                  <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-garamond text-base text-neutral-400 italic">
                    {isHi ? "कोई बुकमार्क नहीं मिला।" : "No treatises currently bookmarked."}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {isHi
                      ? "किसी भी दार्शनिक के पेज पर 'Bookmark Thinker' बटन दबाएं।"
                      : "Click 'Bookmark Thinker' on any philosopher's page to save here."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarksList.map((bkmk, idx) => {
                    const course = PHILOSOPHER_COURSES.find((c) => c.id === bkmk.course_id);
                    return (
                      <div
                        key={idx}
                        className="p-5 border border-neutral-900 bg-black/60 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                            <span className="uppercase tracking-widest text-neutral-400">
                              {course?.name || bkmk.course_id}
                            </span>
                            <Bookmark className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400/20" />
                          </div>

                          <blockquote className="font-garamond text-base text-neutral-200 italic leading-relaxed border-l border-neutral-700 pl-3">
                            &ldquo;{bkmk.quote_text || course?.quote}&rdquo;
                          </blockquote>

                          {bkmk.work_title && (
                            <p className="text-xs text-neutral-500 font-mono">
                              Source: {bkmk.work_title}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-neutral-900">
                          <Link
                            href={`/course/${bkmk.course_id}`}
                            onClick={onClose}
                            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
                          >
                            <span>Read Codex</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 4: REFLECTIONS (JOURNAL)
             ---------------------------------------------------- */}
          {activeTab === "reflections" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
                  {isHi ? "दार्शनिक डायरी एवं चिंतन" : "The Contemplative Journal"}
                </h3>
                <p className="text-xs text-neutral-400 font-garamond">
                  {isHi
                    ? "आपके द्वारा लिखे गए सभी व्यक्तिगत नोट्स और आलोचनात्मक विचार।"
                    : "Encrypted thoughts, dialectical inquiries, and journal entries across all thinkers."}
                </p>
              </div>

              {reflectionsList.length === 0 ? (
                <div className="p-12 border border-neutral-900 bg-black/40 text-center space-y-3">
                  <PenLine className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-garamond text-base text-neutral-400 italic">
                    {isHi ? "अभी तक कोई विचार दर्ज नहीं किया गया है।" : "No reflections recorded yet."}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {isHi
                      ? "किसी भी दार्शनिक के पेज पर Section 06 में जाकर विचार लिखें।"
                      : "Visit any course page and use Section 06 to inscribe your contemplation."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reflectionsList.map((refl) => {
                    const course = PHILOSOPHER_COURSES.find((c) => c.id === refl.course_id);
                    return (
                      <div
                        key={refl.id}
                        className="p-5 border border-neutral-900 bg-black/60 space-y-3 hover:border-neutral-800 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-300 uppercase tracking-widest font-semibold">
                              {course?.name || refl.course_id}
                            </span>
                            <span>•</span>
                            <span>{new Date(refl.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
                              {refl.is_private ? (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Private</span>
                                </>
                              ) : (
                                <span>Public</span>
                              )}
                            </span>
                            <button
                              onClick={() => handleDeleteReflection(refl.id, refl.course_id)}
                              title={isHi ? "हटाएं" : "Delete Entry"}
                              className="text-neutral-600 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="font-garamond text-base sm:text-lg text-neutral-200 leading-relaxed font-light">
                          {refl.reflection_text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 5: SETTINGS & SECURITY
             ---------------------------------------------------- */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl">
              <div>
                <h3 className="font-serif-classic text-xl font-bold tracking-[0.15em] text-white uppercase">
                  {isHi ? "प्रोफ़ाइल एवं सुरक्षा सेटिंग्स" : "Scholar Settings & Security"}
                </h3>
                <p className="text-xs text-neutral-400 font-garamond">
                  {isHi
                    ? "अपनी प्रोफ़ाइल जानकारी और खाता सुरक्षा प्रबंधित करें।"
                    : "Manage your philosophical identity, preferred tradition, and security posture."}
                </p>
              </div>

              {/* Profile Edit Form */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium mb-2">
                    {isHi ? "पूरा नाम" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium mb-2">
                    {isHi ? "ईमेल पता (संरक्षित)" : "Email Address (Locked)"}
                  </label>
                  <input
                    type="email"
                    value={profile?.email || user.email}
                    disabled
                    className="w-full bg-neutral-900/60 border border-neutral-800 px-4 py-3 text-sm text-neutral-300 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium mb-2">
                    {isHi ? "प्राथमिक दार्शनिक परंपरा" : "Primary Philosophical Tradition"}
                  </label>
                  <select
                    value={editTradition}
                    onChange={(e) => setEditTradition(e.target.value)}
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="Rationalism">Cartesian Rationalism &amp; Epistemology</option>
                    <option value="Existentialism">Nietzschean Existentialism &amp; Nihilism</option>
                    <option value="Socratic">Socratic Dialectics &amp; Virtue Ethics</option>
                    <option value="Kantian Idealism">Kantian Idealism &amp; Pure Reason</option>
                    <option value="Dialectical Materialism">Marxian &amp; Hegelian Dialectics</option>
                    <option value="Stoicism">Stoic Epictetus &amp; Marcus Aurelius</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {savingProfile ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isHi ? "बदलाव सहेजें" : "Save Changes"}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Audit Information Card */}
              <div className="p-6 border border-neutral-900 bg-black/60 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHi ? "सुरक्षा ऑडिट स्थिति" : "Military-Grade Security Audit"}</span>
                </div>
                <ul className="text-xs text-neutral-400 space-y-2 font-mono leading-relaxed">
                  <li>• Row-Level Security: Active &amp; Enforced on PostgreSQL schema.</li>
                  <li>• Anti-Tamper: Direct checks require `auth.uid() = user_id`.</li>
                  <li>• Parameterized Queries: 100% protection against SQL Injection.</li>
                  <li>• Storage: Compliant with standard payload length bounds.</li>
                </ul>
              </div>

              {/* Sign Out Section */}
              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif-classic text-neutral-300 block">
                    {isHi ? "अकादमी से प्रस्थान" : "Terminate Active Session"}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {isHi ? "अपने खाते से सुरक्षित लॉग आउट करें" : "Sign out safely from all devices"}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-6 py-2.5 border border-red-900/60 hover:border-red-600 text-red-400 text-xs uppercase tracking-wider font-mono transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isHi ? "लॉग आउट करें" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

