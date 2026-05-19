"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("Common");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 my-8 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold font-mukta text-foreground">
            {t("subscribe") === "Subscribe" ? "Get Gorkha Daily Newsletter" : "गोर्खा दैनिकको न्युजलेटर पाउनुहोस्"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("subscribe") === "Subscribe" 
              ? "Latest news directly to your email — daily at 6 AM" 
              : "ताजा समाचार सिधै आफ्नो इमेलमा — दैनिक बिहान ६ बजे"}
          </p>
        </div>
        
        <div className="w-full md:w-auto min-w-[300px] lg:min-w-[400px]">
          {subscribed ? (
            <div className="text-center py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg font-medium text-sm">
              {t("subscribe") === "Subscribe" ? "Thank you for subscribing!" : "न्युजलेटरको सदस्यता लिनुभएकोमा धन्यवाद!"}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("subscribe") === "Subscribe" ? "Your email address" : "तपाईंको इमेल ठेगाना"}
                className="flex-grow px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/95 transition cursor-pointer"
              >
                {t("subscribe")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
