var vmModule = require("./main-view-model");
var ImageModule = require("ui/image");
var listViewModule = require("ui/list-view");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;
