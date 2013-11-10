TodoMVC.module('TodoList.Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.ItemView = Marionette.ItemView.extend({
		tagName: 'li',
		template: '#template-todoItemView',
		
		ui: {
			edit: '.edit'
		},

		events: {
			'click .destroy': 'destroy',
			'dblclick label': 'onEditClick',
			'keydown .edit': 'onEditKeypress',
			'focusout .edit': 'onEditFocusout',
			'click .toggle': 'toggle'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		onRender: function() {
			this.$el.removeClass('active completed');
			if (this.model.get('completed')) {
				this.$el.addClass('completed');
			} else {
				this.$el.addClass('active');
			}
		},

		destroy: function() {
			this.model.destroy();
		},

		toggle: function() {
			this.model.toggle().save();
		},

		onEditClick: function() {
			this.$el.addClass('editing');
			this.ui.edit.focus();
			this.ui.edit.val(this.ui.edit.val());
		},

		onEditFocusout: function () {
			var todoText = this.ui.edit.val().trim();
			if (todoText) {
				this.model.set('title', todoText).save();
				this.$el.removeClass('editing');
			} else {
				this.destroy();
			}
		},

		onEditKeypress: function(e) {
			var ENTER_KEY = 13, ESC_KEY = 27;

			if (e.which === ENTER_KEY) {
				this.onEditFocusout();
				return;
			}

			if (e.which === ESC_KEY) {
				this.ui.edit.val(this.model.get('title'));
				this.$el.removeClass('editing');
			}
		}
	});


	Views.ListView = Marionette.CompositeView.extend({
		template: '#template-todoListCompositeView',
		itemView: Views.ItemView,
		itemViewContainer: '#todo-list',

		ui: {
			toggle: '#toggle-all'
		},

		events: {
			'click #toggle-all' : 'onToggleAllClick'
		},

		initialize: function() {
			this.listenTo(this.collection, 'all', this.update);
		},

		onRender: function() {
			this.update();
		},

		update: function() {
			function reduceCompleted(left, right) {
				return left && right.get('completed');
			}

			var allCompleted = this.collection.reduce(reduceCompleted, true);
			this.ui.toggle.prop('checked', allCompleted);
			if (this.collection.length === 0) {
				this.$el.parent().hide();
			} else {
				this.$el.parent().show();
			}
		},

		onToggleAllClick : function(evt) {
			var isChecked = evt.currentTarget.checked;
			this.collection.each(function(todo) {
				todo.save({ 'completed': isChecked });
			});
		}
	});

	App.vent.on('todoList:filter', function(filter) {
		filter = filter || 'all';
		$('#todoapp').attr('class', 'filter-' + filter);
	});
});
