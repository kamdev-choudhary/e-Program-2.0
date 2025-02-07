import { faker } from "@faker-js/faker";

export function sanitizeFileName(name) {
  if (typeof name !== "string") {
    return ""; // Return an empty string if the input is not a valid string
  }
  return name.replace(/[\\\/:*?"<>|]/g, "_");
}

const getRandomRank = (min, max) =>
  Math.random() < 0.1 ? "--" : faker.number.int({ min, max });

export const generateMockData = () => {
  return {
    rollNumber1: faker.string.numeric(10),
    rollNumber2: faker.string.numeric(10),
    candidateName: faker.person.fullName(),
    motherName: faker.person.fullName(),
    fatherName: faker.person.fullName(),
    category: faker.helpers.arrayElement([
      "GEN",
      "OBC-NCL",
      "SC",
      "ST",
      "GEN-EWS",
    ]),
    personWithDisability: faker.helpers.arrayElement(["Yes", "No"]),
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 25, mode: "age" })
      .toISOString()
      .split("T")[0],
    stateOfEligibility: faker.location.state(),
    nationality: "Indian",
    mathematics1: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    mathematics2: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    mathematics: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    physics1: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    physics2: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    physics: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    chemistry1: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    chemistry2: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    chemistry: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    total1: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    total2: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    total: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    ntaScoreInWords: faker.string.alpha(10), // Placeholder for words
    crlRank: getRandomRank(1, 500000),
    genEwsRank: getRandomRank(1, 100000),
    obcNclRank: getRandomRank(1, 200000),
    scRank: "--",
    stRank: getRandomRank(1, 80000),
    crlPwDRank: getRandomRank(1, 10000),
    genEwsPwDRank: getRandomRank(1, 5000),
    obcNclPwDRank: getRandomRank(1, 10000),
    scPwDRank: getRandomRank(1, 7000),
    stPwDRank: getRandomRank(1, 5000),
  };
};
