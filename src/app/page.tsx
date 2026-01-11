"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Globe,
  Calendar,
  Image as ImageIcon,
  Loader2,
  LogOut,
  User,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <Globe className="w-16 h-16 animate-spin mx-auto mb-3 text-blue-500" />
        <p className="text-slate-600 font-medium">加载地图中...</p>
      </div>
    </div>
  ),
});

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
  city?: string;
  date?: string;
  notes?: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingLocation, setAddingLocation] = useState(false);

  // 检查认证状态
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // 加载地点数据
  useEffect(() => {
    if (status === "authenticated") {
      fetchLocations();
    }
  }, [status]);

  const fetchLocations = async () => {
    try {
      setError(null);
      const response = await fetch("/api/locations");

      if (response.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("加载地点失败");
      }

      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("加载地点失败:", error);
      setError("加载数据失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (newLocation: Omit<Location, "id">) => {
    try {
      setAddingLocation(true);
      setError(null);

      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
      });

      if (response.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("保存地点失败");
      }

      const savedLocation = await response.json();
      setLocations([savedLocation, ...locations]);
    } catch (error) {
      console.error("保存地点失败:", error);
      setError("保存地点失败，请重试");
    } finally {
      setAddingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("确定要删除这个地点吗？")) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      const response = await fetch(`/api/locations?id=${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("删除失败");
      }

      setLocations(locations.filter((loc) => loc.id !== id));
    } catch (error) {
      console.error("删除地点失败:", error);
      setError("删除失败，请重试");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  // 计算统计数据
  const uniqueCountries = new Set(
    locations.filter((l) => l.country).map((l) => l.country)
  ).size;

  const uniqueCities = new Set(
    locations.filter((l) => l.city).map((l) => l.city)
  ).size;

  // 加载状态
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600 font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  // 未认证状态
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Skyloft</h1>
                <p className="text-xs text-slate-500">旅游足迹记录</p>
              </div>
            </div>

            {/* Stats & User */}
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {locations.length}
                  </div>
                  <div className="text-xs text-slate-600">地点</div>
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {uniqueCountries}
                  </div>
                  <div className="text-xs text-slate-600">国家</div>
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {uniqueCities}
                  </div>
                  <div className="text-xs text-slate-600">城市</div>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {session?.user?.email}
                  </div>
                </div>
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="container mx-auto flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">我的旅行</h2>
              <span className="text-sm text-slate-500">
                {locations.length} 个地点
              </span>
            </div>

            {/* Add Hint */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Plus className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    添加新地点
                  </p>
                  <p className="text-xs text-slate-600">
                    点击地图上的任意位置即可添加新的旅行地点
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-500 animate-spin" />
                <p className="text-slate-500 text-sm">加载地点中...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && locations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  开始你的旅程
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  还没有添加任何地点
                </p>
                <p className="text-xs text-slate-400">
                  点击地图上的任意位置开始标注你的足迹
                </p>
              </div>
            )}

            {/* Locations List */}
            {!loading && locations.length > 0 && (
              <div className="space-y-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="group relative p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-7 h-7 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate mb-1">
                          {location.name}
                        </h3>
                        {(location.city || location.country) && (
                          <p className="text-sm text-slate-600 truncate">
                            {[location.city, location.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                        {location.date && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(location.date).toLocaleDateString(
                                "zh-CN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        disabled={deletingId === location.id}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="删除"
                      >
                        {deletingId === location.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          {addingLocation && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-slate-700">正在保存...</span>
            </div>
          )}
          <MapComponent locations={locations} onAddLocation={handleAddLocation} />
        </main>
      </div>
    </div>
  );
}
