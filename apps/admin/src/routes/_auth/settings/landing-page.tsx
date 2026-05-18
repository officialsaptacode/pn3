import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { settingService, tripService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { MultipleSelect } from "@workspace/ui/components/multi-select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Tiptap from "@/components/tip-tap";

export const Route = createFileRoute("/_auth/settings/landing-page")({
  component: LandingPageSettings,
});

function LandingPageSettings() {
  const queryClient = useQueryClient();
  const [ourSpecialitiesTitle, setOurSpecialitiesTitle] = useState("");
  const [ourSpecialitiesDescription, setOurSpecialitiesDescription] = useState("");
  const [packagesTitle, setPackagesTitle] = useState("");
  const [packagesDescription, setPackagesDescription] = useState("");

  const [popularTreksIds, setPopularTreksIds] = useState<string[]>([]);
  const [handpickedJourneysIds, setHandpickedJourneysIds] = useState<string[]>([]);
  const [upcomingDeparturesIds, setUpcomingDeparturesIds] = useState<string[]>([]);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [heroCtaLink, setHeroCtaLink] = useState("");
  const [aboutUsTitle, setAboutUsTitle] = useState("");
  const [aboutUsContent, setAboutUsContent] = useState("");

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingService.getAll(),
  });

  const { data: tripsResponse, isLoading: isLoadingTrips } = useQuery({
    queryKey: ["trips", "all-for-settings"],
    queryFn: () => tripService.getAll({ limit: 1000 }),
  });

  const tripOptions = (tripsResponse?.data || []).map((trip) => ({
    label: trip.title,
    value: trip.id.toString(),
  }));

  useEffect(() => {
    if (settings) {
      const getVal = (key: string) => settings.find((s: any) => s.key === key)?.value || "";
      setOurSpecialitiesTitle(getVal("landing_our_specialities_title"));
      setOurSpecialitiesDescription(getVal("landing_our_specialities_desc"));
      setPackagesTitle(getVal("landing_packages_title"));
      setPackagesDescription(getVal("landing_packages_desc"));

      try {
        const popTreks = JSON.parse(getVal("landing_popular_treks") || "[]");
        setPopularTreksIds(Array.isArray(popTreks) ? popTreks.map(String) : []);
      } catch (_e) {}

      try {
        const handpicked = JSON.parse(getVal("landing_handpicked_journeys") || "[]");
        setHandpickedJourneysIds(Array.isArray(handpicked) ? handpicked.map(String) : []);
      } catch (_e) {}

      try {
        const upcoming = JSON.parse(getVal("landing_upcoming_departures") || "[]");
        setUpcomingDeparturesIds(Array.isArray(upcoming) ? upcoming.map(String) : []);
      } catch (_e) {}

      setHeroTitle(getVal("landing_hero_title"));
      setHeroSubtitle(getVal("landing_hero_subtitle"));
      setHeroCtaText(getVal("landing_hero_cta_text"));
      setHeroCtaLink(getVal("landing_hero_cta_link"));
      setAboutUsTitle(getVal("landing_about_us_title"));
      setAboutUsContent(getVal("landing_about_us_content"));
    }
  }, [settings]);

  const saveSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return settingService.create({ key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save setting");
    },
  });

  const handleSave = async () => {
    try {
      await saveSettingMutation.mutateAsync({
        key: "landing_our_specialities_title",
        value: ourSpecialitiesTitle,
      });
      await saveSettingMutation.mutateAsync({
        key: "landing_our_specialities_desc",
        value: ourSpecialitiesDescription,
      });
      await saveSettingMutation.mutateAsync({
        key: "landing_popular_treks",
        value: JSON.stringify(popularTreksIds.map(Number)),
      });

      await saveSettingMutation.mutateAsync({
        key: "landing_packages_title",
        value: packagesTitle,
      });
      await saveSettingMutation.mutateAsync({
        key: "landing_packages_desc",
        value: packagesDescription,
      });
      await saveSettingMutation.mutateAsync({
        key: "landing_handpicked_journeys",
        value: JSON.stringify(handpickedJourneysIds.map(Number)),
      });

      await saveSettingMutation.mutateAsync({
        key: "landing_upcoming_departures",
        value: JSON.stringify(upcomingDeparturesIds.map(Number)),
      });

      await saveSettingMutation.mutateAsync({ key: "landing_hero_title", value: heroTitle });
      await saveSettingMutation.mutateAsync({ key: "landing_hero_subtitle", value: heroSubtitle });
      await saveSettingMutation.mutateAsync({ key: "landing_hero_cta_text", value: heroCtaText });
      await saveSettingMutation.mutateAsync({ key: "landing_hero_cta_link", value: heroCtaLink });
      await saveSettingMutation.mutateAsync({ key: "landing_about_us_title", value: aboutUsTitle });
      await saveSettingMutation.mutateAsync({
        key: "landing_about_us_content",
        value: aboutUsContent,
      });

      toast.success("Settings saved successfully");
    } catch (_e) {}
  };

  if (isLoadingSettings || isLoadingTrips) {
    return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Landing Page Settings</h2>
        <p className="text-muted-foreground mt-2">
          Modify the content displayed on the home page sections.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-semibold">Hero Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Main Title</Label>
              <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA Button Text</Label>
              <Input value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA Button Link</Label>
              <Input value={heroCtaLink} onChange={(e) => setHeroCtaLink(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-semibold">About Us Section</h3>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={aboutUsTitle} onChange={(e) => setAboutUsTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Tiptap value={aboutUsContent} onChange={setAboutUsContent} />
          </div>
        </div>
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-semibold">Our Specialities Section (Popular Treks)</h3>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Our Specialities"
              value={ourSpecialitiesTitle}
              onChange={(e) => setOurSpecialitiesTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Tiptap value={ourSpecialitiesDescription} onChange={setOurSpecialitiesDescription} />
          </div>

          <div className="space-y-2">
            <Label>Selected Trips (Max 6 recommended)</Label>
            <MultipleSelect
              options={tripOptions}
              value={popularTreksIds}
              onValueChange={(val) => setPopularTreksIds(val as string[])}
              placeholder="Select trips for Popular Treks..."
            />
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-semibold">Packages Section (Handpicked Journeys)</h3>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Handpicked Journies"
              value={packagesTitle}
              onChange={(e) => setPackagesTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Tiptap value={packagesDescription} onChange={setPackagesDescription} />
          </div>

          <div className="space-y-2">
            <Label>Selected Trips (Max 6 recommended)</Label>
            <MultipleSelect
              options={tripOptions}
              value={handpickedJourneysIds}
              onValueChange={(val) => setHandpickedJourneysIds(val as string[])}
              placeholder="Select trips for Handpicked Journeys..."
            />
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Departures Section</h3>

          <div className="space-y-2">
            <Label>Selected Trips (Max 6 recommended)</Label>
            <MultipleSelect
              options={tripOptions}
              value={upcomingDeparturesIds}
              onValueChange={(val) => setUpcomingDeparturesIds(val as string[])}
              placeholder="Select trips for Upcoming Departures..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saveSettingMutation.isPending}>
            {saveSettingMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
