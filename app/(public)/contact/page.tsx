"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSupport } from "@/hooks/useSupport";

export default function ContactPage() {
  const { form, onSubmit, isSubmitting } = useSupport();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full bg-white pb-20 pt-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase mb-4 block"
        >
          Contact Us
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 tracking-tight"
        >
          Let&apos;s talk.{" "}
          <span className="font-instrument italic text-[#7C3AED]">
            We&apos;re listening
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-[#4B5563] text-lg mb-10 leading-relaxed"
        >
          Whether you have a question, a partnership idea, or just want to say
          hello — drop us a message and we&apos;ll get back to you promptly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button className="bg-[#1F2937] hover:bg-[#111827] text-white rounded-full px-12 py-3 h-auto text-base font-semibold gap-2">
            <MessageSquare className="w-5 h-5" />
            <Link
              href="https://chat.whatsapp.com/HUoYs3Rb1js4H2U4WuvPWK?mode=gi_t"
              target="_blank"
            >
              Join WhatsApp Community
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-full px-10 py-3 h-auto text-base font-semibold"
          >
            <Link href="mailto:support@ngtaskhub.com">Email us</Link>
          </Button>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#F9FAFB] rounded-[32px] p-8 md:p-12 border border-[#F3F4F6]"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">
              Send us a message{" "}
              <span className="font-instrument italic text-[#7C3AED]">
                anytime.
              </span>
            </h2>
            <p className="text-[#6B7280] max-w-lg mx-auto">
              Fill in the form and someone from our team will reach out within
              one business day. For urgent matters, reach us directly via email.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-[#374151] ml-1"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Jacob Moore"
                  className="bg-white border-[#E5E7EB] rounded-xl h-14 px-4 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500 ml-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#374151] ml-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  className="bg-white border-[#E5E7EB] rounded-xl h-14 px-4 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 ml-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-sm font-medium text-[#374151] ml-1"
              >
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help"
                className="bg-white border-[#E5E7EB] rounded-xl min-h-[200px] p-4 focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all resize-none"
                {...form.register("message")}
              />
              {form.formState.errors.message && (
                <p className="text-xs text-red-500 ml-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1F2937] hover:bg-[#111827] text-white rounded-xl h-14 text-base font-bold transition-all shadow-lg shadow-gray-200 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium text-[#1F2937] mb-4">
            Get in touch
          </h2>
          <p className="text-[#6B7280]">
            We&apos;d love to hear from you. Please fill out this form.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <ContactCard
            icon={<Mail className="w-6 h-6 text-[#1F2937]" />}
            title="Email"
            description="Get the latest updates and offers."
            value="support@ngtaskhub.com"
            variants={itemVariants}
          />
          <ContactCard
            icon={<MessageCircle className="w-6 h-6 text-[#1F2937]" />}
            title="Chat"
            description="Message us anytime for quick help."
            value="Start conversation"
            isLink
            variants={itemVariants}
          />
          <ContactCard
            icon={<Phone className="w-6 h-6 text-[#1F2937]" />}
            title="Phone"
            description="Speak to our team for support."
            value="+234 811 380 8210"
            variants={itemVariants}
          />
          <ContactCard
            icon={<MapPin className="w-6 h-6 text-[#1F2937]" />}
            title="Office"
            description="Visit or write to us at:"
            value=" NNPC Housing estate, Eleme, Rivers state, Nigeria"
            variants={itemVariants}
          />
        </motion.div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  description,
  value,
  isLink = false,
  variants,
}: any) {
  return (
    <motion.div
      variants={variants}
      className="bg-[#F9FAFB] rounded-3xl p-8 flex flex-col items-start gap-6 border border-transparent hover:border-[#7C3AED]/10 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm  group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-medium text-[#1F2937]">{title}</h3>
        <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
        <p
          className={`text-[15px] font-medium ${isLink ? "text-[#1F2937] underline decoration-[#7C3AED]/30 underline-offset-4 hover:decoration-[#7C3AED] cursor-pointer" : "text-[#1F2937]"} transition-all`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
