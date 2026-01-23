'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityItem } from '@/components/ActivityItem';

// Mock data for tasks
const mockTasks = {
  open: [],
  assigned: [
    {
      _id: '4',
      title: 'Graphic design for branding',
      category: 'Design',
      description: 'We need a professional brand identity design including logo and color palette',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Assigned',
      budget: 35000,
    },
  ],
  inProgress: [
    {
      _id: '5',
      title: 'App development and testing',
      category: 'Development',
      description: 'Build a full-stack web application with React and Node.js backend',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'In progress',
      budget: 100000,
    },
  ],
  completed: [
    {
      _id: '6',
      title: 'Email template design',
      category: 'Email Marketing',
      description: 'Create responsive email templates for marketing campaigns',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
      budget: 12000,
    },
    {
      _id: '7',
      title: 'Logo creation',
      category: 'Branding',
      description: 'Design a modern and memorable logo for our startup',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
      budget: 20000,
    },
  ],
  canceled: [
    {
      _id: '8',
      title: 'Video editing project',
      category: 'Multimedia',
      description: 'Edit and produce promotional videos for social media',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Canceled',
      budget: 45000,
    },
  ],
};

type StatusFilter = 'open' | 'assigned' | 'inProgress' | 'completed' | 'canceled';

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('open');

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'open', label: 'Open' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'inProgress', label: 'In progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Canceled' },
  ];

  const currentTasks = mockTasks[activeFilter];
  const isEmpty = currentTasks.length === 0;

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Task History</h1>
        <p className="text-gray-600 mt-1">View all your previous tasks</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeFilter === filter.key
                ? 'bg-[#6B46C1] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isEmpty ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="bg-purple-100 p-6 rounded-full">
            <FileText className="h-12 w-12 text-[#6B46C1]" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              No {activeFilter === 'inProgress' ? 'In Progress' : activeFilter} Tasks
            </h2>
            <p className="text-gray-600 max-w-md">
              {activeFilter === 'open'
                ? 'Tasks with open status will appear here.'
                : activeFilter === 'assigned'
                  ? 'Tasks assigned to you will appear here.'
                  : activeFilter === 'inProgress'
                    ? 'Tasks you are working on will appear here.'
                    : activeFilter === 'completed'
                      ? 'Your completed tasks will appear here.'
                      : 'Canceled tasks will appear here.'}
            </p>
          </div>
          <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8 py-2 rounded-lg">
            Post a Task
          </Button>
        </div>
      ) : (
        // Task List
        <div className="space-y-4">
          {currentTasks.map((task) => (
            <ActivityItem
              key={task._id}
              id={task._id}
              title={task.title}
              category={task.category}
              description={task.description}
              date={task.createdAt}
              status={task.status}
              amount={task.budget}
            />
          ))}
        </div>
      )}
    </div>
  );
}
