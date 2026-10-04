const fs = require('fs');
const cheerio = require('cheerio');

const packages = [
  { rank: 1, country: "UAE / Dubai", title: "UAE & Dubai Escape", stay: "3-6 nights", areas: "Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah", season: "Oct-Apr", profile: "Families, couples, honeymoon, luxury, shopping, MICE", priority: "Top Priority", price: "₹45,000", reviews: 420, imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
  { rank: 2, country: "Thailand", title: "Tropical Thailand Adventure", stay: "4-7 nights", areas: "Bangkok, Phuket, Krabi, Pattaya, Chiang Mai", season: "Nov-Mar", profile: "Young couples, honeymooners, families, nightlife", priority: "Top Priority", price: "₹39,999", reviews: 512, imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop" },
  { rank: 3, country: "Vietnam", title: "Vietnam Cultural Tour", stay: "5-8 nights", areas: "Hanoi, Halong Bay, Da Nang, Hoi An, Ho Chi Minh", season: "Feb-May, Sep-Nov", profile: "Couples, honeymooners, families, budget", priority: "Top Priority", price: "₹44,500", reviews: 389, imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop" },
  { rank: 4, country: "Nepal", title: "Nepal Spiritual Trek", stay: "3-7 nights", areas: "Kathmandu, Pokhara, Chitwan, Lumbini", season: "Oct-Nov, Mar-May", profile: "Families, pilgrimage, couples, trekking", priority: "Top Priority", price: "₹29,999", reviews: 275, imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop" },
  { rank: 5, country: "Sri Lanka", title: "Sri Lanka Wildlife", stay: "4-7 nights", areas: "Colombo, Kandy, Nuwara Eliya, Bentota, Yala", season: "Dec-Apr, May-Sep", profile: "Families, honeymooners, wildlife lovers", priority: "Top Priority", price: "₹37,500", reviews: 405, imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop" },
  { rank: 6, country: "Singapore", title: "Singapore Urban Luxury", stay: "3-5 nights", areas: "Marina Bay, Sentosa, Universal Studios", season: "Feb-Apr, Jun-Aug, Dec-Jan", profile: "Families, couples, luxury, shopping", priority: "Top Priority", price: "₹58,000", reviews: 630, imageUrl: "https://images.unsplash.com/photo-1525625298151-1811b8382536?q=80&w=800&auto=format&fit=crop" },
  { rank: 7, country: "Malaysia", title: "Malaysia Highlights", stay: "4-6 nights", areas: "Kuala Lumpur, Langkawi, Penang, Genting", season: "Dec-Mar", profile: "Families, couples, budget/mid-market", priority: "Top Priority", price: "₹34,999", reviews: 310, imageUrl: "https://images.unsplash.com/photo-1515238152791-381c6e36afbc?q=80&w=800&auto=format&fit=crop" },
  { rank: 8, country: "France", title: "Parisian Romance", stay: "7-10 nights", areas: "Paris, Nice, French Riviera, Disneyland", season: "Apr-Jun, Sep-Oct", profile: "Honeymooners, couples, luxury, art", priority: "Top Priority", price: "₹1,10,000", reviews: 290, imageUrl: "https://images.unsplash.com/photo-1502602812047-d7585f1c5092?q=80&w=800&auto=format&fit=crop" },
  { rank: 9, country: "Spain", title: "Spain Sunsets", stay: "7-10 nights", areas: "Madrid, Barcelona, Seville, Ibiza", season: "Apr-Jun, Sep-Oct", profile: "Couples, young travellers, nightlife", priority: "Top Priority", price: "₹1,05,000", reviews: 340, imageUrl: "https://images.unsplash.com/photo-1539037116271-8b010c7b415a?q=80&w=800&auto=format&fit=crop" },
  { rank: 10, country: "Indonesia", title: "Bali Island Escape", stay: "4-7 nights", areas: "Bali, Ubud, Nusa Penida, Lombok, Jakarta", season: "Apr-Oct", profile: "Honeymooners, young couples, wellness", priority: "High", price: "₹49,000", reviews: 820, imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" },
  { rank: 11, country: "Kazakhstan", title: "Kazakhstan Snow", stay: "4-7 nights", areas: "Almaty, Astana, Charyn Canyon, Kolsai", season: "Apr-Jun, Sep-Oct", profile: "Young couples, snow lovers, adventure", priority: "High", price: "₹52,000", reviews: 145, imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop" },
  { rank: 12, country: "Azerbaijan", title: "Baku Nights", stay: "4-7 nights", areas: "Baku, Gabala, Shahdag, Quba, Gobustan", season: "Apr-Jun, Sep-Nov", profile: "Couples, luxury, nightlife, adventure", priority: "High", price: "₹49,999", reviews: 210, imageUrl: "https://images.unsplash.com/photo-1581417539958-8b9a1a4c89bd?q=80&w=800&auto=format&fit=crop" },
  { rank: 13, country: "Uzbekistan", title: "Uzbekistan Heritage", stay: "5-8 nights", areas: "Tashkent, Samarkand, Bukhara, Khiva", season: "Mar-May, Sep-Nov", profile: "Culture/history travellers, photography", priority: "High", price: "₹59,000", reviews: 180, imageUrl: "https://images.unsplash.com/photo-1585288221833-289849202161?q=80&w=800&auto=format&fit=crop" },
  { rank: 14, country: "Bhutan", title: "Bhutan Wellness", stay: "4-7 nights", areas: "Thimphu, Paro, Punakha, Phobjikha", season: "Mar-May, Oct-Dec", profile: "Premium couples, wellness, luxury", priority: "Medium-High", price: "₹78,000", reviews: 155, imageUrl: "https://images.unsplash.com/photo-1570535232770-36a5c1e956a6?q=80&w=800&auto=format&fit=crop" },
  { rank: 15, country: "Japan", title: "Japan Cherry Blossoms", stay: "7-10 nights", areas: "Tokyo, Kyoto, Osaka, Mt Fuji", season: "Mar-Apr, Oct-Nov", profile: "Premium families, affluent couples, foodies", priority: "High", price: "₹1,45,000", reviews: 490, imageUrl: "https://images.unsplash.com/photo-1493976040381-81cb061568d9?q=80&w=800&auto=format&fit=crop" },
  { rank: 16, country: "Russia", title: "Russia Capitals", stay: "6-10 nights", areas: "Moscow, St Petersburg, Kazan, Sochi", season: "May-Sep, Dec-Feb", profile: "Families, premium travellers, winter seekers", priority: "Medium-High", price: "₹88,000", reviews: 200, imageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=800&auto=format&fit=crop" },
  { rank: 17, country: "Armenia", title: "Armenian Lake Sevan", stay: "4-6 nights", areas: "Yerevan, Garni, Geghard, Lake Sevan", season: "May-Jun, Sep-Oct", profile: "Young couples, history/culture, photography", priority: "Medium", price: "₹45,000", reviews: 110, imageUrl: "https://images.unsplash.com/photo-1572522770836-e0f3918a56c4?q=80&w=800&auto=format&fit=crop" },
  { rank: 18, country: "Portugal", title: "Portugal Coastal", stay: "6-9 nights", areas: "Lisbon, Porto, Sintra, Algarve", season: "Mar-Jun, Sep-Oct", profile: "Couples, luxury, food & wine", priority: "High", price: "₹99,000", reviews: 230, imageUrl: "https://images.unsplash.com/photo-1527780004940-d66a6a4c0eb3?q=80&w=800&auto=format&fit=crop" },
  { rank: 19, country: "Kyrgyzstan", title: "Kyrgyzstan Alpine", stay: "4-7 nights", areas: "Bishkek, Issyk-Kul, Karakol", season: "May-Sep", profile: "Backpackers, adventure travellers", priority: "Medium", price: "₹42,000", reviews: 95, imageUrl: "https://images.unsplash.com/photo-1569429184423-37604da88bd4?q=80&w=800&auto=format&fit=crop" },
  { rank: 20, country: "Tajikistan", title: "Tajikistan Pamir", stay: "4-7 nights", areas: "Dushanbe, Pamir, Seven Lakes", season: "May-Oct", profile: "Adventure travellers, mountaineers", priority: "Selective", price: "₹55,000", reviews: 65, imageUrl: "https://images.unsplash.com/photo-1583091924611-c918c575037d?q=80&w=800&auto=format&fit=crop" }
];

const generatePackageHTML = (pkg) => `
<div class="featured-item">
  <div class="featured-item__text">
    <div class="featured-item__head">
      <div data-animation="featured-item-head" class="h4">${pkg.title}</div>
      <div data-animation="featured-item-cost" class="featured-item__cost">
        <div class="body-md color-white-60">from</div>
        <div class="body-lg-semibold">${pkg.price}</div>
      </div>
    </div>
    <div class="featured-item__visual mobile-visible">
      <img src="${pkg.imageUrl}" loading="lazy" alt="${pkg.country}" class="featured-item__illustration" srcset="">
    </div>
    <div class="featured-item__body">
      <div class="featured-item__properties">
        <div data-animation="featured-item-property" class="featured-item-property">
          <div class="featured-item-property__title">
            <div class="title-xs">${pkg.country}</div>
          </div>
          <img src="fonts/697b12d0cfc7c0ffb4594ddd_200b069e26d5dbf25e7efe28a16ac85b_pin.svg" loading="lazy" alt="" class="featured-item-property__icon opacity-20">
        </div>
        <div data-animation="featured-item-property" class="featured-item-property">
          <div class="featured-item-property__title">
            <div class="title-xs">${pkg.stay} <span class="color-white-60"></span></div>
          </div>
          <img src="fonts/697b12d013c40d035e576fc8_calendar.svg" loading="lazy" alt="" class="featured-item-property__icon opacity-20">
        </div>
        <div data-animation="featured-item-property" class="featured-item-property">
          <div class="featured-item-property__title">
            <div class="title-xs">Best in ${pkg.season}</div>
          </div>
          <img src="fonts/697b12d0b38d158447cd2f5b_users.svg" loading="lazy" alt="" class="featured-item-property__icon opacity-20">
        </div>
        <div data-animation="featured-item-property" class="featured-item-property">
          <div class="featured-item-property__title">
            <div class="title-xs">Trusted by ${pkg.reviews}+ <span class="color-white-60">clients</span></div>
          </div>
          <img src="fonts/697b13a6c05aa0554867732d_stars.svg" loading="lazy" alt="" class="featured-item-property__icon size-l">
        </div>
      </div>
      <div data-animation="featured-item-button" class="featured-item__button">
        <a data-wf--button-secondary--variant="full-width" href="/package/${pkg.country.toLowerCase().replace(/[^a-z0-9]/g, '-')}" class="btn-secondary w-variant-28eadc15-d435-4480-c473-16eb53816cbc w-inline-block">
          <div class="button-sm color-white">Explore Package</div>
          <div class="btn-icon w-embed">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C8 0 7.32057 2.41553 7.32057 4C7.32057 5.58447 8 8 8 8C8 8 5.58447 7.32057 4 7.32057C2.41553 7.32057 0 8 0 8C0 8 0.679427 5.58447 0.679427 4C0.679427 2.41553 0 0 0 0C0 0 2.41553 0.679426 4 0.679426C5.58447 0.679426 8 0 8 0Z" fill="white"></path>
            </svg>
          </div>
        </a>
      </div>
    </div>
  </div>
  <div class="featured-item__visual mobile-hidden">
    <img src="${pkg.imageUrl}" loading="lazy" data-animation="featured-item-illustration" alt="${pkg.country}" class="featured-item__illustration" srcset="">
  </div>
</div>
`;

const generateDestinationHTML = (pkg) => `
<div class="destination-mobile-item">
  <div class="destination-mobile-item__head">
    <div class="body-lg">${pkg.country}</div>
    <div class="body-sm color-white-50">/ ${pkg.stay}</div>
  </div>
  <div class="destination-mobile-item__visual">
    <img src="${pkg.imageUrl}" loading="lazy" alt="" class="destination-mobile-item__illustration">
  </div>
</div>
`;

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf-8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // Popular Packages
    const popularPackagesHtml = packages.map(generatePackageHTML).join('\n');
    $('.featured__items').html(popularPackagesHtml);

    // Update section text to Popular Packages if needed
    $('.head__description .h2').each((i, el) => {
        const text = $(el).text();
        if (text.includes('Featured Retreats') || text.includes('Featured')) {
            $(el).html('Popular <span class="mobile-fw">Packages</span>');
        }
        if (text.includes('Explore by Destination')) {
            $(el).html('Top Trending <span class="mobile-fw">INTERNATIONAL Destinations</span>');
        }
    });

    // Trending Destinations
    const destinationsHtml = packages.slice(10, 13).map(generateDestinationHTML).join('\n');
    $('.destination-mobile').html(destinationsHtml);
    
    fs.writeFileSync(filename, $.html());
    console.log(`Updated ${filename}`);
}

processFile('index.html');
processFile('packages.html');
