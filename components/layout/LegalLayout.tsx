import React from "react";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4">
      <article className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
          <div className="space-y-8">
            {children}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50/50 p-8 md:px-12 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} TaskHub. All rights reserved.
          </p>
        </div>
      </article>
    </div>
  );
}
