var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

jQuery(function() {
  var AddTaskView, Task, TaskView, Tasks, TasksView, addTaskView, tasks, tasksView;
  Task = (function(_super) {
    __extends(Task, _super);

    function Task() {
      return Task.__super__.constructor.apply(this, arguments);
    }

    Task.prototype.defaults = {
      title: 'do something',
      completed: false
    };

    Task.prototype.validate = function(attrs) {
      if (_.isEmpty(attrs.title)) {
        return 'title must not be empty!';
      }
    };

    Task.prototype.initialize = function() {
      return this.on('invalid', function(model, error) {
        return $('#error').html(error);
      });
    };

    return Task;

  })(Backbone.Model);
  Tasks = (function(_super) {
    __extends(Tasks, _super);

    function Tasks() {
      return Tasks.__super__.constructor.apply(this, arguments);
    }

    Tasks.prototype.model = Task;

    return Tasks;

  })(Backbone.Collection);
  TaskView = (function(_super) {
    __extends(TaskView, _super);

    function TaskView() {
      return TaskView.__super__.constructor.apply(this, arguments);
    }

    TaskView.prototype.tagName = 'li';

    TaskView.prototype.initialize = function() {
      this.model.on('destroy', this.remove, this);
      return this.model.on('change', this.render, this);
    };

    TaskView.prototype.events = {
      'click .delete': 'destroy',
      'click .toggle': 'toggle'
    };

    TaskView.prototype.toggle = function() {
      return this.model.set('completed', !this.model.get('completed'));
    };

    TaskView.prototype.destroy = function() {
      if (confirm('are you sure?')) {
        return this.model.destroy();
      }
    };

    TaskView.prototype.remove = function() {
      return this.$el.remove();
    };

    TaskView.prototype.template = _.template($('#task-template').html());

    TaskView.prototype.render = function() {
      var template;
      template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    };

    return TaskView;

  })(Backbone.View);
  TasksView = (function(_super) {
    __extends(TasksView, _super);

    function TasksView() {
      return TasksView.__super__.constructor.apply(this, arguments);
    }

    TasksView.prototype.tagName = 'ul';

    TasksView.prototype.initialize = function() {
      this.collection.on('add', this.addNew, this);
      this.collection.on('change', this.updateCount, this);
      return this.collection.on('destroy', this.updateCount, this);
    };

    TasksView.prototype.addNew = function(task) {
      var taskView;
      taskView = new TaskView({
        model: task
      });
      this.$el.append(taskView.render().el);
      $('#title').val('').focus();
      return this.updateCount();
    };

    TasksView.prototype.updateCount = function() {
      var uncompletedTasks;
      uncompletedTasks = this.collection.filter(function(task) {
        return !task.get('completed');
      });
      $('#count').html(uncompletedTasks.length);
      return this;
    };

    TasksView.prototype.render = function() {
      this.collection.each(function(task) {
        var taskView;
        taskView = new TaskView({
          model: task
        });
        return this.$el.append(taskView.render().el);
      }, this);
      return this.updateCount();
    };

    return TasksView;

  })(Backbone.View);
  AddTaskView = (function(_super) {
    __extends(AddTaskView, _super);

    function AddTaskView() {
      return AddTaskView.__super__.constructor.apply(this, arguments);
    }

    AddTaskView.prototype.el = '#addTask';

    AddTaskView.prototype.events = {
      'submit': 'submit'
    };

    AddTaskView.prototype.submit = function(e) {
      var task;
      e.preventDefault();
      task = new Task;
      if (task.set({
        title: $('#title').val()
      }, {
        validate: true
      })) {
        this.collection.add(task);
        return $('#error').empty();
      }
    };

    return AddTaskView;

  })(Backbone.View);
  tasks = new Tasks([
    {
      title: 'task1',
      completed: true
    }, {
      title: 'task2'
    }, {
      title: 'task3'
    }
  ]);
  tasksView = new TasksView({
    collection: tasks
  });
  addTaskView = new AddTaskView({
    collection: tasks
  });
  return $('#tasks').html(tasksView.render().el);
});
