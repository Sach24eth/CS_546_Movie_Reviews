const userRoutes = require('./usersRoute');
const reviewRoutes=require('./reviewsRoute');

const constructorMethod = (app) => {
	// Landing page '/' route
	app.use('/', userRoutes);
	
	app.use('/reviews',reviewRoutes);
	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
