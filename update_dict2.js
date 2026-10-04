const fs = require('fs');
let js = fs.readFileSync('e:/MnM_Travel_Russian/js/enhancements.js', 'utf-8');

js = js.replace(/"Retreats": "Ретриты"/g, '"Bespoke Packages": "Индивидуальные туры"');
js = js.replace(/"Introvert Retreats": "Ретриты для интровертов"/g, '"Private Luxury Safaris": "Частные премиум-сафари"');
js = js.replace(/"Yoga Retreats": "Йога-ретриты"/g, '"Curated Honeymoons": "Эксклюзивные свадебные путешествия"');
js = js.replace(/"Detox": "Детокс"/g, '"Cultural Immersions": "Культурные погружения"');
js = js.replace(/"MNM Travel is a premium wellness travel marketplace that blends the ease of booking with the feel of an editorial magazine\. Discover curated programs, match them with exceptional stays, and book seamlessly\.": "MNM Travel — это премиальный маркетплейс велнес-путешествий, сочетающий удобство бронирования с эстетикой глянцевого журнала\. Откройте для себя авторские программы, подберите к ним исключительные отели и бронируйте без хлопот\."/g, '"MNM Travel is a tailor-made luxury travel boutique that blends the ease of booking with the feel of an editorial magazine. We specialize in crafting highly personalized, ultra-luxury itineraries. From sweeping African safaris to hidden boutique coastal escapes, our experts build the trip around you.": "MNM Travel — это бутик индивидуальных премиум-путешествий. Мы специализируемся на создании ультра-роскошных маршрутов: от африканских сафари до секретных прибрежных вилл. Наши эксперты создают путешествие вокруг вас."');
js = js.replace(/"Choose Retreat": "Выберите ретрит"/g, '"Consult Our Experts": "Проконсультируйтесь с экспертами"');
js = js.replace(/"Match Boutique Stay": "Подберите бутик-отель"/g, '"Design Your Itinerary": "Спроектируйте свой маршрут"');
js = js.replace(/"Browse certified experts with verified credentials and guest testimonials\.": "Изучите профили сертифицированных экспертов с подтвержденными отзывами гостей\."/g, '"Speak with our senior travel designers who have personally vetted every lodge, camp, and boutique hotel we recommend.": "Поговорите с нашими старшими тревел-дизайнерами, которые лично проверили каждый лодж, лагерь и бутик-отель, которые мы рекомендуем."');

fs.writeFileSync('e:/MnM_Travel_Russian/js/enhancements.js', js);
console.log("Updated dictionary");
