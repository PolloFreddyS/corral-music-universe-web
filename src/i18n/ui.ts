/**
 * Interface strings. `es` is typed against `en`, so a missing or extra key is a
 * type error (`npm run check`). Song titles, poem titles, lyrics and the book
 * itself are never translated: they live in content data, not here.
 */
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const en = {
  'meta.siteDescription':
    'Corral Music Universe is an independent, human-directed music project by Freddy Santana: original poetry turned into alternative rock, emo-punk, nu-metal, reggae and the occasional gloriously absurd anthem.',
  'meta.ogLocale': 'en_US',

  'skip': 'Skip to content',
  'nav.label': 'Main',
  'nav.home': 'Home',
  'nav.music': 'Music',
  'nav.about': 'About',
  'nav.book': 'The Book',
  'nav.links': 'Listen & Follow',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',
  'lang.label': 'Language',
  'lang.switchTo': 'Ver en español',
  'lang.current': 'English',

  'home.title': 'Official site',
  'home.latest': 'Latest release',
  'home.listenNow': 'Listen now',
  'home.listenOn': 'Listen on',
  'home.details': 'Release details',
  'home.featured': 'From the catalog',
  'home.allMusic': 'All music',
  'home.manifestoKicker': 'Manifesto',
  'home.manifesto1':
    'Every song here started as words on a page. A poem, a joke between friends, a night that would not end.',
  'home.manifesto2':
    'The writing and the direction are human. The production uses AI as an instrument — and we say so openly.',
  'home.manifesto3':
    'The rule is simple: the music must sound professional, even when the subject is completely absurd.',
  'home.manifestoLink': 'Read the story',
  'home.bookKicker': 'Where it begins',
  'home.bookBody':
    'Before Corral Music Universe had a sound, it had a book of poems. Several of those poems became songs.',
  'home.bookCta': 'Discover the book',
  'home.followKicker': 'Listen & follow',

  'music.title': 'Music',
  'music.intro': 'Albums and singles from Corral Music Universe, newest first.',
  'music.filterLabel': 'Filter by release type',
  'music.all': 'All',
  'music.albums': 'Albums',
  'music.eps': 'EPs',
  'music.singles': 'Singles',
  'music.empty': 'Nothing here yet.',
  'music.tracksCount': '{n} tracks',
  'music.trackCount1': '1 track',

  'type.album': 'Album',
  'type.ep': 'EP',
  'type.single': 'Single',

  'release.tracklist': 'Tracklist',
  'release.story': 'The story',
  'release.listen': 'Listen',
  'release.credits': 'Credits',
  'release.fromPoem': 'From the poem',
  'release.poemsHeading': 'Poems behind the songs',
  'release.poemsBody': 'Each track on this release began as a poem in',
  'release.related': 'More from the catalog',
  'release.prev': 'Previous release',
  'release.next': 'Next release',
  'release.released': 'Released',
  'release.back': 'Back to all music',
  'release.player': 'Player',
  'release.playerLoad': 'Load the Spotify player',
  'release.playerNote':
    'The player is loaded from Spotify only when you ask for it. Spotify may set its own cookies.',
  'release.playerTitle': 'Spotify player for',
  'release.creditsPending': 'Full credits will be published once confirmed.',

  'art.pending': 'Official artwork pending',
  'art.coverOf': 'Cover art for',

  'about.title': 'About',
  'about.kicker': 'The story',
  'about.lede':
    'Corral Music Universe is what happens when a notebook of poems refuses to stay quiet.',
  'about.h.origin': 'Words first',
  'about.p.origin':
    'Freddy Santana started with poetry: pages about love, the soul and the passing of time, written between the numbers of the day and the words of the night. Those poems became La Fórmula del Verso. Later, some of them asked for more than a page. They asked for guitars.',
  'about.h.direction': 'A human at the wheel',
  'about.p.direction':
    'Freddy writes, chooses and directs. Every lyric starts from Freddy’s own words, and every release is Freddy’s call — from the first verse to the final mix.',
  'about.h.ai': 'AI as an instrument, said out loud',
  'about.p.ai':
    'The music is produced with AI-assisted tools. We are not hiding that, and we are not selling it as a gimmick. It is how an independent creator with a full notebook can turn it into records that sound the way they were imagined.',
  'about.h.range': 'No single genre',
  'about.p.range':
    'Alternative rock, emo-punk, nu-metal, reggae — the genre follows the poem. A quiet one might become a slow-burning ballad; an angry one, a wall of guitars.',
  'about.h.two': 'Two sides of the same Corral',
  'about.p.two':
    'Some songs are about heartbreak and the passing of time. Others are about a teammate who stole your kill. Both get the same care in production. Seriousness is a production standard, not a mood.',
  'about.h.gallos': 'Los Gallos Sin Planes',
  'about.p.gallos':
    'The Corral is also a group of friends who game together: Los Gallos Sin Planes. Their in-jokes, rivalries and long nights of matches inspire the project’s comedic songs.',
  'about.h.vision': 'Where it is going',
  'about.p.vision':
    'More poems turned into songs, in English and in Spanish. More albums built with the same rule: honest words, professional sound. One release at a time.',
  'about.factsHeading': 'In plain terms',
  'about.fact.independent': 'Independent. No record label behind it.',
  'about.fact.human': 'Human-written lyrics and human creative direction.',
  'about.fact.ai': 'AI-assisted music production, disclosed.',
  'about.fact.languages': 'Songs in English and Spanish.',

  'book.title': 'The Book',
  'book.kicker': 'Poetry',
  'book.by': 'by',
  'book.originalLanguage': 'Written in Spanish. The poems are shown in their original language.',
  'book.connectionsHeading': 'From poem to song',
  'book.connectionsIntro':
    'These songs on More Human Than Ever were written from poems in the book. The poem keeps its Spanish title; the song found an English voice.',
  'book.poem': 'Poem',
  'book.song': 'Song',
  'book.excerptsHeading': 'Selected verses',
  'book.coverPending': 'Approved cover pending',
  'book.readHeading': 'Read the book',
  'book.download': 'Read the book (PDF)',
  'book.downloadMeta': 'Free · PDF · {pages} pages · Spanish',
  'book.readPending':
    'Details on where to read La Fórmula del Verso will be shared here once they are confirmed.',

  'links.title': 'Listen & Follow',
  'links.intro': 'Official Corral Music Universe profiles. These are the only verified links.',
  'links.open': 'Open',
  'links.contactHeading': 'Contact',
  'links.contactPending': 'A public contact address will be published here once confirmed.',
  'links.newTab': '(opens in a new tab)',

  'footer.tagline': 'Independent. Human-directed. AI-assisted.',
  'footer.rights': 'All rights reserved.',
  'footer.navHeading': 'Explore',
  'footer.listenHeading': 'Listen',

  'notFound.title': 'Page not found',
  'notFound.body': 'This page does not exist. Maybe it is still a poem.',
  'notFound.home': 'Go home',
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
  'meta.siteDescription':
    'Corral Music Universe es un proyecto musical independiente dirigido por Freddy Santana: poesía original convertida en rock alternativo, emo-punk, nu-metal, reggae y algún que otro himno gloriosamente absurdo.',
  'meta.ogLocale': 'es_ES',

  'skip': 'Saltar al contenido',
  'nav.label': 'Principal',
  'nav.home': 'Inicio',
  'nav.music': 'Música',
  'nav.about': 'Historia',
  'nav.book': 'El Libro',
  'nav.links': 'Escucha y sigue',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar menú',
  'lang.label': 'Idioma',
  'lang.switchTo': 'View in English',
  'lang.current': 'Español',

  'home.title': 'Sitio oficial',
  'home.latest': 'Último lanzamiento',
  'home.listenNow': 'Escuchar ahora',
  'home.listenOn': 'Escuchar en',
  'home.details': 'Ver lanzamiento',
  'home.featured': 'Del catálogo',
  'home.allMusic': 'Toda la música',
  'home.manifestoKicker': 'Manifiesto',
  'home.manifesto1':
    'Cada canción aquí empezó como palabras en una página. Un poema, un chiste entre amigos, una noche que no terminaba.',
  'home.manifesto2':
    'La escritura y la dirección son humanas. La producción usa la IA como un instrumento — y lo decimos abiertamente.',
  'home.manifesto3':
    'La regla es simple: la música tiene que sonar profesional, aunque el tema sea completamente absurdo.',
  'home.manifestoLink': 'Lee la historia',
  'home.bookKicker': 'Donde empieza todo',
  'home.bookBody':
    'Antes de que Corral Music Universe tuviera un sonido, tenía un libro de poemas. Varios de esos poemas se convirtieron en canciones.',
  'home.bookCta': 'Descubre el libro',
  'home.followKicker': 'Escucha y sigue',

  'music.title': 'Música',
  'music.intro': 'Álbumes y sencillos de Corral Music Universe, del más reciente al más antiguo.',
  'music.filterLabel': 'Filtrar por tipo de lanzamiento',
  'music.all': 'Todo',
  'music.albums': 'Álbumes',
  'music.eps': 'EPs',
  'music.singles': 'Sencillos',
  'music.empty': 'Todavía no hay nada aquí.',
  'music.tracksCount': '{n} canciones',
  'music.trackCount1': '1 canción',

  'type.album': 'Álbum',
  'type.ep': 'EP',
  'type.single': 'Sencillo',

  'release.tracklist': 'Canciones',
  'release.story': 'La historia',
  'release.listen': 'Escuchar',
  'release.credits': 'Créditos',
  'release.fromPoem': 'Del poema',
  'release.poemsHeading': 'Los poemas detrás de las canciones',
  'release.poemsBody': 'Cada canción de este lanzamiento empezó como un poema en',
  'release.related': 'Más del catálogo',
  'release.prev': 'Lanzamiento anterior',
  'release.next': 'Lanzamiento siguiente',
  'release.released': 'Publicado',
  'release.back': 'Volver a toda la música',
  'release.player': 'Reproductor',
  'release.playerLoad': 'Cargar el reproductor de Spotify',
  'release.playerNote':
    'El reproductor se carga desde Spotify solo cuando lo pides. Spotify puede usar sus propias cookies.',
  'release.playerTitle': 'Reproductor de Spotify para',
  'release.creditsPending': 'Los créditos completos se publicarán cuando estén confirmados.',

  'art.pending': 'Arte oficial pendiente',
  'art.coverOf': 'Portada de',

  'about.title': 'Historia',
  'about.kicker': 'La historia',
  'about.lede':
    'Corral Music Universe es lo que pasa cuando una libreta de poemas se niega a quedarse callada.',
  'about.h.origin': 'Primero, las palabras',
  'about.p.origin':
    'Freddy Santana empezó con la poesía: páginas sobre el amor, el alma y el paso del tiempo, escritas entre los números del día y las palabras de la noche. Esos poemas se convirtieron en La Fórmula del Verso. Después, algunos pidieron más que una página. Pidieron guitarras.',
  'about.h.direction': 'Un humano al volante',
  'about.p.direction':
    'Freddy escribe, elige y dirige. Cada letra parte de sus propias palabras y cada lanzamiento es decisión suya — desde el primer verso hasta la mezcla final.',
  'about.h.ai': 'La IA como instrumento, dicho en voz alta',
  'about.p.ai':
    'La música se produce con herramientas asistidas por IA. No lo escondemos y tampoco lo vendemos como truco. Es la forma en que un creador independiente, con una libreta llena, puede convertirla en discos que suenen como fueron imaginados.',
  'about.h.range': 'Ningún género único',
  'about.p.range':
    'Rock alternativo, emo-punk, nu-metal, reggae — el género sigue al poema. Uno tranquilo puede volverse una balada lenta; uno con rabia, un muro de guitarras.',
  'about.h.two': 'Dos lados del mismo Corral',
  'about.p.two':
    'Algunas canciones hablan del desamor y del paso del tiempo. Otras, de un compañero que te robó la kill. Las dos reciben el mismo cuidado en la producción. La seriedad es un estándar de producción, no un estado de ánimo.',
  'about.h.gallos': 'Los Gallos Sin Planes',
  'about.p.gallos':
    'El Corral también es un grupo de amigos que juegan juntos: Los Gallos Sin Planes. Sus chistes internos, rivalidades y partidas de madrugada inspiran las canciones de comedia del proyecto.',
  'about.h.vision': 'Hacia dónde va',
  'about.p.vision':
    'Más poemas convertidos en canciones, en inglés y en español. Más álbumes hechos con la misma regla: palabras honestas, sonido profesional. Un lanzamiento a la vez.',
  'about.factsHeading': 'En pocas palabras',
  'about.fact.independent': 'Independiente. Sin disquera detrás.',
  'about.fact.human': 'Letras escritas por un humano y dirección creativa humana.',
  'about.fact.ai': 'Producción musical asistida por IA, declarada.',
  'about.fact.languages': 'Canciones en inglés y en español.',

  'book.title': 'El Libro',
  'book.kicker': 'Poesía',
  'book.by': 'de',
  'book.originalLanguage': 'Escrito en español. Los poemas se muestran en su idioma original.',
  'book.connectionsHeading': 'Del poema a la canción',
  'book.connectionsIntro':
    'Estas canciones de More Human Than Ever se escribieron a partir de poemas del libro. El poema conserva su título en español; la canción encontró una voz en inglés.',
  'book.poem': 'Poema',
  'book.song': 'Canción',
  'book.excerptsHeading': 'Versos seleccionados',
  'book.coverPending': 'Portada aprobada pendiente',
  'book.readHeading': 'Leer el libro',
  'book.download': 'Leer el libro (PDF)',
  'book.downloadMeta': 'Gratis · PDF · {pages} páginas · Español',
  'book.readPending':
    'Los detalles sobre dónde leer La Fórmula del Verso se compartirán aquí cuando estén confirmados.',

  'links.title': 'Escucha y sigue',
  'links.intro': 'Perfiles oficiales de Corral Music Universe. Estos son los únicos enlaces verificados.',
  'links.open': 'Abrir',
  'links.contactHeading': 'Contacto',
  'links.contactPending': 'Una dirección de contacto pública se publicará aquí cuando esté confirmada.',
  'links.newTab': '(se abre en una pestaña nueva)',

  'footer.tagline': 'Independiente. Dirigido por humanos. Asistido por IA.',
  'footer.rights': 'Todos los derechos reservados.',
  'footer.navHeading': 'Explora',
  'footer.listenHeading': 'Escucha',

  'notFound.title': 'Página no encontrada',
  'notFound.body': 'Esta página no existe. Quizás todavía es un poema.',
  'notFound.home': 'Ir al inicio',
};

export const ui: Record<Locale, Record<UIKey, string>> = { en, es };

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'es';
}

export function useT(locale: Locale) {
  return (key: UIKey, vars?: Record<string, string | number>) => {
    let s: string = ui[locale][key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}
