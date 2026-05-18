import type { ApiDestination, ApiHierarchicalCountry, NavDestination } from "./navbar.types";
import { defaultDestinations } from "./navbar.types";

// ─── Transform from hierarchical API (/api/destinations/hierarchical) ────────
// The API returns: [{ id, name, slug, destinations: [...children] }]
// Countries with children → flyout (secondLayer)
// Countries with no children → plain link
export const transformHierarchical = (countries: ApiHierarchicalCountry[]): NavDestination[] => {
  if (!countries || countries.length === 0) return defaultDestinations;

  return countries.map((country) => {
    const hasChildren = Array.isArray(country.destinations) && country.destinations.length > 0;

    return {
      title: country.name,
      path: `/${country.slug}`, // ✅ was /destinations/${country.slug}
      ...(hasChildren && {
        secondLayer: country.destinations.map((dest) => ({
          title: dest.name,
          path: `/${country.slug}/${dest.slug}`, // ✅ was /destinations/${dest.slug}
        })),
      }),
    };
  });
};

export const transformDestinations = (apiDestinations: ApiDestination[]): NavDestination[] => {
  if (!apiDestinations || apiDestinations.length === 0) {
    return defaultDestinations;
  }

  const countries = apiDestinations.filter((d) => d.parentId === null || d.parentId === undefined);
  const children = apiDestinations.filter((d) => d.parentId !== null && d.parentId !== undefined);

  if (countries.length === 0) return defaultDestinations;

  const childrenByParent = new Map<number, ApiDestination[]>();
  for (const child of children) {
    const pid = child.parentId!;
    if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
    childrenByParent.get(pid)?.push(child);
  }

  return countries.map((country) => {
    const kids = childrenByParent.get(country.id) ?? [];
    return {
      title: country.name,
      path: `/${country.slug}`, // ✅ was /destinations/${country.slug}
      ...(kids.length > 0 && {
        secondLayer: kids.map((k) => ({
          title: k.name,
          path: `/${country.slug}/${k.slug}`, // ✅ was /destinations/${k.slug}
        })),
      }),
    };
  });
};
