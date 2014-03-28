jQuery ->
 
    class Task extends Backbone.Model
 
        defaults:
            title: 'do something'
            completed: false
 
        validate: (attrs) ->
            if _.isEmpty attrs.title
                'title must not be empty!'
 
        initialize: ->
            @on 'invalid', (model, error) ->
                $('#error').html error
 
    class Tasks extends Backbone.Collection
        model: Task
 
    class TaskView extends Backbone.View
 
        tagName: 'li'
 
        initialize: ->
            @model.on 'destroy', @remove, @
            @model.on 'change', @render, @
 
        events:
            'click .delete': 'destroy'
            'click .toggle': 'toggle'
 
        toggle: ->
            @model.set 'completed', !@model.get 'completed'
 
        destroy: ->
            if confirm 'are you sure?'
                @model.destroy()
 
        remove: ->
            @.$el.remove()
 
        template: _.template($('#task-template').html())
 
        render: ->
            template = @template @model.toJSON()
 
            @.$el.html template
            @
 
    class TasksView extends Backbone.View
 
        tagName: 'ul'
 
        initialize: ->
            @collection.on 'add', @addNew, @
            @collection.on 'change', @updateCount, @
            @collection.on 'destroy', @updateCount, @
 
        addNew: (task) ->
            taskView = new TaskView model: task
            @.$el.append taskView.render().el
            $('#title').val('').focus()
            @updateCount()
 
        updateCount: ->
            uncompletedTasks = @collection.filter( (task) ->
                !task.get 'completed'
            )
            $('#count').html uncompletedTasks.length
            @
 
        render: ->
            @collection.each (task) ->
                taskView = new TaskView model:task
                @.$el.append taskView.render().el
            , @
            @updateCount()
 
    class AddTaskView extends Backbone.View
        el: '#addTask'
        events:
            'submit': 'submit'
 
        submit: (e) ->
            e.preventDefault()
            task = new Task 
            if task.set( {title: $('#title').val()}, {validate: true} )
                @collection.add task
                $('#error').empty()
 
    tasks = new Tasks([
        {
            title: 'task1'
            completed: true
        }
        {
            title: 'task2'
        }
        {
            title: 'task3'
        }
    ])
 
    tasksView = new TasksView collection: tasks
    addTaskView = new AddTaskView collection: tasks
 
    $('#tasks').html tasksView.render().el
