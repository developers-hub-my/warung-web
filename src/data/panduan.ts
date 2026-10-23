// Panduan pengguna (/panduan). One entry per page; each step has exactly one
// screenshot from public/panduan/img/<slug>/, re-captured by
// `node scripts/capture-docs.mjs` against a running warung-app.
//
// `body` and `tip` are trusted HTML written here (bold, links) — never user input.

export interface Step {
  title: string;
  body: string;
  img: string;
  alt: string;
  tip?: string;
}

export interface Topic {
  slug: string;
  title: string;
  summary: string;
  steps: Step[];
}

const img = (topic: string, file: string) => `/panduan/img/${topic}/${file}.webp`;

export const topics: Topic[] = [
  {
    slug: 'daftar',
    title: 'Daftar & sahkan e-mel',
    summary: 'Buka akaun Warung dan sahkan e-mel anda dengan satu tekan.',
    steps: [
      {
        title: 'Buka borang daftar',
        body: 'Pergi ke <a href="https://pos.warung.my/register">pos.warung.my/register</a> atau tekan <strong>Daftar Percuma</strong> di laman ini. Tiada kad kredit diperlukan.',
        img: img('daftar', '01-borang-daftar'),
        alt: 'Borang daftar akaun Warung dengan ruangan nama, e-mel dan kata laluan',
      },
      {
        title: 'Isi nama, e-mel dan kata laluan',
        body: 'Masukkan nama anda, e-mel yang aktif, dan kata laluan dua kali. Kemudian tekan <strong>Create account</strong>.',
        img: img('daftar', '02-isi-borang'),
        alt: 'Borang daftar yang sudah diisi, butang Create account ditanda',
        tip: 'Guna e-mel yang anda boleh buka di telefon. Pautan pengesahan dihantar ke situ.',
      },
      {
        title: 'Semak e-mel anda',
        body: 'Warung hantar pautan pengesahan ke e-mel anda. Skrin ini menunggu sehingga anda tekan pautan itu.',
        img: img('daftar', '03-semak-email'),
        alt: 'Skrin "Semak e-mel anda" dengan butang hantar semula e-mel',
        tip: 'Tiada e-mel? Semak folder Spam, atau tekan <strong>Hantar semula e-mel</strong>. Tersalah taip e-mel? Tekan <strong>Log keluar</strong> dan daftar semula.',
      },
      {
        title: 'Tekan "Sahkan e-mel & mula"',
        body: 'Buka e-mel daripada Warung dan tekan butang itu. Anda terus log masuk dan dibawa ke setup kedai — di telefon atau komputer mana-mana.',
        img: img('daftar', '04-email-pengesahan'),
        alt: 'E-mel pengesahan Warung dengan butang Sahkan e-mel & mula',
        tip: 'Pautan sah selama 60 minit dan hanya boleh digunakan sekali.',
      },
    ],
  },
  {
    slug: 'setup-kedai',
    title: 'Setup kedai',
    summary: 'Dua langkah sahaja: nama kedai, kemudian pilih menu.',
    steps: [
      {
        title: 'Langkah 1: nama kedai',
        body: 'Selepas sahkan e-mel, Warung tanya satu soalan sahaja: apa nama kedai anda?',
        img: img('setup-kedai', '01-nama-kedai'),
        alt: 'Langkah 1 daripada 2: Apa nama kedai anda?',
      },
      {
        title: 'Taip nama, tekan Seterusnya',
        body: 'Nama ini menjadi nama kedai dan cawangan pertama anda. Boleh ditukar kemudian di <strong>Tetapan</strong>.',
        img: img('setup-kedai', '02-isi-nama'),
        alt: 'Nama kedai Warung Mak Jah diisi, butang Seterusnya ditanda',
      },
      {
        title: 'Langkah 2: apa yang anda jual?',
        body: 'Pilih menu yang paling hampir dengan kedai anda. Warung isikan hidangan dan harga untuk anda.',
        img: img('setup-kedai', '03-pilih-menu'),
        alt: 'Pilihan menu: Warung Mamak, Cafe, Gerai Nasi, Kedai Tomyam, Kedai Makan dan Mula kosong',
      },
      {
        title: 'Pilih satu templat menu',
        body: 'Tekan kad menu. Kad yang dipilih bertukar warna. Semua hidangan dan harga boleh diubah kemudian.',
        img: img('setup-kedai', '04-menu-dipilih'),
        alt: 'Kad menu Warung Mamak dipilih',
      },
      {
        title: 'Atau "Mula kosong", kemudian Buka kedai saya',
        body: 'Mahu masukkan menu sendiri? Pilih <strong>Mula kosong</strong>. Kemudian tekan <strong>Buka kedai saya</strong> — anda terus ke kaunter (POS).',
        img: img('setup-kedai', '05-mula-kosong'),
        alt: 'Mula kosong dipilih, butang Buka kedai saya ditanda',
        tip: 'Daftar melalui pelan Pro atau Bisnes? Selepas langkah ini anda dibawa ke halaman <strong>Pelan & Bil</strong> untuk membuat bayaran.',
      },
    ],
  },
  {
    slug: 'jualan-pertama',
    title: 'Jualan pertama di POS',
    summary: 'Tambah hidangan, masukkan ke troli, Bayar, dan lihat resit.',
    steps: [
      {
        title: 'Panduan jualan pertama',
        body: 'Kali pertama anda buka POS, kotak <strong>Jualan pertama anda, dalam 3 langkah</strong> muncul di atas.',
        img: img('jualan-pertama', '01-panduan-jualan-pertama'),
        alt: 'Skrin POS kosong dengan panduan jualan pertama dalam 3 langkah',
      },
      {
        title: 'Tambah hidangan terus di kaunter',
        body: 'Taip nama hidangan dan harga, kemudian tekan <strong>Tambah</strong>. Tidak perlu ke halaman produk.',
        img: img('jualan-pertama', '02-tambah-hidangan'),
        alt: 'Nama hidangan Nasi Lemak Biasa dan harga 3.50 diisi dalam panduan',
      },
      {
        title: 'Hidangan muncul di skrin jualan',
        body: 'Langkah 1 ditanda siap dan hidangan baru terus muncul di grid.',
        img: img('jualan-pertama', '03-hidangan-ditambah'),
        alt: 'Kad Nasi Lemak Biasa RM3.50 di grid POS',
      },
      {
        title: 'Tekan + pada hidangan',
        body: 'Pilih kuantiti dan taip catatan jika perlu (contoh: kurang manis, bungkus asing). Tekan <strong>Tambah ke Troli</strong>.',
        img: img('jualan-pertama', '04-kuantiti'),
        alt: 'Tetingkap kuantiti untuk Nasi Lemak Biasa dengan butang Tambah ke Troli',
        tip: 'Hidangan yang ada variasi (contoh: Teh O, Teh Tarik) akan minta anda pilih variasi dahulu.',
      },
      {
        title: 'Semak troli, tekan Bayar',
        body: 'Troli di sebelah kanan menunjukkan item dan jumlah. Tekan <strong>Bayar</strong>.',
        img: img('jualan-pertama', '05-dalam-troli'),
        alt: 'Troli dengan satu Nasi Lemak Biasa dan butang Bayar ditanda',
      },
      {
        title: 'Pilih jenis pesanan dan cara bayar',
        body: 'Pilih <strong>Makan Sini</strong> atau <strong>Bungkus</strong>, dan cara bayar: <strong>Tunai</strong>, <strong>QR Pay</strong> atau <strong>Kad</strong>. Tekan <strong>Sahkan Pesanan</strong>.',
        img: img('jualan-pertama', '06-bayaran'),
        alt: 'Tetingkap pembayaran: jumlah RM3.50, jenis pesanan, kaedah bayaran, butang Sahkan Pesanan',
        tip: 'Untuk Makan Sini, isi nombor meja dan bilangan pax supaya dapur tahu ke mana makanan dihantar.',
      },
      {
        title: 'Pesanan selesai',
        body: 'Nombor pesanan keluar. Dari sini anda boleh kongsi resit melalui WhatsApp atau e-mel, muat turun PDF, atau terus mula <strong>Pesanan Baru</strong>.',
        img: img('jualan-pertama', '07-pesanan-selesai'),
        alt: 'Tetingkap Pesanan Selesai dengan nombor pesanan dan pilihan resit',
      },
      {
        title: 'Lihat resit',
        body: 'Tekan <strong>Lihat Resit</strong> untuk resit penuh. Boleh dicetak terus dari sini.',
        img: img('jualan-pertama', '08-resit'),
        alt: 'Resit pesanan pertama',
      },
      {
        title: 'Jualan pertama siap!',
        body: 'Kembali ke POS. Selepas jualan pertama, panduan hilang dengan sendirinya dan kaunter sedia untuk pelanggan seterusnya.',
        img: img('jualan-pertama', '09-jualan-pertama-siap'),
        alt: 'Skrin POS selepas jualan pertama, tanpa kotak panduan',
        tip: 'Ini cuma jualan cubaan? Ia boleh dibatalkan kemudian dari senarai pesanan.',
      },
    ],
  },
  {
    slug: 'menu-produk',
    title: 'Menu & produk',
    summary: 'Kategori, produk, variasi, dan tanda hidangan habis.',
    steps: [
      {
        title: 'Buka Inventori → Kategori',
        body: 'Kategori menyusun menu anda di POS (contoh: Makanan, Minuman, Kuih). Tekan <strong>Tambah Kategori</strong>.',
        img: img('menu-produk', '01-kategori'),
        alt: 'Senarai kategori dengan butang Tambah Kategori ditanda',
      },
      {
        title: 'Namakan kategori, tekan Simpan',
        body: 'Taip nama kategori. Biarkan <strong>Aktif</strong> bertanda supaya ia muncul di POS.',
        img: img('menu-produk', '02-tambah-kategori'),
        alt: 'Borang kategori baharu dengan nama Pencuci Mulut',
      },
      {
        title: 'Buka Inventori → Produk',
        body: 'Semua hidangan anda di sini. Tekan <strong>Tambah Produk</strong> untuk hidangan baharu.',
        img: img('menu-produk', '03-senarai-produk'),
        alt: 'Senarai produk dengan butang Tambah Produk ditanda',
      },
      {
        title: 'Isi butiran produk',
        body: 'Isi nama, pilih kategori, dan letak harga asas. Gambar dan penerangan adalah pilihan.',
        img: img('menu-produk', '04-produk-baharu'),
        alt: 'Borang produk baharu: nama Cendol, kategori Pencuci Mulut, harga 4.00',
        tip: '<strong>Masa Ketersediaan</strong> menyembunyikan hidangan di luar waktu, contoh menu sarapan hanya 7 pagi hingga 11 pagi.',
      },
      {
        title: 'Tambah variasi',
        body: 'Tanda <strong>Ada Variasi</strong> dan masukkan setiap variasi dengan harganya sendiri (contoh: Biasa RM4, Pulut RM5). Tekan <strong>Simpan</strong>.',
        img: img('menu-produk', '05-variasi'),
        alt: 'Bahagian variasi dengan dua variasi: Biasa dan Pulut',
      },
      {
        title: 'Hidangan habis? Tanda habis',
        body: 'Di senarai produk, tanda kotak pada hidangan itu, kemudian tekan <strong>Tanda habis</strong>.',
        img: img('menu-produk', '06-tanda-habis'),
        alt: 'Satu produk dipilih, butang Tanda habis ditanda',
        tip: 'Habis hanya untuk cawangan yang sedang anda buka. Cawangan lain masih boleh jual.',
      },
      {
        title: 'Juruwang nampak "Habis" di POS',
        body: 'Hidangan bertukar kelabu dengan label <strong>Habis</strong> dan tidak boleh ditekan. Bila stok sampai, pilih semula dan tekan <strong>Ada stok semula</strong>.',
        img: img('menu-produk', '07-habis-di-pos'),
        alt: 'Grid POS dengan satu hidangan berlabel Habis',
      },
    ],
  },
  {
    slug: 'stok',
    title: 'Stok',
    summary: 'Jejak baki stok, lihat stok rendah, dan laras stok masuk.',
    steps: [
      {
        title: 'Hidupkan Jejak Stok pada produk',
        body: 'Buka produk, tanda <strong>Jejak Stok</strong> dan masukkan kuantiti yang ada sekarang. Tekan <strong>Simpan</strong>.',
        img: img('stok', '01-jejak-stok'),
        alt: 'Borang produk dengan Jejak Stok bertanda dan kuantiti stok 40',
        tip: 'Hanya jejak barang yang dikira satu-satu, seperti kuih atau air tin. Kopi bancuh tidak perlu.',
      },
      {
        title: 'Lihat semua stok di Inventori → Stok',
        body: 'Senarai ini menunjukkan baki setiap produk. Produk dengan baki 10 atau kurang ditanda <strong>Stok Rendah</strong>.',
        img: img('stok', '02-senarai-stok'),
        alt: 'Senarai stok dengan status Stok Rendah dan Ada Stok',
        tip: 'Setiap jualan di POS menolak stok secara automatik. Pemilik juga menerima notifikasi stok rendah setiap hari.',
      },
      {
        title: 'Laras stok',
        body: 'Tekan <strong>⋯</strong> pada produk, pilih <strong>Laras Stok</strong>. Pilih jenis pelarasan, kuantiti dan sebab, kemudian <strong>Simpan</strong>.',
        img: img('stok', '03-laras-stok'),
        alt: 'Borang pelarasan stok dengan kuantiti 20 dan sebab',
      },
      {
        title: 'Semak sejarah pelarasan',
        body: 'Setiap pelarasan direkod dengan tarikh, kuantiti, baki selepas, sebab, dan siapa yang membuatnya.',
        img: img('stok', '04-sejarah-pelarasan'),
        alt: 'Jadual sejarah pelarasan stok',
        tip: 'Ada lebih daripada satu cawangan? Baki stok dikira bersama untuk semua cawangan, bukan untuk setiap cawangan.',
      },
    ],
  },
  {
    slug: 'meja-kds',
    title: 'Meja & KDS (dapur)',
    summary: 'Daftar meja, ambil pesanan ikut meja, dan hantar ke skrin dapur.',
    steps: [
      {
        title: 'Buka Inventori → Meja',
        body: 'Belum ada meja? Tekan <strong>Tambah Meja</strong>.',
        img: img('meja-kds', '00-tiada-meja'),
        alt: 'Halaman Meja kosong dengan butang Tambah Meja',
      },
      {
        title: 'Isi butiran meja',
        body: 'Beri nama, nombor, kapasiti, dan zon (contoh: Dalam, Luar). Tekan <strong>Simpan</strong>.',
        img: img('meja-kds', '01-tambah-meja'),
        alt: 'Borang tambah meja: Meja 1, nombor 1, kapasiti 4, zon Dalam',
        tip: 'Nombor meja mesti unik untuk setiap cawangan.',
      },
      {
        title: 'Semua meja di satu tempat',
        body: 'Tapis ikut zon atau status. Meja tidak aktif tidak dipaparkan kepada juruwang.',
        img: img('meja-kds', '02-senarai-meja'),
        alt: 'Senarai lima meja dalam zon Dalam dan Luar',
      },
      {
        title: 'Ambil pesanan untuk meja',
        body: 'Di POS, masukkan item seperti biasa. Semasa <strong>Bayar</strong>, pilih <strong>Makan Sini</strong> dan isi <strong>No. Meja</strong> dan <strong>Pax</strong>.',
        img: img('meja-kds', '03-pesanan-meja'),
        alt: 'Tetingkap pembayaran dengan No. Meja 3 dan Pax 2',
      },
      {
        title: 'Buka Kedai → KDS di skrin dapur',
        body: 'Paparan Dapur menunjukkan setiap pesanan sebagai tiket: nombor pesanan, Makan Sini atau Bungkus, item dan catatan.',
        img: img('meja-kds', '04-paparan-dapur'),
        alt: 'Paparan Dapur dengan dua tiket pesanan',
        tip: 'Letak tablet atau TV di dapur dan log masuk dengan akaun staf dapur. Tiket baharu muncul sendiri.',
      },
      {
        title: 'Mula, kemudian Siap',
        body: 'Tukang masak tekan <strong>Mula</strong> bila mula masak, dan <strong>Siap</strong> bila item sedia. Warna tiket berubah ikut masa: Ikut masa, Perhati, Lewat.',
        img: img('meja-kds', '05-mula-masak'),
        alt: 'Tiket dengan satu item sedang dimasak dan butang Siap ditanda',
      },
      {
        title: 'Tandakan Semua Siap',
        body: 'Satu tekan untuk siapkan semua item dalam tiket. Tiket hilang dari skrin bila semuanya siap.',
        img: img('meja-kds', '06-semua-siap'),
        alt: 'Paparan Dapur selepas satu tiket ditandakan siap',
      },
    ],
  },
  {
    slug: 'staf-cawangan',
    title: 'Staf & cawangan',
    summary: 'Jemput juruwang, buka cawangan baharu, dan tukar cawangan.',
    steps: [
      {
        title: 'Buka Pengurusan → Kakitangan',
        body: 'Senarai semua ahli pasukan, peranan, dan cawangan mereka. Tekan <strong>Jemput Kakitangan</strong>.',
        img: img('staf-cawangan', '01-senarai-staf'),
        alt: 'Senarai ahli pasukan dengan butang Jemput Kakitangan ditanda',
      },
      {
        title: 'Jemput juruwang',
        body: 'Isi nama dan e-mel, tanda peranan <strong>Juruwang</strong>, kemudian <strong>Simpan</strong>. Warung hantar e-mel jemputan untuk mereka tetapkan kata laluan.',
        img: img('staf-cawangan', '02-jemput-juruwang'),
        alt: 'Borang jemput kakitangan dengan peranan Juruwang dipilih',
        tip: 'Juruwang hanya nampak POS dan pesanan. Mereka tidak boleh ubah harga atau menu.',
      },
      {
        title: 'Buka Pengurusan → Cawangan',
        body: 'Setiap cawangan ada meja, pesanan, dan stok habis sendiri. Menu dikongsi oleh semua cawangan. Tekan <strong>Cawangan Baharu</strong>.',
        img: img('staf-cawangan', '03-senarai-cawangan'),
        alt: 'Senarai tiga cawangan dengan butang Cawangan Baharu ditanda',
        tip: 'Lebih daripada satu cawangan memerlukan pelan <strong>Bisnes</strong>.',
      },
      {
        title: 'Isi butiran cawangan',
        body: 'Masukkan nama cawangan, alamat dan telefon (pilihan), kemudian <strong>Simpan</strong>.',
        img: img('staf-cawangan', '04-cawangan-baharu'),
        alt: 'Borang cawangan baharu Kopi Singa Shah Alam',
      },
      {
        title: 'Tukar cawangan',
        body: 'Tekan nama cawangan di atas menu sisi dan pilih cawangan lain. POS, pesanan dan meja bertukar ke cawangan itu.',
        img: img('staf-cawangan', '05-tukar-cawangan'),
        alt: 'Menu tukar cawangan dibuka: Bangsar, Damansara, Subang Jaya',
      },
    ],
  },
  {
    slug: 'pesanan-resit',
    title: 'Pesanan & resit',
    summary: 'Semak jualan, buka resit, dan kongsi dengan pelanggan.',
    steps: [
      {
        title: 'Buka Kedai → Pesanan',
        body: 'Semua pesanan cawangan ini. Tapis ikut Hari, Minggu, Bulan atau Tahun, status, dan cara bayar.',
        img: img('pesanan-resit', '01-senarai-pesanan'),
        alt: 'Senarai pesanan hari ini dengan juruwang, kaedah bayaran, jumlah dan status',
      },
      {
        title: 'Pesanan hari ini di POS',
        body: 'Juruwang tekan <strong>Pesanan</strong> di bar bawah POS untuk lihat pesanan hari ini, lengkap dengan meja dan catatan.',
        img: img('pesanan-resit', '02-pesanan-hari-ini'),
        alt: 'Senarai Pesanan Hari Ini di POS',
      },
      {
        title: 'Buka resit',
        body: 'Tekan mana-mana pesanan untuk buka resitnya.',
        img: img('pesanan-resit', '03-resit'),
        alt: 'Resit pesanan dengan item, jumlah dan kaedah bayaran',
      },
      {
        title: 'Kongsi resit',
        body: 'Taip nombor telefon pelanggan dan tekan <strong>Kongsi</strong> untuk hantar melalui WhatsApp, atau e-mel dan tekan <strong>Hantar</strong>. Boleh juga <strong>Muat Turun PDF</strong> atau <strong>Cetak</strong>.',
        img: img('pesanan-resit', '04-kongsi-resit'),
        alt: 'Ruangan telefon dan e-mel pelanggan di bawah resit',
        tip: 'Nombor telefon ditulis dengan kod negara, contoh 60123456789.',
      },
      {
        title: 'Apa yang pelanggan nampak',
        body: 'Pautan resit dibuka tanpa log masuk. Pelanggan boleh muat turun PDF sendiri.',
        img: img('pesanan-resit', '05-resit-pelanggan'),
        alt: 'Resit awam yang dibuka oleh pelanggan',
      },
    ],
  },
  {
    slug: 'pelan-bayaran',
    title: 'Pelan & bayaran',
    summary: 'Percuma, Pro dan Bisnes, bayaran FPX melalui Billplz, dan sambung pelan.',
    steps: [
      {
        title: 'Buka Pengurusan → Pelan & Bil',
        body: 'Kedai baharu bermula dengan pelan <strong>Percuma</strong>. Bar di atas menunjukkan berapa produk, pengguna dan cawangan yang sudah digunakan.',
        img: img('pelan-bayaran', '01-pelan-percuma'),
        alt: 'Halaman Pelan & Bil untuk kedai pada pelan Percuma',
      },
      {
        title: 'Pilih pelan, tekan Bayar 1 bulan',
        body: '<strong>Pro</strong> RM29/bulan: 3 pengguna, produk tanpa had. <strong>Bisnes</strong> RM79/bulan: pengguna dan cawangan tanpa had. Anda dibawa ke Billplz untuk bayar melalui FPX (perbankan dalam talian).',
        img: img('pelan-bayaran', '02-pilih-pelan'),
        alt: 'Kad pelan Percuma, Pro dan Bisnes, butang Bayar 1 bulan ditanda',
        tip: 'Pelan aktif sebaik sahaja bayaran berjaya. Anda kembali ke Warung secara automatik.',
      },
      {
        title: 'Bila sampai had pelan',
        body: 'Contohnya, pelan Percuma hanya untuk seorang pengguna. Bila anda cuba jemput juruwang, Warung beritahu sebabnya dan pelan yang diperlukan.',
        img: img('pelan-bayaran', '03-had-pelan'),
        alt: 'Mesej had pelan semasa menjemput kakitangan pada pelan Percuma',
        tip: 'Had hanya menghalang tambah baharu. Turun pelan tidak memadam produk, staf atau cawangan sedia ada.',
      },
      {
        title: 'Sambung pelan',
        body: 'Tiada potongan automatik — setiap bulan dibayar sekali, seperti tambah nilai prabayar. Tekan <strong>Sambung 1 bulan</strong>; bulan baharu bermula selepas tarikh tamat semasa, jadi bayar awal tidak rugi.',
        img: img('pelan-bayaran', '04-pelan-pro'),
        alt: 'Pelan Pro aktif dengan butang Sambung 1 bulan ditanda',
      },
      {
        title: 'Sejarah bayaran',
        body: 'Setiap bayaran disenaraikan dengan pelan, tempoh, status dan jumlah.',
        img: img('pelan-bayaran', '05-sejarah-bayaran'),
        alt: 'Jadual sejarah bayaran',
        tip: 'Tidak sambung? Kedai kembali ke pelan Percuma pada tarikh tamat. Data anda kekal.',
      },
    ],
  },
  {
    slug: 'pwa-offline',
    title: 'Pasang sebagai app & offline',
    summary: 'Pasang Warung di telefon atau tablet, dan terus menjual tanpa internet.',
    steps: [
      {
        title: 'Tekan Pasang',
        body: 'Buka <strong>pos.warung.my</strong> di Chrome. Bila bar <strong>Pasang Warung untuk pengalaman lebih baik</strong> muncul, tekan <strong>Pasang</strong>. Ikon Warung masuk ke skrin utama.',
        img: img('pwa-offline', '01-pasang-app'),
        alt: 'Bar Pasang Warung di atas skrin POS',
        tip: 'iPhone atau iPad: buka di Safari, tekan butang Kongsi, kemudian <strong>Add to Home Screen</strong>.',
      },
      {
        title: 'Internet putus? Terus jual',
        body: 'Bar merah muncul bila tiada internet. POS masih berfungsi seperti biasa.',
        img: img('pwa-offline', '02-luar-talian'),
        alt: 'POS dengan bar merah Anda tidak dalam talian, satu item dalam troli',
      },
      {
        title: 'Pesanan disimpan dalam peranti',
        body: 'Tekan <strong>Bayar</strong> dan <strong>Sahkan Pesanan</strong> seperti biasa. Pesanan disimpan dalam peranti dan dihantar sendiri bila internet kembali — sekali sahaja, tiada pesanan berganda.',
        img: img('pwa-offline', '03-jual-tanpa-internet'),
        alt: 'Mesej Pesanan disimpan secara luar talian, akan disegerakkan apabila kembali dalam talian',
        tip: 'Jangan log keluar atau padam data pelayar semasa luar talian — pesanan yang belum dihantar masih dalam peranti itu.',
      },
    ],
  },
];
