const fs = require('fs');

const rawStrings = [
  "Retreats",
  "Introvert Retreats",
  "/ 78+ Countries",
  "Yoga Retreats",
  "/ 89+ Countries",
  "Detox",
  "/ 56+ Countries",
  "About Us",
  "MNM Travel is a premium wellness travel marketplace that blends the ease of booking with the feel of an editorial magazine. Discover curated programs, match them with exceptional stays, and book seamlessly.",
  "Total countries travelled",
  "Trusted by travelers looking for more than ordinary vacations.",
  "Total retreats attended",
  "Discover unique locations, engaging activities, and expert- led workshops designed to inspire and refresh your spirit.",
  "from",
  "UAE / Dubai",
  "3-6 nights",
  "Best in Oct-Apr",
  "Thailand",
  "4-7 nights",
  "Best in Nov-Mar",
  "Vietnam",
  "5-8 nights",
  "Best in Feb-May, Sep-Nov",
  "Nepal",
  "3-7 nights",
  "Best in Oct-Nov, Mar-May",
  "Sri Lanka",
  "Best in Dec-Apr, May-Sep",
  "Singapore",
  "3-5 nights",
  "Best in Feb-Apr, Jun-Aug, Dec-Jan",
  "Malaysia",
  "4-6 nights",
  "Best in Dec-Mar",
  "France",
  "7-10 nights",
  "Best in Apr-Jun, Sep-Oct",
  "Spain",
  "Indonesia",
  "Best in Apr-Oct",
  "Kazakhstan",
  "Azerbaijan",
  "Best in Apr-Jun, Sep-Nov",
  "Uzbekistan",
  "Best in Mar-May, Sep-Nov",
  "Bhutan",
  "Best in Mar-May, Oct-Dec",
  "Japan",
  "Best in Mar-Apr, Oct-Nov",
  "Russia",
  "6-10 nights",
  "Best in May-Sep, Dec-Feb",
  "Armenia",
  "Best in May-Jun, Sep-Oct",
  "Portugal",
  "6-9 nights",
  "Best in Mar-Jun, Sep-Oct",
  "Kyrgyzstan",
  "Best in May-Sep",
  "Tajikistan",
  "Best in May-Oct",
  "Combine Retreat into one seamless checkout. Instant confirmations where available, or concierge support for bespoke itineraries.",
  "Step",
  "Choose Retreat",
  "Match Boutique Stay",
  "Add Transfers & Extras",
  "Secure Payment",
  "Country",
  "Discover your next adventure! Choose from stunning destinations across Europe with 289 options, vibrant Asia with 90 experiences, and the diverse USA featuring 180 unique locations.",
  "Browse certified experts with verified credentials and guest testimonials.",
  "goals",
  "matches",
  "We recommend retreats and stays that fit.",
  "package",
  "Add transfers, spa, and extras in one checkout.",
  "progress",
  "Use MNM Journal to reflect and rebook.",
  "Practitioners & Coaches",
  "Your Retreat, Our Experts",
  "Each coach is carefully selected to deliver the highest quality guidance in yoga, meditation, fitness, and holistic well-being.",
  "At MNM Travel we've brought together a global network of 200+ certified coaches, practitioners, and wellness experts.",
  "Tell us your goals",
  "Get curated matches",
  "Customize your package",
  "Travel & track progress",
  "Home", "Destinations", "Gallery", "About", "Blog", "Contact",
  "Explore Retreats", "Explore Package", "Popular Packages", "Top Trending INTERNATIONAL Destinations",
  "Trusted by"
];

// Predefined manual translations for a high quality translation dictionary
const translations = {
  "Retreats": "Ретриты",
  "Introvert Retreats": "Ретриты для интровертов",
  "/ 78+ Countries": "/ 78+ стран",
  "Yoga Retreats": "Йога-ретриты",
  "/ 89+ Countries": "/ 89+ стран",
  "Detox": "Детокс",
  "/ 56+ Countries": "/ 56+ стран",
  "About Us": "О нас",
  "MNM Travel is a premium wellness travel marketplace that blends the ease of booking with the feel of an editorial magazine. Discover curated programs, match them with exceptional stays, and book seamlessly.": "MNM Travel — это премиальный маркетплейс велнес-путешествий, сочетающий удобство бронирования с эстетикой глянцевого журнала. Откройте для себя авторские программы, подберите к ним исключительные отели и бронируйте без хлопот.",
  "Total countries travelled": "Всего стран посещено",
  "Trusted by travelers looking for more than ordinary vacations.": "Нам доверяют путешественники, ищущие больше, чем просто обычный отпуск.",
  "Total retreats attended": "Всего ретритов посещено",
  "Discover unique locations, engaging activities, and expert- led workshops designed to inspire and refresh your spirit.": "Откройте для себя уникальные локации, увлекательные активности и мастер-классы от экспертов, созданные для вдохновения и обновления духа.",
  "from": "от",
  "UAE / Dubai": "ОАЭ / Дубай",
  "3-6 nights": "3-6 ночей",
  "Best in Oct-Apr": "Лучше всего: Окт-Апр",
  "Thailand": "Таиланд",
  "4-7 nights": "4-7 ночей",
  "Best in Nov-Mar": "Лучше всего: Ноя-Мар",
  "Vietnam": "Вьетнам",
  "5-8 nights": "5-8 ночей",
  "Best in Feb-May, Sep-Nov": "Лучше всего: Фев-Май, Сен-Ноя",
  "Nepal": "Непал",
  "3-7 nights": "3-7 ночей",
  "Best in Oct-Nov, Mar-May": "Лучше всего: Окт-Ноя, Мар-Май",
  "Sri Lanka": "Шри-Ланка",
  "Best in Dec-Apr, May-Sep": "Лучше всего: Дек-Апр, Май-Сен",
  "Singapore": "Сингапур",
  "3-5 nights": "3-5 ночей",
  "Best in Feb-Apr, Jun-Aug, Dec-Jan": "Лучше всего: Фев-Апр, Июн-Авг, Дек-Янв",
  "Malaysia": "Малайзия",
  "4-6 nights": "4-6 ночей",
  "Best in Dec-Mar": "Лучше всего: Дек-Мар",
  "France": "Франция",
  "7-10 nights": "7-10 ночей",
  "Best in Apr-Jun, Sep-Oct": "Лучше всего: Апр-Июн, Сен-Окт",
  "Spain": "Испания",
  "Indonesia": "Индонезия",
  "Best in Apr-Oct": "Лучше всего: Апр-Окт",
  "Kazakhstan": "Казахстан",
  "Azerbaijan": "Азербайджан",
  "Best in Apr-Jun, Sep-Nov": "Лучше всего: Апр-Июн, Сен-Ноя",
  "Uzbekistan": "Узбекистан",
  "Best in Mar-May, Sep-Nov": "Лучше всего: Мар-Май, Сен-Ноя",
  "Bhutan": "Бутан",
  "Best in Mar-May, Oct-Dec": "Лучше всего: Мар-Май, Окт-Дек",
  "Japan": "Япония",
  "Best in Mar-Apr, Oct-Nov": "Лучше всего: Мар-Апр, Окт-Ноя",
  "Russia": "Россия",
  "6-10 nights": "6-10 ночей",
  "Best in May-Sep, Dec-Feb": "Лучше всего: Май-Сен, Дек-Фев",
  "Armenia": "Армения",
  "Best in May-Jun, Sep-Oct": "Лучше всего: Май-Июн, Сен-Окт",
  "Portugal": "Португалия",
  "6-9 nights": "6-9 ночей",
  "Best in Mar-Jun, Sep-Oct": "Лучше всего: Мар-Июн, Сен-Окт",
  "Kyrgyzstan": "Кыргызстан",
  "Best in May-Sep": "Лучше всего: Май-Сен",
  "Tajikistan": "Таджикистан",
  "Best in May-Oct": "Лучше всего: Май-Окт",
  "Combine Retreat into one seamless checkout. Instant confirmations where available, or concierge support for bespoke itineraries.": "Объедините ретрит в одно удобное бронирование. Мгновенное подтверждение или поддержка консьержа для индивидуальных маршрутов.",
  "Step": "Шаг",
  "Choose Retreat": "Выберите ретрит",
  "Match Boutique Stay": "Подберите бутик-отель",
  "Add Transfers & Extras": "Добавьте трансферы и услуги",
  "Secure Payment": "Безопасная оплата",
  "Country": "Страна",
  "Discover your next adventure! Choose from stunning destinations across Europe with 289 options, vibrant Asia with 90 experiences, and the diverse USA featuring 180 unique locations.": "Откройте для себя следующее приключение! Выбирайте из потрясающих направлений по всей Европе (289 вариантов), яркой Азии (90 впечатлений) и разнообразных США (180 уникальных локаций).",
  "Browse certified experts with verified credentials and guest testimonials.": "Изучите профили сертифицированных экспертов с подтвержденными отзывами гостей.",
  "goals": "цели",
  "matches": "варианты",
  "We recommend retreats and stays that fit.": "Мы рекомендуем подходящие ретриты и отели.",
  "package": "пакет",
  "Add transfers, spa, and extras in one checkout.": "Добавьте трансферы, спа и доп. услуги в один заказ.",
  "progress": "прогресс",
  "Use MNM Journal to reflect and rebook.": "Используйте Журнал MNM для рефлексии и повторного бронирования.",
  "Practitioners & Coaches": "Практики и Тренеры",
  "Your Retreat, Our Experts": "Ваш ретрит, наши эксперты",
  "Each coach is carefully selected to deliver the highest quality guidance in yoga, meditation, fitness, and holistic well-being.": "Каждый тренер тщательно отбирается для обеспечения высочайшего качества в йоге, медитации, фитнесе и холистическом благополучии.",
  "At MNM Travel we've brought together a global network of 200+ certified coaches, practitioners, and wellness experts.": "В MNM Travel мы собрали глобальную сеть из более чем 200 сертифицированных тренеров, практиков и велнес-экспертов.",
  "Tell us your goals": "Расскажите нам о своих целях",
  "Get curated matches": "Получите персонализированные варианты",
  "Customize your package": "Настройте свой тур",
  "Travel & track progress": "Путешествуйте и отслеживайте прогресс",
  "Home": "Главная",
  "Destinations": "Направления",
  "Gallery": "Галерея",
  "About": "О нас",
  "Blog": "Блог",
  "Contact": "Контакты",
  "Explore Retreats": "Смотреть туры",
  "Explore Package": "Смотреть тур",
  "Popular Packages": "Популярные Туры",
  "Top Trending INTERNATIONAL Destinations": "Топ Международных Направлений",
  "Trusted by": "Нам доверяют"
};

const jsContent = `
// Image Source Mapping
const imageUpgrades = {
  "images/6b2bb97f0c1b6d7f2e78e37589eae965.jpg": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop", 
  "images/6f3ad43a139e289fdcc2ccc6d497923b.jpg": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop", 
  "images/7c677b5e8b51587496b66ed9709845df.jpg": "https://images.unsplash.com/photo-1515238152791-381c6e36afbc?q=80&w=800&auto=format&fit=crop", 
  "images/8b2e185fc79ab5f9983920bbc1f8f6b5.jpg": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop", 
  "images/8c22906dc1ab06a9031e5f0fde298c5b.jpg": "https://images.unsplash.com/photo-1502602812047-d7585f1c5092?q=80&w=800&auto=format&fit=crop", 
  "images/9c904a1b42b78bb14a34bb65cc768a40.jpg": "https://images.unsplash.com/photo-1525625298151-1811b8382536?q=80&w=800&auto=format&fit=crop", 
  "images/9dd341eb42d8bf61fd830a7fb49fcea0.jpg": "https://images.unsplash.com/photo-1539037116271-8b010c7b415a?q=80&w=800&auto=format&fit=crop"
};

const fullDict = ${JSON.stringify(translations, null, 2)};

// We will save original text to a data attribute so we can switch back to EN
window.switchLanguage = function(lang) {
  localStorage.setItem('userLang', lang);
  
  const toggles = document.querySelectorAll('.custom-locale-toggles .locale-btn');
  if(toggles.length > 0) {
    toggles.forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(\`lang-toggle-\${lang}\`);
    if(btn) btn.classList.add('active');
  }

  // Iterate all text nodes to preserve layout
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    let text = node.nodeValue.trim();
    if (!text) continue;
    
    // Store original EN text safely on the parent
    if (!node.parentElement.hasAttribute('data-en-text')) {
      // Basic safeguard: dont override if the node spans multiple text elements messily
      if (node.parentElement.childNodes.length === 1) {
         node.parentElement.setAttribute('data-en-text', text);
      }
    }

    if (lang === 'ru') {
       // Check if text perfectly matches a dict key
       if (fullDict[text]) {
         node.nodeValue = fullDict[text];
       } else {
         // Substring matching for composed strings
         Object.keys(fullDict).forEach(enKey => {
           if (node.nodeValue.includes(enKey)) {
              node.nodeValue = node.nodeValue.replace(enKey, fullDict[enKey]);
           }
         });
       }
    } else {
       // Back to EN using data-attribute if available
       if (node.parentElement.hasAttribute('data-en-text')) {
           node.nodeValue = node.parentElement.getAttribute('data-en-text');
       } else {
           // Fallback substring reverse matching
           Object.keys(fullDict).forEach(enKey => {
             const ruText = fullDict[enKey];
             if (node.nodeValue.includes(ruText)) {
                node.nodeValue = node.nodeValue.replace(ruText, enKey);
             }
           });
       }
    }
  }
};

// Currency Converter
const RUB_RATE = 1.08;

window.switchCurrency = function(currency) {
  localStorage.setItem('userCurrency', currency);
  
  const toggles = document.querySelectorAll('.currency-toggles .locale-btn');
  if(toggles.length > 0) {
    toggles.forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(\`curr-toggle-\${currency}\`);
    if(btn) btn.classList.add('active');
  }

  const priceElements = document.querySelectorAll('.body-lg-semibold, .price, .package-price');
  
  priceElements.forEach(el => {
    if (!el.innerText.includes('₹') && !el.innerText.includes('₽')) return;

    if (!el.hasAttribute('data-original-inr')) {
      const match = el.innerText.replace(/,/g, '').match(/\\d+/);
      if (match) el.setAttribute('data-original-inr', match[0]);
    }
    
    const baseVal = parseFloat(el.getAttribute('data-original-inr'));
    if (!isNaN(baseVal)) {
      if (currency === 'rub') {
        const rubVal = Math.round(baseVal * RUB_RATE);
        el.innerText = \`₽\${rubVal.toLocaleString('ru-RU')}\`;
      } else {
        el.innerText = \`₹\${baseVal.toLocaleString('en-IN')}\`;
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Init image upgrades
  document.querySelectorAll("img").forEach(img => {
    const currentSrc = img.getAttribute("src");
    if (currentSrc && imageUpgrades[currentSrc]) {
      img.setAttribute("src", imageUpgrades[currentSrc]);
    }
  });

  // Init language
  const savedLang = localStorage.getItem('userLang') || 'en';
  if (savedLang === 'ru') setTimeout(() => switchLanguage('ru'), 100);

  // Init currency
  const savedCurr = localStorage.getItem('userCurrency') || 'inr';
  if (savedCurr === 'rub') setTimeout(() => switchCurrency('rub'), 100);
});
\`;

fs.writeFileSync('e:/MnM_Travel_Russian/js/enhancements.js', jsContent);
console.log('Saved enhancements.js with full dictionary');
