/**
 * 为了方便调试
 */
function print(str){
    console.log(str);
    return;
}

/**
 * 这里是书籍列表模块    
 * @type {[type]}
 */
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $state, $stateParams) {

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [2, 5, 6],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
        //print(data);
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.books = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //这里可以根据路由上传递过来的bookType参数加载不同的数据
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {///异步获取数据
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('./data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });

                        $scope.setPagingData(data, page, pageSize);
                    });
            } else {
                $http.get('./data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        //alert($stateParams.bookType);
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
            }
            // print(data);
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {  
        data: 'books',
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
        multiSelect: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enablePinning: true,
        columnDefs: [{
            field: 'index',
            displayName: '序号',
            width: 60,
            pinnable: false,
            sortable: false
        }, {
            field: 'name',
            displayName: '书名',
            enableCellEdit: true
        }, {
            field: 'author',
            displayName: '作者',
            enableCellEdit: true,
            width: 220
        }, {
            field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});


/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {

    $scope.setData = function(data) {
        print(data);
        $scope.author = data[0].author;
        $scope.imgSrc = "./image/"+data[0].imgName;
        $scope.name = data[0].name;
        $scope.href = data[0].href;
        $scope.price = data[0].price;
        $scope.isEbook = data[0].isEbook;
        $scope.type = data[0].type;
        $scope.pubTime = data[0].pubTime;
        
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
     $scope.getDataAsync = function(searchText) {///异步获取数据
         setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('./data/bookDetail' + $stateParams.bookId + '.json')
                    .success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });

                        $scope.setData(data);
                    });
            } else {
                $http.get('./data/bookDetail' + $stateParams.bookId + '.json')
                    .success(function(largeLoad) {
                         $scope.setData(largeLoad);
                    });
            }
        }, 100);
    };

    $scope.getDataAsync();
});
