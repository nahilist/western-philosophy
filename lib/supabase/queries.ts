type ApiEnvelope<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: { message?: string } | null };

type ApiResult<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

const SLUG_REGEX = /^[a-z0-9_-]{1,50}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

async function apiRequest<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

    if (!response.ok || !payload?.success) {
      return {
        data: null,
        error:
          (payload && !payload.success ? payload.error?.message : null) ??
          `Request failed with status ${response.status}.`,
        status: response.status,
      };
    }

    return { data: payload.data, error: null, status: response.status };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network request failed.",
      status: 0,
    };
  }
}

function canUseDevelopmentFallback() {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem("philosophy_user"));
  } catch {
    return false;
  }
}

export interface UserProfileData {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  favorite_tradition: string;
  created_at: string;
}

export interface CourseProgressData {
  course_id: string;
  completed_modules: string[];
  progress_percent: number;
  last_read_at: string;
}

export interface BookmarkData {
  id: string;
  course_id: string;
  quote_text: string | null;
  work_title: string | null;
  created_at: string;
}

export interface ReflectionData {
  id: string;
  course_id: string;
  reflection_text: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export async function getCourseProgress(courseId: string) {
  const safeCourseId = courseId.trim().toLowerCase();
  if (!SLUG_REGEX.test(safeCourseId)) {
    return { error: "Invalid course identifier format", data: null };
  }

  const result = await apiRequest<Record<string, unknown>>(
    `/api/account/progress?courseId=${encodeURIComponent(safeCourseId)}`
  );
  if (!result.error) return { data: result.data, error: null };

  if (canUseDevelopmentFallback()) {
    try {
      const raw = localStorage.getItem(`wp_progress_${safeCourseId}`);
      return { data: raw ? JSON.parse(raw) : null, error: null };
    } catch {
      return { data: null, error: null };
    }
  }
  return { data: null, error: result.error };
}

export async function saveCourseProgress(
  courseId: string,
  completedModules: string[],
  progressPercent: number
) {
  const safeCourseId = courseId.trim().toLowerCase();
  if (!SLUG_REGEX.test(safeCourseId)) {
    return { error: "Invalid course identifier", success: false };
  }

  const payload = {
    course_id: safeCourseId,
    completed_modules: completedModules.slice(0, 100).map((module) => module.slice(0, 100).trim()),
    progress_percent: Math.min(100, Math.max(0, Math.floor(progressPercent))),
  };
  const result = await apiRequest("/api/account/progress", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!result.error) return { success: true, error: null };

  if (canUseDevelopmentFallback()) {
    try {
      localStorage.setItem(
        `wp_progress_${safeCourseId}`,
        JSON.stringify({ ...payload, last_read_at: new Date().toISOString() })
      );
      return { success: true, error: null };
    } catch {
      return { success: false, error: "Storage failure" };
    }
  }
  return { success: false, error: result.error };
}

export async function toggleBookmark(courseId: string, quoteText = "", workTitle = "") {
  const safeCourseId = courseId.trim().toLowerCase();
  if (!SLUG_REGEX.test(safeCourseId)) {
    return { error: "Invalid course identifier", bookmarked: false };
  }

  const result = await apiRequest<{ bookmarked: boolean }>("/api/account/bookmarks", {
    method: "POST",
    body: JSON.stringify({
      course_id: safeCourseId,
      quote_text: quoteText.slice(0, 1000).trim(),
      work_title: workTitle.slice(0, 200).trim(),
    }),
  });
  if (result.data) return { bookmarked: result.data.bookmarked, error: null };

  if (canUseDevelopmentFallback()) {
    const key = `wp_bookmark_${safeCourseId}`;
    try {
      const bookmarked = !localStorage.getItem(key);
      if (bookmarked) {
        localStorage.setItem(
          key,
          JSON.stringify({
            course_id: safeCourseId,
            quote_text: quoteText.slice(0, 1000).trim(),
            work_title: workTitle.slice(0, 200).trim(),
          })
        );
      } else {
        localStorage.removeItem(key);
      }
      return { bookmarked, error: null };
    } catch {
      return { bookmarked: false, error: "Storage failure" };
    }
  }
  return { bookmarked: false, error: result.error };
}

export async function saveReflection(
  courseId: string,
  reflectionText: string,
  isPrivate = true
) {
  const safeCourseId = courseId.trim().toLowerCase();
  const trimmedText = reflectionText.trim();
  if (!SLUG_REGEX.test(safeCourseId)) return { error: "Invalid course identifier", success: false };
  if (!trimmedText || trimmedText.length > 5000) {
    return { error: "Reflection must contain 1 to 5,000 characters", success: false };
  }

  const result = await apiRequest("/api/account/reflections", {
    method: "POST",
    body: JSON.stringify({
      course_id: safeCourseId,
      reflection_text: trimmedText,
      is_private: Boolean(isPrivate),
    }),
  });
  if (!result.error) return { success: true, error: null };

  if (canUseDevelopmentFallback()) {
    try {
      const key = `wp_reflections_${safeCourseId}`;
      const list = JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, unknown>>;
      list.unshift({
        id: `demo-${Date.now()}`,
        course_id: safeCourseId,
        reflection_text: trimmedText,
        is_private: isPrivate,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
      return { success: true, error: null };
    } catch {
      return { success: false, error: "Storage failure" };
    }
  }
  return { success: false, error: result.error };
}

export async function joinWaitlist(email: string, source = "website_hero", honeypot = "") {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.length > 255 || !EMAIL_REGEX.test(cleanEmail)) {
    return { error: "Please enter a valid email.", success: false };
  }

  const result = await apiRequest<{ message: string }>("/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ email: cleanEmail, source: source.slice(0, 50), honeypot }),
  });
  return result.data
    ? { success: true, message: result.data.message }
    : { success: false, error: result.error ?? "Unable to join the waitlist." };
}

export async function getUserFullProfile(): Promise<{
  data: UserProfileData | null;
  error: string | null;
}> {
  const result = await apiRequest<UserProfileData>("/api/account/profile");
  if (result.data) return { data: result.data, error: null };

  if (canUseDevelopmentFallback()) {
    try {
      const localUser = JSON.parse(localStorage.getItem("philosophy_user") || "null") as {
        id?: string;
        email?: string;
        name?: string;
      } | null;
      if (!localUser) return { data: null, error: "Not logged in" };
      return {
        data: {
          id: localUser.id ?? "demo-id",
          email: localUser.email ?? "scholar@philosophy.org",
          full_name: localUser.name ?? "Dialectical Scholar",
          favorite_tradition: localStorage.getItem("wp_user_tradition") ?? "Rationalism",
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    } catch {
      return { data: null, error: "Storage failure" };
    }
  }
  return { data: null, error: result.error };
}

export async function updateUserProfile(updates: {
  full_name?: string;
  favorite_tradition?: string;
}) {
  const payload = {
    ...(updates.full_name ? { full_name: updates.full_name.slice(0, 100).trim() } : {}),
    ...(updates.favorite_tradition
      ? { favorite_tradition: updates.favorite_tradition.slice(0, 50).trim() }
      : {}),
  };
  const result = await apiRequest("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!result.error) return { success: true, error: null };

  if (canUseDevelopmentFallback()) {
    try {
      const localUser = JSON.parse(localStorage.getItem("philosophy_user") || "{}") as {
        name?: string;
      };
      if (payload.full_name) localUser.name = payload.full_name;
      localStorage.setItem("philosophy_user", JSON.stringify(localUser));
      if (payload.favorite_tradition) {
        localStorage.setItem("wp_user_tradition", payload.favorite_tradition);
      }
      return { success: true, error: null };
    } catch {
      return { success: false, error: "Storage failure" };
    }
  }
  return { success: false, error: result.error };
}

export async function getAllUserProgress() {
  const result = await apiRequest<CourseProgressData[]>("/api/account/progress");
  if (result.data) return { data: result.data, error: null };

  if (canUseDevelopmentFallback()) {
    const data: CourseProgressData[] = [];
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith("wp_progress_")) {
          data.push(JSON.parse(localStorage.getItem(key) || "{}") as CourseProgressData);
        }
      }
    } catch {
      return { data: [], error: "Storage failure" };
    }
    return { data, error: null };
  }
  return { data: [], error: result.error };
}

export async function getAllUserBookmarks() {
  const result = await apiRequest<BookmarkData[]>("/api/account/bookmarks");
  if (result.data) return { data: result.data, error: null };

  if (canUseDevelopmentFallback()) {
    const data: BookmarkData[] = [];
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith("wp_bookmark_")) {
          const item = JSON.parse(localStorage.getItem(key) || "{}") as Omit<BookmarkData, "id" | "created_at">;
          data.push({ id: key, ...item, created_at: new Date().toISOString() });
        }
      }
    } catch {
      return { data: [], error: "Storage failure" };
    }
    return { data, error: null };
  }
  return { data: [], error: result.error };
}

export async function getAllUserReflections() {
  const result = await apiRequest<ReflectionData[]>("/api/account/reflections");
  if (result.data) return { data: result.data, error: null };

  if (canUseDevelopmentFallback()) {
    const data: ReflectionData[] = [];
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith("wp_reflections_")) {
          const list = JSON.parse(localStorage.getItem(key) || "[]") as ReflectionData[];
          data.push(...list);
        }
      }
      data.sort(
        (a, b) =>
          new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime()
      );
    } catch {
      return { data: [], error: "Storage failure" };
    }
    return { data, error: null };
  }
  return { data: [], error: result.error };
}

export async function deleteUserReflection(reflectionId: string, courseId?: string) {
  const result = await apiRequest("/api/account/reflections", {
    method: "DELETE",
    body: JSON.stringify({ reflection_id: reflectionId }),
  });
  if (!result.error) return { success: true, error: null };

  if (canUseDevelopmentFallback() && courseId) {
    try {
      const key = `wp_reflections_${courseId}`;
      const list = JSON.parse(localStorage.getItem(key) || "[]") as Array<{ id?: string }>;
      localStorage.setItem(key, JSON.stringify(list.filter((item) => item.id !== reflectionId)));
      return { success: true, error: null };
    } catch {
      return { success: false, error: "Storage failure" };
    }
  }
  return { success: false, error: result.error };
}

export async function submitContactInquiry(inquiry: {
  name: string;
  email: string;
  discipline: string;
  subject: string;
  message: string;
  honeypot?: string;
}) {
  const result = await apiRequest<{ id: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: inquiry.name,
      email: inquiry.email,
      subject: `[${inquiry.discipline || "General"}] ${inquiry.subject}`,
      message: inquiry.message,
      honeypot: inquiry.honeypot ?? "",
    }),
  });
  return result.data
    ? { success: true, error: null }
    : { success: false, error: result.error ?? "Failed to submit inquiry." };
}

export async function fetchDilemmaStats(dilemmaId: string) {
  const result = await apiRequest<unknown>(
    `/api/dilemma/vote?dilemmaId=${encodeURIComponent(dilemmaId)}`
  );
  return { data: result.data, error: result.error };
}

export async function castDilemmaVote(dilemmaId: string, selectedChoice: string) {
  const result = await apiRequest<unknown>("/api/dilemma/vote", {
    method: "POST",
    body: JSON.stringify({ dilemma_id: dilemmaId, selected_choice: selectedChoice }),
  });
  return result.data
    ? { success: true, data: result.data, error: null }
    : { success: false, data: null, error: result.error ?? "Failed to record vote." };
}

