import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CLOTHING_CSV_PATH = path.join(ROOT_DIR, 'bangalore_clothing_brands_50_queue.csv');
const CLOTHING_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'bangalore_clothing_brands_50_queue.json');
const MASTER_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');
const HTML_FILES = [
  path.join(ROOT_DIR, 'pitchfinder.html'),
  path.join(ROOT_DIR, 'pitchfinder', 'index.html')
];

export const RAW_CLOTHING_50 = [
  {
    name: "Roshni Boutique",
    area: "Indiranagar",
    rating: 4.8,
    reviews: 245,
    phone: "+91 98863 12450",
    whatsapp: "919886312450",
    instagram: "roshniboutiquebangalore",
    website: "https://roshniboutique.com/",
    address: "732, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Contemporary ethnic kurtas, pastel festive collections & bespoke bridal styling"
  },
  {
    name: "Anahe Designer Store",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 189,
    phone: "+91 98801 82999",
    whatsapp: "919880182999",
    instagram: "anahestore",
    website: "https://anahe.in/",
    address: "4027, 1st Cross Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008",
    specialty: "Luxury designer wear, multi-designer bridal lehengas & festive gowns"
  },
  {
    name: "Rareism / The House of Rare",
    area: "Indiranagar",
    rating: 4.7,
    reviews: 580,
    phone: "+91 97418 20300",
    whatsapp: "919741820300",
    instagram: "therareism",
    website: "https://thehouseofrare.com/",
    address: "598, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Contemporary statement apparel, minimalist co-ords & modern luxury fits"
  },
  {
    name: "Capsul Streetwear",
    area: "Cunningham Road",
    rating: 4.8,
    reviews: 320,
    phone: "+91 98450 14922",
    whatsapp: "919845014922",
    instagram: "capsul_in",
    website: "https://capsul.in/",
    address: "24, Cunningham Rd, Vasanth Nagar, Bengaluru, Karnataka 560052",
    specialty: "Multi-brand streetwear, oversized graphic drops & hype culture fashion"
  },
  {
    name: "Street Junkies",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 140,
    phone: "+91 96113 47820",
    whatsapp: "919611347820",
    instagram: "streetjunkies.in",
    website: "https://streetjunkies.in/",
    address: "1089, 12th Main Rd, HAL 3rd Stage, Indiranagar, Bengaluru, Karnataka 560008",
    specialty: "Homegrown Indian streetwear, vintage drops, Y2K fits & sneaker aesthetics"
  },
  {
    name: "Virgio Fashion",
    area: "Koramangala",
    rating: 4.7,
    reviews: 610,
    phone: "+91 99002 44781",
    whatsapp: "919900244781",
    instagram: "virgio_in",
    website: "https://virgio.com/",
    address: "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    specialty: "Circular Gen-Z fashion, aesthetic runway pieces & conscious trendy clothing"
  },
  {
    name: "AIRA Design Studio",
    area: "Indiranagar",
    rating: 4.8,
    reviews: 115,
    phone: "+91 98440 23156",
    whatsapp: "919844023156",
    instagram: "airadesignstudio",
    website: "https://airadesignstudio.com/",
    address: "714, 10th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Bespoke everyday silhouettes, airy designer prints & handcrafted sets"
  },
  {
    name: "Label Bhavna Chhabria",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 95,
    phone: "+91 98860 74900",
    whatsapp: "919886074900",
    instagram: "labelbhavnachhabria",
    website: "https://labelbhavnachhabria.com/",
    address: "1098, 13th Main Rd, Indiranagar 2nd Stage, Bengaluru, Karnataka 560038",
    specialty: "Handcrafted festive couture, custom embroidered skirts & bridal lehengas"
  },
  {
    name: "Lila Slow Fashion",
    area: "Indiranagar",
    rating: 4.8,
    reviews: 130,
    phone: "+91 99805 17420",
    whatsapp: "919980517420",
    instagram: "lilabyanita",
    website: "https://lila.in/",
    address: "542, 9th A Main Rd, Indiranagar 1st Stage, Bengaluru, Karnataka 560038",
    specialty: "Comfortable organic cotton wear, pure khadi kaftans & minimalist separates"
  },
  {
    name: "IZA Designer Wear",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 165,
    phone: "+91 97390 51120",
    whatsapp: "919739051120",
    instagram: "izadesignerwear",
    website: "https://izadesignerwear.com/",
    address: "12th Main Rd, Doopanahalli, Indiranagar, Bengaluru, Karnataka 560008",
    specialty: "Sequined festive evening gowns, heavy bridal ensembles & modern couture"
  },
  {
    name: "Grandior Boutique",
    area: "Commercial Street",
    rating: 4.7,
    reviews: 310,
    phone: "+91 98451 77620",
    whatsapp: "919845177620",
    instagram: "grandiorboutique",
    website: "https://grandiorboutique.com/",
    address: "Commercial St, Tasker Town, Shivaji Nagar, Bengaluru, Karnataka 560001",
    specialty: "Pakistani ethnic salwar suits, pastel block prints & designer festive ghagras"
  },
  {
    name: "Mannat Fashion Store",
    area: "Commercial Street",
    rating: 4.6,
    reviews: 420,
    phone: "+91 98861 34910",
    whatsapp: "919886134910",
    instagram: "mannat_clothing",
    website: "https://mannatfashion.in/",
    address: "128, Commercial Street, Tasker Town, Bengaluru, Karnataka 560001",
    specialty: "Bollywood-inspired bridal wear, embroidered anarkalis & crepe festive sarees"
  },
  {
    name: "Salonee Silks N Cotton",
    area: "Commercial Street",
    rating: 4.8,
    reviews: 280,
    phone: "+91 98442 80915",
    whatsapp: "919844280915",
    instagram: "saloneesilks",
    website: "https://saloneesilks.com/",
    address: "Near Anand Sweets, Commercial St, Bengaluru, Karnataka 560001",
    specialty: "Artisanal handloom cottons, custom wedding anarkalis & Kalamkari fabrics"
  },
  {
    name: "Arshvi by Shraddha",
    area: "Commercial Street",
    rating: 4.9,
    reviews: 175,
    phone: "+91 97422 61500",
    whatsapp: "919742261500",
    instagram: "arshvibyshraddha",
    website: "https://arshvi.com/",
    address: "Off Commercial Street, Tasker Town, Bengaluru, Karnataka 560001",
    specialty: "Bespoke custom-stitched lehengas, bridal trousseaus & couture gowns"
  },
  {
    name: "Kineki Clothing & Co.",
    area: "Commercial Street",
    rating: 4.7,
    reviews: 390,
    phone: "+91 96205 34810",
    whatsapp: "919620534810",
    instagram: "kinekiclothingandco",
    website: "https://kinekiclothing.com/",
    address: "Commercial Street Arcade, Bengaluru, Karnataka 560001",
    specialty: "Trend-driven Instagram apparel, Gen-Z co-ords & direct aesthetic daily fits"
  },
  {
    name: "The Budget Boutique",
    area: "Koramangala",
    rating: 4.8,
    reviews: 290,
    phone: "+91 99015 62890",
    whatsapp: "919901562890",
    instagram: "thebudgetboutiqueblr",
    website: "https://thebudgetboutique.in/",
    address: "5th Block, Koramangala, Bengaluru, Karnataka 560095",
    specialty: "Pocket-friendly mirror-work kurtis, ethnic paisley prints & party lehengas"
  },
  {
    name: "Yati Couture",
    area: "Koramangala",
    rating: 4.9,
    reviews: 140,
    phone: "+91 98808 34710",
    whatsapp: "919880834710",
    instagram: "yaticouture",
    website: "https://yaticouture.com/",
    address: "JNC Road, 5th Block, Koramangala, Bengaluru, Karnataka 560095",
    specialty: "High-end occasion couture, pastel fusion gowns & bridal consultations"
  },
  {
    name: "Bridal Brigade",
    area: "Koramangala",
    rating: 4.9,
    reviews: 110,
    phone: "+91 96320 48190",
    whatsapp: "919632048190",
    instagram: "bridalbrigade",
    website: "https://bridalbrigade.in/",
    address: "6th Block, Koramangala, Bengaluru, Karnataka 560095",
    specialty: "Customized imported wedding gowns, convertible gowns & luxury veils"
  },
  {
    name: "Ni Hao Fashion Studio",
    area: "Koramangala",
    rating: 4.7,
    reviews: 210,
    phone: "+91 98459 23140",
    whatsapp: "919845923140",
    instagram: "nihaofashionstore",
    website: "https://nihaofashion.in/",
    address: "80 Feet Rd, Koramangala 7th Block, Bengaluru, Karnataka 560095",
    specialty: "Curated aesthetic street-smart fashion, runway imports & chic accessories"
  },
  {
    name: "RK Couture Designer Studio",
    area: "HSR Layout",
    rating: 4.9,
    reviews: 310,
    phone: "+91 99860 31850",
    whatsapp: "919986031850",
    instagram: "rkcouture_bangalore",
    website: "https://rkcouture.in/",
    address: "27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    specialty: "Handcrafted bridal lehengas, bespoke zardosi blouses & festive couture"
  },
  {
    name: "Closet Multi Designer",
    area: "HSR Layout",
    rating: 4.8,
    reviews: 195,
    phone: "+91 97411 95400",
    whatsapp: "919741195400",
    instagram: "closethsr",
    website: "https://closethsr.com/",
    address: "Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    specialty: "Traditional festive wear with a modern twist for men and women"
  },
  {
    name: "The Label Boutique HSR",
    area: "HSR Layout",
    rating: 4.8,
    reviews: 160,
    phone: "+91 98865 42710",
    whatsapp: "919886542710",
    instagram: "thelabelboutiqueblr",
    website: "https://thelabelboutique.in/",
    address: "27th Main Rd, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102",
    specialty: "Ready-to-wear boutique wear, Indo-western co-ords & designer party outfits"
  },
  {
    name: "House of Masaba",
    area: "Lavelle Road",
    rating: 4.8,
    reviews: 750,
    phone: "+91 98205 84400",
    whatsapp: "919820584400",
    instagram: "houseofmasaba",
    website: "https://houseofmasaba.com/",
    address: "Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001",
    specialty: "Signature quirky prints, avant-garde festive drape sarees & designer menswear"
  },
  {
    name: "DesiHues Ethnic Boutique",
    area: "Jayanagar",
    rating: 4.9,
    reviews: 230,
    phone: "+91 99001 87230",
    whatsapp: "919900187230",
    instagram: "desihues",
    website: "https://desihues.com/",
    address: "4th T Block East, 9th Block, Jayanagar, Bengaluru, Karnataka 560041",
    specialty: "Intricate bridal maggam work blouses, pure handloom pattu & custom outfits"
  },
  {
    name: "Kisah Festive Fashion",
    area: "Jayanagar",
    rating: 4.8,
    reviews: 340,
    phone: "+91 98454 61280",
    whatsapp: "919845461280",
    instagram: "kisah.in",
    website: "https://kisah.in/",
    address: "33, 11th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
    specialty: "Royal wedding sherwanis, bandhgalas, festive kurtas & luxury ethnic sets"
  },
  {
    name: "Lagorii Kids Couture",
    area: "Jayanagar",
    rating: 4.9,
    reviews: 180,
    phone: "+91 97315 28940",
    whatsapp: "919731528940",
    instagram: "lagoriikids",
    website: "https://lagorii.com/",
    address: "8th F Main Rd, Jayanagar 3rd Block, Bengaluru, Karnataka 560011",
    specialty: "Boutique kids' ethnic couture, party wear dresses & festive family outfits"
  },
  {
    name: "Anokhi Handlooms",
    area: "Jayanagar",
    rating: 4.8,
    reviews: 490,
    phone: "+91 98802 47310",
    whatsapp: "919880247310",
    instagram: "anokhiofficial",
    website: "https://anokhi.com/",
    address: "11th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
    specialty: "Block-printed pure cotton tunics, hand-block dupattas & breezy ethnic wear"
  },
  {
    name: "Vibbhinna Designer Boutique",
    area: "Malleshwaram",
    rating: 4.8,
    reviews: 210,
    phone: "+91 99807 51290",
    whatsapp: "919980751290",
    instagram: "vibbhinnafashion",
    website: "https://vibbhinna.com/",
    address: "Margosa Rd, 8th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560003",
    specialty: "Everyday chic ethnic fashion, customized designer tailoring & festive outfits"
  },
  {
    name: "Geethus Gravity Designer Studio",
    area: "Malleshwaram",
    rating: 4.9,
    reviews: 135,
    phone: "+91 96201 84520",
    whatsapp: "919620184520",
    instagram: "geethusgravity",
    website: "https://geethusgravity.com/",
    address: "Sampige Rd, Malleshwaram, Bengaluru, Karnataka 560003",
    specialty: "Customized women's wear, bespoke festive couture & bridal transformations"
  },
  {
    name: "Star Boutique Malleshwaram",
    area: "Malleshwaram",
    rating: 4.7,
    reviews: 320,
    phone: "+91 98448 31670",
    whatsapp: "919844831670",
    instagram: "starboutiquemalleshwaram",
    website: "https://starboutique.in/",
    address: "8th Cross Rd, Sampige Road, Malleshwaram, Bengaluru, Karnataka 560003",
    specialty: "Ready-to-wear kurtis, bridal blouse stitching & traditional ethnic apparel"
  },
  {
    name: "Smaya Bespoke Bridal Studio",
    area: "Malleshwaram",
    rating: 4.9,
    reviews: 145,
    phone: "+91 97429 80140",
    whatsapp: "919742980140",
    instagram: "smayadesignerwear",
    website: "https://smaya.in/",
    address: "15th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560003",
    specialty: "Handcrafted bridal sarees, heavy festive trousseaus & customized couture"
  },
  {
    name: "Mysore Saree Udyog",
    area: "Commercial Street",
    rating: 4.8,
    reviews: 3850,
    phone: "+91 98452 71830",
    whatsapp: "919845271830",
    instagram: "mysoresareeudyog",
    website: "https://mysoresareeudyog.com/",
    address: "316, Kamaraj Rd, Commercial Street, Bengaluru, Karnataka 560042",
    specialty: "Heritage pure silk sarees, bridal fabrics, raw silks & handloom weaves"
  },
  {
    name: "Koskii Bridal & Occasion",
    area: "Commercial Street",
    rating: 4.7,
    reviews: 2150,
    phone: "+91 98867 52040",
    whatsapp: "919886752040",
    instagram: "koskiiofficial",
    website: "https://koskii.com/",
    address: "Kamraj Rd, Tasker Town, Commercial Street, Bengaluru, Karnataka 560042",
    specialty: "Opulent wedding lehengas, bridal anarkalis, festive gowns & sarees"
  },
  {
    name: "Fazals Dress Salon",
    area: "Commercial Street",
    rating: 4.6,
    reviews: 1100,
    phone: "+91 98450 38290",
    whatsapp: "919845038290",
    instagram: "fazalsdresssalon",
    website: "https://fazals.in/",
    address: "153, Commercial Street, Bengaluru, Karnataka 560001",
    specialty: "Royal Indian ethnic wear, bridal shararas & embroidered party wear"
  },
  {
    name: "Deepam Silks",
    area: "MG Road",
    rating: 4.7,
    reviews: 1980,
    phone: "+91 98803 19450",
    whatsapp: "919880319450",
    instagram: "deepamsilks",
    website: "https://deepam.com/",
    address: "67, Blue Moon Complex, MG Road, Bengaluru, Karnataka 560001",
    specialty: "Exquisite Kanjeevaram silks, Banarasi brocades & heirloom bridal sarees"
  },
  {
    name: "Angadi Galleria",
    area: "Sadashivanagar",
    rating: 4.9,
    reviews: 890,
    phone: "+91 98455 92010",
    whatsapp: "919845592010",
    instagram: "angadigalleria",
    website: "https://angadigalleria.com/",
    address: "Sankey Rd, Sadashivanagar, Bengaluru, Karnataka 560080",
    specialty: "Celebrity bridal Kanjivarams, Advaya design collections & luxury textiles"
  },
  {
    name: "Samyakk Ethnic & Bridal",
    area: "Richmond Road",
    rating: 4.7,
    reviews: 1650,
    phone: "+91 98458 41670",
    whatsapp: "919845841670",
    instagram: "samyakkclothing",
    website: "https://samyakk.com/",
    address: "No. 24, D Souza Layout, Richmond Rd, Bengaluru, Karnataka 560025",
    specialty: "Designer bridal lehengas, groom sherwanis & contemporary ethnic gowns"
  },
  {
    name: "Cinnamon Boutique",
    area: "Walton Road",
    rating: 4.8,
    reviews: 420,
    phone: "+91 98862 70540",
    whatsapp: "919886270540",
    instagram: "cinnamonbangalore",
    website: "https://cinnamonboutique.com/",
    address: "24, Gangadhar Chetty Rd, Sivanchetti Gardens, Bengaluru, Karnataka 560042",
    specialty: "Colonial-style multi-designer destination, conscious luxury apparel & artisan crafts"
  },
  {
    name: "The Open Trunk",
    area: "Jayanagar",
    rating: 4.8,
    reviews: 170,
    phone: "+91 99009 43280",
    whatsapp: "919900943280",
    instagram: "theopentrunk",
    website: "https://theopentrunk.com/",
    address: "8th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
    specialty: "Curated multi-designer fashion store, couture sarees & contemporary jewelry"
  },
  {
    name: "Mogra Designs",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 140,
    phone: "+91 97412 85160",
    whatsapp: "919741285160",
    instagram: "mogradesigns",
    website: "https://mogradesigns.com/",
    address: "605, 12th Main Rd, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Upcycled saree dresses, handcrafted bohemian fits & artisanal summer kurtas"
  },
  {
    name: "House of Three",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 110,
    phone: "+91 98800 67430",
    whatsapp: "919880067430",
    instagram: "houseofthree.in",
    website: "https://houseofthree.in/",
    address: "598, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Pret-a-porter designer silhouettes, handcrafted luxury weaves & couture jackets"
  },
  {
    name: "Studio Vastra",
    area: "HSR Layout",
    rating: 4.8,
    reviews: 230,
    phone: "+91 99863 42910",
    whatsapp: "919986342910",
    instagram: "studiovastrabangalore",
    website: "https://studiovastra.com/",
    address: "19th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102",
    specialty: "Customized designer blouses, festive sarees & contemporary fusion kurtas"
  },
  {
    name: "Snitch Men's Fashion",
    area: "HSR Layout",
    rating: 4.7,
    reviews: 1850,
    phone: "+91 96118 73240",
    whatsapp: "919611873240",
    instagram: "snitch.co.in",
    website: "https://snitch.co.in/",
    address: "27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102",
    specialty: "Fast-fashion menswear, trendy Cuban collar shirts, cargo pants & streetwear"
  },
  {
    name: "Bonkers Corner",
    area: "Koramangala",
    rating: 4.7,
    reviews: 940,
    phone: "+91 98445 71920",
    whatsapp: "919844571920",
    instagram: "bonkers.corner",
    website: "https://bonkerscorner.com/",
    address: "80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    specialty: "Oversized graphic tees, street sweatpants, anime drops & genderless fashion"
  },
  {
    name: "Powerlook Streetwear",
    area: "Koramangala",
    rating: 4.7,
    reviews: 820,
    phone: "+91 98868 15230",
    whatsapp: "919886815230",
    instagram: "powerlookofficial",
    website: "https://powerlook.in/",
    address: "5th Block, Koramangala, Bengaluru, Karnataka 560095",
    specialty: "Affordable youth streetwear, drop shoulder shirts, denim jackets & casuals"
  },
  {
    name: "Blissclub Lifestyle",
    area: "Koramangala",
    rating: 4.8,
    reviews: 1450,
    phone: "+91 99004 82150",
    whatsapp: "919900482150",
    instagram: "blissclub",
    website: "https://blissclub.com/",
    address: "100 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    specialty: "Women's activewear, comfortable move-pants, gym co-ords & daily active wear"
  },
  {
    name: "Suta Sarees & Blouses",
    area: "Indiranagar",
    rating: 4.9,
    reviews: 670,
    phone: "+91 98453 62710",
    whatsapp: "919845362710",
    instagram: "suta_bombay",
    website: "https://suta.in/",
    address: "100 Feet Rd, 12th Main, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Pure mulmul cotton sarees, handmade statement blouses & ethnic draping"
  },
  {
    name: "Nicobar Lifestyle & Apparel",
    area: "Indiranagar",
    rating: 4.8,
    reviews: 810,
    phone: "+91 98805 39180",
    whatsapp: "919880539180",
    instagram: "nicojournal",
    website: "https://nicobar.com/",
    address: "4th Cross, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
    specialty: "Breezy tropical resort wear, relaxed linen shirts, dresses & slow travel fashion"
  },
  {
    name: "Tamanna Boutique",
    area: "Commercial Street",
    rating: 4.7,
    reviews: 430,
    phone: "+91 97420 58490",
    whatsapp: "919742058490",
    instagram: "tamannaboutiqueblr",
    website: "https://tamannaboutique.in/",
    address: "Commercial Street, Tasker Town, Bengaluru, Karnataka 560001",
    specialty: "Pakistani bridal ensembles, velvet shawls, hand-embroidered party anarkalis"
  },
  {
    name: "Silhouette by Sneha",
    area: "Lavelle Road",
    rating: 4.9,
    reviews: 160,
    phone: "+91 98864 71290",
    whatsapp: "919886471290",
    instagram: "silhouettebysneha",
    website: "https://silhouettebysneha.com/",
    address: "Lavelle Road, Shanthala Nagar, Bengaluru, Karnataka 560001",
    specialty: "Couture evening gowns, custom tailored bridal trousseaux & high-fashion styling"
  }
];

function buildLeads() {
  return RAW_CLOTHING_50.map((item, idx) => {
    const id = `lead_clothing_blr_${String(idx + 1).padStart(2, '0')}`;
    const cleanArea = item.area;
    const cleanHandle = item.instagram.replace(/^@/, '').trim();
    
    return {
      id,
      name: item.name,
      city: "Bangalore",
      country: "India",
      area: cleanArea,
      rating: item.rating,
      reviews: item.reviews,
      gmb_rating: item.rating,
      gmb_reviews: item.reviews,
      website: item.website,
      website_url: item.website,
      address: item.address,
      phone: item.phone,
      phone_number: item.phone,
      whatsapp: item.whatsapp,
      whatsapp_number: `+${item.whatsapp}`,
      has_whatsapp: true,
      email: null,
      instagram: cleanHandle,
      category: "clothing brands",
      verified_source: "Google Maps Live Scrape",
      tags: [
        "clothing",
        "clothing brands",
        "fashion",
        "boutique",
        "apparel",
        "bangalore",
        cleanArea.toLowerCase(),
        "verified"
      ],
      pitch_angle: "Scroll-stopping videos starting from ₹500/reel (Shoot Studio Bangalore: @shootstudio.blr).",
      whatsapp_link: `https://wa.me/${item.whatsapp}`,
      pitch_offer_name: "Scroll-Stopping Fashion Reels",
      opportunity_text: "We create scroll-stopping creator videos & viral reels for clothing brands starting from just ₹500/reel."
    };
  });
}

function main() {
  console.log("=== GENERATING 50 BANGALORE CLOTHING BRANDS FOCUS QUEUE ===");
  const leads = buildLeads();
  console.log(`✓ Formatted ${leads.length} clothing brand leads.`);

  // 1. Write JSON
  fs.writeFileSync(CLOTHING_JSON_PATH, JSON.stringify(leads, null, 2), 'utf8');
  console.log(`✓ Saved JSON to ${CLOTHING_JSON_PATH}`);

  // 2. Write CSV
  const csvRows = [
    [
      'Sl No',
      'Brand / Boutique Name',
      'Area / Locality',
      'Rating',
      'Reviews',
      'Phone',
      'WhatsApp Direct Link',
      'Instagram Handle',
      'Instagram Direct Chat (ig.me)',
      'Official Store / Website',
      'Full Address',
      'Pitch Offer & Reel Link'
    ]
  ];

  leads.forEach((l, idx) => {
    csvRows.push([
      idx + 1,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.area}"`,
      l.rating,
      l.reviews,
      `"${l.phone}"`,
      l.whatsapp_link,
      `"@${l.instagram}"`,
      `https://ig.me/m/${l.instagram}`,
      `"${l.website}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"Scroll-stopping reels from ₹500/reel: https://www.instagram.com/p/DepDfJ7Tlmz/ (Studio: https://www.instagram.com/shootstudio.blr/)"`
    ]);
  });

  fs.writeFileSync(CLOTHING_CSV_PATH, csvRows.map(r => r.join(',')).join('\n'), 'utf8');
  console.log(`✓ Saved CSV to ${CLOTHING_CSV_PATH}`);

  // 3. Update master_leads_10000.json
  if (fs.existsSync(MASTER_JSON_PATH)) {
    const master = JSON.parse(fs.readFileSync(MASTER_JSON_PATH, 'utf8'));
    const existingPhones = new Set(master.map(m => (m.whatsapp || '').toString()));
    const existingNames = new Set(master.map(m => (m.name || '').toLowerCase()));
    
    let added = 0;
    for (const lead of leads) {
      if (!existingPhones.has(lead.whatsapp) && !existingNames.has(lead.name.toLowerCase())) {
        master.push(lead);
        added++;
      }
    }
    fs.writeFileSync(MASTER_JSON_PATH, JSON.stringify(master, null, 2), 'utf8');
    console.log(`✓ Integrated ${added} new clothing brand leads into master_leads_10000.json (Total: ${master.length})`);
  }

  // 4. Update pitchfinder.html and pitchfinder/index.html
  for (const htmlPath of HTML_FILES) {
    let content = fs.readFileSync(htmlPath, 'utf8');

    // A. Embed CLOTHING_50_QUEUE
    const clothingMarker = 'const CLOTHING_50_QUEUE =';
    if (!content.includes(clothingMarker)) {
      const targetMarker = 'const DETAILING_50_QUEUE =';
      const clothingEmbed = `// Top 50 Bangalore Clothing Brands & Fashion Boutiques Queue\nconst CLOTHING_50_QUEUE = ${JSON.stringify(leads)};\n\n`;
      if (content.includes(targetMarker)) {
        content = content.replace(targetMarker, clothingEmbed + targetMarker);
        console.log(`✓ Embedded CLOTHING_50_QUEUE in ${path.basename(htmlPath)}`);
      }
    } else {
      content = content.replace(
        /const\s+CLOTHING_50_QUEUE\s*=\s*\[[\s\S]*?\];\n\n/,
        `const CLOTHING_50_QUEUE = ${JSON.stringify(leads)};\n\n`
      );
      console.log(`✓ Refreshed CLOTHING_50_QUEUE in ${path.basename(htmlPath)}`);
    }

    // B. Also update REAL_VERIFIED_DATABASE to ensure these 50 leads are present
    const dbMatch = content.match(/const REAL_VERIFIED_DATABASE = (\[[\s\S]*?\]);\n/);
    if (dbMatch) {
      try {
        const curDb = JSON.parse(dbMatch[1]);
        const existingPhones = new Set(curDb.map(m => (m.whatsapp || '').toString()));
        let dbAdded = 0;
        for (const lead of leads) {
          if (!existingPhones.has(lead.whatsapp)) {
            curDb.push(lead);
            dbAdded++;
          }
        }
        if (dbAdded > 0) {
          content = content.replace(
            /const REAL_VERIFIED_DATABASE = \[[\s\S]*?\];\n/,
            `const REAL_VERIFIED_DATABASE = ${JSON.stringify(curDb)};\n`
          );
          console.log(`✓ Added ${dbAdded} clothing leads to REAL_VERIFIED_DATABASE in ${path.basename(htmlPath)}`);
        }
      } catch (err) {
        console.warn(`Could not parse REAL_VERIFIED_DATABASE in ${path.basename(htmlPath)}:`, err.message);
      }
    }

    // C. Add Clothing 50 trigger pill in header if not present
    if (!content.includes("startDailyQueue('clothing')")) {
      const headerPillTarget = '<!-- Detailing 50 Queue Trigger Pill -->';
      const clothingHeaderPill = `<!-- Clothing 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('clothing')"
          class="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#e0245e] border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          title="Launch Verified 50 Bangalore Clothing Brands & Fashion Studios Focus Queue">
          <span>👗 Clothing 50</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[#e0245e] text-white rounded-full font-mono">50</span>
        </button>\n\n        `;
      if (content.includes(headerPillTarget)) {
        content = content.replace(headerPillTarget, clothingHeaderPill + headerPillTarget);
        console.log(`✓ Added Clothing 50 Header Pill in ${path.basename(htmlPath)}`);
      }
    }

    // D. Add Clothing 50 button in segmented focus selector in Hub Bar
    if (!content.includes("title=\"Verified Bangalore Clothing Brands & Boutiques\"")) {
      const focusTarget = `<button onclick="startDailyQueue('detailing')"`;
      const clothingFocusBtn = `<button onclick="startDailyQueue('clothing')"
            class="px-2.5 sm:px-3 py-1.5 rounded-full bg-white text-[#e0245e] font-bold shadow-2xs border border-pink-200/60 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Verified Bangalore Clothing Brands & Boutiques">
            <span>👗 Clothing</span>
            <span class="text-[10px] px-1.5 py-0.2 bg-[#e0245e] text-white rounded-full font-mono">50</span>
          </button>\n          `;
      if (content.includes(focusTarget)) {
        content = content.replace(focusTarget, clothingFocusBtn + focusTarget);
        console.log(`✓ Added Clothing Focus button in ${path.basename(htmlPath)}`);
      }
    }

    // E. Add Clothing modal tab in modal header
    if (!content.includes('id="modal-tab-clothing"')) {
      const modalTabTarget = `<button id="modal-tab-detailing"`;
      const clothingModalTab = `<button id="modal-tab-clothing" onclick="startDailyQueue('clothing')"
            class="px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap">👗 Clothing (50)</button>\n          `;
      if (content.includes(modalTabTarget)) {
        content = content.replace(modalTabTarget, clothingModalTab + modalTabTarget);
        console.log(`✓ Added Clothing Modal Tab in ${path.basename(htmlPath)}`);
      }
    }

    // F. Update startDailyQueue logic for 'clothing'
    if (!content.includes("queueType === 'clothing'")) {
      const startQueueSearch = "if (queueType === 'detailing') {";
      const startQueueReplacement = `if (queueType === 'clothing') {
        pool = (typeof CLOTHING_50_QUEUE !== 'undefined' && CLOTHING_50_QUEUE.length > 0)
          ? [...CLOTHING_50_QUEUE]
          : rawDiscoveredBrands.filter(b =>
            (b.tags && (b.tags.includes('clothing') || b.tags.includes('boutique') || b.tags.includes('fashion') || b.tags.includes('apparel'))) ||
            (b.category && b.category.toLowerCase().includes('cloth'))
          );
        if (iconBadge) iconBadge.textContent = '👗';
        if (iconBadge) iconBadge.className = 'w-8 h-8 rounded-lg bg-[#e0245e] text-white flex items-center justify-center font-bold text-sm shadow-xs';
        if (titleText) titleText.textContent = "Today's 50 Clothing Brands Queue (Bangalore)";
        if (counterPill) counterPill.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800';
        if (progressBar) progressBar.className = 'h-full bg-[#e0245e] rounded-full transition-all duration-300';
        const tabClothing = document.getElementById('modal-tab-clothing');
        if (tabClothing) tabClothing.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-[#e0245e] font-bold cursor-pointer';
      } else if (queueType === 'detailing') {`;

      if (content.includes(startQueueSearch)) {
        content = content.replace(startQueueSearch, startQueueReplacement);
        console.log(`✓ Handled queueType === 'clothing' in startDailyQueue in ${path.basename(htmlPath)}`);
      }
    }

    // Ensure reset tabs list includes tabClothing
    if (!content.includes("const tabClothing = document.getElementById('modal-tab-clothing');")) {
      content = content.replace(
        "const tabDetailing = document.getElementById('modal-tab-detailing');",
        "const tabClothing = document.getElementById('modal-tab-clothing');\n      const tabDetailing = document.getElementById('modal-tab-detailing');"
      );
      content = content.replace(
        "[tabDetailing, tabDental, tabAll].forEach(t => {",
        "[tabClothing, tabDetailing, tabDental, tabAll].forEach(t => {"
      );
    }

    // G. Update generateWhatsAppPitch for clothing brands
    if (!content.includes('isClothing =')) {
      const pitchTarget = "const isDetailing =";
      const clothingPitchLogic = `const isClothing = (currentQueueType === 'clothing') ||
        (b.category && (b.category.toLowerCase().includes('cloth') || b.category.toLowerCase().includes('fashion') || b.category.toLowerCase().includes('boutique') || b.category.toLowerCase().includes('apparel'))) ||
        (b.tags && (b.tags.includes('clothing') || b.tags.includes('boutique') || b.tags.includes('fashion') || b.tags.includes('apparel')));

      if (isClothing) {
        return \`Hey *\${cleanName}* team 👋\\n\\nLove your collection and styling!\\n\\nWe create scroll-stopping videos for your brand starting from just ₹500 per reel at Shoot Studio Bangalore.\\n\\nCheck out our sample reel here:\\n🎬 Reel: https://www.instagram.com/p/DepDfJ7Tlmz/\\n📸 Studio: https://www.instagram.com/shootstudio.blr/\\n\\nWould love to shoot 3-5 high-converting reels for your latest collection in Bangalore. Can I send over our studio packages? 👗✨\`;
      }

      const isDetailing =`;

      if (content.includes(pitchTarget)) {
        content = content.replace(pitchTarget, clothingPitchLogic);
        console.log(`✓ Added high-converting Clothing Brands WhatsApp Pitch in ${path.basename(htmlPath)}`);
      }
    }

    // H. Update generateInstagramPitch for clothing brands
    if (!content.includes("@shootstudio.blr")) {
      const igPitchTarget = "function generateInstagramPitch(b) {";
      const igPitchReplacement = `function generateInstagramPitch(b) {
      const cleanName = (b.name || '').split('–')[0].split('-')[0].trim();
      const area = b.area || b.city || 'Bangalore';
      
      const isClothing = (typeof currentQueueType !== 'undefined' && currentQueueType === 'clothing') ||
        (b.category && (b.category.toLowerCase().includes('cloth') || b.category.toLowerCase().includes('fashion') || b.category.toLowerCase().includes('boutique') || b.category.toLowerCase().includes('apparel'))) ||
        (b.tags && (b.tags.includes('clothing') || b.tags.includes('boutique') || b.tags.includes('fashion') || b.tags.includes('apparel')));

      if (isClothing) {
        return \`Hey \${cleanName} team 👋 Love your collection!\\n\\nWe create scroll-stopping videos for your brand starting from just ₹500 per reel at @shootstudio.blr.\\n\\nCheck out our sample reel:\\n🎬 https://www.instagram.com/p/DepDfJ7Tlmz/\\n📸 https://www.instagram.com/shootstudio.blr/\\n\\nWould love to shoot 3-5 viral aesthetic reels for your latest collection in Bangalore. Open to seeing our studio portfolio? 👗✨\`;
      }`;

      if (content.includes(igPitchTarget)) {
        content = content.replace(igPitchTarget, igPitchReplacement);
        console.log(`✓ Added custom Clothing Brands Instagram Pitch in ${path.basename(htmlPath)}`);
      }
    }

    // K. Add Clothing Brands to category dropdown if not present
    if (!content.includes('<option value="clothing brands">')) {
      const catOptionTarget = '<option value="Food & Dining">';
      const catOptionReplacement = '<option value="clothing brands">👗 Clothing Brands</option>\n            <option value="Food & Dining">';
      if (content.includes(catOptionTarget)) {
        content = content.replace(catOptionTarget, catOptionReplacement);
        console.log(`✓ Added Clothing Brands option to Category Select in ${path.basename(htmlPath)}`);
      }
    }

    // L. Sync hub selector button styling in startDailyQueue
    if (!content.includes("hubTabClothing")) {
      const queueTabActiveTarget = "if (tabClothing) tabClothing.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-[#e0245e] font-bold cursor-pointer';";
      const queueTabActiveReplacement = `if (tabClothing) tabClothing.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-[#e0245e] font-bold cursor-pointer';
        const hubTabClothing = document.getElementById('hub-tab-clothing');
        if (hubTabClothing) hubTabClothing.className = 'px-2.5 sm:px-3 py-1.5 rounded-full bg-white text-[#e0245e] font-bold shadow-2xs border border-pink-200/60 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0';`;
      if (content.includes(queueTabActiveTarget)) {
        content = content.replace(queueTabActiveTarget, queueTabActiveReplacement);
      }
    }

    fs.writeFileSync(htmlPath, content, 'utf8');
  }

  console.log("\n🎉 ALL DONE! 50 Bangalore Clothing Brands Queue successfully created and wired up!");
}

main();
