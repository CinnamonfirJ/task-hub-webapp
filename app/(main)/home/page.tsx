"use client";

import { useHome, formatDeadline, getCategoryName } from "@/hooks/useHome";
import { useCategories } from "@/hooks/useCategories";
import { useNearbyTaskers } from "@/hooks/useNearbyTaskers";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clock,
  FilePlus,
  GraduationCap,
  Loader2,
  MapPin,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Stars,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { TaskerProfileModal } from "@/components/dashboard/TaskerProfileModal";
import { TaskLocation } from "@/components/dashboard/TaskLocation";

// ─── Dynamic categories helper ──────────────────────────────────────────────
function getCategoryMeta(name: string) {
  const key = (name || "").toLowerCase();
  if (
    key.includes("local") ||
    key.includes("service") ||
    key.includes("plumb") ||
    key.includes("repair")
  )
    return {
      Icon: Briefcase,
      bg: "bg-purple-100",
      iconColor: "text-[#6B46C1]",
      subtitle: "Plumbing, cleaning, repairs",
    };
  if (
    key.includes("campus") ||
    key.includes("tutor") ||
    key.includes("print") ||
    key.includes("school")
  )
    return {
      Icon: GraduationCap,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      subtitle: "Tutoring, Printing, Laundry",
    };
  if (
    key.includes("errand") ||
    key.includes("delivery") ||
    key.includes("shop") ||
    key.includes("pickup")
  )
    return {
      Icon: ShoppingBag,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      subtitle: "Shopping, Pickup, Delivery",
    };
  return {
    Icon: Package,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    subtitle: "Various services",
  };
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState<any>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Prompt for geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        },
      );
    }
  }, []);

  const {
    user,
    userInitials,
    isProfileComplete,
    featuredTask,
    recentTasks,
    recentActivities,
    isLoading,
    isError,
    isLoadingActivities,
    isActivitiesError,
    isLoadingUser,
    isVerified,
    isTasker,
    hasCategories,
    userName,
    refetchTasks,
  } = useHome();

  // Fetch categories for the categories section
  const { data: allCategories, isLoading: isLoadingCategories } =
    useCategories();

  // Fetch bids on the first user task to get top taskers (user view only)
  const firstTaskId = !isTasker && recentTasks?.[0]?._id;
  const { data: firstTaskBidsData } = useQuery({
    queryKey: ["taskBids", firstTaskId],
    queryFn: async () => {
      const { bidsApi } = await import("@/lib/api/bids");
      return bidsApi.getTaskBids(firstTaskId as string);
    },
    enabled: !!firstTaskId && !isTasker,
    staleTime: 1000 * 60 * 5,
  });

  // Derived from nearby taskers hook
  const { data: nearbyData, isLoading: isLoadingNearby } = useNearbyTaskers(
    coords?.latitude,
    coords?.longitude,
    !!coords && !isTasker,
  );

  // Derive "Top Workers" from multiple real data sources
  const topWorkers: any[] = (() => {
    if (isTasker) return [];

    const workers: any[] = [...(nearbyData || [])];
    const bids = firstTaskBidsData?.bids || [];

    // Add taskers who bid on the user's tasks to fill up to 3
    for (const bid of bids) {
      if (workers.length >= 3) break;
      const t = typeof bid.tasker === "object" ? bid.tasker : null;
      if (t) {
        const id = t._id || (t as any).id;
        if (id && !workers.find((w) => (w._id || (w as any).id) === id)) {
          workers.push(t);
        }
      }
    }
    return workers.slice(0, 3);
  })();

  if (!isMounted) {
    return (
      <div className='flex flex-col space-y-8 mx-auto p-6 md:p-8 w-full max-w-4xl min-h-screen'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-12 w-full rounded-lg' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-20 rounded-lg' />
          ))}
        </div>
        <Skeleton className='h-32 rounded-lg' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-28 rounded-lg' />
          ))}
        </div>
      </div>
    );
  }

  // ─── TASKER VIEW (unchanged logic, cleaned up border radii) ─────────────────
  if (isTasker) {
    return (
      <div className='flex flex-col space-y-6 md:space-y-8 mx-auto p-4 md:p-8 w-full max-w-4xl min-h-screen'>
        {/* Category Setup Banner */}
        {!hasCategories && (
          <div className='bg-[#6B46C1] rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center gap-6 shadow-xl shadow-purple-200 animate-in zoom-in-95 duration-500'>
            <div className='bg-white/20 p-5 rounded-full backdrop-blur-md'>
              <Stars size={40} className='text-white animate-pulse' />
            </div>
            <div className='space-y-3 max-w-lg'>
              <h3 className='font-black text-white text-2xl md:text-3xl leading-tight'>
                Choose Your Services!
              </h3>
              <p className='text-purple-100 text-sm md:text-base font-medium leading-relaxed'>
                You haven&apos;t selected any categories yet and you won&apos;t
                be able to see any tasks until you do. Go to your profile then
                service categories to select categories to work in.
              </p>
            </div>
            <Link href='/profile/become-tasker' className='w-full sm:w-auto'>
              <Button className='w-full sm:w-auto bg-white hover:bg-purple-50 text-[#6B46C1] px-10 h-14 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95'>
                Select Categories <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        )}

        {/* Tasker Header */}
        <div className='flex items-center gap-4'>
          {isLoadingUser ? (
            <Skeleton className='w-12 h-12 rounded-full' />
          ) : (
            <div className='flex justify-center items-center bg-[#6B46C1] rounded-full w-12 h-12 font-bold text-white text-lg shrink-0'>
              {userInitials}
            </div>
          )}
          <div className='min-w-0'>
            <h1 className='font-bold text-gray-900 text-xl md:text-2xl truncate'>
              Welcome {userName}
            </h1>
            <div className='flex items-center gap-2'>
              {isLoadingUser ? (
                <Skeleton className='h-4 w-24 mt-1' />
              ) : (
                <>
                  <p className='text-gray-500 capitalize text-sm'>Tasker</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border transition-colors whitespace-nowrap ${
                      isVerified
                        ? "bg-[#E6FFFA] text-[#38A169] border-[#B2F5EA]"
                        : "bg-[#FFF9EA] text-[#D69E2E] border-[#FFE7A5]"
                    }`}
                  >
                    {isVerified ? (
                      <>
                        <Stars size={8} fill='currentColor' /> Verified
                      </>
                    ) : (
                      <>
                        <Clock size={8} /> Unverified
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className='bg-[#FFF9EA] border border-dashed border-[#FFE7A5] rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm'>
            <div className='bg-[#FBBC05] p-4 rounded-full text-white shadow-lg shrink-0'>
              <Clock size={24} />
            </div>
            <div className='flex-1 space-y-1 text-center md:text-left'>
              <h3 className='font-bold text-gray-900 text-lg'>
                Complete your profile & Verification
              </h3>
              <p className='text-gray-500 text-sm font-medium'>
                Please complete your profile details to apply for tasks and get
                hired
              </p>
            </div>
            <Link href='/profile' className='w-full md:w-auto'>
              <Button className='w-full md:w-auto bg-[#FBBC05] hover:bg-[#E5A900] text-white px-8 h-12 rounded-lg font-bold flex items-center justify-center gap-2'>
                Complete profile <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}

        {/* Available Tasks */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-gray-900 text-xl'>Available tasks</h3>
            <Link
              href='/feed'
              className='text-[#6B46C1] font-semibold text-sm hover:underline flex items-center gap-1'
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center bg-[#6B46C1] rounded-lg p-10 text-white min-h-[160px]'>
              <Loader2 className='w-8 h-8 animate-spin' />
            </div>
          ) : isError ? (
            <div className='bg-[#6B46C1] rounded-lg p-8 text-white text-center'>
              <p>Can&apos;t load tasks. Try again later.</p>
            </div>
          ) : recentTasks.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {recentTasks.slice(0, 2).map((task: any) => (
                <div
                  key={task._id}
                  className='bg-white border border-gray-100 p-6 rounded-lg shadow-sm space-y-4'
                >
                  <div className='flex justify-between items-start'>
                    <span className='bg-[#F5EEFF] text-[#6B46C1] px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider'>
                      {getCategoryName(task)}
                    </span>
                    <span className='text-[#4CAF50] font-black text-xl'>
                      ₦ {task.budget?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-[#6B46C1] flex items-center justify-center text-[10px] font-bold text-white'>
                        {task.user?.fullName?.[0] || "T"}
                      </div>
                      <span className='text-gray-400 text-xs font-semibold'>
                        By {task.user?.fullName || "Task Hub"}
                      </span>
                    </div>
                    <h4 className='font-bold text-lg text-gray-900 leading-tight'>
                      {task.title}
                    </h4>
                    <p className='text-gray-400 text-sm line-clamp-2'>
                      {task.description}
                    </p>
                  </div>
                  <div className='flex justify-between items-center pt-1 gap-2'>
                    <div className='flex items-center gap-1.5 text-gray-400 text-sm font-medium'>
                      <Clock size={14} className='opacity-50' />
                      <span>{formatDeadline(task.deadline)}</span>
                    </div>
                    <Link href={`/tasks/${task._id}`}>
                      <Button className='bg-[#6B46C1] hover:bg-[#553C9A] px-6 h-10 rounded-lg text-xs font-black'>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white border border-gray-100 shadow-sm p-12 rounded-lg flex flex-col items-center justify-center text-center space-y-4'>
              <div className='bg-purple-50 p-4 rounded-full'>
                <FilePlus size={24} className='text-[#6B46C1]' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-bold text-lg text-gray-900'>
                  No Task Available
                </h3>
                <p className='text-gray-400 text-sm max-w-[280px]'>
                  No tasks matching your categories are available right now.
                </p>
              </div>
              <Button
                onClick={() => refetchTasks()}
                className='bg-[#6B46C1] hover:bg-[#553C9A] px-8 rounded-lg font-bold'
              >
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Tasker Recent Activities */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-gray-900 text-xl'>
              Recent Activities
            </h3>
            <Link
              href='/feed'
              className='font-semibold text-[#6B46C1] text-sm hover:underline flex items-center gap-1'
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className='space-y-3'>
            {isLoadingActivities ? (
              <div className='flex items-center gap-3 text-gray-500 font-medium py-10 justify-center'>
                <Loader2 className='w-6 h-6 animate-spin' /> Loading
                activities...
              </div>
            ) : recentActivities.length === 0 ? (
              <div className='bg-white border border-gray-100 rounded-lg py-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm'>
                <h3 className='font-bold text-lg text-gray-900'>
                  No recent activities
                </h3>
                <p className='text-gray-400 text-sm max-w-[280px]'>
                  You haven&apos;t applied to any tasks yet.
                </p>
              </div>
            ) : (
              recentActivities.map((bid: any) => {
                const task = typeof bid.task === "object" ? bid.task : null;
                return (
                  <Link
                    key={bid._id}
                    href={`/tasks/${task?._id || bid._id}`}
                    className='block bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:border-[#6B46C1]/30 transition-colors'
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='font-semibold text-gray-900 text-sm'>
                          {task?.title || "Task"}
                        </p>
                        <p className='text-gray-400 text-xs mt-0.5'>
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-black text-[#4CAF50]'>
                          ₦{bid.amount?.toLocaleString()}
                        </p>
                        <span className='text-[10px] font-bold text-[#6B46C1] uppercase'>
                          Applied
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── USER VIEW ───────────────────────────────────────────────────────────────
  const displayCategories = (() => {
    if (isLoadingCategories) return [];
    if (allCategories && allCategories.length > 0) {
      const mainCategories = allCategories.filter(
        (c: any) => !c.parentCategory,
      );
      return mainCategories.slice(0, 3).map((cat: any) => {
        const meta = getCategoryMeta(cat.displayName || cat.name || "");
        return {
          ...cat,
          Icon: meta.Icon,
          bg: meta.bg,
          iconColor: meta.iconColor,
          subtitle: cat.description || meta.subtitle,
        };
      });
    }
    return [];
  })();

  return (
    <div className='flex flex-col space-y-6 mx-auto p-4 md:p-8 w-full max-w-4xl min-h-screen'>
      {/* ── Welcome Heading ── */}
      <div className='space-y-1'>
        {isLoadingUser ? (
          <Skeleton className='h-7 w-52' />
        ) : (
          <h1 className='font-bold text-gray-900 text-2xl md:text-3xl'>
            Welcome Back, {userName} 👋
          </h1>
        )}
        <p className='text-gray-500 text-sm md:text-base'>
          What do you need help with today?
        </p>
      </div>

      {/* ── Inline Search Bar ── */}
      <div className='relative'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          size={16}
        />
        <input
          type='search'
          placeholder='Search task or service...'
          className='w-full pl-9 pr-4 h-12 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#6B46C1]/30'
        />
      </div>

      {/* ── Categories ── */}
      <div className='space-y-3'>
        <h2 className='font-bold text-gray-900 text-lg md:text-xl'>
          Categories
        </h2>
        {isLoadingCategories ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-20 rounded-lg' />
            ))}
          </div>
        ) : displayCategories.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {displayCategories.map((cat: any) => {
              const { Icon, bg, iconColor, subtitle } = cat;
              return (
                <Link
                  key={cat._id}
                  href={`/post-task?mainCategory=${cat._id}`}
                  className='flex items-center gap-4 bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group'
                >
                  <div
                    className={`shrink-0 w-11 h-11 ${bg} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold text-gray-900 text-sm truncate group-hover:text-[#6B46C1] transition-colors'>
                      {cat.displayName || cat.name}
                    </p>
                    <p className='text-gray-400 text-xs truncate font-medium'>
                      {subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 font-medium'>
            No categories available.
          </div>
        )}
      </div>

      {/* ── CTA Banner ── */}
      <div className='bg-[#6B46C1] rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <h3 className='font-bold text-white text-lg md:text-xl'>
            Need Something done?
          </h3>
          <p className='text-white/70 text-sm'>
            Post a task and get bids in minutes
          </p>
        </div>
        <Link href='/post-task' className='shrink-0'>
          <Button className='bg-white hover:bg-white/20 hover:text-white cursor-pointer text-primary rounded-lg font-semibold h-11 px-6 flex items-center gap-2 whitespace-nowrap'>
            <Plus size={16} /> Post a Task
          </Button>
        </Link>
      </div>

      {/* ── Top Workers Near You ── */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-gray-900 text-lg md:text-xl'>
            Top Workers near you
          </h2>
          <Link
            href='/taskers'
            className='text-[#6B46C1] font-semibold text-sm hover:underline flex items-center gap-1'
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading || (isLoadingNearby && coords) ? (
          <div className='flex gap-4 overflow-x-auto pb-2'>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className='h-28 min-w-[220px] rounded-lg shrink-0'
              />
            ))}
          </div>
        ) : topWorkers.length > 0 ? (
          <div className='flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible'>
            {topWorkers.map((worker: any, idx) => {
              const name =
                worker.fullName ||
                (worker.firstName
                  ? `${worker.firstName} ${worker.lastName || ""}`.trim()
                  : "Tasker");
              const initial = name[0]?.toUpperCase() || "T";
              const role =
                worker.primaryCategory ||
                (Array.isArray(worker.categories) &&
                worker.categories.length > 0
                  ? worker.categories[0]?.displayName ||
                    worker.categories[0]?.name ||
                    worker.categories[0]
                  : "Tasker");
              const rating =
                worker.averageRating ||
                (worker as any)?.stats?.ratings ||
                (worker as any)?.rating ||
                "4.9";
              const jobs =
                worker.completedJobs !== undefined
                  ? worker.completedJobs
                  : (worker as any)?.stats?.tasksCompleted ||
                    (worker as any)?.completedTasks ||
                    0;
              const locationLabel =
                worker.area ||
                worker.residentState ||
                (worker as any)?.location?.city ||
                (worker as any)?.address?.city ||
                "Nearby";

              return (
                <div
                  key={worker._id || idx}
                  className='min-w-[220px] md:min-w-0 bg-white border border-gray-100 rounded-lg p-4 shadow-sm shrink-0 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer'
                  onClick={() => setSelectedTasker(worker)}
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gray-100'>
                      {worker.profilePicture ? (
                        <img
                          src={worker.profilePicture}
                          alt={name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-[#6B46C1] flex items-center justify-center text-white font-bold'>
                          {initial}
                        </div>
                      )}
                    </div>
                    <div className='min-w-0'>
                      <p className='font-bold text-gray-900 text-sm truncate'>
                        {name}
                      </p>
                      <p className='text-gray-400 text-xs truncate capitalize'>
                        {role}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 text-xs text-gray-500'>
                    <span className='flex items-center gap-1'>
                      <Star
                        size={12}
                        className='text-yellow-400 fill-yellow-400'
                      />
                      <span className='font-semibold text-gray-900'>
                        {rating}
                      </span>
                    </span>
                    <span>{jobs} jobs</span>
                    <span className='flex items-center gap-1 font-semibold text-[#6B46C1]'>
                      <MapPin size={12} />
                      {worker.distance
                        ? `${worker.distance.toFixed(1)}km`
                        : locationLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state - no real workers found yet */
          <div className='bg-white border border-gray-100 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-sm'>
            <div className='bg-[#F5EEFF] p-3 rounded-full'>
              <Stars size={20} className='text-[#6B46C1]' />
            </div>
            <div>
              <h3 className='font-bold text-gray-900 text-sm'>
                No top workers nearby
              </h3>
              <p className='text-gray-400 text-xs max-w-[240px]'>
                We haven&apos;t found any taskers in your location yet. Check
                back soon!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Task ── */}
      <div className='space-y-3 pb-6'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-gray-900 text-lg md:text-xl'>
            Recent Task
          </h2>
          <Link
            href='/history'
            className='text-[#6B46C1] font-semibold text-sm hover:underline flex items-center gap-1'
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-16 rounded-lg' />
            ))}
          </div>
        ) : isError ? (
          <div className='bg-white border border-gray-100 rounded-lg p-6 text-center'>
            <p className='text-gray-500'>Failed to load tasks.</p>
          </div>
        ) : recentTasks.length === 0 && !featuredTask ? (
          <div className='bg-white border border-gray-100 rounded-lg py-14 flex flex-col items-center justify-center text-center space-y-3 shadow-sm'>
            <div className='bg-purple-50 p-4 rounded-full'>
              <FilePlus size={22} className='text-[#6B46C1]' />
            </div>
            <h3 className='font-bold text-gray-900'>No tasks yet</h3>
            <p className='text-gray-400 text-sm'>
              Post your first task to get started
            </p>
            <Link href='/post-task'>
              <Button className='bg-[#6B46C1] hover:bg-[#553C9A] rounded-lg font-bold px-6'>
                <Plus size={14} className='mr-1' /> Post a Task
              </Button>
            </Link>
          </div>
        ) : (
          <div className='space-y-2'>
            {[featuredTask, ...recentTasks]
              .filter(Boolean)
              .slice(0, 5)
              .map((task: any) => {
                if (!task) return null;
                const statusColor =
                  task.status === "open"
                    ? "text-[#6B46C1]"
                    : task.status === "completed"
                      ? "text-green-600"
                      : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-500";
                const statusLabel =
                  task.status === "open"
                    ? "Open"
                    : task.status === "completed"
                      ? "Completed"
                      : task.status === "in-progress"
                        ? "In Progress"
                        : task.status;

                return (
                  <Link
                    key={task._id}
                    href={`/tasks/${task._id}`}
                    className='block bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all'
                  >
                    <div className='flex justify-between items-start gap-4'>
                      <div className='min-w-0'>
                        <p className='font-semibold text-gray-900 text-sm truncate'>
                          {task.title}
                        </p>
                        {/* <div className='text-gray-400 text-xs mt-0.5 truncate flex items-center gap-1'>
                          <MapPin size={10} className="shrink-0" />
                          <TaskLocation
                            latitude={
                              typeof task.location === "object"
                                ? task.location?.latitude
                                : undefined
                            }
                            longitude={
                              typeof task.location === "object"
                                ? task.location?.longitude
                                : undefined
                            }
                            fallbackAddress={
                              typeof task.location === "object"
                                ? task.location?.address
                                : typeof task.location === "string"
                                  ? task.location
                                  : (task as any)?.address?.city ||
                                    (task as any)?.location?.city
                            }
                          />
                        </div> */}
                      </div>
                      <div className='text-right shrink-0'>
                        <p className='font-black text-gray-900 text-sm'>
                          ₦ {task.budget?.toLocaleString() || "0"}
                        </p>
                        <span className={`text-xs font-bold ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>

      {/* Tasker Bio Modal */}
      <TaskerProfileModal
        isOpen={!!selectedTasker}
        onClose={() => setSelectedTasker(null)}
        tasker={selectedTasker}
      />
    </div>
  );
}
