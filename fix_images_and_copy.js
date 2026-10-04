const fs = require('fs');

function fixHtml(filename) {
  if (!fs.existsSync(filename)) return;
  let html = fs.readFileSync(filename, 'utf-8');
  
  // The packages script accidentally used country names as image src. 
  // We'll replace them globally with nice Unsplash luxury/safari images.
  const fixes = {
    'src="Singapore"': 'src="https://images.unsplash.com/photo-1525625298151-1811b8382536?q=80&w=800&auto=format&fit=crop"',
    'src="Malaysia"': 'src="https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=800&auto=format&fit=crop"',
    'src="France"': 'src="https://images.unsplash.com/photo-1502602812047-d7585f1c5092?q=80&w=800&auto=format&fit=crop"',
    'src="Spain"': 'src="https://images.unsplash.com/photo-1539037116271-8b010c7b415a?q=80&w=800&auto=format&fit=crop"',
    'src="Indonesia"': 'src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop"',
    'src="Kazakhstan"': 'src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop"',
    'src="Azerbaijan"': 'src="https://images.unsplash.com/photo-1581417539958-8b9a1a4c89bd?q=80&w=800&auto=format&fit=crop"',
    'src="Uzbekistan"': 'src="https://images.unsplash.com/photo-1585288221833-289849202161?q=80&w=800&auto=format&fit=crop"',
    'src="Bhutan"': 'src="https://images.unsplash.com/photo-1570535232770-36a5c1e956a6?q=80&w=800&auto=format&fit=crop"',
    'src="Japan"': 'src="https://images.unsplash.com/photo-1493976040381-81cb061568d9?q=80&w=800&auto=format&fit=crop"',
    'src="Russia"': 'src="https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=800&auto=format&fit=crop"',
    'src="Armenia"': 'src="https://images.unsplash.com/photo-1572522770836-e0f3918a56c4?q=80&w=800&auto=format&fit=crop"',
    'src="Portugal"': 'src="https://images.unsplash.com/photo-1527780004940-d66a6a4c0eb3?q=80&w=800&auto=format&fit=crop"',
    'src="Kyrgyzstan"': 'src="https://images.unsplash.com/photo-1569429184423-37604da88bd4?q=80&w=800&auto=format&fit=crop"',
    'src="Tajikistan"': 'src="https://images.unsplash.com/photo-1583091924611-c918c575037d?q=80&w=800&auto=format&fit=crop"'
  };

  for (const [bad, good] of Object.entries(fixes)) {
    html = html.split(bad).join(good);
  }

  // "Use the whole text content about what MNM is, take their logo from mnmtravels.com and make it their site in terms of text and data about the company, pivot from retreats to what will actually sell the packages"
  // Re-write text elements representing retreats to be packages/safaris/boutique tours
  
  html = html.replace(/Retreats/g, 'Bespoke Packages');
  html = html.replace(/Retreat/g, 'Package');
  html = html.replace(/wellness travel marketplace/g, 'tailor-made luxury travel boutique');
  html = html.replace(/Introvert Bespoke Packages/g, 'Private Luxury Safaris');
  html = html.replace(/Yoga Bespoke Packages/g, 'Curated Honeymoons');
  html = html.replace(/Detox/g, 'Cultural Immersions');
  
  html = html.replace(/Discover curated programs, match them with exceptional stays, and book seamlessly./g, 
  'We specialize in crafting highly personalized, ultra-luxury itineraries. From sweeping African safaris to hidden boutique coastal escapes, our experts build the trip around you.');
  
  html = html.replace(/Choose Package/g, 'Consult Our Experts');
  html = html.replace(/Match Boutique Stay/g, 'Design Your Itinerary');
  
  html = html.replace(/Browse certified experts with verified credentials and guest testimonials./g,
  'Speak with our senior travel designers who have personally vetted every lodge, camp, and boutique hotel we recommend.');

  fs.writeFileSync(filename, html);
  console.log('Fixed images and copy in ' + filename);
}

fixHtml('e:/MnM_Travel_Russian/index.html');
fixHtml('e:/MnM_Travel_Russian/packages.html');
