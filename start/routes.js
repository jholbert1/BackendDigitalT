'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
});

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.get("/logout", "AuthController.logout").middleware(["auth"]);
  Route.get("/user", "AuthController.authUser").middleware(["auth"]);
}).prefix("api/auth");

Route.group(() => {
  Route.get("/", "UserController.index").middleware(["auth"]);
  Route.get("/:id", "UserController.show").middleware(["auth"]);
  Route.post("/", "UserController.store").middleware(["auth"]);
  Route.put("/:id", "UserController.update").middleware(["auth"]);
  Route.post("/delete", "UserController.delete").middleware(["auth"]);
  Route.post("/active", "UserController.active");
}).prefix("api/users")

Route.group(() => {
  Route.get("/", "VehicleController.index").middleware(["auth"]);
  Route.post("/", "VehicleController.store").middleware(["auth"]);
  Route.post("/status", "VehicleController.update_status").middleware(["auth"]);
  Route.get("/status/get", "VehicleController.status_idex").middleware(["auth"]);
  Route.post("/delete", "VehicleController.delete").middleware(["auth"]);
  Route.put("/:id", "VehicleController.update").middleware(["auth"]);
}).prefix("api/vehicles")


