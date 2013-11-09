var app = app || {};

var Workspace = Backbone.Router.extend({
	routes: {
		"*filter": "setFilter"
	},

	setFilter: function(param) {
		app.TodoFilter = param || "";
		app.Todos.trigger("filter");
	}
});

app.TodoRouter = new Workspace();
Backbone.history.start();
