require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Content = require('./models/Content');
const Faculty = require('./models/Faculty');
const Gallery = require('./models/Gallery');
const Notice = require('./models/Notice');

const defaultContent = {
  site: {
    phone: '+91-9516011227',
    email: 'hsems51@gmail.com',
    address: 'Shankar Nagar, Raipur',
    timings: 'Monday – Saturday · 8:00 AM – 2:00 PM',
    topbarNote: 'Admissions Open'
  },
  // Hero is image-only slideshow (no text on slides) — real school photos
  hero: [
    { id: '1', image: '/uploads/event-dance-1.jpg' },
    { id: '2', image: '/uploads/event-dance-2.jpg' }
  ],
  highlights: [
    { id: '1', icon: '📚', title: 'English Medium', text: 'Strong foundation in English across all subjects' },
    { id: '2', icon: '🎓', title: 'Higher Secondary', text: 'Focused programs for Classes 11 & 12' },
    { id: '3', icon: '🔬', title: 'Modern Labs', text: 'Science & computer labs for practical learning' },
    { id: '4', icon: '👨‍🏫', title: 'Expert Faculty', text: 'Dedicated teachers mentoring every student' }
  ],
  about: {
    title: 'Pt. Harishankar Shukla English Medium Higher Secondary School',
    paragraphs: [
      'Located in Shankar Nagar, our school is committed to providing quality English medium education in a nurturing and disciplined environment.',
      'We focus on academic excellence along with the overall development of every student — building confidence, character, and readiness for higher education and life beyond school.',
      'Our experienced faculty and structured teaching methods help students grow into responsible, successful individuals.'
    ],
    chairmanName: 'Shri Sushil Shukla',
    chairmanRole: 'Chairman',
    chairmanInitials: 'SS',
    chairmanMessage: 'Our commitment is to empower every student with knowledge, wisdom, and strong moral character. We strive to provide a world-class learning environment where young minds flourish and transform into future leaders.',
    principalName: 'Mrs. Tripati Shrivastava',
    principalRole: 'Principal',
    principalInitials: 'TS',
    principalMessage: 'Education is not only about marks — it is about shaping thoughtful, confident, and compassionate human beings. At our school, every child is encouraged to discover their potential in a safe and inspiring environment.',
    mission: 'To deliver quality English medium education that builds strong academics, values, and life skills.',
    vision: 'To be a leading school that prepares students to succeed in higher studies and contribute positively to society.',
    values: 'Integrity, discipline, respect, curiosity, and excellence in everything we do.'
  },
  why: [
    { id: '1', title: 'Quality Teaching', text: 'Experienced faculty with modern methods focused on conceptual clarity and exam readiness.' },
    { id: '2', title: 'Safe Campus', text: 'Disciplined, caring environment where students feel secure and motivated to learn.' },
    { id: '3', title: 'All-Round Growth', text: 'Sports, cultural events, and leadership activities beyond textbooks.' },
    { id: '4', title: 'Strong Values', text: 'Character, respect, and responsibility woven into everyday school life.' },
    { id: '5', title: 'Parent Partnership', text: 'Open communication and regular updates so parents stay involved.' },
    { id: '6', title: 'Future Ready', text: 'Guidance for board exams, higher studies, and competitive pathways.' }
  ],
  academics: [
    { id: '1', icon: '📚', title: 'Curriculum', text: 'Comprehensive syllabus with focus on conceptual understanding across all core subjects.' },
    { id: '2', icon: '🎓', title: 'Higher Secondary', text: 'Specialized guidance for Class 11 & 12 students preparing for board and competitive exams.' },
    { id: '3', icon: '🧑‍🏫', title: 'Experienced Faculty', text: 'Qualified teachers who mentor students with care, discipline, and modern methods.' },
    { id: '4', icon: '📝', title: 'Assessments', text: 'Regular tests, feedback, and progress tracking to keep students on the right path.' },
    { id: '5', icon: '🔬', title: 'Practical Learning', text: 'Lab work and activities that connect theory with real-world understanding.' },
    { id: '6', icon: '💻', title: 'Digital Skills', text: 'Computer education to build essential digital literacy for the future.' }
  ],
  facilities: [
    { id: '1', icon: '🏫', title: 'Classrooms', text: 'Spacious, well-ventilated classrooms with proper seating and teaching aids.' },
    { id: '2', icon: '🔬', title: 'Science Labs', text: 'Labs for Physics, Chemistry and Biology to support practical learning.' },
    { id: '3', icon: '💻', title: 'Computer Lab', text: 'Modern computers with internet facility to develop digital skills.' },
    { id: '4', icon: '📖', title: 'Library', text: 'Books, reference materials, and quiet study space for students.' },
    { id: '5', icon: '🏃', title: 'Sports Area', text: 'Grounds and activities that promote fitness, teamwork, and sportsmanship.' },
    { id: '6', icon: '🎨', title: 'Activity Spaces', text: 'Areas for cultural events, assemblies, and co-curricular programs.' }
  ],
  studentLife: [
    { id: '1', icon: '🏆', title: 'Sports & Games', text: 'Regular sports activities that build fitness, teamwork, and healthy competition.' },
    { id: '2', icon: '🎭', title: 'Cultural Events', text: 'Annual functions, performances, and celebrations that showcase student talent.' },
    { id: '3', icon: '📢', title: 'Assemblies', text: 'Morning assemblies that foster discipline, values, and school spirit.' },
    { id: '4', icon: '🤝', title: 'Clubs & Activities', text: 'Opportunities for leadership, creativity, and collaborative projects.' },
    { id: '5', icon: '🌱', title: 'Value Education', text: 'Programs that nurture respect, responsibility, and empathy.' },
    { id: '6', icon: '🎉', title: 'Celebrations', text: 'Festivals and special days celebrated with joy and inclusiveness.' }
  ],
  achievements: [
    { id: '1', year: '2026', title: 'Outstanding Board Results', text: 'Students achieved excellent results in Higher Secondary board examinations.' },
    { id: '2', year: '2025', title: 'Inter-School Debate Winners', text: 'Our team secured top positions in the regional debate competition.' },
    { id: '3', year: '2025', title: 'Science Exhibition', text: 'Innovative student projects recognized at district-level science fair.' },
    { id: '4', year: '2024', title: 'Sports Champions', text: 'Multiple medals in athletics and team sports at inter-school meets.' },
    { id: '5', year: '2024', title: 'Cultural Excellence', text: 'First place in group dance and music at the annual cultural festival.' },
    { id: '6', year: '2023', title: '100% Pass Rate', text: 'Proud record of full pass percentage in board examinations.' }
  ],
  testimonials: [
    { id: '1', name: 'Anil Kumar', role: 'Parent', initials: 'AK', text: 'The teachers are caring and the school maintains high academic standards. My child has improved a lot.', stars: 5 },
    { id: '2', name: 'Sunita Patel', role: 'Parent', initials: 'SP', text: 'A disciplined environment with good facilities. We are happy with our decision to admit our daughter here.', stars: 5 },
    { id: '3', name: 'Rajesh Mehta', role: 'Parent', initials: 'RM', text: 'English medium teaching is strong and the faculty is approachable. Highly recommended.', stars: 5 }
  ],
  admissionCta: {
    title: 'Ready to Join Our School Family?',
    text: 'Admissions are open. Visit us or get in touch to start the application process for your child.',
    btn1Text: 'Admission Enquiry', btn1Link: '/admissions',
    btn2Text: 'Contact Office', btn2Link: '/contact'
  },
  // Homepage popup (announcement modal)
  popup: {
    enabled: true,
    title: 'Welcome to Our School',
    message: 'Admissions are open for the academic year 2026–27. Visit the school office or contact us for more information.',
    buttonText: 'OK',
    image: ''
  }
};

const defaultFaculty = [
  { name: 'Mrs. Tripati Shrivastava', role: 'Principal', designation: 'Principal', experience: '20+ Years', qualification: 'M.A., B.Ed.', subject: 'Administration', initials: 'TS' },
  { name: 'Mr. A. Awasthi', role: 'Vice Principal', designation: 'Vice Principal', experience: '15+ Years', qualification: 'M.Sc., B.Ed.', subject: 'Mathematics', initials: 'AA' },
  { name: 'Mrs. S. Khan', role: 'Senior PGT Teacher', designation: 'PGT English', experience: '12+ Years', qualification: 'M.A. English, B.Ed.', subject: 'English Literature', initials: 'SK' },
  { name: 'Mr. V. Gupta', role: 'Senior PGT Teacher', designation: 'PGT Physics', experience: '14+ Years', qualification: 'M.Sc. Physics, B.Ed.', subject: 'Physics', initials: 'VG' },
  { name: 'Mrs. M. Das', role: 'PGT Teacher', designation: 'PGT Chemistry', experience: '10+ Years', qualification: 'M.Sc. Chemistry, B.Ed.', subject: 'Chemistry', initials: 'MD' },
  { name: 'Mr. R. Joshi', role: 'PGT Teacher', designation: 'PGT Biology', experience: '9+ Years', qualification: 'M.Sc. Zoology, B.Ed.', subject: 'Biology', initials: 'RJ' },
  { name: 'Mrs. N. Tiwari', role: 'TGT Teacher', designation: 'TGT Hindi', experience: '11+ Years', qualification: 'M.A. Hindi, B.Ed.', subject: 'Hindi', initials: 'NT' },
  { name: 'Mr. P. Singh', role: 'Computer Faculty', designation: 'PGT Computer Science', experience: '8+ Years', qualification: 'MCA, B.Tech CS', subject: 'Computer Science', initials: 'PS' }
];

const defaultGallery = [
  { path: '/uploads/event-dance-1.jpg', full: '/uploads/event-dance-1.jpg', caption: 'Annual Function – Dance Performance' },
  { path: '/uploads/event-dance-2.jpg', full: '/uploads/event-dance-2.jpg', caption: 'Cultural Event – Student Performance' }
];

async function seedDatabase() {
  console.log('Seeding database...');

  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    await User.create({ username: 'admin', password: 'school123' });
    console.log('  Admin user created (admin / school123)');
  } else {
    console.log('  Admin user already exists');
  }

  for (const [key, data] of Object.entries(defaultContent)) {
    const existing = await Content.findOne({ key });
    if (!existing) {
      await Content.create({ key, data });
    } else if (key === 'about') {
      const merged = {
        ...defaultContent.about,
        ...existing.data,
        chairmanName: defaultContent.about.chairmanName,
        chairmanInitials: defaultContent.about.chairmanInitials,
        principalName: defaultContent.about.principalName,
        principalInitials: defaultContent.about.principalInitials
      };
      await Content.findOneAndUpdate({ key: 'about' }, { key: 'about', data: merged });
    } else if (key === 'site') {
      const merged = { ...defaultContent.site, ...existing.data, phone: defaultContent.site.phone, email: defaultContent.site.email, address: defaultContent.site.address };
      await Content.findOneAndUpdate({ key: 'site' }, { key: 'site', data: merged });
    }
  }
  console.log('  Content sections seeded');

  if ((await Faculty.countDocuments()) === 0) {
    await Faculty.insertMany(defaultFaculty);
    console.log('  Faculty seeded');
  } else {
    await Faculty.findOneAndUpdate({ role: 'Principal' }, { name: 'Mrs. Tripati Shrivastava', role: 'Principal', subject: 'Administration', initials: 'TS' });
    await Faculty.findOneAndUpdate({ role: 'Vice Principal' }, { name: 'Mr. A. Awasthi', role: 'Vice Principal', subject: 'Mathematics', initials: 'AA' });
  }

  if ((await Gallery.countDocuments()) === 0) {
    await Gallery.insertMany(defaultGallery);
    console.log('  Gallery seeded');
  }

  if ((await Notice.countDocuments()) === 0) {
    await Notice.create({
      title: 'Admissions Open for Academic Year 2026–27',
      content: 'Applications are now open for Higher Secondary classes. Visit the school office for details.'
    });
    console.log('  Sample notice seeded');
  }

  console.log('Seed complete.');
}

if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = seedDatabase;
