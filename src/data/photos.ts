// Landing-page photography from Unsplash (free under the Unsplash License).
// Files live in public/img/landing/<key>-{800,1600}.webp; credits render in the footer.
export type Photo = {
  src: string; // 1600w webp
  srcset: string;
  alt: string; // Malay
  width: number;
  height: number;
  credit: { name: string; url: string };
};

const u = (username: string) => `https://unsplash.com/@${username}?utm_source=warung&utm_medium=referral`;

const photo = (
  key: string,
  alt: string,
  credit: Photo['credit'],
  width = 1600,
  height = 1067,
): Photo => ({
  src: `/img/landing/${key}-1600.webp`,
  srcset: `/img/landing/${key}-800.webp 800w, /img/landing/${key}-1600.webp 1600w`,
  alt,
  width,
  height,
  credit,
});

export const photos = {
  hero: photo(
    'hero',
    'Peniaga gerai nasi campur menyenduk nasi putih ke pinggan, dikelilingi lauk ayam goreng dan sayur',
    { name: 'Kelvin Zyteng', url: u('zyteng') },
  ),
  stall: photo(
    'stall',
    'Dua peniaga muda membakar dan mengipas sate di gerai tepi jalan',
    { name: 'Kelvin Zyteng', url: u('zyteng') },
  ),
  restaurant: photo(
    'restaurant',
    'Pelanggan warga emas berbual sambil minum kopi di meja kedai makan yang sibuk',
    { name: 'ANNIE HATUANH', url: u('anniehatuanh') },
  ),
  cafe: photo(
    'cafe',
    'Petugas café kecil mengambil pesanan di kaunter dengan tablet sementara rakan sekerja menyediakan minuman',
    { name: 'Umar Al Farouq', url: u('umaraf') },
  ),
  food: photo(
    'food',
    'Roti canai rangup bersama kuah kari, bawang dan cili hijau di atas dulang',
    { name: 'Ananthan Chithiraikani', url: u('ananthan8110') },
  ),
  payment: photo(
    'payment',
    'Pelanggan membayar di kaunter dengan telefon pintar sambil juruwang memegang terminal kod QR',
    { name: 'Trương Tuyết Ly', url: u('liliantruong2603') },
  ),
  kitchen: photo(
    'kitchen',
    'Kuali besar berasap di atas dapur gas dalam dapur komersial yang sibuk',
    { name: 'Hailey Tong', url: u('haileytong') },
  ),
  cta: photo(
    'cta',
    'Pasar malam Petaling Street yang sesak dengan pengunjung di bawah tanglung merah pada waktu malam',
    { name: 'Ravin Rau', url: u('ravinrau') },
  ),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
