require('dotenv').config();

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

let mongoose = require('mongoose');

// this connects to your mongo database through the varaible in the dotenv file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// this creates a schema which defines the model we will use to add data to the db
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

// here is is tying our schema to be used as the model for our data
let Person = mongoose.model('Person', personSchema);

// this creates a single instance of our model
const createAndSavePerson = (done) => {
  // here is the instance
  // we give it a name (steve) and call new Person({})
  let steve = new Person({
    name: 'steve',
    age: 27,
    favoriteFoods: ['sandwich', 'pizza'],
  });
  // here we are saving it (as the data argument) we want to stop and catch any errors
  // otherwise we run the done function which takes null and data as arguments
  steve.save((error, data) => {
    if (error) {
      console.log(error);
    } else {
      // from what I understand the null is just another error but we don't want to log it
      // for testing reasons?
      done(null, data);
    }
  });
};

// this array of data will be used with the createManyPeople function
let arrayOfPeople = [
  { name: 'Alex', age: 33, favoriteFoods: ['bread', 'eggs'] },
  { name: 'John', age: 24, favoriteFoods: ['salad'] },
  { name: 'Sarah', age: 26, favoriteFoods: ['rice'] },
];
// this creates many instances of our model
const createManyPeople = (arrayOfPeople, done) => {
  // we use Model.create giving it our array of instances and a function taking error and data
  // in this case our model is Person so we use Person.create
  //  doing it this way we don't need a separate save function it is the second argument
  Person.create(arrayOfPeople, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findPeopleByName = (personName, done) => {
  // this is used for searching the db (personName is just for testing you can enter any name
  // you want to search for)
  // model.find takes two arguments the query and a call back function with what you
  // want to do with the info
  // it will return an array of the items found
  Person.find({ name: personName }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findOneByFood = (food, done) => {
  // this is simalar to .find but will not return an array even if there are multiple items
  // useful when searching things marked unique
  Person.findOne({ favoriteFoods: food }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findPersonById = (personId, done) => {
  //When saving a document, MongoDB automatically adds the field _id, and set it to a unique
  // alphanumeric key. Searching by _id is an extremely frequent operation, so Mongoose provides
  // a dedicated method for it.
  Person.findById({ _id: personId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';
  Person.findById({ _id: personId }, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      result.favoriteFoods.push(foodToAdd);
      result.save((error, updatedResult) => {
        if (error) {
          console.log(error);
        } else {
          done(null, updatedResult);
        }
      });
    }
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (error, updatedRecord) => {
      if (error) {
        console.log(error);
      } else {
        done(null, updatedRecord);
      }
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({ _id: personId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = 'Mary';
  Person.remove({ name: nameToRemove }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const queryChain = (done) => {
  const foodToSearch = 'burrito';
  Person.find({ favoriteFoods: { $all: [foodToSearch] } })
    .sort({ name: 'asc' })
    .limit(2)
    .select('-age')
    .exec((error, data) => {
      if (!error) {
        done(null, data);
      }
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
