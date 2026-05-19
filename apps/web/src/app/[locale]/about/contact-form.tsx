"use client";

import { useState } from "react";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const isEn = locale === "en";
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="border rounded-2xl bg-card p-6 md:p-8 shadow-sm">
      {status === "success" ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/40 border border-green-200 text-green-600 flex items-center justify-center mx-auto text-xl animate-bounce">
            ✓
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-lg">
              {isEn ? "Message Sent Successfully!" : "सन्देश सफलतापूर्वक पठाइयो!"}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {isEn
                ? "Thank you for contacting us. We will get back to you shortly."
                : "हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। हामी चाँडै तपाईंलाई सम्पर्क गर्नेछौं।"}
            </p>
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-muted transition cursor-pointer"
          >
            {isEn ? "Send Another Message" : "अर्को सन्देश पठाउनुहोस्"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-200 text-red-600 text-xs md:text-sm rounded-lg font-semibold">
              ⚠️ {isEn ? "Please fill in all required fields." : "कृपया सबै आवश्यक ठाउँहरू भर्नुहोस्।"}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {isEn ? "Full Name" : "पूरा नाम"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder={isEn ? "John Doe" : "राम बहादुर"}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">
                {isEn ? "Email Address" : "इमेल ठेगाना"} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {isEn ? "Subject" : "विषय"}
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder={isEn ? "Advertising / Feedback" : "विज्ञापन / सुझाव"}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              {isEn ? "Message Content" : "सन्देशको विवरण"} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
              placeholder={isEn ? "Type your message here..." : "यहाँ आफ्नो सन्देश लेख्नुहोस्..."}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-bold font-mukta text-sm rounded-xl hover:bg-primary/95 transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                <span>{isEn ? "Sending..." : "पठाउँदै..."}</span>
              </>
            ) : (
              <span>{isEn ? "Send Message" : "सन्देश पठाउनुहोस्"}</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
