//khai bao dia chi server
var address_server = "http://localhost:8080";
var address_server_scala = "http://10.15.171.21:8080";

//khai bao duong dan
//dung chung
var url_userlogin =address_server + "/userlogin";
var url_checkroleaction =address_server + "/checkroleaction";
var url_rolemodulesangular = address_server+"/rolemodulesangular";

//user
var url_userangular = address_server+"/userangular";
//module
var url_modulelistangular = address_server+"/modulelistangular";
var url_moduledelete = address_server+"/moduledelete";
var url_moduledetailangular = address_server+"/moduledetailangular";

//group
var url_grouplistangular = address_server+"/grouplistangular";
var url_groupdelete = address_server+"/groupdelete";
var url_groupdetailangular = address_server+"/groupdetailangular";

//role
var url_rolelistangular = address_server+"/rolelistangular";
var url_roledelete = address_server+"/roledelete";
var url_roledetailangular = address_server+"/roledetailangular";

//groupmodule
var url_groupchange = address_server+"/groupchange";
var url_groupmoduledetailangular = address_server+"/groupmoduleangular";

//groupmodulerole
var url_groupmodulerolechange = address_server+"/groupmodulerolechange";
var url_groupmoduleroledetailangular = address_server+"/groupmoduleroleangular";

//usergroup
var url_usergroupchange = address_server+"/usergroupchange";
var url_usergroupdetailangular = address_server+"/usergroupdetailangular";

//factoroption
var url_factoroptiondelete = address_server+"/factoroptiondelete";
var url_factoroptionlistangular = address_server+"/factoroptionlistangular";
var url_factoroptiondetailangular = address_server+"/factoroptiondetailangular";

//factor
var url_factordelete = address_server+"/factordelete";
var url_factorlistangular = address_server+"/factorlistangular";
var url_factordetailangular = address_server+"/factordetailangular";

//services scala
var url_grouplistangular_scala = address_server_scala+"/group/getall";
var url_groupdelete_scala = address_server_scala+"/group/delete";