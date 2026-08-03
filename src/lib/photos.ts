/**
 * The photo library. One flat array — filters are derived from it, so
 * adding a photo here automatically updates every filter list in the UI.
 * Replace the SVG placeholders in /public/photos with real scans
 * (same filenames, or update `src`) and the whole site follows.
 */

const BASE = import.meta.env.BASE_URL;

export type Aspect = "landscape" | "portrait" | "square";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  aspect: Aspect;
  /** Frame number as printed on the rebate, e.g. "24A" */
  frame: string;
  camera: string;
  film: string;
  iso: number;
  location: string;
  date: string; // ISO yyyy-mm-dd
  roll: string; // e.g. "Roll 014"
  trip: string;
  tags: string[];
  featured?: boolean;
}

export const photos: Photo[] = [
  {
    id: "p01", src: `${BASE}photos/p01.svg`, alt: "Cliffs at golden hour, Cabo Espichel",
    aspect: "landscape", frame: "07A", camera: "Olympus mju-II", film: "Kodak Portra 400",
    iso: 400, location: "Cabo Espichel, PT", date: "2026-05-17", roll: "Roll 014",
    trip: "Setúbal Coast", tags: ["coast", "golden hour"], featured: true,
  },
  {
    id: "p02", src: `${BASE}photos/p02.svg`, alt: "Fishing boats in the morning haze",
    aspect: "portrait", frame: "12A", camera: "Olympus mju-II", film: "Kodak Gold 200",
    iso: 200, location: "Sesimbra, PT", date: "2026-04-02", roll: "Roll 012",
    trip: "Setúbal Coast", tags: ["harbor", "morning"],
  },
  {
    id: "p03", src: `${BASE}photos/p03.svg`, alt: "Tram wires against a white sky",
    aspect: "landscape", frame: "19A", camera: "Ricoh GR1s", film: "Kodak Tri-X 400",
    iso: 400, location: "Lisbon, PT", date: "2026-03-14", roll: "Roll 011",
    trip: "Lisbon on Foot", tags: ["street", "b&w"], featured: true,
  },
  {
    id: "p04", src: `${BASE}photos/p04.svg`, alt: "Friends at the miradouro, backlit",
    aspect: "portrait", frame: "22A", camera: "Konica Big Mini", film: "Kodak Portra 400",
    iso: 400, location: "Graça, Lisbon", date: "2026-03-14", roll: "Roll 011",
    trip: "Lisbon on Foot", tags: ["people", "golden hour"],
  },
  {
    id: "p05", src: `${BASE}photos/p05.svg`, alt: "Neon kiosk after the rain",
    aspect: "landscape", frame: "03A", camera: "Ricoh GR1s", film: "CineStill 800T",
    iso: 800, location: "Cais do Sodré, Lisbon", date: "2026-02-21", roll: "Roll 010",
    trip: "Lisbon on Foot", tags: ["night", "street"], featured: true,
  },
  {
    id: "p06", src: `${BASE}photos/p06.svg`, alt: "Orange tent, first light",
    aspect: "square", frame: "09A", camera: "Olympus mju-II", film: "Kodak Gold 200",
    iso: 200, location: "Serra da Arrábida, PT", date: "2026-05-18", roll: "Roll 014",
    trip: "Setúbal Coast", tags: ["camping", "morning"],
  },
  {
    id: "p07", src: `${BASE}photos/p07.svg`, alt: "Cathedral steps, single figure",
    aspect: "portrait", frame: "27A", camera: "Ricoh GR1s", film: "Kodak Tri-X 400",
    iso: 400, location: "Aachen, DE", date: "2025-12-24", roll: "Roll 008",
    trip: "Winter in Aachen", tags: ["street", "b&w", "winter"],
  },
  {
    id: "p08", src: `${BASE}photos/p08.svg`, alt: "Pine forest through the windscreen",
    aspect: "landscape", frame: "14A", camera: "Konica Big Mini", film: "Fuji Superia 400",
    iso: 400, location: "Serra da Arrábida, PT", date: "2026-05-18", roll: "Roll 013",
    trip: "Setúbal Coast", tags: ["roadtrip", "nature"],
  },
  {
    id: "p09", src: `${BASE}photos/p09.svg`, alt: "Laundry lines in Alfama",
    aspect: "landscape", frame: "31A", camera: "Olympus mju-II", film: "Kodak Portra 400",
    iso: 400, location: "Alfama, Lisbon", date: "2026-01-10", roll: "Roll 009",
    trip: "Lisbon on Foot", tags: ["street", "color"],
  },
  {
    id: "p10", src: `${BASE}photos/p10.svg`, alt: "Blue hour at the ferry terminal",
    aspect: "portrait", frame: "05A", camera: "Ricoh GR1s", film: "CineStill 800T",
    iso: 800, location: "Cacilhas, PT", date: "2026-02-21", roll: "Roll 010",
    trip: "Lisbon on Foot", tags: ["night", "harbor"],
  },
  {
    id: "p11", src: `${BASE}photos/p11.svg`, alt: "Dune grass, hard noon light",
    aspect: "landscape", frame: "17A", camera: "Olympus mju-II", film: "Kodak Gold 200",
    iso: 200, location: "Meco, PT", date: "2026-04-02", roll: "Roll 012",
    trip: "Setúbal Coast", tags: ["beach", "nature"],
  },
  {
    id: "p12", src: `${BASE}photos/p12.svg`, alt: "Espresso cup, marble counter",
    aspect: "square", frame: "25A", camera: "Konica Big Mini", film: "Kodak Tri-X 400",
    iso: 400, location: "Baixa, Lisbon", date: "2026-03-15", roll: "Roll 011",
    trip: "Lisbon on Foot", tags: ["still life", "b&w"],
  },
  {
    id: "p13", src: `${BASE}photos/p13.svg`, alt: "Trailhead marker in fog",
    aspect: "portrait", frame: "11A", camera: "Konica Big Mini", film: "Fuji Superia 400",
    iso: 400, location: "Sintra, PT", date: "2026-06-06", roll: "Roll 015",
    trip: "Sintra Fog Walk", tags: ["hiking", "nature", "fog"],
  },
  {
    id: "p14", src: `${BASE}photos/p14.svg`, alt: "Last frame of the roll — sunset from the bus",
    aspect: "landscape", frame: "36A", camera: "Olympus mju-II", film: "Kodak Portra 400",
    iso: 400, location: "N379, PT", date: "2026-05-18", roll: "Roll 014",
    trip: "Setúbal Coast", tags: ["roadtrip", "golden hour"], featured: true,
  },
];

export const featuredPhotos = photos.filter((p) => p.featured);

/** Filter dimensions the Gallery can pivot on. */
export const filterKeys = ["roll", "trip", "camera", "film"] as const;
export type FilterKey = (typeof filterKeys)[number] | "tag";

/** Distinct, sorted values for a filter dimension (tags are flattened). */
export function valuesFor(key: FilterKey): string[] {
  if (key === "tag") {
    return [...new Set(photos.flatMap((p) => p.tags))].sort();
  }
  return [...new Set(photos.map((p) => p[key]))].sort();
}

export function matches(photo: Photo, key: FilterKey, value: string): boolean {
  return key === "tag" ? photo.tags.includes(value) : photo[key] === value;
}

export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}
