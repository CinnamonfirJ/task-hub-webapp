export interface FAQ {
  question: string;
  answer: string;
}

export const FAQ_CONTENT: FAQ[] = [
  {
    question: "What is TaskHub?",
    answer: "TaskHub is a secure marketplace that connects people needing help with everyday tasks to verified local service providers (Taskers) in Nigeria. From home repairs to campus errands, we make getting help simple and safe."
  },
  {
    question: "How do I post a task?",
    answer: "Simply click 'Post a Task' on your dashboard, describe what you need, set your budget, and choose a date. Once posted, verified Taskers in your area will submit competitive bids for your job."
  },
  {
    question: "How do I become a Tasker?",
    answer: "To become a Tasker, select the 'Tasker' role during signup and complete the mandatory KYC verification process. Once verified, you can start bidding on tasks and earning money on your own schedule."
  },
  {
    question: "Is TaskHub safe?",
    answer: "Yes, safety is our priority. We use strict KYC verification (ID + Selfie) for all Taskers and a secure escrow payment system where funds are only released when the task is confirmed as completed."
  },
  {
    question: "How do payments work?",
    answer: "When you hire a Tasker, your payment is held in a secure TaskHub escrow wallet. The funds are protected and only released to the Tasker after you confirm that the task has been completed to your satisfaction."
  },
   {
    question: "Can I be both a User and a Tasker?",
    answer: "To ensure a streamlined and secure experience, TaskHub accounts are designed for one role at a time. You must choose between being a 'User' (to hire help) or a 'Tasker' (to provide help) during signup. If you need to switch roles later, you can do so in your profile settings, but you cannot use both interfaces simultaneously with the same login context."
  },
  {
    question: "What is the platform fee?",
    answer: "TaskHub charges a 15% commission on completed tasks. This fee allows us to maintain the platform, provide secure escrow services, and offer dedicated customer support."
  },
  {
    question: "How do I get paid as a Tasker?",
    answer: "Once a user confirms task completion, your earnings (minus the 15% commission) are immediately credited to your TaskHub wallet. You can then withdraw your balance directly to your registered Nigerian bank account."
  },
  {
    question: "Can I cancel a task?",
    answer: "Yes, tasks can be cancelled. However, to ensure fairness, cancellation policies apply based on the task's current status and timing. Check our Terms of Service for specific cancellation rules."
  },
  {
    question: "What if I'm not happy with a task?",
    answer: "If a task isn't completed as agreed, you can raise a dispute through the app. Our support team will review the evidence from both parties and provide a resolution within approximately 14 days."
  },
  {
    question: "Do I need to verify my identity?",
    answer: "Yes. To ensure a trustworthy community, all Taskers are required to complete identity verification (KYC) using a valid government-issued ID and a live selfie before they can bid on tasks."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via the 'Get Help' section in your profile, email us at support@ngtaskhub.com, or call our support line at +234 802 524 3900 during business hours."
  },
];

export const TOP_FAQS = FAQ_CONTENT.slice(0, 6);
