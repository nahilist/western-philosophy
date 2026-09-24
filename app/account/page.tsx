"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  BookOpen,
  Bookmark,
  PenLine,
  ShieldCheck,
  LogOut,
  Check,
  ArrowRight,
  Trash2,
  Lock,
  ExternalLink,
  Edit3,
  Save,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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

type TabType = "overview" | "progress" | "bookmarks" | "reflections" | "settings";

function AccountContent() {
  const { user, openAuthModal, logout, isSupabaseConnected } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [bookmarksList, setBookmarksList] = useState<any[]>([]);
  const [reflectionsList, setReflectionsList] = useState<any[]>([]);

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editTradition, setEditTradition] = useState("Rationalism");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

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
      console.error("Failed to load user account:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

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

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="pt-36 pb-20 px-6 max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 border border-neutral-700 bg-neutral-900 mx-auto flex items-center justify-center">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif-classic text-3xl font-bold uppercase tracking-wider text-white">
              {isHi ? "प्रवेश आवश्यक है" : "Scholar Codex Authentication"}
            </h1>
            <p className="font-garamond text-neutral-400 text-base leading-relaxed">
              {isHi
                ? "अपनी अध्ययन प्रगति, सहेजे गए उद्धरण और व्यक्तिगत दार्शनिक डायरी देखने के लिए कृपया लॉगिन करें।"
                : "Sign in to access your synchronized syllabus progress, saved treatises, and encrypted dialectical journal."}
            </p>
          </div>
          <button
            onClick={() => openAuthModal()}
            className="px-8 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {isHi ? "अकादमी में प्रवेश करें" : "Sign In to Academy"}
          </button>
        </div>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 w-full max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{isHi ? "मुख्य पृष्ठ" : "Return to Academy"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? "PostgreSQL Active" : "Local Codex"}</span>
            </span>
            <button
              onClick={loadUserData}
              title={isHi ? "रीफ्रेश करें" : "Refresh"}
              className="p-1.5 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Identity Banner */}
        <div className="p-8 sm:p-10 border border-neutral-800 bg-neutral-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center text-white font-serif-classic font-bold text-2xl">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "Φ"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="font-serif-classic text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white uppercase">
                  {profile?.full_name || user?.name}
                </h1>
                <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 border border-neutral-800 bg-black text-neutral-300 font-mono font-medium">
                  {profile?.favorite_tradition || "Rationalist"}
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-mono tracking-wider">
                {profile?.email || user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                await logout();
              }}
              className="px-5 py-2.5 border border-red-900/60 hover:border-red-600 text-red-400 text-xs uppercase tracking-wider font-mono transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isHi ? "लॉग आउट" : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-neutral-900 overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-white text-white font-bold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isHi ? "सारांश" : "Overview"}</span>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`py-3 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "progress"
                ? "border-white text-white font-bold"
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
            className={`py-3 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "border-white text-white font-bold"
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
            className={`py-3 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "reflections"
                ? "border-white text-white font-bold"
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
            className={`py-3 px-4 text-xs font-serif-classic uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-white text-white font-bold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? "सुरक्षा एवं सेटिंग्स" : "Settings"}</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-3.5 bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Panels */}
        <div className="space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "अध्ययन पाठ्यक्रम" : "Courses Commenced"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-4xl font-bold text-white">
                      {progressList.length}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/ 14 Thinkers</span>
                  </div>
                </div>

                <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "सहेजे गए सूत्र" : "Preserved Bookmarks"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-4xl font-bold text-white">
                      {bookmarksList.length}
                    </span>
                    <Bookmark className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                    {isHi ? "लिखित दार्शनिक चिंतन" : "Reflections Recorded"}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-classic text-4xl font-bold text-white">
                      {reflectionsList.length}
                    </span>
                    <PenLine className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Course Progress Highlights */}
              <div className="space-y-4">
                <h3 className="font-serif-classic text-base uppercase tracking-[0.25em] text-neutral-300 font-semibold pb-2 border-b border-neutral-900">
                  {isHi ? "सक्रिय दार्शनिक अध्ययन" : "Active Philosophical Inquiries"}
                </h3>

                {progressList.length === 0 ? (
                  <div className="p-12 border border-neutral-900 bg-neutral-950 text-center space-y-3">
                    <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="font-garamond text-neutral-400 italic text-base">
                      {isHi ? "आपने अभी तक कोई पाठ्यक्रम शुरू नहीं किया है।" : "No courses started yet."}
                    </p>
                    <Link
                      href="/#courses"
                      className="inline-block px-6 py-2.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold"
                    >
                      {isHi ? "पाठ्यक्रम संग्रह देखें" : "Explore The 14 Thinkers"}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {progressList.map((item, idx) => {
                      const course = PHILOSOPHER_COURSES.find((c) => c.id === item.course_id);
                      if (!course) return null;
                      return (
                        <div
                          key={idx}
                          className="p-6 border border-neutral-900 bg-neutral-950 space-y-4 hover:border-neutral-800 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 bg-neutral-900 border border-neutral-800 flex-shrink-0 overflow-hidden">
                                <Image
                                  src={course.image}
                                  alt={course.name}
                                  fill
                                  className="object-cover grayscale"
                                />
                              </div>
                              <div>
                                <h4 className="font-serif-classic text-base font-bold text-white uppercase">
                                  {course.name}
                                </h4>
                                <p className="text-xs text-neutral-500 font-mono">
                                  {item.progress_percent || 0}% Contemplated
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/course/${course.id}`}
                              className="px-4 py-2 border border-neutral-800 hover:border-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                            >
                              <span>Resume</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="w-full h-1 bg-neutral-900 overflow-hidden">
                            <div
                              className="h-full bg-white"
                              style={{ width: `${item.progress_percent || 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESS */}
          {activeTab === "progress" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {progressList.length === 0 ? (
                <div className="p-12 border border-neutral-900 bg-neutral-950 text-center space-y-3">
                  <p className="font-garamond text-neutral-400 italic">No courses in progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressList.map((item, idx) => {
                    const course = PHILOSOPHER_COURSES.find((c) => c.id === item.course_id);
                    if (!course) return null;
                    return (
                      <div
                        key={idx}
                        className="p-6 border border-neutral-900 bg-neutral-950 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-neutral-900 border border-neutral-800 flex-shrink-0 overflow-hidden">
                            <Image
                              src={course.image}
                              alt={course.name}
                              fill
                              className="object-cover grayscale"
                            />
                          </div>
                          <div>
                            <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-medium">
                              {course.school}
                            </span>
                            <h4 className="font-serif-classic text-lg font-bold text-white uppercase">
                              {course.name}
                            </h4>
                            <p className="text-xs text-neutral-300 font-garamond">{course.title}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="font-mono text-lg font-bold text-white">
                              {item.progress_percent || 0}%
                            </span>
                            <span className="text-xs text-neutral-400 block uppercase font-mono">
                              Mastery
                            </span>
                          </div>
                          <Link
                            href={`/course/${course.id}`}
                            className="px-5 py-2.5 bg-neutral-900 hover:bg-white hover:text-black border border-neutral-800 text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKMARKS */}
          {activeTab === "bookmarks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {bookmarksList.length === 0 ? (
                <div className="col-span-2 p-12 border border-neutral-900 bg-neutral-950 text-center space-y-2">
                  <p className="font-garamond text-neutral-400 italic">No bookmarks preserved.</p>
                </div>
              ) : (
                bookmarksList.map((bkmk, idx) => {
                  const course = PHILOSOPHER_COURSES.find((c) => c.id === bkmk.course_id);
                  return (
                    <div
                      key={idx}
                      className="p-6 border border-neutral-900 bg-neutral-950 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-medium block">
                          {course?.name || bkmk.course_id}
                        </span>
                        <blockquote className="font-garamond text-lg text-neutral-200 italic leading-relaxed border-l-2 border-neutral-700 pl-4">
                          &ldquo;{bkmk.quote_text || course?.quote}&rdquo;
                        </blockquote>
                      </div>
                      <div className="pt-3 border-t border-neutral-900 flex justify-between items-center">
                        <Link
                          href={`/course/${bkmk.course_id}`}
                          className="text-xs uppercase font-mono tracking-wider text-neutral-300 hover:text-white flex items-center gap-1.5"
                        >
                          <span>Go to Treatise</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: REFLECTIONS */}
          {activeTab === "reflections" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {reflectionsList.length === 0 ? (
                <div className="p-12 border border-neutral-900 bg-neutral-950 text-center space-y-2">
                  <p className="font-garamond text-neutral-400 italic">No reflections inscribed yet.</p>
                </div>
              ) : (
                reflectionsList.map((refl) => {
                  const course = PHILOSOPHER_COURSES.find((c) => c.id === refl.course_id);
                  return (
                    <div
                      key={refl.id}
                      className="p-6 border border-neutral-800 bg-neutral-950/80 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="text-white uppercase font-bold">
                            {course?.name || refl.course_id}
                          </span>
                          <span>•</span>
                          <span>{new Date(refl.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-neutral-300">
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
                            className="text-neutral-600 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="font-garamond text-lg text-neutral-200 leading-relaxed font-light">
                        {refl.reflection_text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
                    {isHi ? "पूरा नाम" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
                    {isHi ? "ईमेल पता" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={profile?.email || user?.email}
                    disabled
                    className="w-full bg-neutral-900/60 border border-neutral-800 px-4 py-3 text-sm text-neutral-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
                    {isHi ? "प्राथमिक परंपरा" : "Primary Tradition"}
                  </label>
                  <select
                    value={editTradition}
                    onChange={(e) => setEditTradition(e.target.value)}
                    className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="Rationalism">Cartesian Rationalism</option>
                    <option value="Existentialism">Existentialism &amp; Nihilism</option>
                    <option value="Socratic">Socratic Dialectics</option>
                    <option value="Kantian Idealism">Kantian Idealism</option>
                    <option value="Dialectical Materialism">Dialectical Materialism</option>
                    <option value="Stoicism">Stoicism</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3.5 bg-white text-black font-serif-classic text-xs uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isHi ? "बदलाव सहेजें" : "Save Changes"}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthProvider>
      <AccountContent />
    </AuthProvider>
  );
}

