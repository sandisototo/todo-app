var app = angular.module('todoApp', ['toastr'])
app.controller('todoCtrl', ($scope, toastr, api, extras) => {
    $scope.todoList = []

    $scope.getTasks = () => {
      api.getTasks()
      .then((response) => response.data)
      .then((data) => {
        if (!data) {
          $scope.errorMessage = "You have not added any tasks yet!"
          extras.displayToast(toastr.warning, "Warning", $scope.errorMessage)
          return
        }

        $scope.todoList = data
  			updateCompletedCount($scope.todoList)
       },
       (error) => {
         $scope.errorMessage = "Sorry we coudn't process this request! Please try again later"
         extras.displayToast(toastr.error, "Error", $scope.errorMessage)
     })
    }
    // Load tasks
    $scope.getTasks()

    // Add task
    $scope.addTask = (newTask) => {
      if (!$scope.newTaskForm.$valid) {
        extras.displayToast(toastr.error, "Error", "Task description cannot be left blank.")
        return false
      }

      api.addTask(newTask)
      .then((response) => response.data)
      .then((data) => {
        if (!data || data.error) {
          extras.displayToast(toastr.error, "Error", data.message || "Could not add this task! Make sure you provide description.")
          return
        }
        $scope.todoList.push({
                               id: data.id,
                               description: data.description,
                               done:false
                             })
        updateCompletedCount($scope.todoList)
        $scope.newTask = {}
        extras.displayToast(toastr.success, "Success", "Task added successfully!")
      },
      (error) => {
        console.log('error--->', error)
        extras.displayToast(toastr.error, "Error", error)
      })
    }

    // Update task
    $scope.updateTask = (changedTask, validate = false, markAll = false) => {
      if (validate && !$scope.editTaskForm.$valid) {
        extras.displayToast(toastr.error, "Error", "Task description cannot be left blank.")
        return false
      }

      if (!validate) changedTask.done = !!changedTask.done || false

      api.updateTask(changedTask)
      .then((response) => response.data)
      .then((data) => {
        if (markAll) console.log('markAll() tasks update response', data)

        if (!markAll && (!data || data.error)) {
          extras.displayToast(toastr.error, "Error", data.message || "Could not update this task! Make sure you provide description.")
          return
        }

        $scope.changedTask = {}
        updateCompletedCount($scope.todoList)
        if (!markAll) extras.displayToast(toastr.success, "Success", "Task updated successfully!")
      },
      (error) => {
        console.log('error--->', error)
        if (!markAll) extras.displayToast(toastr.error, "Error", error)
      })
    }

    // Delete task
    $scope.deleteTask = (task) => {
      api.deleteTask(task.id)
      .then((response) => response.data)
      .then((data) => {
        if (!data || data.error) {
          extras.displayToast(toastr.error, "Error", data.message || "Could not update this task! Make sure you provide description.")
          return
        }

        $scope.todoList.splice($scope.todoList.indexOf(task), 1)

        updateCompletedCount($scope.todoList)
        extras.displayToast(toastr.info, "Deleted", "Task has been deleted successfully!")
      },
      (error) => {
        console.log('error--->', error)
        extras.displayToast(toastr.error, "Error", error)
      })
    }

    // Toggle markAll
    $scope.checkall = false;
    $scope.markAll = () => {
      $scope.checkall = !$scope.checkall;
      for(let key in $scope.todoList) {
        $scope.todoList[key].done = $scope.checkall;
        $scope.updateTask($scope.todoList[key], false, true)
      }

      updateCompletedCount($scope.todoList)
      extras.displayToast(toastr.success, "Success", "All tasks updated successfully!")
    }

    //Show edit form
    $scope.showEditModal = (task) => {
      $scope.taskToChange = task
    }

    const updateCompletedCount = (todoList) => {
      let completed =  todoList.filter((task) => task.done == 0)
      $scope.taskCount = completed.length
    }
})
.provider('apiUrl', function () {
  this.$get = () => 'http://localhost:8080/api/v1/'
})
.provider('headers', function () {
    this.$get = () => {
        return { headers :{ 'Content-Type': 'application/x-www-form-urlencoded,charset=utf-8;'}}
    }
})
.factory('api',  ($http, apiUrl, headers) => {
  console.log('API factory Running')
  let api = {}
  api.getTask= (id) => $http.get(`${apiUrl}tasks/${id}`)
  api.getTasks = () => $http.get(`${apiUrl}tasks`)
  api.addTask = (data) => $http.post(`${apiUrl}task`, data, headers)
  api.updateTask = (data) => $http.put(`${apiUrl}task/${data.id}`, JSON.stringify(data), headers)
  api.deleteTask = (id) => $http.delete(`${apiUrl}task/${id}`)
  return api
})
.factory('extras', (toastr) => {
  console.debug('extras Factory Running')
  let extrasFactory = {}
  // DisplayToast
  extrasFactory.displayToast = (result,title,message) => {
    result(message, title,{
      'extendedTimeOut': '2000',
      'closeButton': 'true',
      'progressBar': 'true',
      'positionClass': 'toast-bottom-left'
    })
  }
  return extrasFactory
})
