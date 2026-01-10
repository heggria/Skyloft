"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MapPin, Globe, Calendar, Image as ImageIcon } from "lucide-react";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Globe className="w-12 h-12 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-muted-foreground">加载地图中...</p>
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载地点数据
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("加载地点失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (newLocation: Omit<Location, "id">) => {
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
      });

      if (response.ok) {
        const savedLocation = await response.json();
        setLocations([savedLocation, ...locations]);
      }
    } catch (error) {
      console.error("保存地点失败:", error);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLocations(locations.filter((loc) => loc.id !== id));
      }
    } catch (error) {
      console.error("删除地点失败:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Travel Map</h1>
              <span className="text-sm text-gray-500">旅游足迹</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{locations.length}</div>
                <div className="text-xs text-gray-600">地点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-gray-600">国家</div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">我的旅行</h2>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">添加新地点</span>
              </button>

              {loading && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                  <p className="text-gray-500 text-sm">加载中...</p>
                </div>
              )}

              {!loading && locations.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-sm">还没有添加任何地点</p>
                  <p className="text-gray-400 text-xs mt-1">点击地图开始标注</p>
                </div>
              )}

              {locations.map((location) => (
                <div
                  key={location.id}
                  className="p-3 rounded-lg border hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {location.name}
                      </h3>
                      {location.city && (
                        <p className="text-xs text-gray-500">{location.city}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {location.date
                            ? new Date(location.date).toLocaleDateString("zh-CN")
                            : "未设置日期"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                      title="删除"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapComponent locations={locations} onAddLocation={handleAddLocation} />
        </main>
      </div>
    </div>
  );
}
