import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Target, Eye, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent" />
        <div className="container relative px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Connecting People, <span className="text-primary">Empowering Communities</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
              TaskHub is more than just a platform; it's a bridge between needs and skills, designed specifically for the vibrant Nigerian market.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TaskHub began as a final year project idea focused on solving real everyday service challenges in Nigeria through a more trusted and structured digital platform. Founded by Abdulsalam Amasa as part of his final year project at Birmingham City University, the idea grew from observing real-life challenges in Nigeria.
                </p>
                <p>
                  In Nigeria, many people need quick and reliable help for everyday tasks, yet often depend on informal and unstructured arrangements. At the same time, many students and young people have useful skills and are looking for flexible ways to earn income.
                </p>
                <p>
                  TaskHub was created to bridge this gap by building a platform that supports both convenience and opportunity. The project focuses on the Nigerian market, where there is increasing demand for trusted local services, campus support, and errand-based help.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                 <div className="aspect-video bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">TaskHub Innovation</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Story Card */}
            <div className="p-8 transition-all bg-white border border-gray-100 rounded-3xl hover:shadow-xl group">
              <div className="flex items-center justify-center w-16 h-16 mb-6 transition-colors bg-purple-50 rounded-2xl group-hover:bg-primary group-hover:text-white text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Our Story</h3>
              <p className="text-gray-600">
                TaskHub began as a final year project idea focused on solving real everyday service challenges in Nigeria through a more trusted and structured digital platform.
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-8 transition-all bg-white border border-gray-100 rounded-3xl hover:shadow-xl group">
              <div className="flex items-center justify-center w-16 h-16 mb-6 transition-colors bg-purple-50 rounded-2xl group-hover:bg-primary group-hover:text-white text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-600">
                To make everyday help easier to access while creating flexible earning opportunities for skilled individuals across Nigeria.
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-8 transition-all bg-white border border-gray-100 rounded-3xl hover:shadow-xl group">
              <div className="flex items-center justify-center w-16 h-16 mb-6 transition-colors bg-purple-50 rounded-2xl group-hover:bg-primary group-hover:text-white text-primary">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Our Vision</h3>
              <p className="text-gray-600">
                To build a trusted and locally relevant task marketplace for Nigeria and beyond, setting a new standard for service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values/Approach */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why TaskHub?</h2>
            <p className="text-gray-600">We are committed to building a platform that is practical, accessible, and locally relevant.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Trusted Support",
              "Simple & Organized",
              "User-Friendly Design",
              "Convenience & Opportunity",
              "Locally Relevant",
              "Verified Taskers",
              "Secure Payments",
              "Campus Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
