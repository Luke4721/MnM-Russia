const fs = require('fs');
const cheerio = require('cheerio');

const originalHtml = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');

function createPage(filename, title, generateContent) {
    const $ = cheerio.load(originalHtml);
    $('title').text(title + ' | MNM Travel');
    
    // Update active nav link
    $('.header-menu__item').removeClass('w--current');
    $(`.header-menu__item[href="${filename}"]`).addClass('w--current');
    
    // Save the footer
    const footerHtml = $('.footer').parent().html() ? $('.footer').prop('outerHTML') : '';
    
    // Empty the main wrapper
    $('.main-wrapper').empty();
    
    // Generate new content
    const newContentHtml = generateContent($);
    
    // Append content and footer
    $('.main-wrapper').append(newContentHtml);
    $('.main-wrapper').append(footerHtml);
    
    fs.writeFileSync(`E:/MnM_Travel_Russian/${filename}`, $.html());
    console.log(`Generated ${filename}`);
}

// 1. Packages Page
createPage('packages.html', 'Destinations', ($) => {
    const $orig = cheerio.load(originalHtml);
    const featuredSection = $orig('.featured-section').clone();
    featuredSection.find('.h2').text('All Destinations');
    return featuredSection.prop('outerHTML');
});

// 2. About Page
createPage('about.html', 'About Us', ($) => {
    return `
    <section class="padding-global" style="padding-top: 150px; padding-bottom: 100px;">
        <div class="container">
            <div class="h2 text-center" style="margin-bottom: 50px;">Our <span style="color:#C19A5B">Heritage</span></div>
            <div class="row align-center" style="gap: 40px; display: flex; flex-wrap: wrap;">
                <div class="column column-6" style="flex: 1; min-width: 300px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                        <h3 class="h3" style="margin-bottom: 20px;">Welcome to MNM Travel</h3>
                        <p class="body-lg" style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
                            Founded with a passion for travel and a deep love for our country's rich cultural heritage, we specialize in creating unforgettable travel experiences for both domestic and international tourists.
                        </p>
                        <h4 class="h4" style="margin-bottom: 10px; margin-top: 30px;">Who We Are</h4>
                        <p class="body-md" style="color: rgba(255,255,255,0.6);">
                            We are a team of dedicated travel enthusiasts and experts with extensive knowledge of the most breathtaking destinations. Our journey began with a simple goal: to share the wonders of travel with the world.
                        </p>
                        <h4 class="h4" style="margin-bottom: 10px; margin-top: 30px;">Our Mission</h4>
                        <p class="body-md" style="color: rgba(255,255,255,0.6);">
                            Our mission is to provide exceptional travel experiences that highlight the rich diversity, cultural heritage, and natural beauty.
                        </p>
                    </div>
                </div>
                <div class="column column-6" style="flex: 1; min-width: 300px;">
                    <img src="images/6979a5eeee86150be7247f79_illustration-about.jpg" style="border-radius: 20px; width: 100%; object-fit: cover; aspect-ratio: 4/5;" alt="About Us" />
                    <div style="display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center;">
                            <div class="h3" style="color: #C19A5B">15+</div>
                            <div class="body-sm" style="opacity: 0.7">Years Exp</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center;">
                            <div class="h3" style="color: #C19A5B">1K+</div>
                            <div class="body-sm" style="opacity: 0.7">Happy Clients</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center;">
                            <div class="h3" style="color: #C19A5B">100+</div>
                            <div class="body-sm" style="opacity: 0.7">Destinations</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
});

// 3. Contact Page
createPage('contact.html', 'Contact Us', ($) => {
    return `
    <section class="padding-global" style="padding-top: 150px; padding-bottom: 100px;">
        <div class="container">
            <div class="h2 text-center" style="margin-bottom: 50px;">Get in <span style="color:#C19A5B">Touch</span></div>
            <div style="max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); padding: 50px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                <form>
                    <div style="margin-bottom: 20px;">
                        <label class="body-sm" style="display:block; margin-bottom: 10px; color: #fff;">Full Name</label>
                        <input type="text" style="width: 100%; padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;" placeholder="John Doe">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label class="body-sm" style="display:block; margin-bottom: 10px; color: #fff;">Email Address</label>
                        <input type="email" style="width: 100%; padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;" placeholder="info@example.com">
                    </div>
                    <div style="margin-bottom: 30px;">
                        <label class="body-sm" style="display:block; margin-bottom: 10px; color: #fff;">Message</label>
                        <textarea rows="5" style="width: 100%; padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white;" placeholder="How can we help you?"></textarea>
                    </div>
                    <button type="submit" class="btn-secondary w-button" style="width: 100%; text-align: center; justify-content: center; background: #C19A5B; color: #111;">Send Message</button>
                </form>
            </div>
            <div style="display: flex; justify-content: center; gap: 40px; margin-top: 60px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div class="body-lg-semibold" style="margin-bottom: 10px; color: #C19A5B;">Email</div>
                    <div class="body-md">info@mnmtravel.com</div>
                </div>
                <div style="text-align: center;">
                    <div class="body-lg-semibold" style="margin-bottom: 10px; color: #C19A5B;">Phone</div>
                    <div class="body-md">+91 123 456 7890</div>
                </div>
                <div style="text-align: center;">
                    <div class="body-lg-semibold" style="margin-bottom: 10px; color: #C19A5B;">Location</div>
                    <div class="body-md">New Delhi, India</div>
                </div>
            </div>
        </div>
    </section>
    `;
});

// 4. Gallery Page
createPage('gallery.html', 'Gallery', ($) => {
    const mnmImagesDir = 'E:/MNM_Website/public/images';
    let availableImages = fs.readdirSync(mnmImagesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.jpeg'));
    
    let imageBlocks = '';
    availableImages.forEach(img => {
        const targetPath = 'E:/MnM_Travel_Russian/images/' + img;
        if(!fs.existsSync(targetPath)) {
            fs.copyFileSync(mnmImagesDir + '/' + img, targetPath);
        }
        imageBlocks += '<img src="images/' + img + '" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" loading="lazy" alt="Gallery Image" />';
    });

    return `
    <section class="padding-global" style="padding-top: 150px; padding-bottom: 100px;">
        <div class="container">
            <div class="h2 text-center" style="margin-bottom: 50px;">Our <span style="color:#C19A5B">Gallery</span></div>
            <div style="column-count: 3; column-gap: 20px;">
                ${imageBlocks}
            </div>
        </div>
    </section>
    <style>
        @media (max-width: 768px) {
            div[style*="column-count: 3"] {
                column-count: 2 !important;
            }
        }
        @media (max-width: 480px) {
            div[style*="column-count: 3"] {
                column-count: 1 !important;
            }
        }
    </style>
    `;
});

// 5. Blog Page
createPage('blog.html', 'Blog', ($) => {
    return `
    <section class="padding-global" style="padding-top: 150px; padding-bottom: 100px;">
        <div class="container">
            <div class="h2 text-center" style="margin-bottom: 50px;">Travel <span style="color:#C19A5B">Journal</span></div>
            <div class="row" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
                
                <div style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <img src="images/ladakh.jpg" style="width: 100%; height: 200px; object-fit: cover;" alt="Blog" />
                    <div style="padding: 20px;">
                        <div class="body-sm" style="color: #C19A5B; margin-bottom: 10px;">Travel Tips</div>
                        <div class="h4" style="margin-bottom: 15px;">Exploring Ladakh: The Ultimate Guide</div>
                        <p class="body-md" style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">Discover the breathtaking landscapes, ancient monasteries, and vibrant culture of Ladakh in our comprehensive travel guide.</p>
                        <a href="#" style="color: #fff; font-weight: bold; border-bottom: 1px solid #C19A5B; padding-bottom: 2px;">Read More</a>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <img src="images/mumbai.jpg" style="width: 100%; height: 200px; object-fit: cover;" alt="Blog" />
                    <div style="padding: 20px;">
                        <div class="body-sm" style="color: #C19A5B; margin-bottom: 10px;">Culture</div>
                        <div class="h4" style="margin-bottom: 15px;">The Magic of South India</div>
                        <p class="body-md" style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">From the serene backwaters of Kerala to the majestic temples of Tamil Nadu, South India is a treasure trove of cultural experiences.</p>
                        <a href="#" style="color: #fff; font-weight: bold; border-bottom: 1px solid #C19A5B; padding-bottom: 2px;">Read More</a>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <img src="images/darjeeling.jpg" style="width: 100%; height: 200px; object-fit: cover;" alt="Blog" />
                    <div style="padding: 20px;">
                        <div class="body-sm" style="color: #C19A5B; margin-bottom: 10px;">Wellness</div>
                        <div class="h4" style="margin-bottom: 15px;">Top 5 Wellness Retreats in India</div>
                        <p class="body-md" style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">Rejuvenate your mind, body, and soul at these top-rated wellness retreats nestled in the serene landscapes of India.</p>
                        <a href="#" style="color: #fff; font-weight: bold; border-bottom: 1px solid #C19A5B; padding-bottom: 2px;">Read More</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
});
