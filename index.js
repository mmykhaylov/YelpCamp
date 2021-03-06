// REQUIRES

require('dotenv').config({ path: "./vars.env"})
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash-plus');

const User = require('./models/user');

const indexRoutes = require('./routes/index');
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

const app = express();

// MONGODB SETUP

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// EXPRESS SETUP

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');

// PASSPORT SETUP

app.use(
  expressSession({
    secret:
      'CJvGwWXcQzBAlaVj5Ym1LcbHFxQwum4OyAbKsnojRfqvv3uNUBi5x5Tq8pSnuuZgtbKgjo3' +
      'iu7Iar7xKfE3hJ0J41pes28MPGAVR5mLWdfVXnj5bZtsA96GEStoYwO68UE8nRsAn6F4W' +
      'X8q8PCYZpC7tL0c1PnKtUnUNXHXeDX1UYILnGOLTplxE68U7NEIGbkjvZtR',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.successMessage = req.flash('success');
  res.locals.warningMessage = req.flash('warning');
  res.locals.errorMessage = req.flash('error');
  next();
});

// ROUTES SETUP

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// LISTENING

app.listen(process.env.PORT === undefined ? 80 : process.env.PORT);
