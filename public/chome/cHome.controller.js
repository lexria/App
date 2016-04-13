angular
  .module('cHome')
  .controller('ClientController', ClientController);

  ClientController.$inject = ['$scope','$rootScope','$location','$uibModal','$log','ClientService'];

  function ClientController($scope,$rootScope,$location,$uibModal,$log,ClientService) {
    var vm = this;
    vm.animationsEnabled = true;

    // THIS OPENS JOB POST FORM MODAL
      vm.openJobModal = function (size) {

        var modalInstance = $uibModal.open({
          animation: vm.animationsEnabled,
          templateUrl: 'chome/tmpls/jobMainModal.html',
          controller: 'JobInstanceCtrl',
          size: size,
          resolve: {
            items: function () {
              return vm.items;
            }
          }
        });
      };

    //logout button
    vm.logout = function(){
      console.log('data inside logout function',window.localStorage);
      ClientService.logoutNow(window.JSON.parse(window.localStorage.getItem('theclient')).id).then(function(){
        window.localStorage.clear();
        console.log('hopefully empty: ',window.localStorage);
        $location.path('/');
      })
    }

    //to load the page after changes
    vm.loadPage = function(){
      //getting data from the login and register
      ClientService.getClient(window.JSON.parse(window.localStorage.getItem('theclient')).id)
      .then(function(data){
        console.log('client data from chome controller',data);
        vm.clientData =  data.data  ;
        console.log('vm client from chome controller',vm.clientData);
      })
    }
    vm.loadPage();

    //edit profile content
    vm.editInfo = false;

    vm.editBtn = function(){
      vm.editInfo = !vm.editInfo;
    }

    vm.master = {};
    vm.saveEdit = function(user){
      // vm.master = angular.copy(user);
      console.log('should be new profile info obj',user);
      ClientService.editClient(user).then(function(data){
        vm.edittedData =  data.data;
        console.log('client after edit',vm.edittedData);
      });
      vm.editInfo = !vm.editInfo;
      vm.loadPage();
    }

    //delete client account
    vm.deleteC = function(){
      console.log('data inside delete function',window.localStorage);
      ClientService.deleteClient().then(function(){
        window.localStorage.clear();
        console.log('hopefully empty: ',window.localStorage);
        $location.path('/');
      })
    }

    //the rating stars
    vm.rate = 0;
    vm.max = 5;
    vm.isReadonly = false;

    vm.hoveringOver = function(value) {
      vm.overStar = value;
      vm.percent = 100 * (value / vm.max);
    };

    vm.ratingStates = [
      {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
      {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
      {stateOn: 'glyphicon-heart'},
      {stateOff: 'glyphicon-off'}
    ];

    //temporary accordion data injecting the page

    vm.historyData = ClientService.historyData;

  }
