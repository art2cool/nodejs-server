const db = require('./config/db');
const User = require('./models/user');
const Student = require('./models/students');
const faker = require('faker');

const admin = {
  "name": "admin",
  "email": "admin@admin.com",
  "role": 'admin',
  "password": "$2a$10$PO1fcL/waUw/mLd/TOcES.Df7wrWBgSLN6jGB0kFfIzfkesAptx0a"
}

const run = async () => {
  try {
    await User.remove({});
    await User.create(admin);
    const students = studentsGenerator(19);
    await Student.remove({});
    await Student.create(students);
  } catch (e) {
    console.log(e);
  } finally {
    db.close()
  }
}

run();

function studentsGenerator(count) {
  const students = []
  while (count--) {
    const stud = {
      "name": faker.name.findName(),
      "email": faker.internet.email(),
      "phone": faker.phone.phoneNumber(),
      "language": faker.random.arrayElement(['English', 'Polish', 'German', 'Japanese']),
      "level": faker.random.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      "dayOfBirth": faker.date.past(),
      "notes": faker.lorem.sentence(),
      "account": faker.random.number(0, 500)
    }
    students.push(stud)
  }
  return students;
}