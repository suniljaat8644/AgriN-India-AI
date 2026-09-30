import { LanguageOption, PresetScenario, LanguageCode } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'en', label: 'English', nativeLabel: 'English', speechCode: 'en-IN' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', speechCode: 'mr-IN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', speechCode: 'gu-IN' },
];

// High-fidelity SVG leaf illustrations encoded as Data URIs for instant testing
export const SAMPLE_LEAF_IMAGES: Record<string, string> = {
  wheat_yellow_rust: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3f5a36"/>
          <stop offset="100%" stop-color="#1b2817"/>
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6ba038"/>
          <stop offset="40%" stop-color="#84b840"/>
          <stop offset="100%" stop-color="#4d7722"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <!-- Wheat Leaf Blade -->
      <path d="M 60 360 Q 180 200 340 50 Q 280 220 180 370 Z" fill="url(#leafGrad)" stroke="#375518" stroke-width="3"/>
      <!-- Midrib Vein -->
      <path d="M 60 360 Q 180 210 340 50" stroke="#b0d66c" stroke-width="4" fill="none"/>
      <!-- Yellow Rust Stripes (Puccinia striiformis) -->
      <path d="M 120 300 Q 170 230 230 160" stroke="#ffd000" stroke-width="6" stroke-dasharray="8 6" fill="none" opacity="0.95"/>
      <path d="M 135 285 Q 185 215 245 145" stroke="#f59e0b" stroke-width="5" stroke-dasharray="10 5" fill="none" opacity="0.95"/>
      <path d="M 150 270 Q 200 200 260 130" stroke="#fbbf24" stroke-width="7" stroke-dasharray="6 4" fill="none" opacity="0.95"/>
      <path d="M 170 250 Q 220 180 280 110" stroke="#ffd000" stroke-width="5" stroke-dasharray="7 5" fill="none" opacity="0.95"/>
      <!-- Powdery Pustules -->
      <circle cx="170" cy="220" r="4" fill="#fbbf24" />
      <circle cx="185" cy="205" r="5" fill="#f59e0b" />
      <circle cx="210" cy="175" r="4" fill="#ffd000" />
      <circle cx="230" cy="150" r="5" fill="#f59e0b" />
      <circle cx="250" cy="130" r="4" fill="#fbbf24" />
      <text x="20" y="380" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Specimen: Triticum aestivum (Wheat) - Yellow Rust Pustules</text>
    </svg>
  `)}`,

  paddy_bacterial_blight: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2d422a"/>
          <stop offset="100%" stop-color="#141c13"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg2)"/>
      <!-- Rice Blade -->
      <path d="M 70 370 Q 150 180 320 40 Q 240 240 130 380 Z" fill="#588e33" stroke="#2c4f17" stroke-width="3"/>
      <!-- Midrib -->
      <path d="M 70 370 Q 150 190 320 40" stroke="#8ec852" stroke-width="3" fill="none"/>
      <!-- Wavy Lesions (Xanthomonas oryzae) on margins -->
      <path d="M 230 140 Q 260 110 320 40 Q 270 120 220 180 Z" fill="#d97706" opacity="0.85"/>
      <path d="M 245 125 Q 280 80 320 40 Q 280 110 240 160 Z" fill="#fde68a" opacity="0.95"/>
      <!-- Water soaked wavy edge -->
      <path d="M 180 230 Q 190 200 220 180 Q 235 150 260 120" stroke="#b45309" stroke-width="4" fill="none"/>
      <text x="20" y="380" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Specimen: Oryza sativa (Paddy) - Bacterial Leaf Blight</text>
    </svg>
  `)}`,

  cotton_leaf_curl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#334433"/>
          <stop offset="100%" stop-color="#131c13"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg3)"/>
      <!-- Broad Cotton Leaf (Palmate lobe) -->
      <path d="M 200 340 C 130 320 90 260 80 180 C 110 170 140 190 170 140 C 190 90 200 60 200 60 C 200 60 210 90 230 140 C 260 190 290 170 320 180 C 310 260 270 320 200 340 Z" fill="#4d7c2f" stroke="#2d4a1b" stroke-width="3"/>
      <!-- Distorted / Cupped leaf edges & thick veins -->
      <path d="M 200 340 L 200 70" stroke="#bbf7d0" stroke-width="5" fill="none"/>
      <path d="M 200 240 Q 140 200 90 190" stroke="#86efac" stroke-width="4" fill="none"/>
      <path d="M 200 240 Q 260 200 310 190" stroke="#86efac" stroke-width="4" fill="none"/>
      <path d="M 200 170 Q 150 140 120 120" stroke="#bef264" stroke-width="3" fill="none"/>
      <path d="M 200 170 Q 250 140 280 120" stroke="#bef264" stroke-width="3" fill="none"/>
      <!-- Whitefly enations & upward puckering -->
      <circle cx="160" cy="200" r="14" fill="#a3e635" opacity="0.6"/>
      <circle cx="240" cy="200" r="16" fill="#a3e635" opacity="0.6"/>
      <circle cx="190" cy="130" r="12" fill="#facc15" opacity="0.7"/>
      <text x="20" y="380" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Specimen: Gossypium (Cotton) - Leaf Curl Virus & Whitefly</text>
    </svg>
  `)}`,

  chilli_leaf_curl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3d472c"/>
          <stop offset="100%" stop-color="#181f10"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg4)"/>
      <!-- Boat shaped curled chilli leaf -->
      <path d="M 200 350 Q 110 220 150 80 Q 200 50 250 80 Q 290 220 200 350 Z" fill="#65a30d" stroke="#365314" stroke-width="3"/>
      <!-- Cupping upward contour -->
      <path d="M 200 340 L 200 80" stroke="#d9f99d" stroke-width="4" fill="none"/>
      <path d="M 140 180 Q 200 160 260 180" stroke="#84cc16" stroke-width="3" fill="none"/>
      <path d="M 150 240 Q 200 220 250 240" stroke="#84cc16" stroke-width="3" fill="none"/>
      <!-- Thrips / Mites silvery patches -->
      <ellipse cx="180" cy="160" rx="20" ry="12" fill="#e2e8f0" opacity="0.55"/>
      <ellipse cx="220" cy="210" rx="18" ry="10" fill="#e2e8f0" opacity="0.55"/>
      <text x="20" y="380" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Specimen: Capsicum annuum (Chilli) - Upward Leaf Curl</text>
    </svg>
  `)}`,

  tomato_early_blight: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg5" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#344e39"/>
          <stop offset="100%" stop-color="#122015"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg5)"/>
      <!-- Serrated Tomato Leaflet -->
      <path d="M 200 350 C 130 320 100 250 110 190 C 80 180 70 140 90 120 C 120 140 140 110 170 80 C 190 60 200 50 200 50 C 200 50 210 60 230 80 C 260 110 280 140 310 120 C 330 140 320 180 290 190 C 300 250 270 320 200 350 Z" fill="#4d7c2f" stroke="#1e3a10" stroke-width="3"/>
      <!-- Concentric rings (Alternaria solani Target Board) -->
      <circle cx="160" cy="180" r="32" fill="#78350f" opacity="0.9"/>
      <circle cx="160" cy="180" r="24" fill="#451a03" stroke="#b45309" stroke-width="2"/>
      <circle cx="160" cy="180" r="16" stroke="#f59e0b" stroke-width="2" fill="#291102"/>
      <circle cx="160" cy="180" r="8" fill="#78350f"/>
      <!-- Yellow halo around spot -->
      <circle cx="160" cy="180" r="38" stroke="#fef08a" stroke-width="4" fill="none" opacity="0.8"/>
      
      <!-- Second smaller lesion -->
      <circle cx="230" cy="240" r="22" fill="#78350f" opacity="0.9"/>
      <circle cx="230" cy="240" r="14" fill="#291102" stroke="#b45309" stroke-width="2"/>
      <circle cx="230" cy="240" r="26" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.8"/>
      <text x="20" y="380" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Specimen: Solanum lycopersicum (Tomato) - Early Blight</text>
    </svg>
  `)}`,
};

export const getPresetsForLanguage = (lang: LanguageCode): PresetScenario[] => {
  const presetsByLang: Record<LanguageCode, PresetScenario[]> = {
    en: [
      {
        id: 'jaipur-wheat',
        title: 'Jaipur, Rajasthan • Wheat Yellow Rust',
        crop: 'Wheat',
        location: 'Jaipur, Rajasthan',
        stage: 'Flowering & Grain Filling',
        soil: 'Dry sandy loam, pH 7.8, low organic carbon (0.35%)',
        weather: 'High temp forecast (31-34°C), low humidity 30%, dry winds',
        query: 'Yellow stripes and powdery pustules appearing on leaves. Is this Yellow Rust? Please advise organic treatment.',
        language: 'en',
        badge: 'Cereal Crop',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'Ludhiana, Punjab • Rice Bacterial Blight',
        crop: 'Rice / Paddy',
        location: 'Ludhiana, Punjab',
        stage: 'Active Tillering to Panicle Initiation',
        soil: 'Clay loam, pH 7.4, medium fertility with high moisture',
        weather: 'Warm 29°C, high humidity 88%, overcast with drizzle forecast',
        query: 'Water-soaked yellowish-white lesions spreading down from leaf tips with wavy margins. How to protect paddy naturally?',
        language: 'en',
        badge: 'Kharif Cereal',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'Wardha, Maharashtra • Cotton Leaf Curl & Whitefly',
        crop: 'Cotton',
        location: 'Wardha, Vidarbha, Maharashtra',
        stage: 'Vegetative to Square Formation',
        soil: 'Deep Black Cotton Soil, moisture stress',
        weather: '35°C daytime heat, intermittent dry spell, 45% humidity',
        query: 'Cotton leaves are curling upwards like a cup and small whiteflies are seen underneath. Suggest natural organic spray.',
        language: 'en',
        badge: 'Cash Crop',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'Warangal, Telangana • Chilli Upward Leaf Curl',
        crop: 'Chilli',
        location: 'Warangal, Telangana',
        stage: 'Flowering & Early Fruit Set',
        soil: 'Red sandy loam, well-drained, low nitrogen',
        weather: '32°C, moderate humidity 60%, clear skies',
        query: 'Chilli leaves are curling upward like a boat and flowers are dropping. Suggest organic remedies.',
        language: 'en',
        badge: 'Spices Crop',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'Rajkot, Gujarat • Groundnut Tikka Leaf Spot',
        crop: 'Groundnut',
        location: 'Rajkot, Saurashtra, Gujarat',
        stage: 'Pegging & Pod Development',
        soil: 'Medium black soil, calcareous, pH 8.0',
        weather: '33°C, 70% humidity, occasional sea breeze',
        query: 'Dark circular brown spots with yellow halos appearing on groundnut leaves, leaves are dropping. Recommend bio-formulation.',
        language: 'en',
        badge: 'Oilseed Crop',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    hi: [
      {
        id: 'jaipur-wheat',
        title: 'जयपुर, राजस्थान • गेहूं पीला रतुआ',
        crop: 'गेहूं',
        location: 'जयपुर, राजस्थान',
        stage: 'फूल आने की अवस्था',
        soil: 'बलुई दोमट, पीएच ७.८, निम्न जैविक कार्बन',
        weather: 'तेज धूप (३१-३४°से), ३०% आर्द्रता, शुष्क हवाएं',
        query: 'पत्तियों पर पीले रंग की लंबी धारियां और पाउडर जैसे दाने दिख रहे हैं। क्या यह पीला रतुआ है? तुरंत जैविक उपचार बताएं।',
        language: 'hi',
        badge: 'अनाज फसल',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'लुधियाना, पंजाब • धान जीवाणु पत्ती झुलसा',
        crop: 'धान',
        location: 'लुधियाना, पंजाब',
        stage: 'कल्ले फूटने की अवस्था',
        soil: 'चिकनी दोमट, अधिक नमी',
        weather: 'तापमान २९°से, ८८% अधिक आर्द्रता, बूंदाबांदी का अनुमान',
        query: 'पत्तियों के सिरों से पीले-सफेद धब्बे नीचे की ओर फैल रहे हैं। धान को जैविक तरीके से कैसे बचाएं?',
        language: 'hi',
        badge: 'खरीफ फसल',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'वर्धा, महाराष्ट्र • कपास पत्ती मरोड़ व सफेद मक्खी',
        crop: 'कपास',
        location: 'वर्धा, विदर्भ, महाराष्ट्र',
        stage: 'वानस्पतिक बढ़वार',
        soil: 'काली कपास मिट्टी, नमी तनाव',
        weather: '३५°से तापमान, शुष्क मौसम, ४५% आर्द्रता',
        query: 'कपास की पत्तियां ऊपर की ओर कटोरी जैसी मुड़ रही हैं और नीचे बारीक सफेद मक्खी दिख रही है। प्राकृतिक छिड़काव बताएं।',
        language: 'hi',
        badge: 'नकदी फसल',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'वारंगल, तेलंगाना • मिर्च पत्ती मरोड़ (मुरड़ा रोग)',
        crop: 'मिर्च',
        location: 'वारंगल, तेलंगाना',
        stage: 'फूल आने की अवस्था',
        soil: 'लाल बलुई दोमट, कम नाइट्रोजन',
        weather: '३२°से तापमान, ६०% आर्द्रता, साफ आसमान',
        query: 'मिर्च के पौधे में पत्तियां ऊपर की ओर मुड़ रही हैं और फूल गिर रहे हैं। देशी उपाय बताएं।',
        language: 'hi',
        badge: 'मसाला फसल',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'राजकोट, गुजरात • मूंगफली टिक्का पर्ण दाग',
        crop: 'मूंगफली',
        location: 'राजकोट, सौराष्ट्र, गुजरात',
        stage: 'दाना भराव की अवस्था',
        soil: 'मध्यम काली मिट्टी',
        weather: '३३°से तापमान, ७०% आर्द्रता',
        query: 'मूंगफली के पत्तों पर गोल गहरे कत्थई धब्बे दिख रहे हैं और पत्ते पीले होकर गिर रहे हैं। देशी दवा बताएं।',
        language: 'hi',
        badge: 'तिलहन फसल',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    pa: [
      {
        id: 'jaipur-wheat',
        title: 'ਜੈਪੁਰ, ਰਾਜਸਥਾਨ • ਕਣਕ ਪੀਲੀ ਕੁੰਗੀ',
        crop: 'ਕਣਕ',
        location: 'ਜੈਪੁਰ, ਰਾਜਸਥਾਨ',
        stage: 'ਫੁੱਲ ਆਉਣ ਦਾ ਸਮਾਂ',
        soil: 'ਰੇਤਲੀ ਦੋਮਟ ਜ਼ਮੀਨ',
        weather: 'ਤੇਜ਼ ਧੁੱਪ (੩੧-੩੪°ਸੈ.)',
        query: 'ਪੱਤਿਆਂ ਉੱਤੇ ਪੀਲੀਆਂ ਧਾਰੀਆਂ ਦਿਖ ਰਹੀਆਂ ਹਨ। ਦੇਸੀ ਇਲਾਜ ਦੱਸੋ।',
        language: 'pa',
        badge: 'ਹਾੜ੍ਹੀ ਦੀ ਫ਼ਸਲ',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ • ਝੋਨੇ ਦਾ ਝੁਲਸ ਰੋਗ',
        crop: 'ਝੋਨਾ',
        location: 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ',
        stage: 'ਫ਼ੁਟਾਰੇ ਦਾ ਸਮਾਂ',
        soil: 'ਚੀਕਣੀ ਦੋਮਟ ਜ਼ਮੀਨ',
        weather: 'ਤਾਪਮਾਨ ੨੯°ਸੈ., ਵੱਧ ਹੁੰਮਸ',
        query: 'ਪੱਤਿਆਂ ਦੇ ਸਿਰਿਆਂ ਤੋਂ ਪਾਣੀ ਨਾਲ ਭਿੱਜੇ ਜਿਹੇ ਪੀਲੇ-ਚਿੱਟੇ ਧੱਬੇ ਹੇਠਾਂ ਵੱਲ ਫੈਲ ਰਹੇ ਹਨ। ਝੋਨੇ ਨੂੰ ਕਿਵੇਂ ਬਚਾਇਆ ਜਾਵੇ?',
        language: 'pa',
        badge: 'ਸਾਉਣੀ ਦੀ ਫ਼ਸਲ',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'ਵਰਧਾ, ਮਹਾਰਾਸ਼ਟਰ • ਨਰਮੇ ਦਾ ਚੂੜਾਮੁੜੀ ਰੋਗ',
        crop: 'ਨਰਮਾ',
        location: 'ਵਰਧਾ, ਮਹਾਰਾਸ਼ਟਰ',
        stage: 'ਵਾਧੇ ਦੀ ਅਵਸਥਾ',
        soil: 'ਕਾਲੀ ਮਿੱਟੀ',
        weather: '੩੫°ਸੈ. ਗਰਮੀ',
        query: 'ਪੱਤੇ ਉੱਪਰ ਵੱਲ ਮੁੜ ਰਹੇ ਹਨ ਅਤੇ ਚਿੱਟੀ ਮੱਖੀ ਦਿਖ ਰਹੀ ਹੈ। ਦੇਸੀ ਸਪਰੇਅ ਦੱਸੋ।',
        language: 'pa',
        badge: 'ਨਕਦੀ ਫ਼ਸਲ',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'ਵਾਰੰਗਲ, ਤੇਲੰਗਾਨਾ • ਮਿਰਚ ਮਰੋੜੀਆ ਰੋਗ',
        crop: 'ਮਿਰਚ',
        location: 'ਵਾਰੰਗਲ, ਤੇਲੰਗਾਨਾ',
        stage: 'ਫੁੱਲ ਆਉਣ ਦਾ ਸਮਾਂ',
        soil: 'ਲਾਲ ਦੋਮਟ ਮਿੱਟੀ',
        weather: '੩੨°ਸੈ. ਤਾਪਮਾਨ',
        query: 'ਮਿਰਚ ਦੇ ਪੱਤੇ ਉੱਪਰ ਮੁੜ ਰਹੇ ਹਨ ਅਤੇ ਫੁੱਲ ਝੜ ਰਹੇ ਹਨ। ਕੁਦਰਤੀ ਹੱਲ ਦੱਸੋ।',
        language: 'pa',
        badge: 'ਮਸਾਲਾ ਫ਼ਸਲ',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'ਰਾਜਕੋਟ, ਗੁਜਰਾਤ • ਮੂੰਗਫਲੀ ਦਾ ਟਿੱਕਾ ਰੋਗ',
        crop: 'ਮੂੰਗਫਲੀ',
        location: 'ਰਾਜਕੋਟ, ਗੁਜਰਾਤ',
        stage: 'ਦਾਣਾ ਭਰਨ ਦਾ ਸਮਾਂ',
        soil: 'ਦਰਮਿਆਨੀ ਕਾਲੀ ਮਿੱਟੀ',
        weather: '੩੩°ਸੈ. ਤਾਪਮਾਨ',
        query: 'ਮੂੰਗਫਲੀ ਦੇ ਪੱਤਿਆਂ ਉੱਤੇ ਕਥਈ ਧੱਬੇ ਦਿਖ ਰਹੇ ਹਨ। ਦੇਸੀ ਦਵਾਈ ਦੱਸੋ।',
        language: 'pa',
        badge: 'ਤੇਲਬੀਜ ਫ਼ਸਲ',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    mr: [
      {
        id: 'jaipur-wheat',
        title: 'जयपूर, राजस्थान • गहू तांबेरा रोग',
        crop: 'गहू',
        location: 'जयपूर, राजस्थान',
        stage: 'फुलधारणा अवस्था',
        soil: 'हलकी वाळूयुक्त जमीन',
        weather: 'कडक ऊन (३१-३४°से)',
        query: 'गव्हाच्या पानांवर पिवळ्या पट्ट्या दिसत आहेत. सेंद्रिय उपाय सांगा.',
        language: 'mr',
        badge: 'अन्नधान्य पीक',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'लुधियाना, पंजाब • भात तांबेरा करपा',
        crop: 'धान',
        location: 'लुधियाना, पंजाब',
        stage: 'फांद्या फुटणे',
        soil: 'चिकणमाती',
        weather: '२९°से, दमट हवामान',
        query: 'पानांच्या टोकाकडून पिवळे चट्टे खाली पसरत आहेत. नैसर्गिक उपाय सांगा.',
        language: 'mr',
        badge: 'खरीप पीक',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'वर्धा, महाराष्ट्र • कापूस चुरडा-मुरडा व पांढरी माशी',
        crop: 'कापूस',
        location: 'वर्धा, विदर्भ, महाराष्ट्र',
        stage: 'शाकीय वाढ',
        soil: 'काळी कसदार जमीन',
        weather: '३५°से तापमान, कोरडे हवामान',
        query: 'कापसाची पाने वरच्या बाजूला वाटीसारखी वळत आहेत आणि पांढरी माशी दिसत आहे. नैसर्गिक फवारणी सांगा.',
        language: 'mr',
        badge: 'नगदी पीक',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'वारंगल, तेलंगणा • मिरची बोकड्या रोग',
        crop: 'मिरची',
        location: 'वारंगल, तेलंगणा',
        stage: 'फुलधारणा',
        soil: 'लाल हलकी जमीन',
        weather: '३२°से तापमान',
        query: 'मिरचीची पाने वरच्या बाजूला वळत आहेत आणि फुले गळत आहेत. घरगुती अर्क सांगा.',
        language: 'mr',
        badge: 'मसाला पीक',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'राजकोट, गुजरात • भुईमूग टिक्का रोग',
        crop: 'भुईमूग',
        location: 'राजकोट, गुजरात',
        stage: 'शेंगा भरणे',
        soil: 'मध्यम काळी जमीन',
        weather: '३३°से तापमान',
        query: 'भुईमुगाच्या पानांवर काळे-तपकिरी ठिपके दिसत आहेत. नैसर्गिक औषध सांगा.',
        language: 'mr',
        badge: 'गळीतधान्य',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    te: [
      {
        id: 'jaipur-wheat',
        title: 'జైపూర్, రాజస్థాన్ • గోధుమ పసుపు కుంకుమ తెగులు',
        crop: 'గోధుమ',
        location: 'జైపూర్, రాజస్థాన్',
        stage: 'పూత దశ',
        soil: 'ఇసుక నేల',
        weather: 'ఎండ తీవ్రత (31-34°C)',
        query: 'గోధుమ ఆకులపై పసుపు గీతలు కనిపిస్తున్నాయి. సేంద్రీయ నివారణ తెలపండి.',
        language: 'te',
        badge: 'ధాన్యపు పంట',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'లూధియానా, పంజాబ్ • వరి బ్యాక్టీరియా ఆకు ఎండు తెగులు',
        crop: 'వరి',
        location: 'లూధియానా, పంజాబ్',
        stage: 'పిలకల దశ',
        soil: 'బంకమట్టి నేల',
        weather: '29°C, అధిక తేమ',
        query: 'వరి ఆకుల చివర్ల నుంచి పసుపు రంగు మచ్చలు క్రిందికి వ్యాపిస్తున్నాయి. రక్షణ చర్యలు తెలపండి.',
        language: 'te',
        badge: 'ఖరీఫ్ పంట',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'వర్ధా, మహారాష్ట్ర • పత్తి ఆకు ముడుత & తెల్లదోమ',
        crop: 'పత్తి',
        location: 'వర్ధా, మహారాష్ట్ర',
        stage: 'శాఖీయ పెరుగుదల',
        soil: 'నల్ల రేగడి నేల',
        weather: '35°C ఎండ',
        query: 'పత్తి ఆకులు పైకి ముడుచుకుపోతున్నాయి మరియు తెల్లదోమ ఆశించింది. సేంద్రీయ పిచికారీ తెలపండి.',
        language: 'te',
        badge: 'వాణిజ్య పంట',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'వరంగల్, తెలంగాణ • మిరప బొబ్బర తెగులు (ముడత)',
        crop: 'మిరప',
        location: 'వరంగల్, తెలంగాణ',
        stage: 'పూత దశ',
        soil: 'ఎర్ర నేల',
        weather: '32°C, 60% తేమ',
        query: 'మిరప తోటలో ఆకులు పైకి ముడుచుకుపోతున్నాయి. పూత రాలిపోతోంది. సహజ నివారణ తెలపండి.',
        language: 'te',
        badge: 'మసాలా పంట',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'రాజ్కోట్, గుజరాత్ • వేరుశనగ టిక్కా ఆకుమచ్చ తెగులు',
        crop: 'వేరుశనగ',
        location: 'రాజ్కోట్, గుజరాత్',
        stage: 'కాయ దశ',
        soil: 'మధ్యస్థ నల్ల నేల',
        weather: '33°C ఎండ',
        query: 'వేరుశనగ ఆకులపై ముదురు గోధుమ రంగు మచ్చలు వస్తున్నాయి. సహజ మందు తెలపండి.',
        language: 'te',
        badge: 'నూనెగింజ పంట',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    ta: [
      {
        id: 'jaipur-wheat',
        title: 'ஜெய்ப்பூர், ராஜஸ்தான் • கோதுமை மஞ்சள் துரு நோய்',
        crop: 'கோதுமை',
        location: 'ஜெய்ப்பூர், ராஜஸ்தான்',
        stage: 'பூக்கும் நிலை',
        soil: 'மணல் கலந்த மண்',
        weather: 'கடும் வெயில் (31-34°C)',
        query: 'கோதுமை இலைகளில் மஞ்சள் கோடுகள் தோன்றுகின்றன. இயற்கை மருத்துவம் கூறுங்கள்.',
        language: 'ta',
        badge: 'தானிய பயிர்',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'லூதியானா, பஞ்சாப் • நெல் பாக்டீரியா இலைக்கருகல்',
        crop: 'நெல்',
        location: 'லூதியானா, பஞ்சாப்',
        stage: 'தூர்கட்டும் நிலை',
        soil: 'களிமண் நிலம்',
        weather: '29°C, அதிக ஈரப்பதம்',
        query: 'நெல் இலைகளின் நுனியிலிருந்து மஞ்சள் கருகல் பரவுகிறது. இயற்கை முறையில் தடுப்பது எப்படி?',
        language: 'ta',
        badge: 'காரீப் பயிர்',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'வர்தா, மகாராஷ்டிரா • பருத்தி இலைச்சுருட்டை & வெள்ளை ஈ',
        crop: 'பருத்தி',
        location: 'வர்தா, மகாராஷ்டிரா',
        stage: 'வளர்ச்சி நிலை',
        soil: 'கருப்பு மண்',
        weather: '35°C வெயில்',
        query: 'பருத்தி இலைகள் மேல்நோக்கி சுருளுகின்றன. இயற்கை பூச்சிவிரட்டி கூறுங்கள்.',
        language: 'ta',
        badge: 'பணப்பயிர்',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'வாரங்கல், தெலுங்கானா • மிளகாய் இலைச்சுருட்டை நோய்',
        crop: 'மிளகாய்',
        location: 'வாரங்கல், தெலுங்கானா',
        stage: 'பூக்கும் நிலை',
        soil: 'செம்மண்',
        weather: '32°C வெயில்',
        query: 'மிளகாய் இலைகள் சுருண்டு பூக்கள் கொட்டுகின்றன. இயற்கை தீர்வு தேவை.',
        language: 'ta',
        badge: 'கார பயிர்',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'ராஜ்கோட், குஜராத் • நிலக்கடலை டிக்கா இலைப்புள்ளி',
        crop: 'நிலக்கடலை',
        location: 'ராஜ்கோட், குஜராத்',
        stage: 'காய் பிடிக்கும் நிலை',
        soil: 'கரிசல் மண்',
        weather: '33°C வெயில்',
        query: 'நிலக்கடலை இலைகளில் பழுப்பு நிற வட்ட புள்ளிகள் தென்படுகின்றன. மருந்து கூறுங்கள்.',
        language: 'ta',
        badge: 'எண்ணெய் வித்து',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
    gu: [
      {
        id: 'jaipur-wheat',
        title: 'જયપુર, રાજસ્થાન • ઘઉં પીળો ગેરુ રોગ',
        crop: 'ઘઉં',
        location: 'જયપુર, રાજસ્થાન',
        stage: 'ફૂલ અવસ્થા',
        soil: 'ગોરાડુ રેતાળ જમીન',
        weather: 'સખત ગરમી (૩૧-૩૪°સે)',
        query: 'ઘઉંના પાન પર પીળા રંગની પટ્ટીઓ દેખાય છે. દેશી ઉપાય જણાવો.',
        language: 'gu',
        badge: 'ધાન્ય પાક',
        imageSampleKey: 'wheat_yellow_rust',
      },
      {
        id: 'ludhiana-paddy',
        title: 'લુધિયાણા, પંજાબ • ડાંગર બેક્ટેરિયલ સુકારો',
        crop: 'ડાંગર',
        location: 'લુધિયાણા, પંજાબ',
        stage: 'ફૂટ અવસ્થા',
        soil: 'ચીકણી જમીન',
        weather: '૨૯°સે, વધુ ભેજ',
        query: 'ડાંગરના પાનના છેડા સુકાઈ રહ્યા છે અને પીળા પડી રહ્યા છે. પ્રાકૃતિક ઉપચાર જણાવો.',
        language: 'gu',
        badge: 'ખરીફ પાક',
        imageSampleKey: 'paddy_bacterial_blight',
      },
      {
        id: 'vidarbha-cotton',
        title: 'વર્ધા, મહારાષ્ટ્ર • કપાસ કુકડવાટ અને સફેદ માખી',
        crop: 'કપાસ',
        location: 'વર્ધા, મહારાષ્ટ્ર',
        stage: 'વાનસ્પતિક વૃદ્ધિ',
        soil: 'કાળી જમીન',
        weather: '૩૫°સે ગરમી',
        query: 'કપાસના પાન ઉપરની તરફ વળી રહ્યા છે અને સફેદ માખી દેખાય છે. દેશી છંટકાવ જણાવો.',
        language: 'gu',
        badge: 'રોકડિયો પાક',
        imageSampleKey: 'cotton_leaf_curl',
      },
      {
        id: 'warangal-chilli',
        title: 'વારંગલ, તેલંગાણા • મરચી કોકડવા રોગ',
        crop: 'મરચી',
        location: 'વારંગલ, તેલંગાણા',
        stage: 'ફૂલ અવસ્થા',
        soil: 'લાલ ગોરાડુ જમીન',
        weather: '૩૨°સે ગરમી',
        query: 'મરચીમાં પાન ઉપર તરફ વળી ગયા છે અને ફૂલ ખરી રહ્યા છે. દેશી ઉપાય આપો.',
        language: 'gu',
        badge: 'મસાલા પાક',
        imageSampleKey: 'chilli_leaf_curl',
      },
      {
        id: 'rajkot-groundnut',
        title: 'રાજકોટ, ગુજરાત • મગફળી ટિક્કા રોગ (પાનના ટપકાં)',
        crop: 'મગફળી',
        location: 'રાજકોટ, સૌરાષ્ટ્ર, ગુજરાત',
        stage: 'દાણા ભરાવ અવસ્થા',
        soil: 'મધ્યમ કાળી જમીન',
        weather: '૩૩°સે, ૭૦% ભેજ',
        query: 'મગફળીના પાન પર ગોળ ઘાટા કથ્થાઈ રંગના ટપકાં દેખાય છે અને પાન ખરી રહ્યા છે. દેશી દવા જણાવો.',
        language: 'gu',
        badge: 'તેલીબિયાં પાક',
        imageSampleKey: 'tomato_early_blight',
      },
    ],
  };

  const list = presetsByLang[lang] || presetsByLang['en'];
  return list.map((item) => {
    const telemetry = SCENARIO_TELEMETRY[item.id] || {
      coordinates: '26.9124° N, 75.7873° E',
      telemetryNdvi: 0.45,
      telemetrySoilMoisture: 22,
      telemetrySurfaceTemp: 32.5,
    };
    return {
      ...item,
      ...telemetry,
    };
  });
};

export const SCENARIO_TELEMETRY: Record<string, { coordinates: string; telemetryNdvi: number; telemetrySoilMoisture: number; telemetrySurfaceTemp: number }> = {
  'jaipur-wheat': {
    coordinates: '26.9124° N, 75.7873° E',
    telemetryNdvi: 0.42,
    telemetrySoilMoisture: 19,
    telemetrySurfaceTemp: 34.2,
  },
  'ludhiana-paddy': {
    coordinates: '30.9010° N, 75.8573° E',
    telemetryNdvi: 0.74,
    telemetrySoilMoisture: 38,
    telemetrySurfaceTemp: 24.5,
  },
  'vidarbha-cotton': {
    coordinates: '20.7453° N, 78.6022° E',
    telemetryNdvi: 0.48,
    telemetrySoilMoisture: 22,
    telemetrySurfaceTemp: 36.1,
  },
  'warangal-chilli': {
    coordinates: '17.9689° N, 79.5941° E',
    telemetryNdvi: 0.52,
    telemetrySoilMoisture: 28,
    telemetrySurfaceTemp: 33.0,
  },
  'rajkot-groundnut': {
    coordinates: '22.3039° N, 70.8022° E',
    telemetryNdvi: 0.39,
    telemetrySoilMoisture: 16,
    telemetrySurfaceTemp: 37.4,
  },
};

export const PRESET_SCENARIOS = getPresetsForLanguage('en');

