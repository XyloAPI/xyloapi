export interface LocationDetails {
  lat: number;
  lon: number;
  display_name: string;
}

export interface EstimasiWaktu {
  motor: string;
  mobil: string;
  jalan_kaki: string;
}

export interface HitungJarakResult {
  dari: {
    nama: string;
    lokasi: string;
    koordinat: { lat: number; lon: number };
  };
  ke: {
    nama: string;
    lokasi: string;
    koordinat: { lat: number; lon: number };
  };
  jarak: string;
  jarak_km: number;
  estimasi_waktu: EstimasiWaktu;
}

async function getCoordinates(city: string): Promise<LocationDetails | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.append("q", city);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");
    url.searchParams.append("countrycodes", "id");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "KawaiiYumeeAPI/1.0",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;
    const data = await response.json() as any[];

    if (!data || !data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    };
  } catch {
    return null;
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatJarak(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} meter`;
  return `${km.toFixed(1)} km`;
}

function estimasiWaktu(km: number): EstimasiWaktu {
  const motor = km / 40;
  const mobil = km / 60;
  const jalan = km / 5;

  const fmt = (jam: number) => {
    const h = Math.floor(jam);
    const m = Math.round((jam - h) * 60);

    if (h === 0) return `${m} menit`;
    if (m === 0) return `${h} jam`;
    return `${h} jam ${m} menit`;
  };

  return {
    motor: fmt(motor),
    mobil: fmt(mobil),
    jalan_kaki: fmt(jalan),
  };
}

export async function hitungJarak(kota1: string, kota2: string): Promise<HitungJarakResult> {
  const [loc1, loc2] = await Promise.all([
    getCoordinates(kota1),
    getCoordinates(kota2),
  ]);

  if (!loc1) throw new Error(`Kota '${kota1}' tidak ditemukan`);
  if (!loc2) throw new Error(`Kota '${kota2}' tidak ditemukan`);

  const km = haversine(loc1.lat, loc1.lon, loc2.lat, loc2.lon);

  return {
    dari: {
      nama: kota1,
      lokasi: loc1.display_name,
      koordinat: { lat: loc1.lat, lon: loc1.lon },
    },
    ke: {
      nama: kota2,
      lokasi: loc2.display_name,
      koordinat: { lat: loc2.lat, lon: loc2.lon },
    },
    jarak: formatJarak(km),
    jarak_km: parseFloat(km.toFixed(2)),
    estimasi_waktu: estimasiWaktu(km),
  };
}
