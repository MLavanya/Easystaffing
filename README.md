Easy Staffing
=============

Web application for managing the staffing process. Its easy to use and has free text search. Its backed by a powerful Solr search engine which searched documents ( CVs ).It helps track a vacancy , candidate and his applications to the maximum level. Also the shorlisting and applying process is very easy for the fact that only the suitable candidates will be able to apply. The pain of actaully matching people looking for keywords etc is all done by the system.



Setup Dev Env
=============

Dev Environment consists of the following requisites.
 
 1. MySQL
 2. Solr        // ToDo backup solr schema files.
    * Apache Solr has to be running on your system locally.
    * You can download Apache Solr from http://www.apache.org/dyn/closer.cgi/lucene/solr/
    * Copy the core EasyStaffingCandidate,EasyStaffingVacancy to ```~\solr-4.9.0\solr-4.9.0\example\solr```.
    * To start the Solr server open command prompt(windows)/ Terminal(Linux/Mac) and navigate to the directory ```\solr-4.9.0\solr-4.9.0\example```
      then type ```java -jar start.jar``` 
    * To check Solr is up and running open your browser and type ```localhost:8983/solr/``` you see the Solr admin panel.
 3. Nodejs
 4. Emberjs


Note: Detailed design and documentation can be found in the [wiki ... ](http://192.168.1.137/development/easystaffing/wikis/home)

Deployment
==========

Deployment of the application is taken care by the grunt tool. execute the deploy task by calling it as below

  `grunt deploy`
  
The secret.json contains parameters that are to be set so that the grunt task can deploy and execute the application on the remote server.The parameters that are to be configured on the remote server are as below
  `
  {
	"host":"ip of the system to deploy to",
	"username": "ssh username",
	"password": "ssh password",
	"path": "path to deply the code"
  }
  `

Release History
===============

| Version | Date |
|---------|------|
| 1.0 | 15-09-2014 |


Milestones
===============

| Version | Date | Remarks |
|---------|------|---------|
| 1.0 | 11-08-2014 | Started Implementation |
| 1.0 | 05-09-2014 | Completed Implementation |
| 1.0 | 08-09-2014 | Testing Started |


Reports
=======

* [Static Code Analysis](http://192.168.1.137/development/easystaffing/edit/master/report/index.html)
* [Code Coverage](http://192.168.1.137/development/easystaffing/edit/master/coverage/index.html)
* [API Documentation](http://192.168.1.137/development/easystaffing/edit/master/docs/index.html)
* [CI Status](http://192.168.1.137/development/easystaffing/edit/master/reports/index.html)


Contact
=======

Prashanth Karnam : prashanthk@srsconsultinginc.com
                 : @prashanthk
                 
Lavanya M : lavanyam@srsconsultinginc.com
          : @lavanyam

Team
======

Prashanth Karnam : prashanthk@srsconsultinginc.com
Lavanya M : lavanyam@srsconsultinginc.com
Pradeep M : pradeepm@srsconsultinginc.com
RamaKrishna T : ramakrishnat@srsconsultinginc.com