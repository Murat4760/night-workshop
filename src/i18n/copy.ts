export const LANGS = ['en', 'tr', 'az'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_LABEL: Record<Lang, string> = { en: 'EN', tr: 'TR', az: 'AZ' }
export const LANG_NAME: Record<Lang, string> = { en: 'English', tr: 'Türkçe', az: 'Azərbaycanca' }

type Item = { k: string; t: string; d: string }

export type Copy = {
  langSwitch: string
  skipToContent: string
  backToTop: string
  meta: { title: string; description: string }
  nav: { work: string; process: string; contact: string; available: string }
  loader: { tag: string }
  hero: { eyebrow: string; name: [string, string]; sub: string; cue: string }
  stack: { index: string; title: string }
  feat: { index: string; title: [string, string]; bullets: Item[] }
  /** Order-matched to WORK_ROWS in WorkIndex.tsx (names/years aren't translated). */
  work: { index: string; title: string; cursor: string; rows: { type: string; result: string }[] }
  /** statLabels is order-matched to STATS in Numbers.tsx. */
  numbers: {
    index: string
    title: string
    statLabels: [string, string, string, string]
    quote: { text: string; author: string; role: string }
  }
  proc: { index: string; title: string; steps: Item[] }
  cta: { index: string; title: [string, string]; sub: string; button: string }
  foot: { email: string; copyright: string }
}

export const COPY: Record<Lang, Copy> = {
  /* ------------------------------------------------------------------ */
  en: {
    langSwitch: 'Change language',
    skipToContent: 'Skip to content',
    backToTop: 'Back to top',
    meta: {
      title: 'Murad Guluzade — Solo Web Developer | The Night Workshop',
      description:
        'I design and ship fast, unmistakably custom websites — start to finish, one pair of hands. No templates, no handoff gaps.',
    },
    nav: { work: 'Work', process: 'Process', contact: 'Contact', available: '2 slots open' },
    loader: { tag: 'The night workshop' },
    hero: {
      eyebrow: 'Solo web developer — building after dark',
      name: ['Murad', 'Guluzade'],
      sub: 'I design and ship fast, unmistakably custom websites — start to finish, one pair of hands. No templates, no handoff gaps.',
      cue: 'Scroll',
    },
    stack: { index: '02 — The bench', title: 'Tools on the desk' },
    feat: {
      index: '03 — Featured build',
      title: ['Saraykapı', 'Restaurant'],
      bullets: [
        { k: '01', t: 'Booking flow rebuilt', d: 'Three screens down to one. Reservations up 38% in the first month.' },
        { k: '02', t: 'Sub-second first paint', d: 'Static-first delivery, images streamed at the size the device asks for.' },
        { k: '03', t: 'Menu edits without me', d: 'Owner updates prices from a phone; no deploy, no invoice.' },
        { k: '04', t: 'Built and shipped in 9 days', d: 'Brief on a Monday, live the following Wednesday.' },
      ],
    },
    work: {
      index: '04 — Selected work',
      title: 'The rest of the bench',
      cursor: 'View',
      rows: [
        { type: 'Restaurant', result: '+38% reservations' },
        { type: 'Construction', result: 'Rebuilt in 3 weeks' },
        { type: 'Salon', result: 'Booking live in 6 days' },
        { type: 'Education', result: '3× enquiry capture' },
      ],
    },
    numbers: {
      index: '05 — By the numbers',
      title: 'Four years, one desk',
      statLabels: ['Sites shipped', 'Day average build', 'Lighthouse median', 'Years solo'],
      quote: {
        text: 'He rebuilt the whole site in nine days and the phone started ringing again. I update the menu myself now, from my phone, between services.',
        author: 'Saraykapı',
        role: 'Owner · Istanbul',
      },
    },
    proc: {
      index: '06 — How I build',
      title: 'Brief. Build. Ship.',
      steps: [
        { k: '01', t: 'Brief', d: 'One call, one page. What it must do, who it is for, what "done" looks like.' },
        { k: '02', t: 'Build', d: 'Design and code in the same pair of hands. You see it live from day two.' },
        { k: '03', t: 'Ship', d: 'Deployed, measured, handed over — with the keys and a way to edit it.' },
      ],
    },
    cta: {
      index: '07 — Open for work',
      title: ['Got something', 'worth building?'],
      sub: 'Two project slots open this quarter. Tell me what you need — you get a straight answer on scope, price and timeline within a day.',
      button: 'Start a project',
    },
    foot: { email: 'Email', copyright: 'Murad Guluzade. Built after dark.' },
  },

  /* ------------------------------------------------------------------ */
  tr: {
    langSwitch: 'Dili değiştir',
    skipToContent: 'İçeriğe geç',
    backToTop: 'Başa dön',
    meta: {
      title: 'Murad Guluzade — Bağımsız Web Geliştirici | Gece Atölyesi',
      description:
        'Hızlı ve şablona benzemeyen siteler tasarlayıp yayına alıyorum — baştan sona tek elden. Şablon yok, teslim boşluğu yok.',
    },
    nav: { work: 'İşler', process: 'Süreç', contact: 'İletişim', available: '2 proje yeri açık' },
    loader: { tag: 'Gece atölyesi' },
    hero: {
      eyebrow: 'Bağımsız web geliştirici — geceleri üretir',
      name: ['Murad', 'Guluzade'],
      sub: 'Hızlı ve şablona benzemeyen siteler tasarlayıp yayına alıyorum — baştan sona tek elden. Şablon yok, teslim boşluğu yok.',
      cue: 'Kaydır',
    },
    stack: { index: '02 — Tezgâh', title: 'Masadaki araçlar' },
    feat: {
      index: '03 — Öne çıkan iş',
      title: ['Saraykapı', 'Restoran'],
      bullets: [
        { k: '01', t: 'Rezervasyon akışı yeniden kuruldu', d: 'Üç ekran tek ekrana indi. İlk ayda rezervasyonlar %38 arttı.' },
        { k: '02', t: 'Saniyenin altında ilk görüntü', d: 'Statik öncelikli dağıtım, görseller cihazın istediği boyutta geliyor.' },
        { k: '03', t: 'Menü güncellemeleri bensiz', d: 'İşletme sahibi fiyatları telefondan güncelliyor; deploy yok, fatura yok.' },
        { k: '04', t: '9 günde yapıldı ve yayınlandı', d: 'Pazartesi brief, ertesi çarşamba yayında.' },
      ],
    },
    work: {
      index: '04 — Seçilmiş işler',
      title: 'Tezgâhtaki diğer işler',
      cursor: 'Bak',
      rows: [
        { type: 'Restoran', result: '%38 daha fazla rezervasyon' },
        { type: 'İnşaat', result: '3 haftada yenilendi' },
        { type: 'Kuaför', result: '6 günde online randevu' },
        { type: 'Eğitim', result: '3 kat daha fazla başvuru' },
      ],
    },
    numbers: {
      index: '05 — Rakamlarla',
      title: 'Dört yıl, tek masa',
      statLabels: ['Yayınlanan site', 'Gün ortalama süre', 'Lighthouse ortancası', 'Yıl bağımsız'],
      quote: {
        text: 'Siteyi dokuz günde baştan kurdu ve telefon yeniden çalmaya başladı. Menüyü artık servis aralarında kendim, telefondan güncelliyorum.',
        author: 'Saraykapı',
        role: 'İşletme sahibi · İstanbul',
      },
    },
    proc: {
      index: '06 — Nasıl çalışırım',
      title: 'Brief. Üret. Yayınla.',
      steps: [
        { k: '01', t: 'Brief', d: 'Tek görüşme, tek sayfa. Ne yapmalı, kim için, "bitti" neye benziyor.' },
        { k: '02', t: 'Üret', d: 'Tasarım ve kod aynı elde. İkinci günden itibaren canlı görürsünüz.' },
        { k: '03', t: 'Yayınla', d: 'Yayına alındı, ölçüldü, teslim edildi — anahtarlar ve düzenleme yolu ile.' },
      ],
    },
    cta: {
      index: '07 — İşe açığım',
      title: ['Yapmaya değer', 'bir şey mi var?'],
      sub: 'Bu çeyrekte iki proje kontenjanı açık. Ne gerektiğini yazın — kapsam, fiyat ve süre için bir gün içinde net cevap alın.',
      button: 'Projeyi başlat',
    },
    foot: { email: 'E-posta', copyright: 'Murad Guluzade. Geceleri üretildi.' },
  },

  /* ------------------------------------------------------------------ */
  az: {
    langSwitch: 'Dili dəyiş',
    skipToContent: 'Məzmuna keç',
    backToTop: 'Yuxarı qayıt',
    meta: {
      title: 'Murad Guluzade — Müstəqil Veb Tərtibatçı | Gecə Emalatxanası',
      description:
        'Sürətli və şablona bənzəməyən saytlar dizayn edib təhvil verirəm — başdan sona tək əldən. Şablon yoxdur, təhvil boşluğu yoxdur.',
    },
    nav: { work: 'İşlər', process: 'Proses', contact: 'Əlaqə', available: '2 layihə yeri açıq' },
    loader: { tag: 'Gecə emalatxanası' },
    hero: {
      eyebrow: 'Müstəqil veb tərtibatçı — gecələr qurur',
      name: ['Murad', 'Guluzade'],
      sub: 'Sürətli və şablona bənzəməyən saytlar dizayn edib təhvil verirəm — başdan sona tək əldən. Şablon yoxdur, təhvil boşluğu yoxdur.',
      cue: 'Sürüşdür',
    },
    stack: { index: '02 — Dəzgah', title: 'Masadakı alətlər' },
    feat: {
      index: '03 — Seçilmiş iş',
      title: ['Saraykapı', 'Restoran'],
      bullets: [
        { k: '01', t: 'Rezervasiya axını yenidən quruldu', d: 'Üç ekran birə endi. İlk ayda rezervasiyalar 38% artdı.' },
        { k: '02', t: 'Saniyədən az ilk göstərim', d: 'Statik öncəlikli çatdırılma, şəkillər cihazın istədiyi ölçüdə gəlir.' },
        { k: '03', t: 'Menyu dəyişiklikləri mənsiz', d: 'Sahibkar qiymətləri telefondan yeniləyir; deploy yoxdur, faktura yoxdur.' },
        { k: '04', t: '9 gündə hazırlanıb yayımlandı', d: 'Bazar ertəsi brif, növbəti çərşənbə efirdə.' },
      ],
    },
    work: {
      index: '04 — Seçilmiş işlər',
      title: 'Dəzgahdakı digər işlər',
      cursor: 'Bax',
      rows: [
        { type: 'Restoran', result: '38% çox rezervasiya' },
        { type: 'Tikinti', result: '3 həftəyə yeniləndi' },
        { type: 'Gözəllik salonu', result: '6 gündə onlayn qeydiyyat' },
        { type: 'Təhsil', result: '3 dəfə çox müraciət' },
      ],
    },
    numbers: {
      index: '05 — Rəqəmlərlə',
      title: 'Dörd il, bir masa',
      statLabels: ['Yayımlanan sayt', 'Gün orta müddət', 'Lighthouse medianı', 'İl müstəqil'],
      quote: {
        text: 'Saytı doqquz günə yenidən qurdu və telefon yenidən zəng çalmağa başladı. Menyunu artıq servis aralarında özüm, telefondan yeniləyirəm.',
        author: 'Saraykapı',
        role: 'Sahibkar · İstanbul',
      },
    },
    proc: {
      index: '06 — Necə işləyirəm',
      title: 'Brif. Qur. Yayımla.',
      steps: [
        { k: '01', t: 'Brif', d: 'Bir görüş, bir səhifə. Nə etməli, kim üçün, "bitdi" necə görünür.' },
        { k: '02', t: 'Qur', d: 'Dizayn və kod eyni əldə. İkinci gündən canlı görürsünüz.' },
        { k: '03', t: 'Yayımla', d: 'Yayımlandı, ölçüldü, təhvil verildi — açarlar və redaktə imkanı ilə.' },
      ],
    },
    cta: {
      index: '07 — İşə açığam',
      title: ['Qurmağa dəyər', 'bir şey var?'],
      sub: 'Bu rübdə iki layihə yeri açıqdır. Nəyə ehtiyacınız olduğunu yazın — əhatə, qiymət və müddət barədə bir gün içində dəqiq cavab alın.',
      button: 'Layihəyə başla',
    },
    foot: { email: 'E-poçt', copyright: 'Murad Guluzade. Gecələr quruldu.' },
  },
}
