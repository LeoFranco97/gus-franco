/**
 * All site content lives here so copy and curation can be changed without
 * touching component code.
 *
 * Photography is served from the same CDN that already hosts it for
 * gusfrn.co, so this repo carries no image files. Every URL in the data is
 * stored with its host collapsed to a short prefix and expanded by `img()`
 * below, which keeps `stories-index.json` and the per-story files small.
 *
 * To host the photos here instead, run scripts/mirror-photos.py, which walks
 * the same data, downloads every file into public/photos and rewrites the
 * prefixes. Nothing else needs to change.
 */

import indexJson from './stories-index.json'

/** Expands a stored photo path into a full URL. */
export function img(p: string): string {
  if (p.startsWith('@i/')) return 'https://cdn-sites-images.46graus.com/files/' + p.slice(3)
  if (p.startsWith('@c/')) return 'https://cdn.46graus.com/files/' + p.slice(3)
  // A mirrored build rewrites the prefixes to plain relative paths.
  return `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
}

export const profile = {
  firstName: 'Gus',
  fullName: 'Gustavo Franco',
  brand: 'FRNCO',
  role: 'Fotógrafo e Diretor de Fotografia',
  heroLine: 'fotógrafo e diretor de fotografia, 15 anos contando histórias ao redor do mundo',
  email: 'chiarovisuals@gmail.com',
  whatsapp: '+55 11 98945-7354',
  whatsappUrl: 'https://wa.me/5511989457354',
  instagram: 'https://www.instagram.com/ogusfranco',
  instagramHandle: '@ogusfranco',
  instagramAlt: 'https://www.instagram.com/gus.flashh/',
  instagramAltHandle: '@gus.flashh',
  oldSite: 'https://gusfrn.co',
  location: 'São Paulo, Brasil',
}

export const nav = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Imprensa', href: '#imprensa' },
  { label: 'Histórias', href: '#historias' },
  { label: 'Contato', href: '#contato' },
]

export type WallPiece = {
  src: string
  /** True width/height of the file. Drives CSS aspect-ratio, so the wall
   *  never reflows and no frame is ever cropped. */
  ratio: number
  caption: string
}

/**
 * The hero wall.
 *
 * This is Gus's own front-page edit, carried over frame for frame, because a
 * photographer's opening selection is an authored thing and not something to
 * re-cut. Only his portrait is pulled out of it, since it belongs in Sobre.
 *
 * The order is interleaved tall / wide so that in a fixed-width column the
 * frames come out at very different heights, and index 0 to 3 are what lands
 * at the top of the first four columns on the opening frame.
 */
export const heroWall: WallPiece[] = [
  { src: '@i/photos/aa46d9dd/ec96678b-71b7-4127-9baa-d7583c8ff72a/whitedreams-1-1280x1920.jpg', ratio: 2535 / 3800, caption: 'Casamento em Curitiba, Paraná' },
  { src: '@i/photos/aa46d9dd/35ddb6e1-4ab0-4d9b-9878-517d88cb1eb9/iceland_gusfranco-155-1024x683.jpg', ratio: 7950 / 5304, caption: 'Engagement na Islândia' },
  { src: '@i/photos/aa46d9dd/a9f80f3f-10eb-42af-82b4-ce8da808a694/monks-monge-monges-tailandia-2-1064x1440.jpg', ratio: 2809 / 3800, caption: 'Retrato de monges, Tailândia' },
  { src: '@i/photos/aa46d9dd/e5bce29a-7995-479e-bc58-df75bca648a8/lost-in-amsterdam-high-1-2-1024x631.jpg', ratio: 6426 / 3965, caption: 'Ensaio em Amsterdam' },
  { src: '@i/photos/aa46d9dd/4c8c6618-95b9-4a44-a7ce-7a7996bd7eb6/dubai-at-night-1-1303x1920.jpg', ratio: 2579 / 3800, caption: 'Casal em Dubai' },
  { src: '@i/photos/aa46d9dd/7447d3f2-ed45-4403-bdba-ea8769a19717/uruguay-368-1024x683.jpg', ratio: 3800 / 2535, caption: 'Ensaio no Uruguai' },
  { src: '@i/photos/aa46d9dd/96763db6-920c-4308-ac69-cb7e695eca12/gus_jj_rio_de_janeiro-410-1264x1920.jpg', ratio: 2502 / 3800, caption: 'Casamento no Cristo Redentor, Rio de Janeiro' },
  { src: '@i/photos/aa46d9dd/aec0c5c6-62fb-42f5-a4b8-684e00411e59/closer-to-the-edge-1-2080x1070.jpg', ratio: 2080 / 1070, caption: 'Closer to the edge' },
  { src: '@i/photos/aa46d9dd/cced7eae-6358-417b-9da1-2a59b8a5a3ec/elopement-chiang-mai-gustavo-franco-1-1279x1920.jpg', ratio: 1386 / 2080, caption: 'Elopement em Chiang Mai, Tailândia' },
  { src: '@i/photos/aa46d9dd/35df5319-e26a-4769-b4ad-99a83849dcb8/iceland_gusfranco-141-1024x730.jpg', ratio: 9926 / 7077, caption: 'Engagement na Islândia' },
  { src: '@i/photos/aa46d9dd/de81b404-e670-4585-b445-2e223c147788/oldcity-92-1361x1920.jpg', ratio: 4332 / 6111, caption: 'Old City, Dubai' },
  { src: '@i/photos/aa46d9dd/d2c5e7ca-147b-4e01-9208-5797b923144b/jeri2-3261-2080x1387-1024x682.jpg', ratio: 2080 / 1387, caption: 'Casamento em Jericoacoara' },
  { src: '@i/photos/aa46d9dd/e87facf7-f447-4bc6-b116-6abb0b77a2a6/under-secret-forest-gustavofrancofotografia-1153x1440.jpg', ratio: 1480 / 1848, caption: 'Elopement no Rio Grande do Sul' },
  { src: '@i/photos/aa46d9dd/b99a9c26-0559-443d-86ec-882b0c17e27e/uruguay-274-1024x735.jpg', ratio: 3800 / 2728, caption: 'Ensaio no Uruguai' },
  { src: '@i/photos/aa46d9dd/559b1648-6ec7-43b2-bec8-b4cd076b3f3a/la_01_gusfranco-19-1280x1920.jpg', ratio: 1867 / 2800, caption: 'Casamento em Nova Prata, Rio Grande do Sul' },
  { src: '@i/photos/aa46d9dd/7a3e8866-5972-49f3-9527-4cfebcfd32fc/ohluv-3-1024x683.jpg', ratio: 1626 / 1085, caption: 'Freedom' },
  { src: '@i/photos/aa46d9dd/f9808707-ac20-4d60-94d6-383feb5f6d2b/la_01_gusfranco-24-1216x1920.jpg', ratio: 1774 / 2800, caption: 'Gus Franco' },
]

/** Gus's portrait, from the Sobre page of gusfrn.co. */
export const portrait =
  '@i/photos/aa46d9dd/31c20214-dd2d-4fd6-a4b1-fcb1242ceec7/nh_gusfranco-68-1280x1920.jpg'

export const aboutText =
  'A fotografia me encontrou em 2010, quando eu estava focado em estudar música. Sou formado em Fotografia e também pela Academia Internacional de Cinema, e trabalho como diretor de fotografia com experiência em cinema, casais, casamentos, retratos e documentários ao redor do mundo. Confiança é o que me move: confiar no meu olhar e desejar a minha forma de contar histórias.'

export const aboutMore = [
  'Tenho experiência na criação de imagens para grandes marcas, como Sport Club Corinthians Paulista, Realme e Ministério da Cultura.',
  'Jesh De Rox foi um dos meus mentores mais marcantes, mas ao longo da minha jornada tive a oportunidade de aprender com grandes professores na fotografia. Além disso, vivi um período na França estudando arte com a Descobrindo a Normandia, o que ampliou ainda mais meu olhar.',
  'Direção e exibição de curtas-metragens no Museu Catavento e no Instituto Moreira Salles (IMS), São Paulo. Sempre tratei a fotografia com o devido respeito que ela merece, com muito estudo e dedicação. Por conta disso, estou há mais de 15 anos nessa arte.',
]

export const aboutTextEn =
  'Photography found me in 2010, at a time when I was deeply immersed in studying music. I am graduated in Photography and also from the International Academy of Cinema, and I work as a director of photography with experience in cinema, couples, weddings and portraits around the world. Trust is what moves me: trusting my vision and working with people who desire my way of telling stories.'

/** Where the work has run. The credential strip. */
export const published = [
  'Cosmopolitan',
  'Folha de S. Paulo',
  'HuffPost UK',
  'Junebug Weddings',
  'The Washington Times',
  'Metro.co.uk',
  'The Mercury',
  'BoredPanda',
  'Metrópoles',
  'Business Insider',
]

/** Brands the images were made for. */
export const brands = [
  'Sport Club Corinthians Paulista',
  'Realme',
  'Ministério da Cultura',
]

/**
 * Press. The lead quote carries the section; the rest are the shorter
 * citations, each kept in the language it was published in.
 */
export const press = {
  lead: {
    quote:
      "Gustavo's unrelenting commitment to creating images that don't just meet the eyes, but the heart, truly make him stand apart as a true storyteller.",
    source: 'Junebug Weddings',
  },
  awards: [
    { title: 'Best of The Best', source: 'Junebug Weddings', note: '2016 e 2017' },
    { title: 'Pré-selecionado', source: 'Paraty Em Foco', note: 'Festival Internacional de Fotografia' },
    { title: 'Publicado', source: 'Junebug Weddings', note: 'Destination wedding em Jericoacoara' },
  ],
  quotes: [
    { quote: 'A Creative Visionary of Love', source: 'Praise Wedding' },
    { quote: 'Mágico', source: 'Mariée Weddings' },
    { quote: 'Meaningful portraits', source: 'LaBride' },
    {
      quote: 'Sus imágenes nos hacen recordar esas historias salidas de cuentos de hadas',
      source: 'El Mejor Sí',
    },
    {
      quote:
        'Encontrei o fotógrafo dos meus sonhos. Uma pessoa espontânea, inspirada, criativa, com uma luz própria e que entende o clima do casal.',
      source: 'Manu, para Mariée Weddings',
    },
  ],
}

export const services = [
  {
    n: '01',
    name: 'Casamento Intimista',
    desc: 'Casamentos pequenos, em casa, na praia, na floresta ou na cidade, fotografados sem protocolo e sem pose armada. O dia acontece, eu documento.',
  },
  {
    n: '02',
    name: 'Elopement',
    desc: 'Dois noivos, um lugar difícil de chegar e nenhuma plateia. Islândia, Tailândia, Ibiza, Espanha, dunas e florestas do sul do Brasil.',
  },
  {
    n: '03',
    name: 'Destination Wedding',
    desc: 'Cobertura completa de casamento fora de casa, do drink de boas-vindas à festa, com planejamento a distância e equipe em campo.',
  },
  {
    n: '04',
    name: 'Retrato e Ensaio',
    desc: 'Ensaio de casal, ensaio feminino, retrato autoral e documentário. Trabalho em luz natural e em luz cinematográfica construída.',
  },
  {
    n: '05',
    name: 'Direção de Fotografia',
    desc: 'Direção de fotografia para cinema e publicidade, com curtas dirigidos e exibidos no Museu Catavento e no Instituto Moreira Salles.',
  },
  {
    n: '06',
    name: 'Mentoria',
    desc: 'Mentoria de fotografia para quem está construindo um olhar próprio, com leitura de portfólio, tratamento e direção de ensaio.',
  },
]

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

export type Photo = {
  full: string
  mid: string
  thumb: string
  w: number
  h: number
  cap?: string
  alt?: string
  exif?: Record<string, string>
}

export type StorySummary = {
  id: string
  kind: 'ensaio' | 'galeria' | 'selecao'
  title: string
  subtitle: string
  /** The raw tag from the old blog. Kept for reference, not shown. */
  category: string
  /** Hand-assigned bucket the Histórias filter runs on. */
  group: string
  date: string
  published: string
  place: string
  count: number
  source: string
  claps: number
  cover: Pick<Photo, 'full' | 'mid' | 'thumb' | 'w' | 'h'>
  preview: Pick<Photo, 'thumb' | 'mid' | 'w' | 'h'>[]
}

export type StoryFull = {
  id: string
  title: string
  subtitle: string
  texts: string[]
  source: string
  photos: Photo[]
}

export const stories = indexJson as StorySummary[]

export const totalPhotos = stories.reduce((n, s) => n + s.count, 0)

/** Loads one story's full photo list. Cached, so reopening is instant. */
const cache = new Map<string, Promise<StoryFull>>()
export function loadStory(id: string): Promise<StoryFull> {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}stories/${id}.json`).then((r) => {
      if (!r.ok) throw new Error(`story ${id}: ${r.status}`)
      return r.json() as Promise<StoryFull>
    })
    // A failed fetch must not be cached, or a retry can never succeed.
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}

/**
 * The marquee strip under the hero. Wide frames only, one per story, taken
 * across the whole body of work rather than from the most recent jobs.
 */
export const marqueeRowOne = [
  '@i/photos/aa46d9dd/7dd30fd7-0499-4261-99dd-642e55a5f1a0/gus_franco_casamento_florianopolis_neon40-1024x593.jpg',
  '@i/photos/aa46d9dd/da3c019f-b60c-4fdc-95d7-1d912a696613/gus_franco_o_silencio_da_forja_7_punhos_em_silencio-1024x683.jpg',
  '@i/photos/aa46d9dd/45beeba3-098b-4bc7-b309-aff4aa6a534a/dscf1749-1024x682.jpeg',
  '@i/photos/aa46d9dd/27124544-3159-4222-bd6a-c66171a0f465/gus_jj_rio_de_janeiro-384-1024x683.jpg',
  '@i/photos/aa46d9dd/3c634694-c901-4b20-a27e-54c16ccc34b7/house_wedding_pv_gusfranco-334-1024x683.jpg',
  '@i/photos/aa46d9dd/bcb1a41c-8064-475a-9a72-dbf639a9cb84/unforgiven_gus_franco-45-1024x683.jpg',
  '@i/photos/aa46d9dd/f4cf3a95-d62e-415f-989d-489e73c5dc51/mirroredge-4-1024x683.jpg',
  '@i/photos/aa46d9dd/43225681-0554-412d-a6d5-042048c1c367/punta_cana-131-1024x682.jpg',
  '@i/blog/1230/6d2aaff9-6c57-4ac7-91b2-843625614e5e/1300_09f5797b-915e-4761-9b12-72b10a4ff795.jpg',
  '@i/blog/1230/8c1b4970-95bb-426f-9549-7ab90d6395a2/1300_13317ab6-3789-4170-92c3-b140750f1f21.jpg',
  '@i/photos/aa46d9dd/c95babf6-8eec-47da-ad22-e733dee498ca/gustavo-franco-urubici-travel23-1024x682.jpg',
  '@i/blog/1230/c5c71ba4-589c-4352-8c7f-fb39ceae5a05/1300_d10b8073-7e2e-49dd-97e2-bfff8f153f31.jpg',
  '@i/blog/1230/68d8b53a-c336-4a12-aac6-c80484b3b0b1/1300_fe71fa0a-f7ef-4f58-b1ab-fc4dfef6f9dc.jpg',
  '@i/blog/1230/1fab3f04-d01d-45a1-ab22-8dcf438cc069/1300_91f559e6-b08c-49d1-9b39-2bf35b59d6ae.jpg',
  '@c/blog/1230/02864e2f-8f13-4f50-9c8f-cd1a9e2eca34/1300_cf1e3f0b-6a3b-46f9-b8de-2da69bb90ec8.jpg',
  '@c/blog/1230/326571da-f78b-4a23-add4-4831778b138b/1300_9c3b4778-5255-48e5-b14f-54903d608c13.jpg',
  '@c/blog/1230/afef8778-7369-485e-bd2d-aca43bf253b6/1300_e9188c21-10ff-4870-a419-76ea8d111936.png',
  '@c/blog/1230/86afb023-2b23-45b2-87e3-e6501f892512/1300_8e231a0c-9429-442d-9c67-65d82b4136f4.jpg',
] as const

export const marqueeRowTwo = [
  '@c/blog/1230/2412e817-a914-46db-8e4c-e388e8f01dad/1300_f560adc4-7d76-400b-b0d6-8beffa6ff81a.jpg',
  '@c/blog/1230/77d44c87-bfa2-46f3-9383-1ed2dc5b3430/1300_3170fb87-407c-43d1-bbbb-fd512bfebd9e.jpg',
  '@c/blog/1230/1919ddf6-0d15-41c1-9f29-b441c696f7cf/1300_151a9f45-3ba8-4ae7-9de0-b028432f8344.jpg',
  '@c/blog/1230/c6155faf-9a9f-4c52-9839-ae896a0cec44/1300_f9c220c1-b0ef-4ae7-a5ba-75c244dd059b.jpg',
  '@c/blog/1230/98555590-a58d-41a8-a774-3751369a7698/1300_18ff6e3e-5285-4ebe-baa1-bda02b47533f.jpg',
  '@c/blog/1230/4a3803ff-f45b-4f24-ab7a-f24431627286/1300_183118d8-d580-4859-bd5d-b1fde1653a85.jpg',
  '@c/blog/1230/f36d08ce-2892-4f9a-9c5d-b1d043138a29/1300_bdf895a4-e986-4832-8e0b-b50b7802cfe6.jpg',
  '@c/blog/1230/7fdff68c-bd57-44f7-aa0a-9bb5c016bead/1300_7a02eba8-ca3b-46af-937e-57d387f67ad5.jpg',
  '@c/blog/1230/8fe2f827-8df6-4113-a83f-8908d2e9d98c/1300_fd3a3650-160f-4e0a-b78f-388d7a888e86.jpg',
  '@c/blog/1230/e1a3f2f1-874e-4ed7-850f-60a0c6ff0674/1300_cf9a9d7c-5ce6-4af6-9de3-5f1bb8ea025a.jpg',
  '@c/blog/1230/6966a703-4048-4dc9-a5ec-805196898e12/1300_bf6adda5-7ab2-4004-a79e-ea15a9ef31bb.jpg',
  '@c/blog/1230/232354b0-4eb7-4e3f-a7eb-521b568b0538/1300_d68003ad-939e-4223-a575-022f1240b092.jpg',
  '@c/blog/1230/b8cb4dc4-a3f4-4a5f-9b97-1145c3876980/1300_aa9bc5b5-b5c8-400d-9c49-c20a32f1e08f.jpg',
  '@c/photos/aa46d9dd/a5c3103b-e7f5-4ebe-b37a-36c8f5153638/italiamm-9471-1024x682.jpg',
  '@c/photos/aa46d9dd/326fdb39-5b8d-415c-9a07-b92d012d910b/8-sabrinagilmar-1024x682.jpg',
  '@c/photos/aa46d9dd/6779fb5f-0ed9-4ba9-a45e-1de92b2ca5da/jeri1-7214-1024x682.jpg',
  '@c/photos/aa46d9dd/c18f4c2e-57e6-418e-9842-a54029cad791/pri-bride-dream-gustavo-franco-0629-1024x682.jpg',
  '@i/photos/aa46d9dd/e5bce29a-7995-479e-bc58-df75bca648a8/lost-in-amsterdam-high-1-2-1024x631.jpg',
] as const
