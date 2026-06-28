export interface ChecklistStep {
  id: string;
  title: string;
  shortDesc: string;
  what: string;
  why: string;
  codeBlock?: {
    language: string;
    label: string;
    code: string;
  };
  resources: {
    label: string;
    url: string;
  }[];
}

export interface ChecklistPhase {
  id: string;
  phase: string;
  label: string;
  icon: string;
  color: string;
  steps: ChecklistStep[];
}

export const checklistData: ChecklistPhase[] = [
  {
    id: 'phase-1',
    phase: 'FAZ 1',
    label: 'Altyapı ve Sunucu Kurulumu',
    icon: '🏗️',
    color: '#7c5cfc',
    steps: [
      {
        id: 'step-1-1',
        title: 'sGTM Container Oluşturulması',
        shortDesc: 'Google Tag Manager arayüzünde sunucu taraflı container oluşturun.',
        what: 'Google Tag Manager (tagmanager.google.com) arayüzünde yeni bir container oluştururken "Server" tipini seçin. Bu container, tarayıcı yerine sunucu tarafında çalışacak tag\'leri, trigger\'ları ve variable\'ları barındırır. Oluşturma tamamlandığında size bir Container ID (GTM-XXXXXXX formatında) ve provisioning snippet\'i verilir.',
        why: 'Tarayıcı tabanlı GTM container\'ları ITP (Intelligent Tracking Prevention), adblocker ve tarayıcı kısıtlamalarına maruz kalır. Sunucu taraflı bir container sayesinde event işleme ve veri iletimi tamamen sizin kontrolünüzdeki bir bulut sunucusunda gerçekleşir. Bu, veri kaybını minimize eder ve hassas parametreleri (user data, revenue) güvenli şekilde yönetmenizi sağlar.',
        codeBlock: {
          language: 'text',
          label: 'Container Bilgilerinizi Not Edin',
          code: `Container ID   : GTM-XXXXXXX
Container Type : Server
Provisioning   : Otomatik (GCP) veya Manuel (Stape/Hardal)

tagmanager.google.com → Admin → Container Settings`
        },
        resources: [
          { label: 'sGTM Kurulum Rehberi', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/intro' },
          { label: 'Container Tipleri', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/setup-guide' }
        ]
      },
      {
        id: 'step-1-2',
        title: 'Sunucu Provisioning (GCP / Stape / Hardal)',
        shortDesc: 'sGTM container\'ının çalışacağı cloud altyapısını ayağa kaldırın.',
        what: 'sGTM container\'ının çalışması için bir HTTP sunucusuna ihtiyaç vardır. Üç ana seçenek mevcuttur:\n\n**1. Google Cloud Platform (GCP) Otomatik Provisioning:** GTM arayüzünden "Set up your server" akışını izleyerek Cloud Run veya App Engine üzerinde otomatik deploy edin.\n\n**2. Stape.io:** GTM konfigürasyonunu yönetmenizi kolaylaştıran managed bir sGTM hosting platformu.\n\n**3. Hardal:** Türkiye merkezli, KVKK uyumlu sGTM yönetim platformu. EU veri merkezi seçeneği sunar.',
        why: 'sGTM, bir web sunucusu gibi çalışır; tarayıcıdan gelen HTTP isteklerini kabul eder, event\'leri işler ve downstream endpoint\'lere (GA4, Meta, TikTok) iletir. Sunucu olmadan container çalışamaz. GCP, en düşük maliyetli seçenek iken; Stape ve Hardal gibi platformlar monitoring, log ve yönetim kolaylığı sunar.',
        codeBlock: {
          language: 'bash',
          label: 'GCP gcloud CLI ile Manuel Deploy',
          code: `# GCP Cloud Run üzerinde sGTM deploy
gcloud run deploy gtm-server \\
  --image gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable \\
  --platform managed \\
  --region europe-west1 \\
  --set-env-vars CONTAINER_CONFIG=<your_config_string>`
        },
        resources: [
          { label: 'GCP Provisioning Guide', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide' },
          { label: 'App Engine Setup', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/app-engine-setup-guide' },
          { label: 'Stape.io', url: 'https://stape.io' }
        ]
      },
      {
        id: 'step-1-3',
        title: 'Custom Domain & DNS Ayarları',
        shortDesc: 'ss.domain.com gibi bir subdomain tanımlayarak first-party tracking kurun.',
        what: 'Alan adı yöneticinizde (Cloudflare, Route53 vb.) yeni bir alt alan adı (örn: `ss.sitemiz.com`) oluşturun ve bunu sGTM sunucunuzun IP/CNAME adresine yönlendirin:\n\n- **A Record:** `ss` → `<GCP/Stape IP>`\n- **CNAME Record:** `ss` → `<cloud-run-url>.run.app`\n\nArdından sGTM Admin panelinde bu custom domain\'i "Tagging Server URLs" alanına ekleyin.',
        why: '`googletagmanager.com` gibi üçüncü parti domain\'ler adblocker\'lar tarafından kolayca engellenir ve Safari ITP bu domainlerden set edilen cookie\'lerin süresini 7 güne kısıtlar. Kendi subdomain\'inizi kullanarak:\n\n• Cookie\'ler **first-party** olarak set edilir (tarayıcı kısıtlaması yok)\n• Adblocker engellemeleri önemli ölçüde azalır\n• GDPR/KVKK uyumu için veri egemenliği sağlanır',
        codeBlock: {
          language: 'text',
          label: 'DNS Kaydı Yapısı',
          code: `# Cloudflare / DNS Sağlayıcınızda:
Type   : CNAME
Name   : ss          (→ ss.sitemiz.com olacak)
Target : <cloud-run-url>.run.app
Proxy  : OFF (DNS-only, gri bulut)

# sGTM Admin Panelinde:
Tagging Server URLs → https://ss.sitemiz.com`
        },
        resources: [
          { label: 'Custom Domain Rehberi', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/custom-domain' },
          { label: 'First-Party Cookie Avantajları', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/first-party-cookies' }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    phase: 'FAZ 2',
    label: 'Web-to-Server Veri Akışı',
    icon: '🔄',
    color: '#06b6d4',
    steps: [
      {
        id: 'step-2-1',
        title: 'Web GTM — GA4 Transport URL Güncelleme',
        shortDesc: 'GA4 Configuration Tag\'ini sGTM sunucu URL\'inize yönlendirin.',
        what: 'Web GTM container\'ınızda bulunan **GA4 Configuration Tag** veya **Google Tag**\'i açın. "Fields to Set" bölümünde `transport_url` parametresini sGTM custom domain adresinize ayarlayın:\n\n`transport_url` → `https://ss.sitemiz.com`\n\nBu değişiklik, web sayfanızdan gönderilen tüm GA4 hit\'lerinin doğrudan Google sunucularına değil, önce sizin sGTM sunucunuza gitmesini sağlar.',
        why: 'Transport URL\'yi değiştirmeden tüm GA4 verileri `analytics.google.com` üzerinden akar; bu endpoint adblocker\'lar tarafından kolayca engellenir. sGTM\'e yönlendirerek:\n\n• Hit\'lerin kendi sunucunuzdan çıkmasını sağlarsınız\n• İstemci kimliği (`client_id`) first-party cookie olarak yazılır\n• Server-side tag\'leri (Meta CAPI, TikTok vb.) tetikleyebilirsiniz',
        codeBlock: {
          language: 'javascript',
          label: 'gtag() ile Doğrudan Ayar (alternatif)',
          code: `// Eğer doğrudan gtag kullanıyorsanız:
gtag('config', 'G-XXXXXXXXXX', {
  transport_url: 'https://ss.sitemiz.com',
  first_party_collection: true
});

// GTM'de "Fields to Set" tablosuna ekleyin:
// Field Name  : transport_url
// Value       : https://ss.sitemiz.com`
        },
        resources: [
          { label: 'Transport URL Dokümantasyonu', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/send-data' },
          { label: 'GA4 Configuration Tag', url: 'https://support.google.com/tagmanager/answer/9442095' }
        ]
      },
      {
        id: 'step-2-2',
        title: 'Data Layer İyileştirmeleri (User Data & E-ticaret)',
        shortDesc: 'Hash\'lenmiş kullanıcı verisi ve e-ticaret parametrelerini Data Layer\'a ekleyin.',
        what: 'Sunucu tarafına gönderilecek verilerin web tarafında eksiksiz olması gerekir. İki kritik alan şunlardır:\n\n**1. User Data (Hashed):**\n```javascript\nwindow.dataLayer.push({\n  user_data: {\n    email_address: sha256(email),\n    phone_number: sha256(phone)\n  }\n});\n```\n\n**2. E-Ticaret Parametreleri:**\nGA4 e-ticaret standart event\'leri (`purchase`, `add_to_cart` vb.) için `items` array ve `transaction_id` dahil tüm parametreler eksiksiz olmalı.',
        why: '**User Data:** Meta CAPI ve TikTok Event API, event\'leri kullanıcıyla eşleştirmek için hash\'lenmiş `email` ve `phone` kullanır. Bu veriler olmadan **Event Match Quality (EMQ)** skoru düşer, reklam optimizasyonu zayıflar.\n\n**E-Ticaret:** `transaction_id` değeri, web tag\'i ile server tag\'i arasındaki **deduplication** için kritiktir. Eksik ya da tutarsız olursa aynı satın alma çift sayılır.',
        codeBlock: {
          language: 'javascript',
          label: 'Purchase Event — Tam Data Layer Yapısı',
          code: `window.dataLayer.push({
  event: 'purchase',
  event_id: 'order_' + orderId + '_' + Date.now(), // Deduplication için
  user_data: {
    email_address: '<sha256_hashed_email>',
    phone_number:  '<sha256_hashed_phone_e164>'
  },
  ecommerce: {
    transaction_id: orderId,   // Benzersiz & tutarlı olmalı
    value: 149.90,
    currency: 'TRY',
    items: [{
      item_id: 'SKU-001',
      item_name: 'Ürün Adı',
      price: 149.90,
      quantity: 1
    }]
  }
});`
        },
        resources: [
          { label: 'GA4 E-Ticaret Ölçümü', url: 'https://developers.google.com/analytics/devguides/collection/ga4/ecommerce' },
          { label: 'User-Provided Data', url: 'https://support.google.com/google-ads/answer/13258081' }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    phase: 'FAZ 3',
    label: 'Server-Side Tagging Kurulumları',
    icon: '⚙️',
    color: '#f59e0b',
    steps: [
      {
        id: 'step-3-1',
        title: 'GA4 Server-Side Client & Tag Kurulumu',
        shortDesc: 'sGTM\'de GA4 Client oluşturun ve GA4 Measurement Protocol Tag\'i yapılandırın.',
        what: '**GA4 Client:** sGTM container\'ında "Clients" bölümüne gidin → "New" → "GA4" tipini seçin. Bu client, transport_url üzerinden gelen istekleri yakalar ve parse eder.\n\n**GA4 Tag:** "Tags" → "New" → "Google Analytics: GA4" tipini seçin. Measurement ID (G-XXXXXXXXXX) ve API Secret (GA4 Admin → Data Streams → Measurement Protocol API Secrets) girin.\n\nTrigger olarak "All Events" veya spesifik event\'ler ekleyin.',
        why: '**Client**, gelen HTTP POST isteğini okuyarak sGTM\'in anlayabileceği bir formata çevirir; **Tag** ise bu veriyi GA4 Measurement Protocol API\'sine iletir. İkisi birlikte çalışmazsa veri GA4 mülküne ulaşmaz.\n\nServer-side GA4 Tag\'inin avantajı: istemci ID\'si first-party cookie ile yaşatılır, IP adresi server\'da maskelenir, parametreler zenginleştirilebilir.',
        codeBlock: {
          language: 'text',
          label: 'GA4 Tag Konfigürasyonu',
          code: `// sGTM → Tags → New → Google Analytics: GA4

Tag Type        : Google Analytics: GA4
Measurement ID  : G-XXXXXXXXXX
API Secret      : <Measurement Protocol API Secret>
                  (GA4 Admin → Data Streams →
                   Measurement Protocol API Secrets)

Trigger: All Events  (veya filtrelenmiş event listesi)

// Client: sGTM → Clients → New → GA4
// Varsayılan ayarlar genellikle yeterlidir.`
        },
        resources: [
          { label: 'GA4 Client Kurulumu', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/ga4-client' },
          { label: 'Measurement Protocol', url: 'https://developers.google.com/analytics/devguides/collection/protocol/ga4' }
        ]
      },
      {
        id: 'step-3-2',
        title: 'Meta (Facebook) Conversions API (CAPI) Entegrasyonu',
        shortDesc: 'Meta CAPI tag\'ini kurun ve event_id ile deduplication\'ı yapılandırın.',
        what: '**sGTM\'de Meta CAPI Tag:**\n1. "Tags" → "New" → "Facebook Conversions API" (Stape Community Template veya Manuel)\n2. Pixel ID ve Meta System User Access Token girin\n3. Event Name mapping\'i yapın (GA4 event → Meta event)\n4. `event_id` parametresini **mutlaka** web tag ile aynı değere bağlayın\n5. User Data mapping: `email`, `phone`, `fbp`, `fbc` cookie değerlerini ekleyin\n\n**Pixel ID:** Meta Business Manager → Events Manager → Pixel → Settings\n**Access Token:** Meta Business Manager → System User → Generate Token',
        why: '**Neden CAPI?** iOS 14+ ve tarayıcı engellemeleri nedeniyle browser-side Pixel yaklaşık %30-60 daha az event yakalar. CAPI, server\'dan doğrudan Meta\'ya event gönderir; bu nedenle tarayıcı kısıtlamalarından etkilenmez.\n\n**Neden event_id?** Hem browser Pixel hem de CAPI aynı satın almayı göndermeli; ancak Meta bunları **bir** olay olarak saymalı. `event_id` eşleşmesi olmazsa:\n• Çift dönüşüm sayılır\n• ROAS yanlış hesaplanır\n• Reklam optimizasyonu bozulur\n\n**EMQ Skoru** ne kadar yüksekse Meta o kadar iyi match eder → reklam verimliliği artar.',
        codeBlock: {
          language: 'javascript',
          label: 'Web Pixel + event_id (Browser Tarafı)',
          code: `// Web GTM'de (Custom HTML Tag veya fbq doğrudan):
const eventId = 'purchase_' + orderId + '_' + Date.now();

fbq('track', 'Purchase', {
  value: 149.90,
  currency: 'TRY',
  content_ids: ['SKU-001'],
  content_type: 'product'
}, {
  eventID: eventId  // ← Bu değer Data Layer'da da olmalı!
});

// Data Layer'a da ekleyin ki sGTM okusun:
window.dataLayer.push({
  event: 'purchase',
  event_id: eventId,  // sGTM'de bu değeri CAPI tag'ine bağlayın
  // ... diğer parametreler
});`
        },
        resources: [
          { label: 'Conversions API Dokümantasyonu', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api' },
          { label: 'Deduplication Rehberi', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events' },
          { label: 'Event Match Quality', url: 'https://www.facebook.com/business/help/765081237495884' }
        ]
      },
      {
        id: 'step-3-3',
        title: 'TikTok Events API Kurulumu',
        shortDesc: 'sGTM\'de TikTok Events API tag\'ini kurun ve piksel deduplication\'ını ayarlayın.',
        what: '**sGTM\'de TikTok Events API Tag:**\n1. "Tags" → Community Templates → "TikTok Events API" template arayın\n2. TikTok Pixel ID ve Access Token girin\n3. Event mapping yapın: GA4 `purchase` → TikTok `PlaceAnOrder`\n4. `event_id` veya `order_id` ile deduplication yapılandırın\n5. User data: `email`, `phone`, `external_id` mapping\'i ekleyin\n\n**Pixel ID & Access Token:** TikTok Events Manager → Setup → Events API',
        why: 'TikTok\'un kullanıcı kitlesi mobil ağırlıklı ve büyük oranda iOS cihaz kullanmaktadır. iOS\'ta App Tracking Transparency (ATT) ve Safari ITP, browser-side pixel\'ın veri toplamasını ciddi ölçüde kısıtlar.\n\nServer-side Events API ile:\n• iOS ve cookie engeli olan kullanıcıların dönüşümleri ölçülür\n• TikTok\'un reklam algoritması daha doğru sinyal alır\n• Retargeting ve lookalike audience kalitesi artar\n• Attribution penceresi daha geniş ve doğru olur',
        codeBlock: {
          language: 'text',
          label: 'TikTok Events API — Tag Konfigürasyonu',
          code: `// sGTM → Tags → Community Templates → TikTok Events API

Pixel ID     : <TikTok_Pixel_ID>
Access Token : <TikTok_Events_API_Token>
              (TikTok Events Manager → Setup →
               Events API → Generate Access Token)

Event Name Mapping:
  GA4 purchase       → TikTok PlaceAnOrder
  GA4 add_to_cart   → TikTok AddToCart
  GA4 view_item     → TikTok ViewContent

Deduplication:
  Event ID Field → {{event_id}}  (Data Layer değişkeni)`
        },
        resources: [
          { label: 'TikTok Events API Docs', url: 'https://business-api.tiktok.com/portal/docs?id=1771100865818625' },
          { label: 'GTM Community Templates', url: 'https://tagmanager.google.com/gallery/#/?page=1&context=SERVER' }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    phase: 'FAZ 4',
    label: 'Test, QA ve Canlıya Alım',
    icon: '✅',
    color: '#22c55e',
    steps: [
      {
        id: 'step-4-1',
        title: 'sGTM Preview Mode & Console İncelemesi',
        shortDesc: 'sGTM Preview Mode ile gelen HTTP isteklerini ve cookie\'leri doğrulayın.',
        what: 'sGTM container\'ında "Preview" butonuna tıklayın → Preview linkini kopyalayıp tarayıcıda açın.\n\nKontrol edilmesi gerekenler:\n1. **HTTP Request:** Transport URL\'e istek geldiğini görün\n2. **Status Code:** 200 OK olmadığı durumlarda log\'ları inceleyin\n3. **Event İşleme:** GA4 Client\'ın event\'i doğru parse ettiğini doğrulayın\n4. **Tag Tetiklenmesi:** GA4, Meta CAPI, TikTok tag\'lerinin "Fired" durumunda olduğunu görün\n5. **Cookie:** DevTools → Application → Cookies → `_ga`, `_gcl_aw`, `fbp` cookie\'lerinin first-party domain\'de yazıldığını kontrol edin',
        why: 'Preview Mode olmadan hangi tag\'lerin tetiklendiğini, hangi variable\'ların boş kaldığını veya hangi isteklerin hata verdiğini göremezsiniz. Canlıya almadan önce her bir kritik event\'in:\n\n• Doğru parse edildiği\n• Tüm required parametreleri taşıdığı\n• Downstream endpoint\'lere (GA4, Meta) ulaştığı\n\ndoğrulanmalıdır. Cookie kontrolü özellikle önemlidir: first-party domain yazılmıyorsa ITP bypass edilemez.',
        codeBlock: {
          language: 'text',
          label: 'DevTools Cookie Kontrol Checklist',
          code: `Chrome DevTools → Application → Cookies → https://ss.sitemiz.com

Kontrol Edilecek Cookie'ler:
✓ _ga          : 2 yıl ömrü, first-party domain
✓ _ga_XXXXXXX  : Session ID, sGTM tarafından set edilmeli
✓ _gcl_aw      : Google Ads click ID (varsa)
✓ _fbp         : Facebook browser ID
✓ _fbc         : Facebook click ID (fbclid'den türetilen)

Network Tab → Transport URL isteğini bulun:
✓ Status: 200 OK
✓ Response: { "status": "ok" }`
        },
        resources: [
          { label: 'sGTM Preview Mode', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/debug' },
          { label: 'Cookie Debugging', url: 'https://developers.google.com/tag-platform/tag-manager/server-side/first-party-cookies' }
        ]
      },
      {
        id: 'step-4-2',
        title: 'GA4 DebugView & Meta Event Quality Kontrolleri',
        shortDesc: 'GA4 DebugView ve Meta Events Manager\'da verilerin doğru gittiğini onaylayın.',
        what: '**GA4 DebugView:**\n`analytics.google.com` → Admin → DebugView\nSayfada gezinerek ve event tetikleyerek real-time event akışını izleyin. Event parametrelerinin, user properties\'in eksiksiz geldiğini doğrulayın.\n\n**GA4 Realtime:**\n`Reports → Realtime` — aktif kullanıcı sayısını ve event\'leri canlı görün.\n\n**Meta Events Manager:**\n`business.facebook.com` → Events Manager → Test Events\nTest Event Code alın, siteye gelin ve event\'leri tetikleyin. Hem Pixel (browser) hem CAPI (server) event\'lerinin geldiğini ve **deduplication\'ın çalıştığını** (ikisi de "matched" görünüyor ama count 1 kalıyor) doğrulayın.\n\n**Meta Event Quality Score (EMQ):** Events Manager → Events → kalite skorunu inceleyin.',
        why: 'Son QA adımı olmadan canlıya almak, müşteri bütçesinin yanlış optimize edilmesine yol açar:\n\n• **GA4 DebugView eksikse** → parametre kayıpları canlıda fark edilmez\n• **Meta\'da deduplication çalışmıyorsa** → dönüşümler çift sayılır, ROAS şişer\n• **EMQ skoru düşükse** → Meta algoritması event\'leri doğru kullanıcıya atayamaz, CPA artar\n• **Cookie süreleri yanlışsa** → attribution penceresi kısalır, organik ziyaretlerin reklamlara atfedilmesi hatalı olur',
        codeBlock: {
          language: 'text',
          label: 'QA Final Checklist',
          code: `GA4 Kontroller:
✓ DebugView'da purchase event görünüyor
✓ transaction_id parametresi mevcut
✓ user_id veya client_id dolu
✓ items array eksiksiz (item_id, price, quantity)
✓ Revenue = beklenen değer

Meta Kontroller:
✓ Test Events → browser Pixel event geldi
✓ Test Events → CAPI (server) event geldi
✓ Deduplicated count = 1 (ikisi aynı event_id)
✓ Event Match Quality ≥ 7.0

TikTok Kontroller:
✓ Events Manager → Diagnostics → hata yok
✓ PlaceAnOrder event test'te görünüyor`
        },
        resources: [
          { label: 'GA4 DebugView', url: 'https://support.google.com/analytics/answer/7201382' },
          { label: 'Meta Test Events', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#test-events-tool' },
          { label: 'Meta Event Match Quality', url: 'https://www.facebook.com/business/help/765081237495884' }
        ]
      }
    ]
  }
];

export const getTotalSteps = () =>
  checklistData.reduce((acc, phase) => acc + phase.steps.length, 0);
