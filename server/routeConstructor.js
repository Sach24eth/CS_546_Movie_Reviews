const userRoutes = require("./routes/usersRoute");
const privateRoutes = require("./routes/privateRoute");
const homePageRoute = require("./routes/homePageRoute");
<<<<<<< HEAD
const ReviewRoute = require("./routes/reviewsRoute");

const constructorMethod = (app) => {
  // Landing page '/' route
  app.use("/", homePageRoute);
  app.use("/users", userRoutes);
  app.use("/private", privateRoutes);
  app.use("/reviews",ReviewRoute);
  app.get("/*", (req, res) => {
    res.render("errorPage/404");
  });
=======
const communityRoute = require("./routes/community");

const constructorMethod = (app) => {
    // Landing page '/' route
    app.use("/", homePageRoute);
    app.use("/users", userRoutes);
    app.use("/private", privateRoutes);
    app.use("/community", communityRoute);
    app.get("/*", (req, res) => {
        res.render("errorPage/404");
    });
>>>>>>> upstream/main
};

module.exports = constructorMethod;
