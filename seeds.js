const faker = require('faker');
const db = require('./config/db');
const User = require('./models/user');
const Student = require('./models/student');
const Class = require('./models/classes');
const Paid = require('./models/paid');
const Collaboration = require('./models/collaboration');

const admin = {
  "name": "admin",
  "email": "admin@admin.com",
  "role": 'admin',
  "phone": faker.phone.phoneNumber(),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
}

const teachers = [{
  "name": "Olya Dmytrivna",
  "email": "dmutrivna@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number({ min: 10, max: 100 }),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Nataha Dmytrivna",
  "email": "123Vasivna@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number({ min: 10, max: 100 }),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Vassa Petrov",
  "email": "Vaasap!@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number({ min: 10, max: 100 }),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Ira Komariyska",
  "email": "opsrsfc@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number({ min: 10, max: 100 }),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
}]

const run = async () => {
  try {
    await User.remove({});
    await Student.remove({});
    await Class.remove({});
    await Paid.remove({});
    await Collaboration.remove({});
    await User.create(admin);
    await User.create(teachers);
    const students = studentsGenerator(29);
    await Student.create(students);

    const studentIDs = await Student.aggregate([{ $group: { _id: null, ids: { $push: "$_id" } } }]).exec();
    const teacherIDs = await User.aggregate([{ $match: { role: 'teacher' } }, { $group: { _id: null, ids: { $push: "$_id" } } }]).exec();
    const classes = classesGenerator(8, studentIDs[0].ids, teacherIDs[0].ids)
    await Class.create(classes);
    const payments = generatePaiment(studentIDs[0].ids);
    await Paid.create(payments);
    const classes2 = await Class.aggregate([{ $group: { _id: null, classes: { $push: { id: "$_id", students: "$students" } } } }]).exec();
    const collaborations = generateCollaborations(classes2[0].classes)
    await Collaboration.create(collaborations);
  } catch (e) {
    console.log(e);
  } finally {
    db.close()
  }
}

run();

function studentsGenerator(count) {
  const students = [];
  while (count--) {
    const stud = {
      "name": faker.name.findName(),
      "email": faker.internet.email(),
      "phone": faker.phone.phoneNumber(),
      "language": faker.random.arrayElement([
        "English",
        "Polish",
        "German",
        "Japanese",
        "Chinese",
        "Spanish",
        "Italian",
        "Turkish",
        "French",
        "Chezh",
        "Arabian"
      ]),
      "level": faker.random.arrayElement([
        "Beginner",
        "Elementary",
        "Pre-intermediate",
        "Intermediate",
        "Upper-intermediate",
        "Advanced"
      ]),
      "dayOfBirth": faker.date.past(),
      "notes": faker.lorem.sentence(),
      "account": faker.random.number({ min: -100, max: 500 }),
    }
    students.push(stud)
  }
  return students;
}

function classesGenerator(count, studentsIDs, teacherIDs) {
  const classes = [];
  while (count--) {
    const clas = { language: faker.random.arrayElement([
        "English",
        "Polish",
        "German",
        "Japanese",
        "Chinese",
        "Spanish",
        "Italian",
        "Turkish",
        "French",
        "Chezh",
        "Arabian"
    ]), level: faker.random.arrayElement([
      "Beginner",
      "Elementary",
      "Pre-intermediate",
      "Intermediate",
      "Upper-intermediate",
      "Advanced"
    ]), notes: faker.lorem.sentence(), type: faker.random.arrayElement([
        "induvidual",
        "semi-induvidual",
        "group",
        "group"
      ]), price: faker.random.number(50, 200), teacher: faker.random.arrayElement(teacherIDs) };
    if (clas.type == 'induvidual') {
      const index = faker.random.number({ min: 0, max: studentsIDs.length - 1 });
      clas.students = [...studentsIDs.slice(index, index + 1)];
    }
    if (clas.type == 'semi-induvidual') {
      const index = faker.random.number({ min: 0, max: studentsIDs.length - 1 });
      clas.students = [...studentsIDs.slice(index, index + 2)];
    }
    if (clas.type == 'group') {
      const index = Math.floor(Math.random() * 10);
      clas.students = [...studentsIDs.slice(index, index + 3)];
    }
    classes.push(clas)
  }
  return classes
}

function generatePaiment(studentIDs) {
  const payments = [];
  studentIDs.forEach(id => {
    let count = faker.random.number({ min: 3, max: 20 });
    while (count--) {
      let paid = {
        student: id,
        value: faker.random.number({ min: -200, max: 200 }),
        type: faker.random.arrayElement(['income', 'outcome'])
      };
      payments.push(paid);
    }
  })
  return payments;
}


function generateCollaborations(classes) {
  const collaborations = [];
  classes.forEach(clas => {
    let count = faker.random.number(15);
    let planed = 2;
    while (count--) {
      const day = faker.date.past(1);
      const collaboration = {
        class: clas.id,
        status: faker.random.arrayElement(['finished']),
        room: faker.random.arrayElement(['n1', 'n2', 'n3', 'n4', 'n5']),
        since: day,
        until: new Date(day.getTime() + 1000 * 60 * 60 * 2),
        students: clas.students.filter(el => faker.random.boolean())
      }
      collaborations.push(collaboration);
    }
    while (planed--) {
      const day = faker.date.future(1);
      const collaboration = {
        class: clas.id,
        status: faker.random.arrayElement(['planned']),
        room: faker.random.arrayElement(['n1', 'n2', 'n3', 'n4', 'n5']),
        since: day,
        until: new Date(day.getTime() + 1000 * 60 * 60 * 2),
        students: []
      }
      collaborations.push(collaboration);
    }
    const day = new Date();
    const collaboration = {
      class: clas.id,
      status: faker.random.arrayElement(['planned']),
      room: faker.random.arrayElement(['n1', 'n2', 'n3', 'n4', 'n5']),
      since: new Date(day.getTime() - 1000 * 60 * 60 * 2),
      until: day,
      students: clas.students.filter(el => faker.random.boolean())
    }
    collaborations.push(collaboration);

  })
  return collaborations
}