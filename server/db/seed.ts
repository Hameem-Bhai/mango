export function seedDatabase(db: any) {
    // Categories
    const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    if (categoriesCount.count === 0) {
        const insertCategory = db.prepare('INSERT INTO categories (slug, label, description) VALUES (?, ?, ?)');
        const categories = [
            ['disposables', 'Disposables', 'Grab & go, up to 8000 puffs'],
            ['pod-kits', 'Pod Kits', 'Refillable, built to last'],
            ['e-liquids', 'E-Liquids', 'Bottle your favorite flavor'],
            ['coils-tanks', 'Coils & Parts', 'Keep your kit running']
        ];
        categories.forEach(c => insertCategory.run(c));
    }

    // Products
    const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (productsCount.count === 0) {
        const insertProduct = db.prepare(`
            INSERT INTO products (slug, name, flavor, description, price, compareAtPrice, colorHex, puffCount, nicotine, volume, category, rating, reviewCount, featured, brand, imageUrl, flavors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const products = [
            // e-liquids
            ['bar-juice-30ml', 'Bar Juice 30ml', 'Assorted Flavors', 'Premium Bar Juice in assorted refreshing flavors.', 1600, 1800, '#FDA701', null, '3mg', '30ml', 'e-liquids', null, 0, 0, 'Bar Juice', '/products/bar-juice-30ml.webp', 'Watermelon Ice, Fresh Mint, Strawberry Banana, Blue Razz Ice, Mango Peach'],
            ['blvk-juice-30ml', 'Blvk Juice 30ml', 'Assorted Flavors', 'Premium BLVK Unicorn Juice in popular classic profiles.', 1600, 1800, '#1A1A1A', null, '3mg', '30ml', 'e-liquids', null, 0, 1, 'BLVK', '/products/blvk-juice-30ml.webp', 'Caramel Tobacco, Spearmint, Grape Apple, Mango Ice, Lychee Ice'],
            ['will-well-juice-10ml', 'Will Well Juice 10ml', 'Assorted Flavors', 'Pocket-sized Will Well 10ml juice with rich vapor production.', 500, 600, '#06B6D4', null, '3mg', '10ml', 'e-liquids', null, 0, 0, 'Will Well', '/products/will-well-juice-10ml.jpg', 'Mint Frost, Grape Chill, Berry Mix'],
            ['flyto-juice-30ml', 'Flyto Juice 30ml', 'Assorted Flavors', 'Original Flyto 30ml juice engineered for pod systems.', 1500, 1700, '#FF6B35', null, '3mg', '30ml', 'e-liquids', null, 0, 0, 'Flyto', '/products/flyto-juice-30ml.webp', 'Mango Freeze, Cool Mint, Watermelon Lush, Peach Ice'],
            ['flyto-juice-10ml', 'Flyto Juice 10ml', 'Assorted Flavors', 'Convenient 10ml Flyto juice with high flavor fidelity.', 600, 700, '#FF6B35', null, '3mg', '10ml', 'e-liquids', null, 0, 0, 'Flyto', '/products/flyto-juice-10ml.webp', 'Mango Freeze, Cool Mint, Watermelon Lush'],
            ['vct-juice-30ml', 'VCT Juice 30ml', 'Tobacco & Dessert', 'World famous Ripe Vapes VCT (Vanilla Custard Tobacco).', 1600, 1800, '#8B4513', null, '3mg', '30ml', 'e-liquids', null, 0, 1, 'VCT', '/products/vct-juice-30ml.webp', 'Original Vanilla Custard Tobacco, Sweet Almond VCT, Cafe Mocha VCT'],
            ['just-juice-30ml', 'Just Juice 30ml', 'Assorted Flavors', 'British award-winning premium fruit e-liquids.', 1600, 1800, '#22C55E', null, '3mg', '30ml', 'e-liquids', null, 0, 0, 'Just Juice', '/products/just-juice-30ml.webp', 'Mango & Passionfruit, Berry Burst, Blood Orange & Guava, Kiwi Cranberry'],
            ['vgod-juice-30ml', 'Vgod Juice 30ml', 'Assorted Flavors', 'Legendary VGOD high performance vape liquid.', 1600, 1800, '#076136', null, '3mg', '30ml', 'e-liquids', null, 0, 1, 'VGOD', '/products/vgod-juice-30ml.webp', 'Lush Ice, Cubano Rich Cigar, Mighty Mint, Apple Bomb'],
            ['juice-head-30ml', 'Juice Head 30ml', 'Fruit Blends', 'Sweet and tart Californian fruit blends.', 1600, 1800, '#FF4444', null, '3mg', '30ml', 'e-liquids', null, 0, 0, 'Juice Head', '/products/juice-head-30ml.webp', 'Peach Pear, Blueberry Lemon, Strawberry Kiwi, Watermelon Lime'],
            ['juice-head-100ml', 'Juice Head 100ml', 'Fruit Blends', 'Large format 100ml Juice Head freebase bottle.', 2200, 2500, '#FF4444', null, '3mg', '100ml', 'e-liquids', null, 0, 0, 'Juice Head', '/products/juice-head-100ml.webp', 'Peach Pear, Blueberry Lemon, Watermelon Lime'],
            ['juice-head-120ml', 'Juice Head 120ml', 'Fruit Blends', 'Extra value 120ml bottle with authentic Californian fruit profiles.', 2400, 2700, '#FF4444', null, '3mg', '120ml', 'e-liquids', null, 0, 0, 'Juice Head', '/products/juice-head-120ml.webp', 'Peach Pear, Blueberry Lemon, Strawberry Kiwi'],
            ['prevase-30ml', 'Prevase 30ml', 'Assorted Flavors', 'Smooth salt nicotine blends with crisp cooling finish.', 1600, 1800, '#EC4899', null, '3mg', '30ml', 'e-liquids', null, 0, 0, 'Prevase', '/products/prevase-30ml.webp', 'Watermelon Ice, Grape Soda, Double Apple, Cool Mint'],
            
            // coils-tanks
            ['uwell-caliburn-g3-cartridge', 'Uwell Caliburn G3 Cartridge', 'Integrated Coil Pod', 'Replacement cartridge for Uwell Caliburn G3 with anti-leak tech.', 400, null, '#076136', null, null, null, 'coils-tanks', null, 0, 0, 'Uwell', '/products/uwell-caliburn-g3-cartridge.png', '0.6Ω Mesh Pod, 0.9Ω Mesh Pod'],
            ['vaporesso-xros-cartridge', 'Vaporesso XROS Cartridge', 'Corex Heating Pod', 'Authentic Vaporesso XROS replacement pod cartridge.', 400, null, '#1A1A1A', null, null, null, 'coils-tanks', null, 0, 0, 'Vaporesso', '/products/vaporesso-xros-cartridge.png', '0.6Ω Mesh, 0.8Ω Mesh, 1.0Ω Regular'],
            ['kumiho-cartridge', 'Kumiho Cartridge', 'Model Pod Replacement', 'Genuine replacement pod cartridge for Kumiho series.', 400, null, '#F59E0B', null, null, null, 'coils-tanks', null, 0, 0, 'Kumiho', '/products/kumiho-cartridge.png', '0.6Ω Mesh, 0.8Ω Mesh'],
            ['voopoo-argus-cartridge', 'Voopoo Argus Cartridge', 'ITO Atomization Pod', 'Replacement top-fill cartridge for Voopoo Argus Pod series.', 400, null, '#FDA701', null, null, null, 'coils-tanks', null, 0, 0, 'Voopoo', '/products/voopoo-argus-cartridge.png', '0.7Ω Mesh, 1.2Ω MTL'],

            // disposables
            ['elfbar-raya-d1-13000-puffs', 'Elfbar Raya D1 13000 Puffs', 'Digital Screen Disposable', 'The all-new Elfbar Raya D1 offers up to 13,000 puffs with smart digital display.', 1800, 2000, '#0066CC', 13000, '50mg', null, 'disposables', null, 0, 1, 'Elf Bar', '/products/elfbar-raya-d1-13k.webp', 'Watermelon Bubblegum, Double Mango, Grape Ice, Strawberry Kiwi, Blueberry Ice, Miami Mint'],
            ['elfbar-raya-s1-15000-puffs', 'Elfbar Raya S1 15000 Puffs', 'Dual Mesh Disposable', 'High puff count Elfbar Raya S1 featuring turbo mode and battery monitor.', 1900, 2200, '#0066CC', 15000, '50mg', null, 'disposables', null, 0, 1, 'Elf Bar', '/products/elfbar-raya-s1-15k.png', 'Peach Mango Watermelon, Miami Mint, Blue Razz Ice, Strawberry Blast, Kiwi Passionfruit'],
            ['flyto-6k-full-kit', 'Flyto 6K Full Kit', 'Switchable Disposable Kit', 'Complete rechargeable battery kit with 6,000 puff prefilled pod.', 1200, 1400, '#FF6B35', 6000, '50mg', null, 'disposables', null, 0, 0, 'Flyto', '/products/flyto-6k-full-kit.png', 'Mango Freeze, Cool Mint, Lush Ice, Triple Berry'],
            ['flyto-6k-cartridge', 'Flyto 6K Cartridge', 'Replacement Pod Pod', 'Refill cartridge replacement for Flyto 6K device.', 600, 700, '#FF6B35', 6000, '50mg', null, 'disposables', null, 0, 0, 'Flyto', '/products/flyto-6k-cartridge.png', 'Mango Freeze, Cool Mint, Lush Ice, Triple Berry'],
            ['flyto-10k-full-kit', 'Flyto 10K Full Kit', 'High-Puff Rechargeable Kit', 'Complete kit for Flyto 10,000 puffs with dual airflow control.', 1400, 1600, '#FF6B35', 10000, '50mg', null, 'disposables', null, 0, 1, 'Flyto', '/products/flyto-10k-full-kit.png', 'Mango Freeze, Cool Mint, Lush Ice, Kiwi Passionfruit, Grape Energy'],
            ['flyto-10k-cartridge', 'Flyto 10K Cartridge', 'Replacement 10K Pod', 'Pre-filled 10K replacement pod for Flyto 10K kit.', 800, 900, '#FF6B35', 10000, '50mg', null, 'disposables', null, 0, 0, 'Flyto', '/products/flyto-10k-cartridge.png', 'Mango Freeze, Cool Mint, Lush Ice, Kiwi Passionfruit'],
            ['kiligbar-6k-full-kit', 'Kiligbar 6K Full Kit', 'Compact Prefilled Kit', 'Kiligbar 6,000 puff full starter set with Type-C fast charging.', 1200, 1400, '#8B5CF6', 6000, '50mg', null, 'disposables', null, 0, 0, 'Kiligbar', '/products/kiligbar-6k-full-kit.webp', 'Grape Ice, Watermelon Ice, Blueberry Raspberry, Strawberry Ice'],
            ['kiligbar-6k-cartridge', 'Kiligbar 6K Cartridge', 'Prefilled Replacement Pod', 'Replacement flavor cartridge for Kiligbar 6K battery.', 600, 700, '#8B5CF6', 6000, '50mg', null, 'disposables', null, 0, 0, 'Kiligbar', '/products/kiligbar-6k-cartridge.png', 'Grape Ice, Watermelon Ice, Blueberry Raspberry, Strawberry Ice'],

            // pod-kits
            ['uwell-caliburn-g3-pod-kit', 'Uwell Caliburn G3 Pod Kit', 'Refillable Pod System', 'Next-gen Uwell Caliburn G3 with OLED display, 25W max output, dual airflow, and 900mAh battery.', 2800, 3100, '#076136', null, null, '2.5ml', 'pod-kits', null, 0, 1, 'Uwell', '/products/uwell-caliburn-g3-pod-kit.webp', 'Midnight Black, Space Grey, Silver, Cobalt Blue, Emerald Green'],
            ['vaporesso-xros-3-pod-kit', 'Vaporesso XROS 3 Pod Kit', 'Refillable Pod System', 'Best-selling Vaporesso XROS 3 featuring Axon chip, Pulse Mode, precise airflow, and 1000mAh battery.', 2600, 2900, '#1A1A1A', null, null, '2ml', 'pod-kits', null, 0, 1, 'Vaporesso', '/products/vaporesso-xros-3-pod-kit.webp', 'Black, Space Grey, Navy Blue, Rose Pink, Sky Blue'],
            ['voopoo-argus-g-pod-kit', 'Voopoo Argus G Pod Kit', 'Refillable Pod System', 'Sleek Voopoo Argus G with 1000mAh battery, OLED screen, multi-layer leakage-proof cartridge, and 25W power.', 2900, 3200, '#FDA701', null, null, '2ml', 'pod-kits', null, 0, 1, 'Voopoo', '/products/voopoo-argus-g-pod-kit.webp', 'Space Grey, Racing Green, Gloss Black, Glow Pink, Satin Blue'],
            ['kumiho-model-v-pod-kit', 'Kumiho Model V Pod Kit', 'Refillable Pod System', 'Ultra-compact Kumiho Model V aluminum alloy pod system with vibrating interaction and 600mAh battery.', 2200, 2500, '#F59E0B', null, null, '2ml', 'pod-kits', null, 0, 0, 'Kumiho', '/products/kumiho-model-v-pod-kit.webp', 'Black, Gunmetal, Blue, Red, Gold']
        ];
        
        products.forEach(p => insertProduct.run(p));
    }

    // Blog Posts
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number };
    if (blogCount.count === 0) {
        const insertBlog = db.prepare(`
            INSERT INTO blog_posts (slug, title, excerpt, content, author, category)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const posts = [
            ['how-to-prime-coils', 'How to Properly Prime Your Coils', 'Learn the essential steps to priming your new vape coils for maximum lifespan and best flavor.', 'Priming your coils is the most important step when installing a new coil. If you skip this step, you risk burning the cotton instantly, ruining the coil before you even get to use it. \n\nFirst, take your new coil and locate the exposed cotton ports. Apply a few drops of e-liquid directly onto the cotton until it appears saturated. Next, install the coil into your pod or tank and fill it with your favorite e-liquid. \n\nNow for the crucial part: wait. Let the tank sit for at least 5-10 minutes. This allows the e-liquid to fully soak into the dense cotton. For an extra measure, take a few "primer puffs" without pressing the fire button. This pulls liquid into the coil. \n\nStart vaping at a lower wattage than recommended and slowly work your way up to your preferred setting. This process ensures your coil lasts longer and delivers the purest flavor possible.', 'Vape Master BD', 'Guides'],
            ['guide-to-charging', 'Complete Guide to Charging Your Vape', 'Safety tips, charging times, and battery care to keep your vape running smoothly in Bangladesh weather.', 'Battery safety is paramount when it comes to vaping. Always use the charger that came with your device or a high-quality replacement. Never use a phone fast charger unless your device specifically supports it, as pushing too much current can damage the battery.\n\nMost modern vapes feature USB-C charging and take between 45 minutes to 2 hours to fully charge. Do not leave your vape charging overnight or unattended. Once it is fully charged, unplug it to prevent battery degradation.\n\nKeep your device out of extreme temperatures. In Dhaka heat, leaving it in a hot car can cause the battery to vent and liquid to leak. Proper battery care extends the life of your device significantly.', 'Tech Guru', 'Guides'],
            ['disposables-vs-pod-kits', 'Disposables vs Pod Kits: Which Is Right For You?', 'A comprehensive comparison between disposable vapes and refillable pod systems in Bangladesh.', 'The vape market has evolved rapidly, presenting consumers with two main choices: disposable vapes and refillable pod kits. Which one is right for you in BD?\n\nDisposables offer ultimate convenience. There is no filling, no coil changing, and no charging (until the battery dies on rechargeable models). You simply open the package and vape. They are perfect for beginners, travelers, or those who want a zero-maintenance experience. However, they are more expensive in the long run.\n\nPod kits require a small initial investment but are significantly cheaper to maintain. You buy bottles of e-liquid and replacement coils or pods. This gives you access to thousands of flavor combinations and varying nicotine strengths. While they require some maintenance, such as cleaning and refilling, they are the more sustainable and cost-effective choice for regular vapers.', 'Review Team', 'Reviews'],
            ['understanding-nicotine-strengths', 'Understanding Nicotine Strengths', 'A guide to mg levels, salt nic versus freebase, and finding your perfect match.', 'Choosing the right nicotine strength is critical to your vaping journey. There are two main types of nicotine used in e-liquids: Freebase and Nicotine Salts.\n\nFreebase nicotine is the traditional form. It provides a stronger throat hit and is typically used in sub-ohm devices at lower concentrations (0mg, 3mg, 6mg, up to 12mg). It is ideal for vapers who want large clouds and a noticeable throat hit.\n\nNicotine Salts are smoother, allowing for much higher nicotine concentrations (typically 20mg to 50mg) without a harsh throat hit. They are absorbed by the body faster, mimicking the sensation of a traditional cigarette. Nic salts are exclusively used in low-wattage pod systems and disposable vapes.\n\nIf you are transitioning from smoking, a high-strength nic salt (35mg-50mg) in a pod system is usually recommended. If you prefer large clouds and flavor, a 3mg or 6mg freebase liquid in a sub-ohm tank is the way to go.', 'Mr. Mango Team', 'Tips'],
            ['top-5-vape-maintenance-tips', 'Top 5 Vape Maintenance Tips', 'Keep your device clean and functioning perfectly with these easy maintenance tips.', 'Regular maintenance extends the life of your device and ensures you always get the best flavor. Here are our top 5 tips:\n\n1. Keep it Clean: Use a cotton swab to clean the contacts between your pod/tank and the battery. E-liquid condensation can build up here and cause connection issues.\n\n2. Change Coils Regularly: Depending on your usage and the sweetness of your e-liquid, coils last between 1 to 3 weeks. If your vape tastes burnt or flavor diminishes, change it.\n\n3. Store Upright: Always store your vape standing up. This prevents the e-liquid from leaking through the mouthpiece or airflow holes.\n\n4. Monitor E-liquid Levels: Never let your tank run completely empty. Vaping on a dry coil will burn the cotton instantly, requiring a coil replacement.\n\n5. Clean Your Tank: When changing flavors, disassemble your tank and wash the glass and metal parts (not the coil!) in warm water. Let them dry completely before reassembly to avoid flavor ghosting.', 'Mr. Mango Team', 'Tips']
        ];
        
        posts.forEach(p => insertBlog.run(p));
    }

    // FAQ Items
    const faqCount = db.prepare('SELECT COUNT(*) as count FROM faq_items').get() as { count: number };
    if (faqCount.count === 0) {
        const insertFaq = db.prepare('INSERT INTO faq_items (question, answer, category, sortOrder) VALUES (?, ?, ?, ?)');
        
        const faqs = [
            ['Where is your physical outlet in Dhaka?', 'Our official physical outlet is located at 2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka. You can visit for in-person shopping, device testing, flavor advice, and instant purchases!', 'Outlets', 1],
            ['How fast is delivery inside Dhaka and outside Dhaka?', 'Inside Dhaka, we provide same-day or 24-hour express delivery across Kuril, Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Bashundhara, and all other areas. Outside Dhaka across all Bangladesh, delivery takes 2-3 business days via courier (Steadfast / RedX / Pathao).', 'Shipping', 1],
            ['What payment methods do you accept in Bangladesh?', 'We accept bKash, Nagad, Rocket, Upay, Visa/Mastercard debit and credit cards, and Cash on Delivery (COD) inside Dhaka.', 'Ordering', 1],
            ['Are all products 100% authentic original brands?', 'Yes, absolutely! We guarantee 100% authentic products sourced directly from official manufacturers (Elf Bar, Geek Bar, Lost Mary, Uwell, Vaporesso, SMOK, etc.) with scratch-off verification codes on every box.', 'Products', 1],
            ['What is your return or warranty policy?', 'We accept returns on unopened, sealed products within 7 days. If a device has a manufacturing defect upon unboxing, contact us within 24 hours with a video proof for an immediate exchange.', 'Returns', 1],
            ['How do I track my order?', 'Once your order is dispatched, you will receive an SMS and tracking number. You can also track your order status directly on our Track Order page using your order ID.', 'Ordering', 2],
            ['Why do I need to verify my age?', 'You must be 18+ / 21+ of legal age to purchase any vape product. We strictly prohibit sales to minors.', 'Age Verification', 1],
            ['Can I visit your Kuril outlet directly without ordering online?', 'Yes! Our Kuril outlet (Tong Market, beside AIUB main gate) is open daily from 11:00 AM to 11:00 PM. Our friendly staff will help you choose devices, juices, and replacement pods.', 'Outlets', 2]
        ];
        
        faqs.forEach(f => insertFaq.run(f));
    }
}
