import type { DocTopic } from './types';
import { imgurRoute } from './routes/uploader/imgur';
import { n_8uploadsRoute } from './routes/uploader/8uploads';
import { freeimageRoute } from './routes/uploader/freeimage';
import { imghippoRoute } from './routes/uploader/imghippo';
import { catboxRoute } from './routes/uploader/catbox';
import { litterboxRoute } from './routes/uploader/litterbox';
import { uguuRoute } from './routes/uploader/uguu';
import { imgbbRoute } from './routes/uploader/imgbb';
import { yourimageshareRoute } from './routes/uploader/yourimageshare';
import { gofileRoute } from './routes/uploader/gofile';
import { tiktokRoute } from './routes/downloader/tiktok';
import { instagramRoute } from './routes/downloader/instagram';
import { youtubeRoute } from './routes/downloader/youtube';
import { spotifyRoute } from './routes/downloader/spotify';
import { soundcloudRoute } from './routes/downloader/soundcloud';
import { xRoute } from './routes/downloader/x';
import { threadsRoute } from './routes/downloader/threads';
import { facebookRoute } from './routes/downloader/facebook';
import { bilibiliRoute } from './routes/downloader/bilibili';
import { snackvideoRoute } from './routes/downloader/snackvideo';
import { capcutRoute } from './routes/downloader/capcut';
import { cocofunRoute } from './routes/downloader/cocofun';
import { douyinRoute } from './routes/downloader/douyin';
import { youtube_communityRoute } from './routes/downloader/youtube-community';
import { githubRoute } from './routes/downloader/github';
import { gdriveRoute } from './routes/downloader/gdrive';
import { mediafireRoute } from './routes/downloader/mediafire';
import { megaRoute } from './routes/downloader/mega';
import { npmRoute } from './routes/downloader/npm';
import { pinterestRoute } from './routes/downloader/pinterest';
import { rednoteRoute } from './routes/downloader/rednote';
import { scribdRoute } from './routes/downloader/scribd';
import { sfileRoute } from './routes/downloader/sfile';
import { teraboxRoute } from './routes/downloader/terabox';
import { dailymotionRoute } from './routes/downloader/dailymotion';
import { phRoute } from './routes/downloader/ph';
import { pornhdRoute } from './routes/downloader/pornhd';
import { xnxxRoute } from './routes/downloader/xnxx';
import { straitstimesRoute } from './routes/news/straitstimes';
import { cnaRoute } from './routes/local-news/cna';
import { bbcRoute } from './routes/news/bbc';
import { cnnRoute } from './routes/news/cnn';
import { mothershipRoute } from './routes/news/mothership';
import { aljazeeraRoute } from './routes/news/aljazeera';
import { abcRoute } from './routes/news/abc';
import { washingtonpostRoute } from './routes/news/washingtonpost';
import { apnewsRoute } from './routes/news/apnews';
import { foxnewsRoute } from './routes/news/foxnews';
import { reutersRoute } from './routes/news/reuters';
import { cbsRoute } from './routes/news/cbs';
import { nytimesRoute } from './routes/news/nytimes';
import { msnowRoute } from './routes/news/msnow';
import { wsjRoute } from './routes/news/wsj';
import { guardianRoute } from './routes/news/guardian';
import { timeRoute } from './routes/news/time';
import { skynewsRoute } from './routes/news/skynews';
import { nprRoute } from './routes/news/npr';
import { bloombergRoute } from './routes/news/bloomberg';
import { thetimesRoute } from './routes/news/thetimes';
import { dwRoute } from './routes/news/dw';
import { nhlRoute } from './routes/news/nhl';
import { news24Route } from './routes/news/news24';
import { newsweekRoute } from './routes/news/newsweek';
import { yahoonewsRoute } from './routes/news/yahoonews';
import { usnewsRoute } from './routes/news/usnews';
import { nbcnewsRoute } from './routes/news/nbcnews';
import { nasanewsRoute } from './routes/news/nasanews';
import { freepRoute } from './routes/news/freep';
import { massliveRoute } from './routes/news/masslive';
import { wmtvRoute } from './routes/news/wmtv';
import { forbesRoute } from './routes/news/forbes';
import { euronewsRoute } from './routes/news/euronews';
import { usatodayRoute } from './routes/news/usatoday';
import { independentRoute } from './routes/news/independent';
import { punchRoute } from './routes/news/punch';
import { detikRoute } from './routes/local-news/detik';
import { kompasRoute } from './routes/local-news/kompas';
import { cnnindonesiaRoute } from './routes/local-news/cnnindonesia';
import { liputan6Route } from './routes/local-news/liputan6';
import { sindonewsRoute } from './routes/local-news/sindonews';
import { antaranewsRoute } from './routes/local-news/antaranews';
import { bmkgRoute } from './routes/local-news/bmkg';
import { tempoRoute } from './routes/local-news/tempo';
import { bisnisRoute } from './routes/local-news/bisnis';
import { okezoneRoute } from './routes/local-news/okezone';
import { cnbcRoute } from './routes/local-news/cnbc';
import { timesRoute } from './routes/local-news/times';
import { inilahRoute } from './routes/local-news/inilah';
import { biRoute } from './routes/local-news/bi';
import { hukumonlineRoute } from './routes/local-news/hukumonline';
import { mediaindonesiaRoute } from './routes/local-news/mediaindonesia';
import { beritajakartaRoute } from './routes/local-news/beritajakarta';
import { tangerangkotaRoute } from './routes/local-news/tangerangkota';
import { kompastvRoute } from './routes/local-news/kompastv';
import { vivaRoute } from './routes/local-news/viva';
import { inewsRoute } from './routes/local-news/inews';
import { terkiniRoute } from './routes/local-news/terkini';
import { merdekaRoute } from './routes/local-news/merdeka';

import { jakartapostRoute } from './routes/local-news/jakartapost';
import { removebgRoute } from './routes/image-tools/removebg';
import { upscaleRoute } from './routes/image-tools/upscale';
import { sepiaRoute } from './routes/image-tools/sepia';
import { invertRoute } from './routes/image-tools/invert';
import { flipRoute } from './routes/image-tools/flip';
import { pixelateRoute } from './routes/image-tools/pixelate';
import { round_cornersRoute } from './routes/image-tools/round-corners';
import { splitRoute } from './routes/image-tools/split';
import { add_noiseRoute } from './routes/image-tools/add-noise';
import { blurRoute } from './routes/image-tools/blur';
import { sharpenRoute } from './routes/image-tools/sharpen';
import { solarizeRoute } from './routes/image-tools/solarize';
import { glowRoute } from './routes/image-tools/glow';
import { posterizeRoute } from './routes/image-tools/posterize';
import { blurfaceRoute } from './routes/image-tools/blurface';
import { enhanceRoute } from './routes/image-tools/enhance';
import { qr_generatorRoute } from './routes/qr-tools/qr-generator';
import { qr_decoderRoute } from './routes/qr-tools/qr-decoder';
import { tinyurlRoute } from './routes/shortlink-tools/tinyurl';
import { isgdRoute } from './routes/shortlink-tools/isgd';
import { vgdRoute } from './routes/shortlink-tools/vgd';
import { ulvisRoute } from './routes/shortlink-tools/ulvis';
import { dagdRoute } from './routes/shortlink-tools/dagd';
import { cleanuriRoute } from './routes/shortlink-tools/cleanuri';
import { llamaRoute } from './routes/ai-chat/llama';
import { groqRoute } from './routes/ai-chat/groq';
import { qwenRoute } from './routes/ai-chat/qwen';
import { minimaxRoute } from './routes/ai-chat/minimax';
import { deepseekRoute } from './routes/ai-chat/deepseek';
import { deepseek_flashRoute } from './routes/ai-chat/deepseek-flash';
import { kimiRoute } from './routes/ai-chat/kimi';
import { glm_5_1Route } from './routes/ai-chat/glm-5.1';
import { nemotronRoute } from './routes/ai-chat/nemotron';
import { chatgptRoute } from './routes/ai-chat/chatgpt';
import { graniteRoute } from './routes/ai-chat/granite';
import { mistralRoute } from './routes/ai-chat/mistral';
import { quillbotRoute } from './routes/ai-chat/quillbot';
import { perplexityRoute } from './routes/ai-chat/perplexity';
import { geminiRoute } from './routes/ai-chat/gemini';
import { pollinationsRoute } from './routes/ai-chat/pollinations';
import { asyntRoute } from './routes/ai-chat/asynt';
import { muslimaiRoute } from './routes/ai-chat/muslimai';
import { gitaaiRoute } from './routes/ai-chat/gitaai';
import { powerbrainaiRoute } from './routes/ai-chat/powerbrainai';
import { feloRoute } from './routes/ai-chat/felo';
import { mathgptRoute } from './routes/ai-chat/mathgpt';
import { jeevesRoute } from './routes/ai-chat/jeeves';
import { sahabataiRoute } from './routes/ai-chat/sahabatai';
import { ayaRoute } from './routes/ai-chat/aya';
import { ansariRoute } from './routes/ai-chat/ansari';
import { olabibaRoute } from './routes/ai-chat/olabiba';
import { gemmaRoute } from './routes/ai-chat/gemma';
import { deepseek_r1Route } from './routes/ai-chat/deepseek-r1';
import { feelbetterRoute } from './routes/ai-chat/feelbetter';
import { fluxRoute } from './routes/ai-image/flux';
import { flux1Route } from './routes/ai-image/flux1';
import { magicstudioRoute } from './routes/ai-image/magicstudio';
import { zimageturboRoute } from './routes/ai-image/zimageturbo';
import { qwenimageRoute } from './routes/ai-image/qwenimage';
import { ernieimageRoute } from './routes/ai-image/ernieimage';
import { ideogramRoute } from './routes/ai-image/ideogram';
import { somniumRoute } from './routes/ai-image/somnium';
import { gempa_terkiniRoute } from './routes/bmkg/gempa-terkini';
import { gempa_terbaruRoute } from './routes/bmkg/gempa-terbaru';
import { gempa_dirasakanRoute } from './routes/bmkg/gempa-dirasakan';
import { weatherRoute } from './routes/informations/weather';
import { iplookupRoute } from './routes/informations/iplookup';
import { myipRoute } from './routes/informations/myip';
import { webserverRoute } from './routes/informations/webserver';
import { hostingProviderRoute } from './routes/informations/hosting-provider';
import { pingRoute } from './routes/informations/ping';
import { urlParserRoute } from './routes/informations/url-parser';
import { mxlookupRoute } from './routes/informations/mx-lookup';
import { nslookupRoute } from './routes/informations/ns-lookup';
import { dnsvalidationRoute } from './routes/informations/dns-validation';
import { dnsrecordsRoute } from './routes/informations/dns-records';
import { dmarcvalidationRoute } from './routes/informations/dmarc-validation';
import { ipblacklistRoute } from './routes/informations/ip-blacklist';
import { verifyemailRoute } from './routes/informations/verify-email';
import { ipv4ToIpv6Route } from './routes/informations/ipv4-to-ipv6';
import { ipToDecimalRoute } from './routes/informations/ip-to-decimal';
import { ipv6CompatibilityRoute } from './routes/informations/ipv6-compatibility';
import { ipv6GeneratorRoute } from './routes/informations/ipv6-generator';
import { ipv6CidrRoute } from './routes/informations/ipv6-cidr';
import { ipv6RangeRoute } from './routes/informations/ipv6-range';
import { subnetRoute } from './routes/informations/subnet';
import { ipWhoisRoute } from './routes/informations/ip-whois';
import { macLookupRoute } from './routes/informations/mac-lookup';
import { passwordGeneratorRoute } from './routes/informations/password-generator';
import { md5GeneratorRoute } from './routes/informations/md5-generator';
import { kodeposRoute } from './routes/informations/kodepos';
import { jadwal_tvRoute } from './routes/informations/jadwal-tv';
import { jadwal_bolaRoute } from './routes/informations/jadwal-bola';
import { bratRoute } from './routes/maker/brat';
import { fakedanaRoute } from './routes/maker/fakedana';
import { iqcRoute } from './routes/maker/iqc';
import { fakemlRoute } from './routes/maker/fakeml';
import { nokiaRoute } from './routes/maker/nokia';
import { emojimixRoute } from './routes/maker/emojimix';
import { yappingRoute } from './routes/maker/yapping';
import { darksystemRoute } from './routes/maker/darksystem';
import { fakeffRoute } from './routes/maker/fakeff';
import { snbpRoute } from './routes/maker/snbp';
import { snbtRoute } from './routes/maker/snbt';
import { sertifikatTololRoute } from './routes/maker/sertifikat-tolol';
import { kuitansiRoute, kwitansiRoute } from './routes/maker/kuitansi';
import { carbonRoute } from './routes/maker/carbon';
import { trumpTweetsRoute } from './routes/maker/trumptweets';
import { igfeedRoute } from './routes/maker/igfeed';
import { faketweetRoute } from './routes/maker/faketweet';
import { phlogoRoute } from './routes/maker/phlogo';
import { ytlogoRoute } from './routes/maker/ytlogo';
import { pakustadRoute } from './routes/maker/pakustad';
import { spotifycardRoute } from './routes/maker/spotifycard';
import { fakecommentRoute } from './routes/maker/fakecomment';
import { fakedmRoute } from './routes/maker/fakedm';
import { wantedRoute } from './routes/maker/wanted';
import { wastedRoute } from './routes/maker/wasted';
import { iphoneGalleryRoute } from './routes/maker/iphonegallery';
import { iphoneContextMenuRoute } from './routes/maker/iphonecontextmenu';
import { fakeCanonRoute } from './routes/maker/fakecanon';
import { toBotakRoute } from './routes/ai-image-edit/to-botak';
import { toZombieRoute } from './routes/ai-image-edit/to-zombie';
import { toBlondeRoute } from './routes/ai-image-edit/to-blonde';
import { toBabiRoute } from './routes/ai-image-edit/to-babi';
import { toAnimeRoute } from './routes/ai-image-edit/to-anime';
import { toBrewokRoute } from './routes/ai-image-edit/to-brewok';
import { toChibiRoute } from './routes/ai-image-edit/to-chibi';
import { toDprRoute } from './routes/ai-image-edit/to-dpr';
import { toKacamataRoute } from './routes/ai-image-edit/to-kacamata';
import { toHijabRoute } from './routes/ai-image-edit/to-hijab';
import { toLegoRoute } from './routes/ai-image-edit/to-lego';
import { toMekkahRoute } from './routes/ai-image-edit/to-mekkah';
import { toPeciRoute } from './routes/ai-image-edit/to-peci';
import { toPutihRoute } from './routes/ai-image-edit/to-putih';
import { toHitamRoute } from './routes/ai-image-edit/to-hitam';
import { toTuaRoute } from './routes/ai-image-edit/to-tua';
import { toBayiRoute } from './routes/ai-image-edit/to-bayi';
import { toSingaporeRoute } from './routes/ai-image-edit/to-singapore';
import { toMalaysiaRoute } from './routes/ai-image-edit/to-malaysia';
import { toThailandRoute } from './routes/ai-image-edit/to-thailand';
import { toJawaRoute } from './routes/ai-image-edit/to-jawa';
import { toPilotRoute } from './routes/ai-image-edit/to-pilot';
import { toKantoranRoute } from './routes/ai-image-edit/to-kantoran';
import { toWisudaRoute } from './routes/ai-image-edit/to-wisuda';
import { toHantuRoute } from './routes/ai-image-edit/to-hantu';
import { toVampirRoute } from './routes/ai-image-edit/to-vampir';
import { toCyberpunkRoute } from './routes/ai-image-edit/to-cyberpunk';
import { toKoreaRoute } from './routes/ai-image-edit/to-korea';
import { toJepangRoute } from './routes/ai-image-edit/to-jepang';
import { toArabRoute } from './routes/ai-image-edit/to-arab';
import { toIndiaRoute } from './routes/ai-image-edit/to-india';
import { toDubaiRoute } from './routes/ai-image-edit/to-dubai';
import { toGendutRoute } from './routes/ai-image-edit/to-gendut';
import { toKurusRoute } from './routes/ai-image-edit/to-kurus';
import { toKekarRoute } from './routes/ai-image-edit/to-kekar';
import { toTniRoute } from './routes/ai-image-edit/to-tni';
import { toPolisiRoute } from './routes/ai-image-edit/to-polisi';
import { toDokterRoute } from './routes/ai-image-edit/to-dokter';
import { toPunkRoute } from './routes/ai-image-edit/to-punk';
import { toKriboRoute } from './routes/ai-image-edit/to-kribo';
import { toGondrongRoute } from './routes/ai-image-edit/to-gondrong';
import { toSdmTinggiRoute } from './routes/ai-image-edit/to-sdm-tinggi';
import { toSatanRoute } from './routes/ai-image-edit/to-satan';
import { toVintageRoute } from './routes/ai-image-edit/to-vintage';
import { toBarefaceRoute } from './routes/ai-image-edit/to-bareface';
import { sswebRoute } from './routes/tools/ssweb';
import { web2zipRoute } from './routes/tools/web2zip';
import { ocrRoute } from './routes/tools/ocr';
import { translateRoute } from './routes/tools/translate';
import { deeplRoute } from './routes/tools/deepl';
import { aksarajawaRoute } from './routes/tools/aksarajawa';
import { hitungjarakRoute } from './routes/tools/hitungjarak';
import { base64ToImageRoute } from './routes/tools/base64-to-image';
import { noHokiRoute } from './routes/primbon/no-hoki';
import { tafsirMimpiRoute } from './routes/primbon/tafsir-mimpi';
import { ramalanJodohRoute } from './routes/primbon/ramalan-jodoh';
import { ramalanJodohBaliRoute } from './routes/primbon/ramalan-jodoh-bali';
import { ramalanSuamiIstriRoute } from './routes/primbon/ramalan-suami-istri';
import { ramalanCintaRoute } from './routes/primbon/ramalan-cinta';
import { artiNamaRoute } from './routes/primbon/arti-nama';
import { kecocokanNamaRoute } from './routes/primbon/kecocokan-nama';
import { namaPasanganRoute } from './routes/primbon/nama-pasangan';
import { tanggalJadianRoute } from './routes/primbon/tanggal-jadian';
import { sifatUsahaRoute } from './routes/primbon/sifat-usaha';
import { rejekiHokiRoute } from './routes/primbon/rejeki-hoki';
import { pekerjaanCocokRoute } from './routes/primbon/pekerjaan-cocok';
import { ramalanPitagorasRoute } from './routes/primbon/ramalan-pitagoras';
import { potensiPenyakitRoute } from './routes/primbon/potensi-penyakit';
import { simbolTarotRoute } from './routes/primbon/simbol-tarot';
import { ramalanKartuRoute } from './routes/primbon/ramalan-kartu';
import { fengShuiRoute } from './routes/primbon/feng-shui';
import { ramalanIChingRoute } from './routes/primbon/ramalan-i-ching';
import { hariBaikRoute } from './routes/primbon/hari-baik';
import { hariLaranganRoute } from './routes/primbon/hari-larangan';
import { hariNaasRoute } from './routes/primbon/hari-naas';
import { nagaHariRoute } from './routes/primbon/naga-hari';
import { arahRejekiRoute } from './routes/primbon/arah-rejeki';
import { ramalanPeruntunganRoute } from './routes/primbon/ramalan-peruntungan';
import { wetonRoute } from './routes/primbon/weton';
import { sifatKarakterRoute } from './routes/primbon/sifat-karakter';
import { potensiKeberuntunganRoute } from './routes/primbon/potensi-keberuntungan';
import { memancingIkanRoute } from './routes/primbon/memancing-ikan';
import { masaSuburRoute } from './routes/primbon/masa-subur';
import { zodiakRoute } from './routes/primbon/zodiak';
import { shioRoute } from './routes/primbon/shio';
import { kayuBertuahRoute } from './routes/primbon/kayu-bertuah';
import { batuPermataRoute } from './routes/primbon/batu-permata';
import { pamaliRoute } from './routes/primbon/pamali';
import { tanggalLahirRoute } from './routes/primbon/tanggal-lahir';
import { wetonJodohRoute } from './routes/primbon/weton-jodoh';
import { hariBaikMenikahRoute } from './routes/primbon/hari-baik-menikah';
import { pinterestSearchRoute } from './routes/search/pinterest';
import { youtubeSearchRoute } from './routes/search/youtube';
import { appleMusicSearchRoute } from './routes/search/apple_music';
import { bilibiliSearchRoute } from './routes/search/bilibili';
import { wikipediaSearchRoute } from './routes/search/wikipedia';
import { wikimediaSearchRoute } from './routes/search/wikimedia';
import { tiktokSearchRoute } from './routes/search/tiktok';
import { deezerSearchRoute } from './routes/search/deezer';
import { githubSearchRoute } from './routes/search/github';
import { chordSearchRoute } from './routes/search/chord';




export const docTopics: DocTopic[] = [
  imgurRoute,
  n_8uploadsRoute,
  freeimageRoute,
  imghippoRoute,
  catboxRoute,
  litterboxRoute,
  uguuRoute,
  imgbbRoute,
  yourimageshareRoute,
  gofileRoute,
  tiktokRoute,
  instagramRoute,
  youtubeRoute,
  spotifyRoute,
  soundcloudRoute,
  xRoute,
  threadsRoute,
  facebookRoute,
  bilibiliRoute,
  snackvideoRoute,
  capcutRoute,
  cocofunRoute,
  douyinRoute,
  youtube_communityRoute,
  githubRoute,
  gdriveRoute,
  mediafireRoute,
  megaRoute,
  npmRoute,
  pinterestRoute,
  rednoteRoute,
  scribdRoute,
  sfileRoute,
  teraboxRoute,
  dailymotionRoute,
  phRoute,
  pornhdRoute,
  xnxxRoute,
  straitstimesRoute,
  cnaRoute,
  bbcRoute,
  cnnRoute,
  mothershipRoute,
  aljazeeraRoute,
  abcRoute,
  washingtonpostRoute,
  apnewsRoute,
  foxnewsRoute,
  reutersRoute,
  cbsRoute,
  nytimesRoute,
  msnowRoute,
  wsjRoute,
  guardianRoute,
  timeRoute,
  skynewsRoute,
  nprRoute,
  bloombergRoute,
  thetimesRoute,
  dwRoute,
  nhlRoute,
  news24Route,
  newsweekRoute,
  yahoonewsRoute,
  usnewsRoute,
  nbcnewsRoute,
  nasanewsRoute,
  freepRoute,
  massliveRoute,
  wmtvRoute,
  forbesRoute,
  euronewsRoute,
  usatodayRoute,
  independentRoute,
  punchRoute,
  detikRoute,
  kompasRoute,
  cnnindonesiaRoute,
  liputan6Route,
  sindonewsRoute,
  antaranewsRoute,
  bmkgRoute,
  tempoRoute,
  bisnisRoute,
  okezoneRoute,
  cnbcRoute,
  timesRoute,
  inilahRoute,
  biRoute,
  hukumonlineRoute,
  mediaindonesiaRoute,
  beritajakartaRoute,
  tangerangkotaRoute,
  kompastvRoute,
  vivaRoute,
  inewsRoute,
  terkiniRoute,
  merdekaRoute,
  jakartapostRoute,
  removebgRoute,
  upscaleRoute,
  sepiaRoute,
  invertRoute,
  flipRoute,
  pixelateRoute,
  round_cornersRoute,
  splitRoute,
  add_noiseRoute,
  blurRoute,
  sharpenRoute,
  solarizeRoute,
  glowRoute,
  posterizeRoute,
  blurfaceRoute,
  enhanceRoute,
  qr_generatorRoute,
  qr_decoderRoute,
  tinyurlRoute,
  isgdRoute,
  vgdRoute,
  ulvisRoute,
  dagdRoute,
  cleanuriRoute,
  llamaRoute,
  groqRoute,
  qwenRoute,
  minimaxRoute,
  deepseekRoute,
  deepseek_flashRoute,
  kimiRoute,
  glm_5_1Route,
  nemotronRoute,
  chatgptRoute,
  graniteRoute,
  mistralRoute,
  quillbotRoute,
  perplexityRoute,
  geminiRoute,
  pollinationsRoute,
  asyntRoute,
  muslimaiRoute,
  gitaaiRoute,
  powerbrainaiRoute,
  feloRoute,
  mathgptRoute,
  jeevesRoute,
  sahabataiRoute,
  ayaRoute,
  ansariRoute,
  olabibaRoute,
  gemmaRoute,
  deepseek_r1Route,
  feelbetterRoute,
  fluxRoute,
  flux1Route,
  magicstudioRoute,
  zimageturboRoute,
  qwenimageRoute,
  ernieimageRoute,
  ideogramRoute,
  somniumRoute,
  gempa_terkiniRoute,
  gempa_terbaruRoute,
  gempa_dirasakanRoute,
  weatherRoute,
  iplookupRoute,
  myipRoute,
  webserverRoute,
  hostingProviderRoute,
  pingRoute,
  urlParserRoute,
  mxlookupRoute,
  nslookupRoute,
  dnsvalidationRoute,
  dnsrecordsRoute,
  dmarcvalidationRoute,
  ipblacklistRoute,
  verifyemailRoute,
  ipv4ToIpv6Route,
  ipToDecimalRoute,
  ipv6CompatibilityRoute,
  ipv6GeneratorRoute,
  ipv6CidrRoute,
  ipv6RangeRoute,
  subnetRoute,
  ipWhoisRoute,
  macLookupRoute,
  passwordGeneratorRoute,
  md5GeneratorRoute,
  kodeposRoute,
  jadwal_tvRoute,
  jadwal_bolaRoute,
  bratRoute,
  fakedanaRoute,
  iqcRoute,
  fakemlRoute,
  nokiaRoute,
  emojimixRoute,
  yappingRoute,
  darksystemRoute,
  fakeffRoute,
  snbpRoute,
  snbtRoute,
  sertifikatTololRoute,
  kuitansiRoute,
  kwitansiRoute,
  carbonRoute,
  trumpTweetsRoute,
  igfeedRoute,
  faketweetRoute,
  phlogoRoute,
  ytlogoRoute,
  pakustadRoute,
  spotifycardRoute,
  fakecommentRoute,
  fakedmRoute,
  wantedRoute,
  wastedRoute,
  iphoneGalleryRoute,
  iphoneContextMenuRoute,
  fakeCanonRoute,
  toBotakRoute,
  toZombieRoute,
  toBlondeRoute,
  toBabiRoute,
  toAnimeRoute,
  toBrewokRoute,
  toChibiRoute,
  toDprRoute,
  toKacamataRoute,
  toHijabRoute,
  toLegoRoute,
  toMekkahRoute,
  toPeciRoute,
  toPutihRoute,
  toHitamRoute,
  toTuaRoute,
  toBayiRoute,
  toSingaporeRoute,
  toMalaysiaRoute,
  toThailandRoute,
  toJawaRoute,
  toPilotRoute,
  toKantoranRoute,
  toWisudaRoute,
  toHantuRoute,
  toVampirRoute,
  toCyberpunkRoute,
  toKoreaRoute,
  toJepangRoute,
  toArabRoute,
  toIndiaRoute,
  toDubaiRoute,
  toGendutRoute,
  toKurusRoute,
  toKekarRoute,
  toTniRoute,
  toPolisiRoute,
  toDokterRoute,
  toPunkRoute,
  toKriboRoute,
  toGondrongRoute,
  toSdmTinggiRoute,
  toSatanRoute,
  toVintageRoute,
  toBarefaceRoute,
  sswebRoute,
  web2zipRoute,
  ocrRoute,
  translateRoute,
  deeplRoute,
  aksarajawaRoute,
  hitungjarakRoute,
  base64ToImageRoute,
  noHokiRoute,
  tafsirMimpiRoute,
  ramalanJodohRoute,
  ramalanJodohBaliRoute,
  ramalanSuamiIstriRoute,
  ramalanCintaRoute,
  artiNamaRoute,
  kecocokanNamaRoute,
  namaPasanganRoute,
  tanggalJadianRoute,
  sifatUsahaRoute,
  rejekiHokiRoute,
  pekerjaanCocokRoute,
  ramalanPitagorasRoute,
  potensiPenyakitRoute,
  simbolTarotRoute,
  ramalanKartuRoute,
  fengShuiRoute,
  ramalanIChingRoute,
  hariBaikRoute,
  hariLaranganRoute,
  hariNaasRoute,
  nagaHariRoute,
  arahRejekiRoute,
  ramalanPeruntunganRoute,
  wetonRoute,
  sifatKarakterRoute,
  potensiKeberuntunganRoute,
  memancingIkanRoute,
  masaSuburRoute,
  zodiakRoute,
  shioRoute,
  kayuBertuahRoute,
  batuPermataRoute,
  pamaliRoute,
  tanggalLahirRoute,
  wetonJodohRoute,
  hariBaikMenikahRoute,
  pinterestSearchRoute,
  youtubeSearchRoute,
  appleMusicSearchRoute,
  bilibiliSearchRoute,
  wikipediaSearchRoute,
  wikimediaSearchRoute,
  tiktokSearchRoute,
  deezerSearchRoute,
  githubSearchRoute,
  chordSearchRoute,
];

// Adjust methods dynamically based on category: GET for News, Downloader and Search
docTopics.forEach(topic => {
  if (topic.category === 'Search' || topic.category === 'News' || topic.category === 'Local News' || topic.category === 'Downloader' || (topic.category === 'QR Tools' && topic.id !== 'qr-decoder') || topic.category === 'Shortlink Tools' || topic.category === 'AI Chat' || topic.category === 'BMKG Indonesia' || topic.category === 'Informations' || topic.category === 'DNS Tools' || topic.category === 'Email Tools' || topic.category === 'IP Tools' || (topic.category === 'Dev Tools' && topic.id !== 'base64-to-image') || topic.category === 'Cyber Security Tools' || topic.category === 'Maker' || (topic.category === 'Tools' && topic.id !== 'base64-to-image')) {
    topic.method = 'GET';
  }
});
