
var __cov_keflNmXrsFkr4_4RGqCklw = (Function('return this'))();
if (!__cov_keflNmXrsFkr4_4RGqCklw.__coverage__) { __cov_keflNmXrsFkr4_4RGqCklw.__coverage__ = {}; }
__cov_keflNmXrsFkr4_4RGqCklw = __cov_keflNmXrsFkr4_4RGqCklw.__coverage__;
if (!(__cov_keflNmXrsFkr4_4RGqCklw['routes/databaseconnection.js'])) {
   __cov_keflNmXrsFkr4_4RGqCklw['routes/databaseconnection.js'] = {"path":"routes/databaseconnection.js","s":{"1":0,"2":0,"3":0},"b":{},"f":{},"fnMap":{},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":34}},"2":{"start":{"line":3,"column":0},"end":{"line":8,"column":3}},"3":{"start":{"line":12,"column":0},"end":{"line":12,"column":22}}},"branchMap":{}};
}
__cov_keflNmXrsFkr4_4RGqCklw = __cov_keflNmXrsFkr4_4RGqCklw['routes/databaseconnection.js'];
__cov_keflNmXrsFkr4_4RGqCklw.s['1']++;var mysql=require('mysql');__cov_keflNmXrsFkr4_4RGqCklw.s['2']++;var pool=mysql.createPool({host:'localhost',user:'root',password:'',database:'staffing'});__cov_keflNmXrsFkr4_4RGqCklw.s['3']++;module.exports=pool;
