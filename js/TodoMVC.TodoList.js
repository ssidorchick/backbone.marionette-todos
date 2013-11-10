TodoMVC.module('TodoList', function(TodoList, App, Backbone, Marionette, $, _) {
	TodoList.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'*filter': 'filterItems'
		}
	});

	TodoList.Controller = function() {
		this.todoList = new App.Todos.TodoList();
	};

	_.extend(TodoList.Controller.prototype, {
		start: function() {
			this.showHeader(this.todoList);
			this.showFooter(this.todoList);
			this.showTodoList(this.todoList);

			this.todoList.fetch();
		},

		showHeader: function(todoList) {
			var header = new App.Layout.Header({
				collection: this.todoList
			});
			App.header.show(header);
		},

		showFooter: function(todoList) {
			var footer = new App.Layout.Footer({
				collection: this.todoList
			});
			App.footer.show(footer);
		},

		showTodoList: function(todoList) {
			App.main.show(new TodoList.Views.ListView({
				collection: todoList
			}));
		},

		filterItems: function(filter) {
			App.vent.trigger('todoList:filter', (filter && filter.trim()) || '');
		}
	});

	TodoList.addInitializer(function() {
		var controller = new TodoList.Controller();
		new TodoList.Router({
			controller: controller
		});

		controller.start();
	});
});
