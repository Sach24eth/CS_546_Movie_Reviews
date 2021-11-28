<<<<<<< HEAD
const userRoutes = require('./usersRoute');
const reviewRoutes=require('./reviewsRoute');

const constructorMethod = (app) => {
	// Landing page '/' route
	app.use('/', userRoutes);
	
	app.use('/reviews',reviewRoutes);
	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
=======
const userRoutes = require("./usersRoute");
const productRoutes = require("./productRoute");
const constructorMethod = (app) => {
  // Landing page '/' route
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
  app.use("/product", productRoutes);
>>>>>>> upstream/main
};

module.exports = constructorMethod;
