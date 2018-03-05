const db = require('./config/db');
const User = require('./models/user');
const Student = require('./models/students');
const Class = require('./models/classes');
const faker = require('faker');

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
  "coeficient": faker.random.number(1, 100),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Nataha Dmytrivna",
  "email": "123Vasivna@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number(1, 100),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Vassa Petrov",
  "email": "Vaasap!@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number(1, 100),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
},
{
  "name": "Ira Komariyska",
  "email": "opsrsfc@teacher.com",
  "role": 'teacher',
  "phone": faker.phone.phoneNumber(),
  "coeficient": faker.random.number(1, 100),
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
}]

const run = async () => {
  try {
    await User.remove({});
    await Student.remove({});
    await Class.remove({});
    await User.create(admin);
    await User.create(teachers);
    const students = studentsGenerator(29);
    await Student.create(students);

    const studentIDs = await Student.aggregate([{$group:{_id: null, ids: {$push: "$_id"}}}]).exec();
    const teacherIDs = await User.aggregate([{$match: {role: 'teacher'}},{$group:{_id: null, ids: {$push: "$_id"}}}]).exec();
    const classes = classesGenerator(8, studentIDs[0].ids, teacherIDs[0].ids)
    await Class.create(classes);
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
      "language": faker.random.arrayElement(['English', 'Polish', 'German', 'Japanese']),
      "level": faker.random.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      "dayOfBirth": faker.date.past(),
      "notes": faker.lorem.sentence(),
      "account": faker.random.number(100, 500),
    }
    students.push(stud)
  }
  return students;
}

function classesGenerator(count, studentsIDs, teacherIDs) {
  const classes = [];
  while(count--) {
    const clas = {
      "language": faker.random.arrayElement(['English', 'Polish', 'German', 'Japanese']),
      "level": faker.random.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      "notes": faker.lorem.sentence(),
      "type": faker.random.arrayElement(['induvidual', 'semi-induvidual', 'group']),
      "price": faker.random.number(50, 200),
      "teacher": faker.random.arrayElement(teacherIDs)
    }
    console.log(clas.type)
    console.log(studentsIDs.length)
    if (clas.type == 'induvidual' ) {
      const index = faker.random.number(0, studentsIDs.length-1);
      clas.students = [...studentsIDs.slice(index, index + 1)];
    }
    if (clas.type == 'semi-induvidual' ) {
      const index = faker.random.number(0, studentsIDs.length-1);
      clas.students = [...studentsIDs.slice(index, index + 2)];
    }
    if (clas.type == 'group' ) {
      const index = Math.floor(Math.random()*10);
      clas.students = [...studentsIDs.slice(index, index + 3)];
    }
    classes.push(clas)
  }
  return classes
}