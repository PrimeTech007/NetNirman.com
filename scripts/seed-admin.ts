import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/netnirman";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@netnirman.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Create admin user
  const usersCollection = mongoose.connection.db!.collection("users");
  const existing = await usersCollection.findOne({ email: ADMIN_EMAIL });

  if (!existing) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await usersCollection.insertOne({
      name: "Super Admin",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "super_admin",
      isActive: true,
      loginAttempts: 0,
      lockUntil: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  } else {
    console.log("Admin user already exists, updating password...");
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await usersCollection.updateOne(
      { _id: existing._id },
      { $set: { passwordHash, updatedAt: new Date() } }
    );
    console.log(`Admin password updated for: ${ADMIN_EMAIL}`);
  }

  // Seed services
  const servicesCollection = mongoose.connection.db!.collection("services");
  const servicesCount = await servicesCollection.countDocuments();
  if (servicesCount === 0) {
    const services = [
      { name: "Web Design & UI/UX", slug: "web-design", icon: "PaintBrush", description: "Stunning, conversion-focused web designs tailored for Indian businesses. We create pixel-perfect interfaces that users love.", features: ["Custom UI/UX Design", "Mobile-First Approach", "Figma Prototypes", "Design System Creation", "User Research & Testing"], order: 1, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Web Development", slug: "web-development", icon: "Code", description: "Full-stack web development with modern frameworks. Fast, secure, and scalable applications built for growth.", features: ["Next.js & React", "Node.js Backend", "Database Design", "API Development", "Performance Optimization"], order: 2, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Mobile App Development", slug: "mobile-app", icon: "DeviceMobile", description: "Cross-platform mobile applications that work flawlessly on iOS and Android. Built with React Native & Flutter.", features: ["React Native Apps", "Flutter Development", "App Store Deployment", "Push Notifications", "Offline Support"], order: 3, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "AI Integration", slug: "ai-integration", icon: "Brain", description: "Leverage artificial intelligence to automate processes, enhance user experiences, and gain competitive advantages.", features: ["Chatbot Development", "AI-Powered Analytics", "Process Automation", "Machine Learning Models", "GPT Integration"], order: 4, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Branding & Identity", slug: "branding", icon: "Palette", description: "Build a memorable brand identity that resonates with your target audience and stands out in the market.", features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Collateral", "Social Media Kit"], order: 5, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "SEO & Digital Marketing", slug: "seo-marketing", icon: "MagnifyingGlass", description: "Data-driven SEO and digital marketing strategies to boost your online visibility and drive organic growth.", features: ["Technical SEO", "Content Strategy", "Google Ads", "Social Media Marketing", "Analytics & Reporting"], order: 6, isVisible: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    await servicesCollection.insertMany(services);
    console.log("Services seeded!");
  }

  // Seed testimonials
  const testimonialsCollection = mongoose.connection.db!.collection("testimonials");
  const testimonialsCount = await testimonialsCollection.countDocuments();
  if (testimonialsCount === 0) {
    const testimonials = [
      { clientName: "Rahul Sharma", company: "TechVista Solutions", quote: "Net Nirman transformed our online presence completely. Their team delivered a stunning website that increased our leads by 200%. Highly recommended!", rating: 5, isVisible: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { clientName: "Priya Patel", company: "GreenLeaf Organics", quote: "Working with Net Nirman was a fantastic experience. They understood our vision perfectly and built an e-commerce platform that exceeded expectations.", rating: 5, isVisible: true, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { clientName: "Amit Kumar", company: "FinEdge Capital", quote: "The AI-powered dashboard Net Nirman built for us revolutionized how we analyze financial data. Their technical expertise is unmatched.", rating: 5, isVisible: true, order: 3, createdAt: new Date(), updatedAt: new Date() },
    ];
    await testimonialsCollection.insertMany(testimonials);
    console.log("Testimonials seeded!");
  }

  // Seed site settings
  const settingsCollection = mongoose.connection.db!.collection("site_settings");
  const settingsCount = await settingsCollection.countDocuments();
  if (settingsCount === 0) {
    const settings = [
      { key: "marquee_text", value: "Website ☺ Mobile ☺ Development ☺ AI Solutions ☺ Branding ☺ SEO ☺", description: "Marquee strip text", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "stats", value: { projects: 50, clients: 30, years: 3, onTime: 100 }, description: "Homepage stats", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "contact_info", value: { address: "Greater Noida, Uttar Pradesh, India", phone: "+91 9876543210", email: "hello@netnirman.com", whatsapp: "919876543210", businessHours: "Mon-Sat: 10AM - 7PM" }, description: "Contact information", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "social_links", value: { twitter: "", linkedin: "", instagram: "", github: "", facebook: "" }, description: "Social media links", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "announcement_bar", value: { enabled: false, text: "", link: "" }, description: "Announcement bar settings", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "maintenance_mode", value: false, description: "Maintenance mode toggle", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "pricing_plans", value: [
        { name: "Starter", priceRange: "₹15,000 – ₹30,000", description: "Perfect for startups and small businesses getting online.", features: ["5-Page Responsive Website", "Mobile Optimized", "Contact Form", "Basic SEO Setup", "1 Month Support", "SSL Certificate"], isPopular: false },
        { name: "Growth", priceRange: "₹30,000 – ₹80,000", description: "For growing businesses needing advanced features.", features: ["Up to 15 Pages", "Custom CMS/Admin", "E-commerce (up to 50 products)", "Advanced SEO", "Analytics Dashboard", "3 Months Support", "Performance Optimization"], isPopular: true },
        { name: "Enterprise", priceRange: "₹80,000+", description: "Full-scale digital solutions for established businesses.", features: ["Unlimited Pages", "Custom Web Application", "AI Integration", "Mobile App (Optional)", "Priority Support (6 months)", "Dedicated Project Manager", "Source Code Ownership", "API Development"], isPopular: false },
      ], description: "Pricing plans", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
      { key: "faq", value: [
        { question: "How long does a typical project take?", answer: "A standard website takes 2-4 weeks. Complex web applications can take 6-12 weeks depending on requirements." },
        { question: "Do you provide post-launch support?", answer: "Yes! All our plans include post-launch support. Starter includes 1 month, Growth includes 3 months, and Enterprise includes 6 months." },
        { question: "What technologies do you use?", answer: "We primarily use Next.js, React, Node.js, MongoDB, and modern cloud services. We choose the best tech stack based on your project needs." },
        { question: "Can you work with existing designs?", answer: "Absolutely! We can implement any design from Figma, Adobe XD, or Sketch. We also offer design services if you need them." },
        { question: "Do you offer EMI/payment plans?", answer: "Yes, we offer flexible payment plans. Typically 50% upfront and 50% on delivery, or custom arrangements for larger projects." },
      ], description: "FAQ items", updatedBy: "system", createdAt: new Date(), updatedAt: new Date() },
    ];
    await settingsCollection.insertMany(settings);
    console.log("Site settings seeded!");
  }

  // Seed sample clients
  const clientsCollection = mongoose.connection.db!.collection("clients");
  const clientsCount = await clientsCollection.countDocuments();
  if (clientsCount === 0) {
    const clientResult = await clientsCollection.insertMany([
      { name: "Rahul Sharma", company: "TechVista Solutions", email: "rahul@techvista.com", phone: "+91 9876543211", city: "Noida", state: "Uttar Pradesh", industry: "Technology", source: "website", status: "active", createdAt: new Date(), updatedAt: new Date() },
      { name: "Priya Patel", company: "GreenLeaf Organics", email: "priya@greenleaf.com", phone: "+91 9876543212", city: "Delhi", state: "Delhi", industry: "Food & Agriculture", source: "referral", status: "active", createdAt: new Date(), updatedAt: new Date() },
      { name: "Amit Kumar", company: "FinEdge Capital", email: "amit@finedge.in", phone: "+91 9876543213", city: "Gurugram", state: "Haryana", industry: "Finance", source: "website", status: "active", createdAt: new Date(), updatedAt: new Date() },
    ]);
    const ids = clientResult.insertedIds;
    console.log("Clients seeded!");

    // Seed sample projects
    const projectsCollection = mongoose.connection.db!.collection("projects");
    const projectsCount = await projectsCollection.countDocuments();
    if (projectsCount === 0) {
      const projects = [
        { name: "TechVista Corporate Website", slug: "techvista-corporate", clientId: ids[0], type: ["Web Design", "Web Development"], status: "completed", description: "Complete corporate website redesign with modern UI and CMS.", techStack: ["Next.js", "Tailwind CSS", "Strapi"], startDate: new Date("2024-01-15"), deadline: new Date("2024-03-15"), value: 55000, paymentStatus: "paid", amountReceived: 55000, isPublic: true, isFeatured: true, thumbnailUrl: "", caseStudy: { challenge: "Outdated website with poor mobile experience", solution: "Built a responsive Next.js site with headless CMS", results: "200% increase in leads, 4x faster load time", testimonial: "Net Nirman transformed our online presence completely." }, createdAt: new Date(), updatedAt: new Date() },
        { name: "GreenLeaf E-Commerce", slug: "greenleaf-ecommerce", clientId: ids[1], type: ["Web Development", "E-Commerce"], status: "completed", description: "Full e-commerce platform for organic food products.", techStack: ["Next.js", "Stripe", "MongoDB"], startDate: new Date("2024-02-01"), deadline: new Date("2024-05-01"), value: 75000, paymentStatus: "paid", amountReceived: 75000, isPublic: true, isFeatured: true, thumbnailUrl: "", caseStudy: { challenge: "No online presence for a growing organic brand", solution: "Custom e-commerce with inventory management", results: "500+ orders in first month, 50% repeat customers", testimonial: "Working with Net Nirman was a fantastic experience." }, createdAt: new Date(), updatedAt: new Date() },
        { name: "FinEdge Analytics Dashboard", slug: "finedge-analytics", clientId: ids[2], type: ["Web Application", "AI Integration"], status: "completed", description: "AI-powered financial analytics dashboard.", techStack: ["React", "Node.js", "Python", "PostgreSQL"], startDate: new Date("2024-03-01"), deadline: new Date("2024-07-01"), value: 120000, paymentStatus: "paid", amountReceived: 120000, isPublic: true, isFeatured: true, thumbnailUrl: "", caseStudy: { challenge: "Manual financial analysis taking too much time", solution: "AI-powered dashboard with automated reporting", results: "80% time saved on analysis, real-time insights", testimonial: "The AI-powered dashboard revolutionized how we analyze financial data." }, createdAt: new Date(), updatedAt: new Date() },
        { name: "LocalBazar Mobile App", slug: "localbazar-mobile", clientId: ids[0], type: ["Mobile App"], status: "in_progress", description: "Hyperlocal marketplace mobile application.", techStack: ["React Native", "Firebase", "Node.js"], startDate: new Date("2024-06-01"), deadline: new Date("2024-10-01"), value: 95000, paymentStatus: "partial", amountReceived: 47500, isPublic: false, isFeatured: false, thumbnailUrl: "", createdAt: new Date(), updatedAt: new Date() },
        { name: "EduLearn LMS Platform", slug: "edulearn-lms", clientId: ids[1], type: ["Web Application"], status: "review", description: "Learning management system for online courses.", techStack: ["Next.js", "MongoDB", "AWS S3"], startDate: new Date("2024-05-15"), deadline: new Date("2024-09-15"), value: 85000, paymentStatus: "partial", amountReceived: 42500, isPublic: false, isFeatured: false, thumbnailUrl: "", createdAt: new Date(), updatedAt: new Date() },
      ];
      await projectsCollection.insertMany(projects);
      console.log("Projects seeded!");
    }
  }

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

seed().catch(console.error);
