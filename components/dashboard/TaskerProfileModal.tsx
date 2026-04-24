import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth";
import { Briefcase, TrendingUp, Star } from "lucide-react";

interface TaskerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasker: Partial<User> | null;
}

export function TaskerProfileModal({
  isOpen,
  onClose,
  tasker,
}: TaskerProfileModalProps) {
  if (!tasker) return null;

  const taskerName =
    tasker?.fullName ||
    (tasker?.firstName
      ? `${tasker.firstName} ${tasker.lastName || ""}`
      : "Elliot Samuel");

  const taskerInitial =
    taskerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "E";

  // @ts-ignore - Assuming categories could be array of strings or objects.
  const categories =
    tasker?.categories && tasker.categories.length > 0
      ? tasker.categories
          .map((c: any) => c.displayName || c.name || c)
          .join(" , ")
      : "";

  const bio =
    tasker?.bio ||
    "No bio provided yet.";

  // @ts-ignore
  const hasStats = !!tasker?.stats;
  // @ts-ignore
  const tasksCompleted = tasker?.stats?.tasksCompleted || "0";
  // @ts-ignore
  const successRate = tasker?.stats?.successRate || "0%";
  // @ts-ignore
  const ratings = tasker?.stats?.ratings || "0";

  const works = tasker?.previousWork || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl rounded-lg p-0 bg-white border-0 gap-0 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Tasker Profile</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center pt-12 pb-8 bg-white space-y-4'>
          <div className='w-24 h-24 rounded-full overflow-hidden shrink-0'>
            {tasker.profilePicture ? (
              <img
                src={tasker.profilePicture}
                alt={taskerName}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-[#6B46C1] flex items-center justify-center text-white font-semibold text-3xl tracking-wide'>
                {taskerInitial}
              </div>
            )}
          </div>
          <div className='text-center space-y-1'>
            <h2 className='text-xl font-bold text-gray-900'>{taskerName}</h2>
            <p className='text-gray-500 text-sm font-medium'>{categories}</p>
          </div>
        </div>

        <div className='px-8 pb-10 bg-white space-y-10'>
          {/* BIO Section */}
          <section className='space-y-4'>
            <h3 className='text-sm font-bold text-gray-700 tracking-wider'>
              BIO
            </h3>
            <p className='text-gray-600 leading-relaxed text-[15px]'>{bio}</p>
          </section>

          {/* TASKER STATISTICS Section */}
          {hasStats && (
            <section className='space-y-4'>
              <h3 className='text-sm font-bold text-gray-700 tracking-wider'>
                TASKER STATISTICS
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* Stat Card 1 */}
                <div className='border border-gray-100 rounded-lg p-5 shadow-sm space-y-4 bg-white'>
                  <div className='w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-[#6B46C1]'>
                    <Briefcase size={20} strokeWidth={2.5} />
                  </div>
                  <div className='space-y-1'>
                    <div className='text-2xl font-black text-gray-900'>
                      {tasksCompleted}
                    </div>
                    <div className='text-gray-500 font-medium text-sm'>
                      Task completed
                    </div>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className='border border-gray-100 rounded-lg p-5 shadow-sm space-y-4 bg-white'>
                  <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500'>
                    <TrendingUp size={20} strokeWidth={2.5} />
                  </div>
                  <div className='space-y-1'>
                    <div className='text-2xl font-black text-gray-900'>
                      {successRate}
                    </div>
                    <div className='text-gray-500 font-medium text-sm'>
                      Success Rate
                    </div>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className='border border-gray-100 rounded-lg p-5 shadow-sm space-y-4 bg-white'>
                  <div className='w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-500'>
                    <Star size={20} strokeWidth={2.5} />
                  </div>
                  <div className='space-y-1'>
                    <div className='text-2xl font-black text-gray-900'>
                      {ratings}
                    </div>
                    <div className='text-gray-500 font-medium text-sm'>
                      Ratings
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* WORKS Section */}
          {works.length > 0 && (
            <section className='space-y-4 pb-4'>
              <h3 className='text-sm font-bold text-gray-700 tracking-wider'>
                WORKS
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {works.map((work, idx) => (
                  <div
                    key={work.publicId || idx}
                    className='aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-50'
                  >
                    <img
                      src={work.url}
                      alt={`Work ${idx + 1}`}
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
