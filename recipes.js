const mongoose = require('mongoose');

const Schema   = mongoose.Schema;
const data = require('./data.js');

mongoose.connect('mongodb://localhost/recipeApp')
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const recipeSchema = new Schema({
  title: { type: String, required: true, unique: true },
  level: { type: String, enum: ['Easy Peasy', 'Amateur Chef', 'UltraPro Chef'] },
  ingredients: Array,
  cuisine: { type: String, required: true },
  dishType: { type: String, enum: ['Breakfast', 'Dish', 'Snack', 'Drink', 'Dessert', 'Other'] },
  image: { type: String, default: 'https://images.media-allrecipes.com/images/75131.jpg' },
  duration: { type: Number, min: [0, 'You cant cook that fast!'] },
  creator: String,
  created: { type: Date, default: Date.now() },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

Recipe.deleteMany({})
  .then(() => {
    Recipe.create({
      title: 'Fish and chips',
      level: 'Easy Peasy',
      ingredients: ['fish', 'potatoes', 'love', 'salt', 'vinegar', 'mayonnaise', 'oil'],
      cuisine: 'British',
      dishType: 'Dish',
      duration: 30,
      creator: 'Us',
    })
      .then((dish) => {
        console.log(dish);
      })
      .then(() => Recipe.insertMany(data)
        .then(() => {
          console.log(data.title);
        }))
      .then(() => Recipe.findOne({ title: 'Rigatoni alla Genovese' })
        .then((dish) => {
          console.log(dish);
          dish.duration = 100;
          return dish.save()
            .then((result) => {
              console.log('after saving', result);
            });
        }))
      .then(() => Recipe.deleteOne({ title: 'Carrot Cake' })
        .then(() => {
          console.log('removed');
          mongoose.connection.close();
        }));
  })
  .catch((error) => {
    console.log(error);
  });
